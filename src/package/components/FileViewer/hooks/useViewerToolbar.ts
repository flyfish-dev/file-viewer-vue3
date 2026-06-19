import { computed, watch, type ComputedRef, type Ref, type ShallowRef } from 'vue'
import {
  createFileViewerToolbarControllerActionHandlers,
} from '@file-viewer/core'
import type {
  FileRenderExportAdapter,
  FileViewerOperationAvailability,
  FileViewerOptions,
  FileViewerToolbarOptions,
  FileViewerToolbarPosition,
  FileViewerZoomState
} from '@file-viewer/core'

interface UseViewerToolbarOptions {
  activeExportAdapter: ShallowRef<FileRenderExportAdapter | null>;
  currentBuffer: Ref<ArrayBuffer | null>;
  currentExtend: ComputedRef<string>;
  currentFile: Ref<File | null>;
  currentSourceUrl: Ref<string | null>;
  error: Ref<string>;
  getOptions: () => FileViewerOptions | undefined;
  getZoomState: () => FileViewerZoomState;
  loading: Ref<boolean>;
  normalizedToolbar: ComputedRef<FileViewerToolbarOptions>;
  renderedReady: Ref<boolean>;
  zoomState: FileViewerZoomState;
  emitOperationAvailabilityChange: (availability: FileViewerOperationAvailability) => void;
  emitZoomChange: (state: FileViewerZoomState) => void;
}

/**
 * FileViewer 组件层的工具栏与能力状态门面。
 *
 * 按钮显隐、PDF 默认悬浮位置和能力矩阵由 `@file-viewer/core` 统一计算；
 * 这里只负责把 Vue 响应式状态、组件事件和操作 API 串起来。
 */
export const useViewerToolbar = ({
  activeExportAdapter,
  currentBuffer,
  currentExtend,
  currentFile,
  currentSourceUrl,
  error,
  getOptions,
  getZoomState,
  loading,
  normalizedToolbar,
  renderedReady,
  zoomState,
  emitOperationAvailabilityChange,
  emitZoomChange
}: UseViewerToolbarOptions) => {
  const toolbarActions = createFileViewerToolbarControllerActionHandlers({
    getAdapter: () => activeExportAdapter.value,
    getBuffer: () => currentBuffer.value,
    getExtension: () => currentExtend.value,
    getFile: () => currentFile.value,
    getHasError: () => !!error.value,
    getLoading: () => loading.value,
    getOptions,
    getSourceUrl: () => currentSourceUrl.value,
    getToolbar: () => normalizedToolbar.value,
    getRenderedReady: () => renderedReady.value,
    getZoomState,
    zoomSyncState: zoomState,
    onOperationAvailabilityChange: emitOperationAvailabilityChange,
    onZoomChange: emitZoomChange
  })

  const toolbarState = computed(() => {
    return toolbarActions.resolveToolbarState()
  })

  const operationAvailability = computed<FileViewerOperationAvailability>(() => toolbarState.value.operationAvailability)
  const visibleToolbar = computed<FileViewerToolbarOptions>(() => toolbarState.value.visibleToolbar)
  const showToolbar = computed(() => toolbarState.value.showToolbar)
  const toolbarPosition = computed<FileViewerToolbarPosition>(() => toolbarState.value.toolbarPosition)
  const toolbarDisabled = computed(() => toolbarState.value.toolbarDisabled)

  const zoomButtonDisabled = (
    action: keyof Pick<FileViewerZoomState, 'canZoomIn' | 'canZoomOut' | 'canReset'>
  ) => {
    return toolbarActions.isZoomButtonDisabled(action)
  }

  watch(operationAvailability, availability => {
    toolbarActions.syncOperationAvailability(availability)
  }, { immediate: true })

  watch(
    () => toolbarActions.createZoomSyncSnapshot(),
    () => {
      toolbarActions.syncZoomChange()
    },
    { immediate: true }
  )

  return {
    operationAvailability,
    visibleToolbar,
    showToolbar,
    toolbarPosition,
    toolbarDisabled,
    zoomButtonDisabled
  }
}
