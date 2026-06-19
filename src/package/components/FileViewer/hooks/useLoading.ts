import { computed, reactive, toValue, watch, type MaybeRefOrGetter } from 'vue'
import {
  createFileViewerLoadingController,
  createFileViewerLoadingControllerActionHandlers,
  resolveFileViewerLoadingTheme,
  type FileViewerLoadingState,
  type FileViewerStateTheme
} from '@file-viewer/core'

export type LoadingTheme = FileViewerStateTheme

export const resolveLoadingTheme = resolveFileViewerLoadingTheme

/**
 * FileViewer loading 响应式门面。
 *
 * 真实 loading 状态机和主题矩阵在 `@file-viewer/core` 中维护，
 * 这里仅把纯 TS controller 的快照同步成组件需要的 Vue ref/computed 形态。
 */
export const useLoading = (extendSource: MaybeRefOrGetter<string>) => {
  const controller = createFileViewerLoadingController(toValue(extendSource))
  const state = reactive<FileViewerLoadingState>(controller.getState())
  const actions = createFileViewerLoadingControllerActionHandlers(state, controller)

  watch(
    () => toValue(extendSource),
    nextExtend => {
      actions.setExtension(nextExtend)
    }
  )

  return {
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    message: computed(() => state.message),
    theme: computed(() => state.theme),
    styleVars: computed(() => state.styleVars),
    startLoading: actions.startLoading,
    setLoadingMessage: actions.setLoadingMessage,
    stopLoading: actions.stopLoading,
    showError: actions.showError,
    clearError: actions.clearError,
    resetLoading: actions.resetLoading,
    syncLoadingState: actions.syncLoadingState
  }
}
