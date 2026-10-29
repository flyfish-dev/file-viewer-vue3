import { computed } from 'vue'
import type { FileViewerWatermarkOptions } from '@file-viewer/core'
import {
  resolveFileViewerWatermarkPresentationState
} from '@file-viewer/core'

export const useViewerWatermark = (
  getWatermark: () => boolean | FileViewerWatermarkOptions | undefined
) => {
  const watermarkState = computed(() => resolveFileViewerWatermarkPresentationState(getWatermark()))
  const normalizedWatermark = computed(() => watermarkState.value.normalizedWatermark)
  const watermarkStyle = computed(() => watermarkState.value.watermarkStyle)
  const watermarkInlineStyle = computed(() => watermarkState.value.watermarkInlineStyle)

  return {
    normalizedWatermark,
    watermarkStyle,
    watermarkInlineStyle
  }
}
