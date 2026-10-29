import type { Ref } from 'vue'
import {
  createFileViewerFitController,
  hasFileViewerExplicitInitialViewState
} from '@file-viewer/core'
import type {
  FileViewerFitMode,
  FileViewerFitOptions,
  FileViewerFitResult,
  FileViewerOptions
} from '@file-viewer/core'

interface UseViewerFitOptions {
  output: Ref<HTMLDivElement | null>;
  getOptions: () => FileViewerOptions | undefined;
  refreshZoomProvider: () => void;
  refreshViewStateProvider: () => void;
  emitFitChange: (result: FileViewerFitResult) => void;
}

export const useViewerFit = ({
  output,
  getOptions,
  refreshZoomProvider,
  refreshViewStateProvider,
  emitFitChange
}: UseViewerFitOptions) => {
  const controller = createFileViewerFitController({
    root: () => output.value,
    getFit: () => getOptions()?.fit,
    onFit: result => {
      refreshZoomProvider()
      refreshViewStateProvider()
      emitFitChange(result)
    }
  })

  return {
    startFitObserver: () => controller.observe(),
    stopFitObserver: () => controller.destroy(),
    resetAutoFit: () => controller.resetAutoFit(),
    markFitUserInteraction: () => controller.markUserInteraction(),
    applyInitialFit: () => controller.applyInitialFit({
      skip: hasFileViewerExplicitInitialViewState(getOptions()?.initialViewState)
    }),
    fitToView: (fit?: FileViewerFitMode | FileViewerFitOptions) => controller.fit(fit, {
      source: 'api',
      reason: 'api'
    })
  }
}
