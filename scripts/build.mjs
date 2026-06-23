import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distDir = resolve(packageDir, 'dist')
const args = new Set(process.argv.slice(2))

async function collectFiles(dir, files = []) {
  const entries = await readdir(dir)
  for (const entry of entries) {
    const filePath = join(dir, entry)
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) {
      await collectFiles(filePath, files)
    } else {
      files.push(filePath)
    }
  }
  return files
}

async function inlineCssAssetUrls() {
  const files = await collectFiles(distDir)
  const cssAssets = []
  for (const filePath of files) {
    if (!filePath.endsWith('.css')) {
      continue
    }
    const source = await readFile(filePath, 'utf8')
    if (source.trim()) {
      cssAssets.push({ filePath, source })
    }
  }

  if (!cssAssets.length) {
    return
  }

  cssAssets.sort((a, b) => b.source.length - a.source.length)
  const cssDataUrl = `data:text/css;base64,${Buffer.from(cssAssets[0].source).toString('base64')}`
  const cssHref = JSON.stringify(cssDataUrl)

  for (const filePath of files) {
    if (!/\.(mjs|js)$/.test(filePath)) {
      continue
    }
    const source = await readFile(filePath, 'utf8')
    let rewritten = source
    rewritten = rewritten.replace(
      /const\s+([A-Za-z_$][\w$]*)\s*=\s*"data:text\/css;base64,[^"]*";/,
      (_match, varName) => `const ${varName} = ${cssHref};`
    )
    rewritten = rewritten.replace(/new URL\("style\.css", import\.meta\.url\)\.href/g, cssHref)
    rewritten = rewritten.replace(/new URL\("\.\/file-viewer3\.css", import\.meta\.url\)\.href/g, cssHref)
    if (rewritten !== source) {
      await writeFile(filePath, rewritten, 'utf8')
    }
  }
}

async function fixInlineWorkerBlobs() {
  const inlineWorkerBlobRE = /new Blob\(\[atob\(([^)]+)\)\],/g
  const files = await collectFiles(distDir)
  for (const filePath of files) {
    if (!/\.(mjs|js)$/.test(filePath)) {
      continue
    }
    const source = await readFile(filePath, 'utf8')
    let replacementCount = 0
    const fixed = source.replace(inlineWorkerBlobRE, (_match, base64Source) => {
      replacementCount += 1
      return `new Blob([Uint8Array.from(atob(${base64Source}), byte => byte.charCodeAt(0))],`
    })
    if (replacementCount) {
      await writeFile(filePath, fixed, 'utf8')
      console.log(`fixed ${replacementCount} inline worker blob(s) in ${filePath.replace(`${packageDir}/`, '')}`)
    }
  }
}

async function writeCompatibilityCss() {
  await mkdir(distDir, { recursive: true })
  await writeFile(resolve(distDir, 'file-viewer3.css'), [
    "@import './vue3.css';",
    '',
    '.ff-file-viewer-vue3 {',
    '  width: 100%;',
    '  height: 100%;',
    '  min-height: 0;',
    '}',
    ''
  ].join('\n'))
}

async function assertFile(relativePath) {
  const fullPath = join(packageDir, relativePath)
  const info = await stat(fullPath).catch(() => null)
  if (!info?.isFile()) {
    throw new Error(`[file-viewer-vue3] Missing required package file: ${relativePath}`)
  }
}

async function assertMissing(relativePath) {
  const info = await stat(join(packageDir, relativePath)).catch(() => null)
  if (info) {
    throw new Error(`[file-viewer-vue3] Unexpected demo artifact in library package output: ${relativePath}`)
  }
}

async function verifyPackageOutput() {
  await assertFile('dist/index.mjs')
  await assertFile('dist/src/package/index.d.ts')
  await assertFile('dist/style.css')
  await assertFile('dist/file-viewer3.css')

  await assertMissing('dist/index.html')
  await assertMissing('dist/compare.html')

  const packageJson = JSON.parse(await readFile(join(packageDir, 'package.json'), 'utf8'))
  const typeEntry = packageJson.exports?.['.']?.types || packageJson.types
  if (!typeEntry) {
    throw new Error('[file-viewer-vue3] package.json does not expose a type entry.')
  }
  const normalizedTypeEntry = typeEntry.replace(/^\.\//, '')
  await assertFile(normalizedTypeEntry)
  console.log(`[file-viewer-vue3] Verified library package output in ${distDir}`)
}

if (!args.has('--verify-only')) {
  await inlineCssAssetUrls()
  await fixInlineWorkerBlobs()
  await writeCompatibilityCss()
}

await verifyPackageOutput()
