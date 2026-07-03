import { computed, type ComputedRef, type Ref } from 'vue'
import {
  createFileViewerErrorState,
  formatFileViewerErrorMessage,
  resolveFileViewerPresentationState,
  type FileViewerStateTheme
} from '@file-viewer/core'
import type {
  FileViewerFileRef as FileRef,
  FileViewerOptions
} from '@file-viewer/core'

interface UseViewerPresentationOptions {
  filename: Ref<string>;
  getFile: () => FileRef | undefined;
  getUrl: () => string | undefined;
  getSourceFilename?: () => string | undefined;
  getOptions: () => FileViewerOptions | undefined;
}

interface UseViewerErrorStateOptions {
  currentExtend: ComputedRef<string>;
  error: ComputedRef<string>;
  loadingTheme: ComputedRef<FileViewerStateTheme>;
  getOptions?: () => FileViewerOptions | undefined;
}

/**
 * FileViewer 组件层的展示派生状态门面。
 *
 * 文件名、扩展名、主题和工具栏默认值仍由 core 规则决定；
 * 这里仅把 Vue props/ref 组合成模板和其他 hooks 需要的响应式状态。
 */
export const useViewerPresentation = ({
  filename,
  getFile,
  getUrl,
  getSourceFilename,
  getOptions
}: UseViewerPresentationOptions) => {
  const presentationState = computed(() => resolveFileViewerPresentationState({
    filename: getSourceFilename?.() || filename.value,
    file: getFile(),
    url: getUrl(),
    options: getOptions()
  }))
  const displayFilename = computed(() => presentationState.value.displayFilename)
  const currentExtend = computed(() => presentationState.value.extension)
  const normalizedToolbar = computed(() => presentationState.value.toolbar)
  const viewerTheme = computed(() => presentationState.value.theme)

  return {
    displayFilename,
    currentExtend,
    normalizedToolbar,
    viewerTheme,
    formatErrorMessage: (prefix: string, error: unknown) =>
      formatFileViewerErrorMessage(prefix, error, getOptions())
  }
}

export const useViewerErrorState = ({
  currentExtend,
  error,
  loadingTheme,
  getOptions
}: UseViewerErrorStateOptions) => {
  return computed(() => createFileViewerErrorState(currentExtend.value, error.value, loadingTheme.value, getOptions?.()))
}
