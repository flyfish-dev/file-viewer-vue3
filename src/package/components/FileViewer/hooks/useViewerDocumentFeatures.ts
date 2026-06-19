import { nextTick, onBeforeUnmount, reactive, shallowRef, type Ref } from 'vue'
import type {
  FileViewerDocumentAnchor,
  FileViewerOptions,
  FileViewerSearchState
} from '@file-viewer/core'
import {
  createEmptyFileViewerSearchState,
  createFileViewerDocumentFeatureControllerActionHandlers
} from '@file-viewer/core'

interface UseViewerDocumentFeaturesOptions {
  output: Ref<HTMLDivElement | null>;
  getOptions: () => FileViewerOptions | undefined;
  emitSearchChange: (state: FileViewerSearchState) => void;
  emitLocationChange: (anchor: FileViewerDocumentAnchor | null) => void;
}

/**
 * FileViewer 的文档交互门面。
 *
 * 底层锚点、滚动和文本切片由 core 负责，Vue 侧只保留搜索响应式 hook；
 * 这里负责把这些能力组合成组件对外暴露的 API，并同步搜索/定位状态。
 */
export const useViewerDocumentFeatures = ({
  output,
  getOptions,
  emitSearchChange,
  emitLocationChange
}: UseViewerDocumentFeaturesOptions) => {
  const anchors = shallowRef<FileViewerDocumentAnchor[]>([])
  const state = reactive<FileViewerSearchState>(createEmptyFileViewerSearchState())
  const documentActions = createFileViewerDocumentFeatureControllerActionHandlers({
    root: () => output.value,
    searchTarget: {
      anchors,
      state
    },
    searchOptions: () => getOptions()?.search,
    waitForDomUpdate: () => nextTick(),
    getAiOptions: () => getOptions()?.ai,
    onSearchChange: emitSearchChange,
    onLocationChange: emitLocationChange
  })

  onBeforeUnmount(() => {
    documentActions.destroyDocumentFeatures()
  })

  return {
    refreshDocumentIndex: documentActions.refreshDocumentIndex,
    clearDocumentState: documentActions.clearDocumentState,
    getScrollContainer: documentActions.getScrollContainer,
    searchDocument: documentActions.searchDocument,
    clearDocumentSearch: documentActions.clearDocumentSearch,
    nextSearchResult: documentActions.nextSearchResult,
    previousSearchResult: documentActions.previousSearchResult,
    getSearchState: documentActions.getSearchState,
    collectDocumentAnchors: documentActions.collectDocumentAnchors,
    scrollToAnchor: documentActions.scrollToAnchor,
    scrollToLine: documentActions.scrollToLine,
    getDocumentTextChunks: documentActions.getDocumentTextChunks
  }
}
