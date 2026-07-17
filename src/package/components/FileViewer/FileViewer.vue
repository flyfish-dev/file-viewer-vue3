<script setup lang='ts'>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Moon, RotateCcw, Sun, ZoomIn, ZoomOut } from '@lucide/vue'
import {
  createFileViewerTranslator,
  createFileViewerRequestScope,
  FILE_VIEWER_RENDER_SURFACE_BACKGROUND_PROPERTY,
  normalizeFileViewerRenderSurfaceBackground,
  reportFileViewerLifecycleHookError,
  reportFileViewerOperationError,
  resolveFileViewerColorScheme,
  syncFileViewerRenderSurfaceBackground,
  toggleFileViewerColorScheme
} from '@file-viewer/core'
import type {
  FileViewerComponentEmits as FileViewerEmits,
  FileViewerComponentProps as FileViewerProps,
  FileViewerOptions,
  FileViewerResolvedThemeMode
} from '@file-viewer/core'
import { useLoading } from './hooks/useLoading'
import { useViewerDocumentFeatures } from './hooks/useViewerDocumentFeatures'
import { useViewerExport } from './hooks/useViewerExport'
import { useViewerFit } from './hooks/useViewerFit'
import { useViewerLifecycle } from './hooks/useViewerLifecycle'
import { useViewerErrorState, useViewerPresentation } from './hooks/useViewerPresentation'
import { useViewerPreviewLifecycle } from './hooks/useViewerPreviewLifecycle'
import { useViewerPublicApi } from './hooks/useViewerPublicApi'
import { useViewerRenderSurface } from './hooks/useViewerRenderSurface'
import { useViewerSourceLoading } from './hooks/useViewerSourceLoading'
import { useViewerToolbar } from './hooks/useViewerToolbar'
import { useViewerViewState } from './hooks/useViewerViewState'
import { useViewerWatermark } from './hooks/useViewerWatermark'
import { useViewerZoom } from './hooks/useViewerZoom'

const props = defineProps<FileViewerProps>()

const emit = defineEmits<FileViewerEmits>()

const filename = ref('')
const output = ref<HTMLDivElement | null>(null)
const currentFile = ref<File | null>(null)
const currentBuffer = ref<ArrayBuffer | null>(null)
const currentSourceUrl = ref<string | null>(null)
const manualViewerTheme = ref<FileViewerResolvedThemeMode | null>(null)
const viewerColorSchemeQuery = typeof globalThis.matchMedia === 'function'
  ? globalThis.matchMedia('(prefers-color-scheme: dark)')
  : null
const systemPrefersDark = ref(viewerColorSchemeQuery?.matches ?? false)
const handleViewerColorSchemeChange = (event: MediaQueryListEvent) => {
  systemPrefersDark.value = event.matches
}

onMounted(() => viewerColorSchemeQuery?.addEventListener?.('change', handleViewerColorSchemeChange))
onBeforeUnmount(() => viewerColorSchemeQuery?.removeEventListener?.('change', handleViewerColorSchemeChange))

const effectiveOptions = computed<FileViewerOptions | undefined>(() => {
  if (!manualViewerTheme.value) {
    return props.options
  }
  return {
    ...(props.options || {}),
    theme: manualViewerTheme.value
  }
})

watch(() => props.options?.theme, () => {
  manualViewerTheme.value = null
})

const viewerLabels = computed(() => {
  const t = createFileViewerTranslator(effectiveOptions.value)
  return {
    zoomGroup: t('toolbar.zoomGroup'),
    zoomOut: t('toolbar.zoomOut'),
    zoomIn: t('toolbar.zoomIn'),
    zoomReset: t('toolbar.zoomReset'),
    download: t('toolbar.download'),
    downloadTitle: t('toolbar.downloadTitle'),
    print: t('toolbar.print'),
    printTitle: t('toolbar.printTitle'),
    printDirect: t('toolbar.printDirect'),
    printMask: t('toolbar.printMask'),
    printMaskTitle: t('toolbar.printMaskTitle'),
    exportHtml: t('toolbar.exportHtml'),
    exportHtmlTitle: t('toolbar.exportHtmlTitle'),
    themeToLight: t('toolbar.themeToLight'),
    themeToDark: t('toolbar.themeToDark')
  }
})
const printMenuOpen = ref(false)
const {
  refreshDocumentIndex,
  clearDocumentState,
  getScrollContainer,
  searchDocument,
  clearDocumentSearch,
  nextSearchResult,
  previousSearchResult,
  getSearchState,
  collectDocumentAnchors,
  scrollToAnchor,
  scrollToLine,
  getDocumentTextChunks
} = useViewerDocumentFeatures({
  output,
  getOptions: () => effectiveOptions.value,
  emitSearchChange: state => emit('search-change', state),
  emitLocationChange: anchor => emit('location-change', anchor)
})

const {
  displayFilename,
  currentExtend,
  normalizedToolbar,
  viewerTheme,
  viewerDensity,
  formatErrorMessage
} = useViewerPresentation({
  filename,
  getFile: () => props.file,
  getUrl: () => props.url,
  getSourceFilename: () => props.filename || props.name,
  getOptions: () => effectiveOptions.value
})

const {
  watermarkStyle,
  watermarkInlineStyle
} = useViewerWatermark(() => effectiveOptions.value?.watermark)

const {
  loading,
  error,
  message,
  theme: loadingTheme,
  styleVars: loadingVars,
  startLoading,
  setLoadingMessage,
  stopLoading,
  showError,
  clearError,
  resetLoading
} = useLoading(currentExtend, () => effectiveOptions.value)

const viewerRootStyle = computed(() => {
  const background = normalizeFileViewerRenderSurfaceBackground(
    effectiveOptions.value?.ui?.surfaceBackground
  )
  return {
    ...loadingVars.value,
    ...(background
      ? { [FILE_VIEWER_RENDER_SURFACE_BACKGROUND_PROPERTY]: background }
      : {})
  }
})

watch(() => effectiveOptions.value?.ui?.surfaceBackground, async () => {
  await nextTick()
  syncFileViewerRenderSurfaceBackground(output.value, effectiveOptions.value)
  Array.from(output.value?.children || []).forEach(child => {
    syncFileViewerRenderSurfaceBackground(child as HTMLElement, effectiveOptions.value)
  })
}, { immediate: true })

const errorState = useViewerErrorState({
  currentExtend,
  error,
  loadingTheme,
  getOptions: () => effectiveOptions.value
})

const {
  requestController,
  getCurrentVersion,
  isCurrentRequest
} = createFileViewerRequestScope()

const {
  markLoadStarted,
  clearLoadStarted,
  notifyLifecycle,
  notifyActiveUnloadStart,
  notifyActiveUnloadComplete,
  setActiveDocumentContext,
  clearActiveDocumentContext,
  buildLoadStartState,
  buildRenderCompleteState,
  runBeforeOperation
} = useViewerLifecycle({
  getOptions: () => effectiveOptions.value,
  getFilename: () => filename.value,
  getBufferSize: () => currentBuffer.value?.byteLength,
  getCurrentFile: () => currentFile.value,
  getCurrentVersion,
  getFallbackFile: () => props.file,
  getFallbackUrl: () => props.url,
  emitLifecycle: emit,
  emitOperationBefore: context => emit('operation-before', context),
  emitOperationCancel: context => emit('operation-cancel', context),
  formatErrorMessage,
  handleLifecycleError: (nextError, context) => {
    reportFileViewerLifecycleHookError({ error: nextError, context })
  },
  handleOperationError: (nextError, context) => {
    reportFileViewerOperationError({ error: nextError, context })
  },
  onOperationErrorMessage: showError
})

const {
  zoomState,
  refreshZoomProvider,
  startZoomObserver,
  stopZoomObserver,
  clearZoomProvider,
  zoomIn,
  zoomOut,
  resetZoom,
  getZoomState
} = useViewerZoom({
  output,
  enabled: () => true,
  runBeforeOperation
})

const {
  refreshViewStateProvider,
  startViewStateObserver,
  stopViewStateObserver,
  clearViewStateProvider,
  getViewState,
  applyViewState
} = useViewerViewState({
  output,
  emitViewStateChange: change => {
    if (
      (change.source === 'user' || change.source === 'api') &&
      change.action !== 'fit'
    ) {
      markFitUserInteraction()
    }
    emit('view-state-change', change)
  }
})

const {
  startFitObserver,
  stopFitObserver,
  markFitUserInteraction,
  applyInitialFit,
  fitToView
} = useViewerFit({
  output,
  getOptions: () => effectiveOptions.value,
  refreshZoomProvider,
  refreshViewStateProvider,
  emitFitChange: result => emit('fit-change', result)
})

const {
  activeExportAdapter,
  renderedReady,
  progressiveReady,
  clearRenderedContent,
  destroyRenderSession,
  mountRenderedContent,
  setActiveRenderSession
} = useViewerRenderSurface({
  output,
  getOptions: () => effectiveOptions.value,
  isCurrentRequest,
  notifyActiveUnloadStart,
  notifyActiveUnloadComplete,
  clearActiveDocumentContext,
  clearDocumentState,
  refreshDocumentIndex,
  startZoomObserver,
  stopZoomObserver,
  clearZoomProvider,
  refreshZoomProvider,
  startFitObserver,
  stopFitObserver,
  applyInitialFit,
  startViewStateObserver,
  stopViewStateObserver,
  clearViewStateProvider,
  refreshViewStateProvider
})

const {
  operationAvailability,
  visibleToolbar,
  toolbarOrder,
  showToolbar,
  toolbarPosition,
  toolbarDisabled,
  zoomButtonDisabled
} = useViewerToolbar({
  activeExportAdapter,
  currentBuffer,
  currentExtend,
  currentFile,
  currentSourceUrl,
  error,
  getOptions: () => effectiveOptions.value,
  getZoomState,
  loading,
  normalizedToolbar,
  renderedReady,
  zoomState,
  emitOperationAvailabilityChange: availability => emit('operation-availability-change', availability),
  emitZoomChange: state => emit('zoom-change', state)
})

const {
  cancelPreview,
  refreshPreview
} = useViewerSourceLoading({
  getFile: () => props.file,
  getUrl: () => props.url,
  getSourceFilename: () => props.filename || props.name,
  getOptions: () => effectiveOptions.value,
  filename,
  currentFile,
  currentBuffer,
  currentSourceUrl,
  renderedReady,
  progressiveReady,
  requestController,
  clearRenderedContent,
  mountRenderedContent,
  destroyRenderSession,
  setActiveRenderSession,
  buildLoadStartState,
  buildRenderCompleteState,
  notifyLifecycle,
  setActiveDocumentContext,
  markLoadStarted,
  clearLoadStarted,
  startLoading,
  setLoadingMessage,
  stopLoading,
  showError,
  clearError,
  resetLoading,
  formatErrorMessage
})

let externalThemeRefreshSequence = 0
watch(
  [() => props.options?.theme, () => systemPrefersDark.value],
  async ([nextTheme, nextSystemDark], [previousTheme, previousSystemDark]) => {
    const nextScheme = resolveFileViewerColorScheme(nextTheme, nextSystemDark)
    const previousScheme = resolveFileViewerColorScheme(previousTheme, previousSystemDark)
    if (nextScheme === previousScheme || (!props.file && !props.url)) {
      return
    }

    // Semantic renderers such as DOCX and spreadsheets resolve authored colors
    // while rendering. Re-render them when the host changes theme, then restore
    // the user's position instead of applying a visual filter to the document.
    const sequence = externalThemeRefreshSequence += 1
    const previousViewState = getViewState()
    await nextTick()
    await refreshPreview()
    if (sequence === externalThemeRefreshSequence && previousViewState) {
      await applyViewState(previousViewState, {
        action: 'restore',
        source: 'api'
      })
    }
  },
  { flush: 'post' }
)

const {
  downloadOriginalFile,
  exportRenderedHtml,
  printRenderedHtml,
  printWithMask
} = useViewerExport({
  activeExportAdapter,
  currentBuffer,
  currentFile,
  currentSourceUrl,
  displayFilename,
  formatErrorMessage,
  getOptions: () => effectiveOptions.value,
  operationAvailability,
  output,
  runBeforeOperation,
  showError,
  watermarkInlineStyle
})

const zoomInByUser = async () => {
  markFitUserInteraction()
  return zoomIn()
}

const zoomOutByUser = async () => {
  markFitUserInteraction()
  return zoomOut()
}

const resetZoomByUser = async () => {
  markFitUserInteraction()
  return resetZoom()
}

const resolvedViewerTheme = computed(() => {
  return resolveFileViewerColorScheme(viewerTheme.value, systemPrefersDark.value)
})
const themeButtonTitle = computed(() => {
  return resolvedViewerTheme.value === 'dark'
    ? viewerLabels.value.themeToLight
    : viewerLabels.value.themeToDark
})

const toggleViewerTheme = async () => {
  const previousViewState = getViewState()
  const nextTheme = toggleFileViewerColorScheme(viewerTheme.value, systemPrefersDark.value)
  manualViewerTheme.value = nextTheme
  emit('theme-change', nextTheme)
  await nextTick()
  if (props.file || props.url) {
    await refreshPreview()
    if (previousViewState) {
      await applyViewState(previousViewState, {
        action: 'restore',
        source: 'api'
      })
    }
  }
}

const closePrintMenu = () => {
  printMenuOpen.value = false
}

const togglePrintMenu = () => {
  if (toolbarDisabled.value) {
    return
  }
  printMenuOpen.value = !printMenuOpen.value
}

const printDirect = async () => {
  closePrintMenu()
  await printRenderedHtml()
}

const printWithMaskAction = async () => {
  closePrintMenu()
  await printWithMask()
}

const destroyViewer = () => {
  cancelPreview('component-unmount')
  resetLoading()
  stopZoomObserver()
  stopFitObserver()
  stopViewStateObserver()
}

const publicApi = useViewerPublicApi({
  destroy: () => {
    destroyViewer()
  },
  downloadOriginalFile,
  printRenderedHtml,
  printWithMask,
  exportRenderedHtml,
  zoomIn: zoomInByUser,
  zoomOut: zoomOutByUser,
  resetZoom: resetZoomByUser,
  fitToView,
  getZoomState,
  getViewState,
  applyViewState: async (state, options) => {
    markFitUserInteraction()
    return applyViewState(state, options)
  },
  operationAvailability,
  getScrollContainer,
  searchDocument,
  clearDocumentSearch,
  nextSearchResult,
  previousSearchResult,
  getSearchState,
  collectDocumentAnchors,
  scrollToAnchor,
  scrollToLine,
  getDocumentTextChunks
})

defineExpose(publicApi)

useViewerPreviewLifecycle({
  getFile: () => props.file,
  getUrl: () => props.url,
  getSourceFilename: () => props.filename || props.name,
  refreshPreview,
  cancelPreview,
  clearRenderedContent,
  resetLoading,
  stopZoomObserver,
  stopFitObserver,
  stopViewStateObserver
})
</script>

<template>
  <div
    class='file-viewer'
    :data-viewer-theme='viewerTheme'
    :data-viewer-density='viewerDensity'
    :style='viewerRootStyle'
  >
    <div class='viewer-stage'>
      <div
        v-if='showToolbar'
        class='viewer-actions'
        :class='{ "viewer-actions--floating": toolbarPosition === "bottom-right" }'
        :data-toolbar-position='toolbarPosition'
      >
        <template v-for='toolbarItem in toolbarOrder' :key='toolbarItem'>
          <div
            v-if='toolbarItem === "zoom" && visibleToolbar.zoom'
            class='viewer-actions-group viewer-zoom-actions'
            :aria-label='viewerLabels.zoomGroup'
          >
            <button
              v-if='operationAvailability.zoomOut'
              type='button'
              class='viewer-icon-button'
              :disabled='zoomButtonDisabled("canZoomOut")'
              :title='viewerLabels.zoomOut'
              :aria-label='viewerLabels.zoomOut'
              @click='zoomOutByUser'
            >
              <ZoomOut :size='15' :stroke-width='2.4' />
            </button>
            <button
              v-if='operationAvailability.zoomReset'
              type='button'
              class='viewer-zoom-meter'
              :disabled='zoomButtonDisabled("canReset")'
              :title='viewerLabels.zoomReset'
              @click='resetZoomByUser'
            >
              {{ zoomState.label }}
            </button>
            <span
              v-else
              class='viewer-zoom-meter viewer-zoom-meter--readonly'
              :title='zoomState.label'
              :aria-label='zoomState.label'
            >
              {{ zoomState.label }}
            </span>
            <button
              v-if='operationAvailability.zoomIn'
              type='button'
              class='viewer-icon-button'
              :disabled='zoomButtonDisabled("canZoomIn")'
              :title='viewerLabels.zoomIn'
              :aria-label='viewerLabels.zoomIn'
              @click='zoomInByUser'
            >
              <ZoomIn :size='15' :stroke-width='2.4' />
            </button>
            <button
              v-if='operationAvailability.zoomReset'
              type='button'
              class='viewer-icon-button'
              :disabled='zoomButtonDisabled("canReset")'
              :title='viewerLabels.zoomReset'
              :aria-label='viewerLabels.zoomReset'
              @click='resetZoomByUser'
            >
              <RotateCcw :size='14' :stroke-width='2.4' />
            </button>
          </div>
          <button
            v-else-if='toolbarItem === "download" && visibleToolbar.download'
            type='button'
            :disabled='toolbarDisabled'
            :title='viewerLabels.downloadTitle'
            @click='downloadOriginalFile'
          >
            {{ viewerLabels.download }}
          </button>
          <div
            v-else-if='toolbarItem === "print" && visibleToolbar.print'
            class='viewer-print-menu'
            :data-open='printMenuOpen ? "true" : "false"'
            @focusout='event => {
              const next = event.relatedTarget as Node | null
              if (!next || !(event.currentTarget as HTMLElement).contains(next)) {
                closePrintMenu()
              }
            }'
          >
            <button
              type='button'
              :disabled='toolbarDisabled'
              :title='viewerLabels.printTitle'
              :aria-label='viewerLabels.printTitle'
              :aria-haspopup='true'
              :aria-expanded='printMenuOpen'
              @click='togglePrintMenu'
            >
              {{ viewerLabels.print }}
            </button>
            <div class='viewer-print-menu-panel' role='menu'>
              <button
                type='button'
                role='menuitem'
                :disabled='toolbarDisabled'
                :title='viewerLabels.printTitle'
                @click='printDirect'
              >
                {{ viewerLabels.printDirect }}
              </button>
              <button
                type='button'
                role='menuitem'
                :disabled='toolbarDisabled'
                :title='viewerLabels.printMaskTitle'
                @click='printWithMaskAction'
              >
                {{ viewerLabels.printMask }}
              </button>
            </div>
          </div>
          <button
            v-else-if='toolbarItem === "exportHtml" && visibleToolbar.exportHtml'
            type='button'
            :disabled='toolbarDisabled'
            :title='viewerLabels.exportHtmlTitle'
            @click='exportRenderedHtml'
          >
            {{ viewerLabels.exportHtml }}
          </button>
          <button
            v-else-if='toolbarItem === "theme" && visibleToolbar.theme'
            type='button'
            class='viewer-icon-button viewer-theme-button'
            :title='themeButtonTitle'
            :aria-label='themeButtonTitle'
            :aria-pressed='resolvedViewerTheme === "dark"'
            :disabled='toolbarDisabled'
            @click='toggleViewerTheme'
          >
            <Sun v-if='resolvedViewerTheme === "dark"' :size='15' :stroke-width='2.3' />
            <Moon v-else :size='15' :stroke-width='2.3' />
          </button>
        </template>
      </div>
      <div class='viewer-content-shell'>
        <div ref='output' class='content' data-viewer-scroll-root='true' :class='{ hidden: (loading && !progressiveReady) || !!error }' />
        <div v-if='watermarkStyle' class='viewer-watermark' :style='watermarkStyle' />

        <div v-if='loading && !progressiveReady' class='state-panel loading-panel'>
          <div class='loading-card'>
            <div class='loading-icon'>{{ loadingTheme.badge }}</div>
            <div class='loading-copy'>
              <span class='loading-kicker'>{{ loadingTheme.label }}</span>
              <strong>{{ message }}</strong>
              <p>{{ loadingTheme.hint }}</p>
            </div>
            <span class='loading-ring' />
          </div>
        </div>

        <div v-else-if='error' class='state-panel error-panel'>
          <div class='error-card'>
            <strong>{{ errorState.title }}</strong>
            <p>{{ errorState.message }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.file-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  --file-viewer-toolbar-gap: 6px;
  --file-viewer-toolbar-min-height: 45px;
  --file-viewer-toolbar-padding: 6px 10px;
  --file-viewer-toolbar-floating-offset: 16px;
  --file-viewer-toolbar-floating-min-height: 42px;
  --file-viewer-toolbar-floating-padding: 6px;
  --file-viewer-toolbar-group-gap: 2px;
  --file-viewer-toolbar-group-padding: 2px;
  --file-viewer-toolbar-button-min-width: 42px;
  --file-viewer-toolbar-button-height: 30px;
  --file-viewer-toolbar-button-padding: 0 10px;
  --file-viewer-toolbar-button-radius: 8px;
  --file-viewer-toolbar-icon-size: 30px;
  --file-viewer-toolbar-meter-min-width: 48px;
  --file-viewer-toolbar-meter-padding: 0 8px;
  --file-viewer-toolbar-floating-button-min-width: 48px;
  --file-viewer-toolbar-floating-button-height: 32px;
  --file-viewer-toolbar-floating-icon-size: 32px;
  --file-viewer-toolbar-floating-meter-min-width: 54px;
  background: var(--file-viewer-render-surface-background, #ffffff);
  color-scheme: light;
}

.file-viewer[data-viewer-density='compact'] {
  --file-viewer-toolbar-gap: 3px;
  --file-viewer-toolbar-min-height: 34px;
  --file-viewer-toolbar-padding: 3px 5px;
  --file-viewer-toolbar-floating-offset: 10px;
  --file-viewer-toolbar-floating-min-height: 32px;
  --file-viewer-toolbar-floating-padding: 3px;
  --file-viewer-toolbar-group-gap: 2px;
  --file-viewer-toolbar-group-padding: 2px;
  --file-viewer-toolbar-button-min-width: 34px;
  --file-viewer-toolbar-button-height: 26px;
  --file-viewer-toolbar-button-padding: 0 6px;
  --file-viewer-toolbar-button-radius: 6px;
  --file-viewer-toolbar-icon-size: 26px;
  --file-viewer-toolbar-meter-min-width: 42px;
  --file-viewer-toolbar-meter-padding: 0 5px;
  --file-viewer-toolbar-floating-button-min-width: 38px;
  --file-viewer-toolbar-floating-button-height: 28px;
  --file-viewer-toolbar-floating-icon-size: 28px;
  --file-viewer-toolbar-floating-meter-min-width: 46px;
}

.file-viewer[data-viewer-theme='dark'] {
  background: var(--file-viewer-render-surface-background, #0f171d);
  color-scheme: dark;
}

.viewer-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-actions {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--file-viewer-toolbar-gap);
  min-height: var(--file-viewer-toolbar-min-height);
  padding: var(--file-viewer-toolbar-padding);
  border-bottom: 1px solid rgba(20, 35, 53, 0.06);
  background: rgba(255, 255, 255, 0.92);
}

.viewer-actions[data-toolbar-position='top-center'] {
  justify-content: center;
}

.viewer-actions--floating {
  position: absolute;
  z-index: 30;
  right: calc(var(--file-viewer-toolbar-floating-offset) + env(safe-area-inset-right, 0px));
  bottom: calc(var(--file-viewer-toolbar-floating-offset) + env(safe-area-inset-bottom, 0px));
  min-height: var(--file-viewer-toolbar-floating-min-height);
  padding: var(--file-viewer-toolbar-floating-padding);
  border: 1px solid rgba(20, 35, 53, 0.1);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.16);
  backdrop-filter: blur(16px);
}

.viewer-actions-group {
  display: inline-flex;
  align-items: center;
  gap: var(--file-viewer-toolbar-group-gap);
  padding: var(--file-viewer-toolbar-group-padding);
  border: 1px solid rgba(20, 35, 53, 0.08);
  border-radius: 999px;
  background: rgba(20, 35, 53, 0.035);
}

.viewer-actions button {
  min-width: var(--file-viewer-toolbar-button-min-width);
  height: var(--file-viewer-toolbar-button-height);
  padding: var(--file-viewer-toolbar-button-padding);
  border: 0;
  border-radius: var(--file-viewer-toolbar-button-radius);
  background: transparent;
  color: #40546a;
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
}

.viewer-actions .viewer-icon-button {
  width: var(--file-viewer-toolbar-icon-size);
  min-width: var(--file-viewer-toolbar-icon-size);
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.viewer-actions .viewer-zoom-meter {
  min-width: var(--file-viewer-toolbar-meter-min-width);
  height: var(--file-viewer-toolbar-button-height);
  padding: var(--file-viewer-toolbar-meter-padding);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: #23465e;
}

.viewer-actions .viewer-zoom-meter--readonly {
  font-size: 12px;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
}

.viewer-print-menu {
  position: relative;
  display: inline-flex;
}

.viewer-print-menu-panel {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 40;
  min-width: 118px;
  padding: 4px;
  border: 1px solid rgba(20, 35, 53, 0.12);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.16);
  display: none;
  flex-direction: column;
  gap: 2px;
}

.viewer-print-menu[data-open='true'] .viewer-print-menu-panel {
  display: flex;
}

.viewer-print-menu-panel button {
  width: 100%;
  min-width: 0;
  justify-content: flex-start;
  text-align: left;
  border-radius: 8px;
}

.viewer-actions--floating .viewer-print-menu-panel {
  top: auto;
  bottom: calc(100% + 6px);
  z-index: 50;
}

.viewer-actions--floating button {
  min-width: var(--file-viewer-toolbar-floating-button-min-width);
  height: var(--file-viewer-toolbar-floating-button-height);
  border-radius: 999px;
}

.viewer-actions--floating .viewer-icon-button {
  width: var(--file-viewer-toolbar-floating-icon-size);
  min-width: var(--file-viewer-toolbar-floating-icon-size);
}

.viewer-actions--floating .viewer-zoom-meter {
  min-width: var(--file-viewer-toolbar-floating-meter-min-width);
  height: var(--file-viewer-toolbar-floating-button-height);
}

.viewer-actions button:hover:not(:disabled) {
  background: rgba(33, 163, 102, 0.1);
  color: #16774c;
}

.viewer-actions button:disabled {
  color: #aab5c0;
  cursor: not-allowed;
}

.viewer-content-shell {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.content {
  display: block;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: var(--file-viewer-render-surface-background, #f2f2f2);
}

.content.hidden {
  visibility: hidden;
}

:global(.flyfish-search-match) {
  padding: 0 2px;
  border-radius: 4px;
  background: rgba(255, 214, 102, 0.72);
  color: inherit;
  box-shadow: 0 0 0 1px rgba(185, 128, 0, 0.14);
}

:global(.flyfish-search-match--active) {
  background: rgba(47, 191, 122, 0.82);
  box-shadow: 0 0 0 2px rgba(30, 132, 83, 0.24);
}

.viewer-watermark {
  position: absolute;
  z-index: 20;
  inset: 0;
  pointer-events: none;
  background-repeat: repeat;
}

.state-panel {
  position: absolute;
  z-index: 40;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(246, 248, 249, 0.98));
}

.loading-card,
.error-card {
  width: min(100%, 460px);
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(19, 36, 55, 0.06);
  box-shadow: 0 18px 42px rgba(15, 31, 47, 0.12);
}

.loading-icon {
  flex-shrink: 0;
  min-width: 70px;
  height: 70px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: linear-gradient(135deg, var(--viewer-accent) 0%, var(--viewer-accent) 100%);
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 0.04em;
  box-shadow: 0 14px 30px rgba(17, 28, 40, 0.14);
}

.loading-copy {
  min-width: 0;
  flex: 1;
}

.loading-kicker {
  display: block;
  color: var(--viewer-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loading-copy strong,
.error-card strong {
  display: block;
  margin-top: 4px;
  color: #16283b;
  font-size: 20px;
  line-height: 1.2;
}

.loading-copy p,
.error-card p {
  margin: 8px 0 0;
  color: #6a7d90;
  line-height: 1.6;
}

.loading-ring {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: 3px solid var(--viewer-soft);
  border-top-color: var(--viewer-accent);
  animation: viewer-spin 0.9s linear infinite;
}

.error-card {
  display: block;
  text-align: center;
}

.error-card strong {
  color: #b42318;
}

.file-viewer[data-viewer-theme='dark'] .viewer-actions--floating {
  border-color: rgba(167, 185, 198, 0.16);
  background: rgba(14, 22, 28, 0.94);
  box-shadow: 0 20px 52px rgba(0, 0, 0, 0.34);
}

.file-viewer[data-viewer-theme='dark'] .viewer-actions {
  border-bottom-color: rgba(167, 185, 198, 0.12);
  background: rgba(14, 22, 28, 0.94);
}

.file-viewer[data-viewer-theme='dark'] .viewer-actions button {
  color: #b8c7d5;
}

.file-viewer[data-viewer-theme='dark'] .viewer-actions-group {
  border-color: rgba(167, 185, 198, 0.13);
  background: rgba(167, 185, 198, 0.08);
}

.file-viewer[data-viewer-theme='dark'] .viewer-actions button:hover:not(:disabled) {
  background: rgba(45, 212, 154, 0.14);
  color: #5ee0ae;
}

.file-viewer[data-viewer-theme='dark'] .viewer-actions button:disabled {
  color: #667888;
}

.file-viewer[data-viewer-theme='dark'] .content {
  background: var(--file-viewer-render-surface-background, #141c23);
}

.file-viewer[data-viewer-theme='dark'] .state-panel {
  background:
    linear-gradient(180deg, rgba(15, 23, 30, 0.92), rgba(11, 17, 22, 0.98));
}

.file-viewer[data-viewer-theme='dark'] .loading-card,
.file-viewer[data-viewer-theme='dark'] .error-card {
  background: rgba(19, 29, 37, 0.94);
  border-color: rgba(139, 161, 177, 0.16);
  box-shadow: 0 22px 52px rgba(0, 0, 0, 0.34);
}

.file-viewer[data-viewer-theme='dark'] .loading-copy strong,
.file-viewer[data-viewer-theme='dark'] .error-card strong {
  color: #eff7fb;
}

.file-viewer[data-viewer-theme='dark'] .loading-copy p,
.file-viewer[data-viewer-theme='dark'] .error-card p {
  color: #9eb0bf;
}

.file-viewer[data-viewer-theme='dark'] .error-card strong {
  color: #ff9c91;
}

@keyframes viewer-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-color-scheme: dark) {
  .file-viewer[data-viewer-theme='system'] {
    background: var(--file-viewer-render-surface-background, #0f171d);
    color-scheme: dark;
  }

  .file-viewer[data-viewer-theme='system'] .viewer-actions--floating {
    border-color: rgba(167, 185, 198, 0.16);
    background: rgba(14, 22, 28, 0.94);
    box-shadow: 0 20px 52px rgba(0, 0, 0, 0.34);
  }

  .file-viewer[data-viewer-theme='system'] .viewer-actions {
    border-bottom-color: rgba(167, 185, 198, 0.12);
    background: rgba(14, 22, 28, 0.94);
  }

  .file-viewer[data-viewer-theme='system'] .viewer-actions button {
    color: #b8c7d5;
  }

  .file-viewer[data-viewer-theme='system'] .viewer-actions-group {
    border-color: rgba(167, 185, 198, 0.13);
    background: rgba(167, 185, 198, 0.08);
  }

  .file-viewer[data-viewer-theme='system'] .viewer-actions button:hover:not(:disabled) {
    background: rgba(45, 212, 154, 0.14);
    color: #5ee0ae;
  }

  .file-viewer[data-viewer-theme='system'] .viewer-actions button:disabled {
    color: #667888;
  }

  .file-viewer[data-viewer-theme='system'] .content {
    background: var(--file-viewer-render-surface-background, #141c23);
  }

  .file-viewer[data-viewer-theme='system'] .state-panel {
    background:
      linear-gradient(180deg, rgba(15, 23, 30, 0.92), rgba(11, 17, 22, 0.98));
  }

  .file-viewer[data-viewer-theme='system'] .loading-card,
  .file-viewer[data-viewer-theme='system'] .error-card {
    background: rgba(19, 29, 37, 0.94);
    border-color: rgba(139, 161, 177, 0.16);
    box-shadow: 0 22px 52px rgba(0, 0, 0, 0.34);
  }

  .file-viewer[data-viewer-theme='system'] .loading-copy strong,
  .file-viewer[data-viewer-theme='system'] .error-card strong {
    color: #eff7fb;
  }

  .file-viewer[data-viewer-theme='system'] .loading-copy p,
  .file-viewer[data-viewer-theme='system'] .error-card p {
    color: #9eb0bf;
  }

  .file-viewer[data-viewer-theme='system'] .error-card strong {
    color: #ff9c91;
  }
}

@media (max-width: 767px) {
  .viewer-actions--floating {
    right: calc(10px + env(safe-area-inset-right, 0px));
    bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    max-width: calc(100% - 20px);
    gap: 4px;
    padding: 5px;
    overflow: visible;
  }

  .viewer-actions--floating .viewer-print-menu-panel {
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    min-width: min(148px, calc(100vw - 32px));
  }

  .viewer-actions--floating button {
    min-width: 40px;
    height: 30px;
    padding: 0 9px;
  }
}
</style>

<style>
.file-render {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
</style>
