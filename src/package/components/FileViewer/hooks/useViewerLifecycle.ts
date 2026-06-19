import {
  createFileViewerLifecycleFacade,
} from '@file-viewer/core'
import type {
  FileViewerErrorMessageFormatter,
  FileViewerFileRef,
  FileViewerLifecycleComponentEmit,
  FileViewerLifecycleContext,
  FileViewerOperationContext,
  FileViewerOptions,
} from '@file-viewer/core'

interface UseViewerLifecycleOptions {
  getOptions: () => FileViewerOptions | undefined;
  getFilename: () => string;
  getBufferSize: () => number | undefined;
  getCurrentFile: () => File | null;
  getCurrentVersion: () => number;
  getFallbackFile: () => FileViewerFileRef | undefined;
  getFallbackUrl: () => string | undefined;
  emitLifecycle: FileViewerLifecycleComponentEmit;
  emitOperationBefore: (context: FileViewerOperationContext) => void;
  emitOperationCancel: (context: FileViewerOperationContext) => void;
  formatErrorMessage: FileViewerErrorMessageFormatter;
  handleLifecycleError: (error: unknown, context: FileViewerLifecycleContext) => void;
  handleOperationError?: (error: unknown, context: FileViewerOperationContext) => void;
  onOperationErrorMessage?: (message: string, context: FileViewerOperationContext) => void;
}

/**
 * FileViewer 组件层的生命周期与操作门面。
 *
 * 纯 TS 协议已经由 `@file-viewer/core` 提供；这里仅把 Vue emit 和组件
 * 当前状态组合起来，保持入口组件更薄。
 */
export const useViewerLifecycle = ({
  getOptions,
  getFilename,
  getBufferSize,
  getCurrentFile,
  getCurrentVersion,
  getFallbackFile,
  getFallbackUrl,
  emitLifecycle,
  emitOperationBefore,
  emitOperationCancel,
  formatErrorMessage,
  handleLifecycleError,
  handleOperationError,
  onOperationErrorMessage
}: UseViewerLifecycleOptions) => {
  return createFileViewerLifecycleFacade({
    getOptions,
    getFilename,
    getBufferSize,
    getCurrentFile,
    getCurrentVersion,
    getFallbackFile,
    getFallbackUrl,
    emitLifecycle,
    emitOperationBefore,
    emitOperationCancel,
    formatErrorMessage,
    handleLifecycleError,
    handleOperationError,
    onOperationErrorMessage
  })
}
