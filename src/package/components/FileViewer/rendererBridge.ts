import {
  collectFileViewerRendererPlugins,
  createFileRenderHandlerLoader,
  createFileRenderHandlerRendererSession,
  createFileViewerCoreRendererRegistry,
  createRendererRegistry,
  installFileViewerRendererPlugins,
  normalizeSource,
  renderFileViewerHandler,
  type FileRenderContext,
  type FileRenderHandler,
  type FileRenderHandlerRendererSession,
  type FileViewerRenderedInstance as Rendered,
  type FileViewerRendererPluginInput,
  type RendererRegistry,
} from '@file-viewer/core'
import { vueRendererDispatcher, vueRendererRegistry } from '../../vendors/renders'

export type FileViewerVueRenderSession = FileRenderHandlerRendererSession<Rendered | undefined>

type VueRenderHandler = FileRenderHandler<Rendered, HTMLDivElement>

const createRendererRegistryForContext = async (
  context?: FileRenderContext
): Promise<RendererRegistry> => {
  const options = context?.options || {}
  const registry = options.rendererMode === 'replace'
    ? createRendererRegistry([])
    : createFileViewerCoreRendererRegistry({
        builtinRenderers: options.builtinRenderers
      }).registry
  const plugins = collectFileViewerRendererPlugins<VueRenderHandler>(
    options.renderers as FileViewerRendererPluginInput<VueRenderHandler> | undefined
  )

  if (!plugins.length) {
    return registry
  }

  await installFileViewerRendererPlugins({
    registry,
    plugins,
    registerHandler: registration => {
      const definition = registry.getById(registration.rendererId)
      if (!definition) return

      registry.register({
        ...definition,
        load: createFileRenderHandlerLoader({
          handler: registration.handler,
          getTarget: loadContext => loadContext.surface.container as HTMLDivElement
        })
      })
    }
  })

  return registry
}

/**
 * Bridges the Vue renderer registry into the framework-neutral core renderer session.
 *
 * The Vue component package owns only lifecycle and the DOM surface. The actual renderer
 * registry is rebuilt from the current options for every load, so presets such as
 * @file-viewer/preset-all work in the native Vue component path without falling back to
 * the static core-only registry.
 */
export async function createVueRenderSession(
  buffer: ArrayBuffer,
  type: string,
  target: HTMLDivElement,
  context?: FileRenderContext
): Promise<FileViewerVueRenderSession> {
  const registry = await createRendererRegistryForContext(context)
  const renderer = registry.getByExtension(type) || vueRendererRegistry.getByExtension(type)

  if (renderer?.load) {
    return await renderer.load({
      source: normalizeSource({
        buffer,
        filename: context?.filename || `preview.${type}`,
        type,
        url: context?.url
      }),
      surface: { container: target },
      options: context?.options || {},
      registerExportAdapter: context?.registerExportAdapter,
      renderContext: context
    }) as FileRenderHandlerRendererSession<Rendered>
  }

  const rendered = await renderFileViewerHandler<Rendered | undefined, HTMLDivElement>({
    dispatcher: vueRendererDispatcher,
    buffer,
    target,
    type,
    context
  })
  return createFileRenderHandlerRendererSession(rendered)
}
