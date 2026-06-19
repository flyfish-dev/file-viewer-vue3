import {
  createFileRenderHandlerRendererSession,
  normalizeSource,
  renderFileViewerHandler,
  type FileRenderContext,
  type FileRenderHandlerRendererSession,
  type FileViewerRenderedInstance as Rendered,
} from '@file-viewer/core'
import { vueRendererDispatcher, vueRendererRegistry } from '../../vendors/renders'

export type FileViewerVueRenderSession = FileRenderHandlerRendererSession<Rendered | undefined>

/**
 * Bridges the Vue renderer registry into the framework-neutral core renderer session.
 *
 * The Vue wrapper owns only the async component loaders and DOM surface; source
 * normalization, handler dispatch and session teardown stay in @file-viewer/core.
 */
export async function createVueRenderSession(
  buffer: ArrayBuffer,
  type: string,
  target: HTMLDivElement,
  context?: FileRenderContext
): Promise<FileViewerVueRenderSession> {
  const renderer = vueRendererRegistry.getByExtension(type)
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
