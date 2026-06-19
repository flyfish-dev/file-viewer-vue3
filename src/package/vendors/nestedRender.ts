import type {
  FileRenderContext,
  FileViewerRenderedInstance as AppWrapper,
  FileViewerRenderedInstance as Rendered
} from '@file-viewer/core'
import { fileViewerCoreRendererDispatcher } from '@file-viewer/core'

const createWrapper = (el: HTMLDivElement): AppWrapper => ({
  $el: el,
  unmount() {
    // 非 Vue 渲染器没有额外销毁动作，保留统一的卸载接口。
  }
})

const renderUnsupported = async (target: HTMLDivElement, type: string): Promise<Rendered> => {
  target.innerHTML = `<div style="text-align:center;margin-top:80px">不支持.${type}格式的在线预览，请下载后预览或转换为支持的格式</div>
<div style="text-align:center">压缩包和邮件附件会复用主预览器的格式能力，当前附件类型暂未命中可预览链路。</div>`
  return createWrapper(target)
}

/**
 * 压缩包内文件和邮件附件的嵌套预览入口。
 *
 * 主预览器和附件预览共享 core dispatcher。Vue3 标准组件包 不再持有格式专属
 * vendor，所有类型统一交给 framework-neutral core renderer。
 */
export const renderNestedBuffer = async (
  buffer: ArrayBuffer,
  type: string,
  target: HTMLDivElement,
  context?: FileRenderContext
): Promise<Rendered> => {
  const normalizedType = type.toLowerCase()

  const coreHandler = fileViewerCoreRendererDispatcher.get(normalizedType)
  if (coreHandler) {
    return coreHandler(buffer, target, normalizedType, {
      ...context,
      renderNestedBuffer: context?.renderNestedBuffer || renderNestedBuffer
    })
  }

  return renderUnsupported(target, normalizedType)
}
