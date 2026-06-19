import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type {
  FileRenderExportAdapter,
  FileViewerOperationAvailability,
  FileViewerOperationType
} from '@file-viewer/core'
import {
  createFileViewerPublicOperationActionHandlers
} from '@file-viewer/core'

interface UseViewerExportOptions {
  activeExportAdapter: ShallowRef<FileRenderExportAdapter | null>;
  currentBuffer: Ref<ArrayBuffer | null>;
  currentFile: Ref<File | null>;
  currentSourceUrl: Ref<string | null>;
  displayFilename: ComputedRef<string>;
  formatErrorMessage: (prefix: string, nextError: unknown) => string;
  operationAvailability: ComputedRef<FileViewerOperationAvailability>;
  output: Ref<HTMLDivElement | null>;
  runBeforeOperation: (operation: FileViewerOperationType) => Promise<boolean>;
  showError: (message: string) => void;
  watermarkInlineStyle: ComputedRef<string>;
}

export const useViewerExport = ({
  activeExportAdapter,
  currentBuffer,
  currentFile,
  currentSourceUrl,
  displayFilename,
  formatErrorMessage,
  operationAvailability,
  output,
  runBeforeOperation,
  showError,
  watermarkInlineStyle
}: UseViewerExportOptions) => {
  return createFileViewerPublicOperationActionHandlers({
    getBuffer: () => currentBuffer.value,
    getFile: () => currentFile.value,
    getUrl: () => currentSourceUrl.value,
    getFilename: () => displayFilename.value,
    getMimeType: () => currentFile.value?.type,
    getRenderedSource: () => output.value,
    getAdapter: () => activeExportAdapter.value,
    getWatermarkInlineStyle: () => watermarkInlineStyle.value,
    getPrintAvailable: () => operationAvailability.value.print,
    beforeOperation: runBeforeOperation,
    formatErrorMessage,
    onErrorMessage: showError
  })
}
