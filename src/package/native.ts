import styleHref from './style.css?url'
import { vueRendererRegistry } from './vendors/renders'
import {
  mountViewer,
  type ViewerController,
  type ViewerMountOptions,
  type ViewerCoreOptions,
  type ViewerSourceInput
} from './controller'

export interface CreateFlyfishFileViewerOptions extends ViewerMountOptions {
  source?: ViewerSourceInput
  autoLoad?: boolean
  fetchFile?: ViewerCoreOptions['fetchFile']
  onError?: ViewerCoreOptions['onError']
}

export type FlyfishFileViewerNativeController = ViewerController
export type FlyfishFileViewerNativeSource = ViewerSourceInput

const ensureNativeViewerStyles = () => {
  if (typeof document === 'undefined') return
  if (document.querySelector('link[data-file-viewer-style="true"]')) return

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = styleHref
  link.dataset.fileViewerStyle = 'true'
  document.head.appendChild(link)
}

/**
 * Mount the full Flyfish renderer stack directly into a DOM container.
 *
 * This is the native integration base used by framework component packages. Component packages keep
 * their own component lifecycle and call the shared core controller for loading,
 * teardown, search, zoom, print and export.
 */
export const createFlyfishFileViewer = (
  container: HTMLElement,
  options: CreateFlyfishFileViewerOptions = {}
) => {
  ensureNativeViewerStyles()
  const source = options.source || options
  const initialOptions: ViewerMountOptions = {
    ...(options.autoLoad === false
      ? {}
      : {
          url: source.url,
          file: source.file,
          buffer: source.buffer,
          name: source.name || options.name,
          filename: source.filename || options.filename,
          type: source.type || options.type,
          size: source.size ?? options.size
        }),
    options: options.options,
    onEvent: options.onEvent
  }
  return mountViewer(container, initialOptions, {
    registry: vueRendererRegistry,
    fetchFile: options.fetchFile,
    onError: options.onError
  })
}

export const mountFlyfishFileViewer = createFlyfishFileViewer
