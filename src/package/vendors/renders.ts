import {
  DEFAULT_RENDERER_DEFINITIONS,
  createFileRenderHandlerRegistry,
  createFileViewerRendererDispatcher,
  createFileViewerUnsupportedState,
  coreBrowserRendererHandlers
} from '@file-viewer/core'
import type {
  FileRenderHandler,
  FileViewerRenderedInstance as AppWrapper
} from '@file-viewer/core'

type FileHandler = FileRenderHandler<AppWrapper, HTMLDivElement>

interface VueRendererHandler {
  rendererId: string;
  handler: FileHandler;
}

// 假装构造一个vue的包装，让上层统一处理销毁和替换节点
const createWrapper = (el: HTMLDivElement): AppWrapper => ({
  $el: el,
  unmount() {
    // 什么也不需要 nothing to do
  }
})

// 已经下沉到 core 的渲染器直接复用 core handler。Vue3 只维护尚未完全
// framework-neutral 的强交互链路，避免组件层继续堆积重复 vendor 入口。
const handlers: Array<VueRendererHandler> = [
  ...coreBrowserRendererHandlers
]

// 错误处理
const renderUnsupported: FileHandler = async (_buffer: ArrayBuffer, target: HTMLDivElement, type?: string) => {
  const state = createFileViewerUnsupportedState(type)
  const wrapper = document.createElement('div')
  wrapper.style.textAlign = 'center'
  wrapper.style.marginTop = '80px'

  const message = document.createElement('div')
  message.textContent = state.message
  wrapper.appendChild(message)

  if (state.description) {
    const description = document.createElement('div')
    description.textContent = state.description
    wrapper.appendChild(description)
  }

  target.replaceChildren(wrapper)
  return createWrapper(target)
}

export const vueRendererRegistryBridge = createFileRenderHandlerRegistry({
  definitions: DEFAULT_RENDERER_DEFINITIONS,
  handlers
})
export const vueRendererRegistry = vueRendererRegistryBridge.registry
export const vueRendererDispatcher = createFileViewerRendererDispatcher({
  registry: vueRendererRegistry,
  handlers,
  fallbackHandler: renderUnsupported
})

export const missingCoreRendererHandlers = vueRendererRegistryBridge.missingRendererIds

// 扩展名与格式矩阵统一由 core dispatcher 派发，Vue3 不再持有格式专属 vendor。
const renders = vueRendererDispatcher.handlersByExtension

export default renders
