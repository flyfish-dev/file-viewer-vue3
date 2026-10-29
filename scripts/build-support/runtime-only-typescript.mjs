import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path'

const normalized = (value) => value.replace(/\s+/g, ' ').trim()

export function runtimeOnlyCompilerOptions(options) {
  return { ...options, removeComments: true, sourceMap: false, inlineSourceMap: false,
    declarationMap: false, inlineSources: false, noEmitOnError: true }
}

export function restoreRuntimeImportDirectives(ts, sources, emitted, filename) {
  const imports = file => {
    const calls = []
    const visit = node => {
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) calls.push(node)
      ts.forEachChild(node, visit)
    }
    visit(file)
    return calls
  }
  const original = sources.flatMap(file => {
    const parsed = ts.createSourceFile(file.fileName, file.text, ts.ScriptTarget.Latest, true, file.scriptKind)
    return imports(parsed).map(node => {
      const comments = [...new Map([
        ...(ts.getLeadingCommentRanges(parsed.text, node.arguments[0].pos) || []),
        ...(ts.getTrailingCommentRanges(parsed.text, node.arguments[0].pos) || []),
      ].map(range => [range.pos, range])).values()]
      const directives = []
      for (const range of comments) {
        const text = parsed.text.slice(range.pos, range.end).replace(/^\/\*|\*\/$|^\/\//g, '').trim()
        if (/^webpackIgnore\s*:\s*(?:true|false)$/.test(text)) directives.push(`/* ${text} */`)
        else if (text === '@vite-ignore') directives.push('/* @vite-ignore */')
        else if (/webpack[A-Z]|@vite-/.test(text)) throw new Error('Unreviewed runtime import directive; preserve its semantics before emission')
      }
      return directives
    })
  })
  if (!original.some(directives => directives.length)) return { output: emitted, directivesRestored: 0 }
  const parsed = ts.createSourceFile(filename, emitted, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  if (parsed.parseDiagnostics.length) throw new Error('Cannot restore directives in invalid emitted JavaScript')
  const compiled = imports(parsed)
  if (compiled.length !== original.length) throw new Error('Runtime import ordering changed during emission; review directive binding')
  let output = emitted
  let directivesRestored = 0
  for (let index = compiled.length - 1; index >= 0; index--) {
    if (!original[index].length) continue
    const position = compiled[index].arguments[0].getStart(parsed)
    output = output.slice(0, position) + original[index].join(' ') + ' ' + output.slice(position)
    directivesRestored += original[index].length
  }
  return { output, directivesRestored }
}

// Resolve the owner's relative TypeScript inputs during ordinary emission.
// Both executable imports and declarations must identify Node-loadable output
// files; changing archive contents after packing cannot repair that contract.
export function runtimeOnlyEsmTransformer(ts, options) {
  const runtimeExtensions = new Set(['.js', '.mjs', '.cjs', '.json', '.node', '.wasm', '.css'])
  return context => sourceFile => {
    const specifier = value => {
      if (value !== '.' && value !== '..' && !value.startsWith('./') && !value.startsWith('../')) return value
      if (runtimeExtensions.has(extname(value))) return value
      const resolvedModule = ts.resolveModuleName(value, sourceFile.fileName, options, ts.sys).resolvedModule
      if (!resolvedModule || !/\.(?:[cm]?ts|tsx)$/.test(resolvedModule.resolvedFileName)) return value
      const suffix = resolvedModule.resolvedFileName.endsWith('.mts') ? '.mjs' :
        resolvedModule.resolvedFileName.endsWith('.cts') ? '.cjs' : '.js'
      const path = relative(dirname(sourceFile.fileName), resolvedModule.resolvedFileName)
        .replaceAll('\\', '/').replace(/(?:\.d)?\.(?:[cm]?ts|tsx)$/, suffix)
      return path.startsWith('.') ? path : `./${path}`
    }
    const literal = node => {
      const next = specifier(node.text)
      return next === node.text ? node : context.factory.createStringLiteral(next)
    }
    const visit = node => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        return context.factory.updateImportDeclaration(node, node.modifiers, node.importClause,
          literal(node.moduleSpecifier), node.attributes)
      }
      if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        return context.factory.updateExportDeclaration(node, node.modifiers, node.isTypeOnly, node.exportClause,
          literal(node.moduleSpecifier), node.attributes)
      }
      if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) && ts.isStringLiteral(node.argument.literal)) {
        return context.factory.updateImportTypeNode(node, context.factory.updateLiteralTypeNode(node.argument,
          literal(node.argument.literal)), node.attributes, node.qualifier, node.typeArguments, node.isTypeOf)
      }
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword &&
          node.arguments.length && ts.isStringLiteral(node.arguments[0])) {
        return context.factory.updateCallExpression(node, node.expression, node.typeArguments,
          [literal(node.arguments[0]), ...node.arguments.slice(1)])
      }
      return ts.visitEachChild(node, visit, context)
    }
    return ts.visitEachChild(sourceFile, visit, context)
  }
}

function legalComments(ts, sourceFile) {
  const found = new Map()
  const inspect = (node) => {
    const ranges = [...(ts.getLeadingCommentRanges(sourceFile.text, node.pos) || []),
      ...(ts.getTrailingCommentRanges(sourceFile.text, node.end) || [])]
    for (const range of ranges) {
      const comment = sourceFile.text.slice(range.pos, range.end)
      if (!/@license|@preserve|copyright|^\/\*!|^\/\/!/i.test(comment)) continue
      const body = comment.replace(/^\/\*[!*]?|\*\/$|^\/\/!?/g, '')
        .replace(/^\s*\*\s?/gm, '').replace(/@(license|preserve)\b/gi, '').trim()
      if (body) found.set(range.pos, normalized(body))
    }
    ts.forEachChild(node, inspect)
  }
  inspect(sourceFile)
  return [...found.values()]
}

export function assertRuntimeOnlySourceNotices(ts, sourceFiles, legalDocuments) {
  const notices = legalDocuments.map(normalized)
  let checkedComments = 0
  for (const sourceFile of sourceFiles) {
    for (const comment of legalComments(ts, sourceFile)) {
      checkedComments++
      if (!notices.some((document) => document.includes(comment))) {
        throw new Error('Runtime-only comment removal would omit a legal/preserved notice; retain it in a required legal document first')
      }
    }
  }
  return { checkedComments }
}

// Vue's ordinary declaration generator retains source namespaces. Normalize its
// generated declarations during the owning build, before any package is packed.
export async function normalizeRuntimeOnlyDeclarations({ ts, directory, legalDocumentPaths }) {
  if (!Array.isArray(legalDocumentPaths) || !legalDocumentPaths.length) throw new Error('A runtime-only declaration build requires legal documents')
  const paths = []
  const walk = async folder => {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name)
      if (entry.isDirectory()) await walk(path)
      else if (entry.isFile() && /\.d\.[cm]?ts$/.test(entry.name)) paths.push(path)
    }
  }
  await walk(resolve(directory))
  if (!paths.length) throw new Error('The declaration owner emitted no declarations')
  const sourceFiles = await Promise.all(paths.sort().map(async path =>
    ts.createSourceFile(path, await readFile(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)))
  if (sourceFiles.some(file => file.parseDiagnostics.length)) throw new Error('The declaration owner emitted invalid syntax')
  const legal = await Promise.all(legalDocumentPaths.map(path => readFile(path, 'utf8')))
  const noticeAudit = assertRuntimeOnlySourceNotices(ts, sourceFiles, legal)
  const transformer = runtimeOnlyEsmTransformer(ts, { moduleResolution: ts.ModuleResolutionKind.Bundler })
  const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed })
  const outputs = sourceFiles.map(file => {
    const result = ts.transform(file, [transformer])
    try { return { path: file.fileName, content: printer.printFile(result.transformed[0]) } }
    finally { result.dispose() }
  })
  await Promise.all(outputs.map(({ path, content }) => writeFile(path, content)))
  return { declarationFileCount: outputs.length, ...noticeAudit }
}

export async function compileRuntimeOnlyTypescript({ ts, tsconfigPath, legalDocumentPaths }) {
  if (!Array.isArray(legalDocumentPaths) || !legalDocumentPaths.length) throw new Error('A runtime-only build requires legal documents')
  const path = resolve(tsconfigPath)
  const config = ts.readConfigFile(path, ts.sys.readFile)
  if (config.error) throw new Error('Cannot read runtime-only TypeScript configuration')
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, dirname(path), undefined, path)
  if (parsed.errors.length) throw new Error('Invalid runtime-only TypeScript configuration')
  const options = runtimeOnlyCompilerOptions(parsed.options)
  if (!options.outDir || !options.rootDir || options.noEmit || options.emitDeclarationOnly) {
    throw new Error('Runtime-only TypeScript configuration must emit runtime and declarations from a separate rootDir to outDir')
  }
  const relativeOutput = relative(resolve(options.rootDir), resolve(options.outDir))
  if (!relativeOutput || (!isAbsolute(relativeOutput) && relativeOutput !== '..' && !relativeOutput.startsWith(`..${sep}`))) {
    throw new Error('Runtime-only TypeScript output must be outside source rootDir')
  }
  const files = await Promise.all(legalDocumentPaths.map((document) => readFile(document)))
  const program = ts.createProgram({ rootNames: parsed.fileNames, options, projectReferences: parsed.projectReferences })
  const ownSources = program.getSourceFiles().filter((file) => parsed.fileNames.includes(file.fileName))
  const noticeAudit = assertRuntimeOnlySourceNotices(ts, ownSources, files.map((file) => file.toString('utf8')))
  const diagnostics = ts.getPreEmitDiagnostics(program)
  if (diagnostics.length) throw new Error(`Runtime-only TypeScript build has ${diagnostics.length} diagnostics; inspect them privately`)
  const transform = runtimeOnlyEsmTransformer(ts, options)
  let runtimeImportDirectivesRestored = 0
  const emitFile = (filename, data, writeByteOrderMark, _onError, sourceFiles = []) => {
    if (/\.[cm]?js$/.test(filename)) {
      const restored = restoreRuntimeImportDirectives(ts, sourceFiles, data, filename)
      data = restored.output
      runtimeImportDirectivesRestored += restored.directivesRestored
    }
    ts.sys.writeFile(filename, data, writeByteOrderMark)
  }
  const result = program.emit(undefined, emitFile, undefined, undefined,
    { after: [transform], afterDeclarations: [transform] })
  if (result.emitSkipped || result.diagnostics.length) throw new Error('Runtime-only TypeScript build did not complete')
  return { schemaVersion: 1, mode: 'runtime-only', compiler: `typescript@${ts.version}`,
    sourceFileCount: ownSources.length, runtimeImportDirectivesRestored, ...noticeAudit,
    legalDocumentDigests: files.map((file) => createHash('sha256').update(file).digest('hex')) }
}
