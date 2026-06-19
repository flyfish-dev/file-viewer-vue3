import type { ComputedRef } from 'vue'
import { createFileViewerPublicApi } from '@file-viewer/core'
import type {
  FileViewerPublicApi as FileViewerExpose,
  FileViewerOperationAvailability
} from '@file-viewer/core'

interface UseViewerPublicApiOptions extends Omit<FileViewerExpose, 'getOperationAvailability'> {
  operationAvailability: ComputedRef<FileViewerOperationAvailability>;
}

/**
 * FileViewer 组件对外实例方法的统一门面。
 *
 * 主组件只负责 `defineExpose`，这里集中维护 ref API 的方法清单和快照语义，
 * 便于后续 React / Svelte / pure JS wrapper 对齐同一套外部能力。
 */
export const useViewerPublicApi = ({
  operationAvailability,
  ...api
}: UseViewerPublicApiOptions): FileViewerExpose => {
  return createFileViewerPublicApi({
    ...api,
    getOperationAvailability: () => operationAvailability.value
  })
}
