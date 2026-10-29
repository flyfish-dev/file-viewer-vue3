import {
  resolveFileViewerArchiveWasmUrl,
  resolveFileViewerArchiveWorkerUrl,
  resolveFileViewerAssetUrl,
} from '@file-viewer/core';
import type {
  FileViewerArchiveOptions,
  ResolveFileViewerAssetUrlOptions,
} from '@file-viewer/core';

export const getBrowserFileViewerDocumentBaseUrl = () => {
  if (typeof document !== 'undefined' && document.baseURI) {
    return document.baseURI;
  }
  if (typeof location !== 'undefined' && location.href) {
    return location.href;
  }
  return 'file:///';
};

export const resolveBrowserFileViewerAssetUrl = (
  value: string | URL | undefined,
  fallback: string,
  options: ResolveFileViewerAssetUrlOptions = {}
) => {
  return resolveFileViewerAssetUrl(value, fallback, {
    documentBaseUrl: getBrowserFileViewerDocumentBaseUrl(),
    ...options,
  });
};

export const resolveBrowserFileViewerArchiveWorkerUrl = (
  options?: Pick<FileViewerArchiveOptions, 'workerUrl'> | null,
  baseUrl?: string
) => {
  return resolveFileViewerArchiveWorkerUrl(options, baseUrl || getBrowserFileViewerDocumentBaseUrl());
};

export const resolveBrowserFileViewerArchiveWasmUrl = (
  options?: Pick<FileViewerArchiveOptions, 'wasmUrl'> | null,
  fallback = ''
) => {
  return resolveFileViewerArchiveWasmUrl(options, fallback);
};
