import type {
  FileViewerSearchProvider,
  FileViewerZoomProvider,
} from '@file-viewer/core';

export interface FileViewerSearchProviderHost extends HTMLElement {
  __flyfishViewerSearchProvider?: FileViewerSearchProvider;
}

export interface FileViewerZoomProviderHost extends HTMLElement {
  __flyfishViewerZoomProvider?: FileViewerZoomProvider;
}

const searchProviderRegistry = new WeakMap<HTMLElement, FileViewerSearchProvider>();
const zoomProviderRegistry = new WeakMap<HTMLElement, FileViewerZoomProvider>();

export const registerFileViewerSearchProvider = (
  host: HTMLElement,
  provider: FileViewerSearchProvider
) => {
  searchProviderRegistry.set(host, provider);
  // Bridge for the still-transitional core document controllers.
  (host as FileViewerSearchProviderHost).__flyfishViewerSearchProvider = provider;
};

export const unregisterFileViewerSearchProvider = (host: HTMLElement | null | undefined) => {
  if (!host) {
    return;
  }
  searchProviderRegistry.delete(host);
  delete (host as FileViewerSearchProviderHost).__flyfishViewerSearchProvider;
};

export const findFileViewerSearchProvider = (root: HTMLElement | null | undefined) => {
  if (!root) {
    return null;
  }

  const direct = searchProviderRegistry.get(root) || (root as FileViewerSearchProviderHost).__flyfishViewerSearchProvider;
  if (direct) {
    return direct;
  }

  const host = root.querySelector<FileViewerSearchProviderHost>('[data-viewer-search-provider]');
  return host
    ? searchProviderRegistry.get(host) || host.__flyfishViewerSearchProvider || null
    : null;
};

export const registerFileViewerZoomProvider = (
  host: HTMLElement,
  provider: FileViewerZoomProvider
) => {
  zoomProviderRegistry.set(host, provider);
  host.dataset.viewerZoomProvider = host.dataset.viewerZoomProvider || 'custom';
  // Bridge for the still-transitional core zoom controller.
  (host as FileViewerZoomProviderHost).__flyfishViewerZoomProvider = provider;
};

export const unregisterFileViewerZoomProvider = (host: HTMLElement | null | undefined) => {
  if (!host) {
    return;
  }
  zoomProviderRegistry.delete(host);
  delete host.dataset.viewerZoomProvider;
  delete (host as FileViewerZoomProviderHost).__flyfishViewerZoomProvider;
};

export const findFileViewerZoomProvider = (root: HTMLElement | null | undefined) => {
  if (!root) {
    return null;
  }

  const direct = zoomProviderRegistry.get(root) || (root as FileViewerZoomProviderHost).__flyfishViewerZoomProvider;
  if (direct) {
    return direct;
  }

  const host = root.querySelector<FileViewerZoomProviderHost>('[data-viewer-zoom-provider]');
  return host
    ? zoomProviderRegistry.get(host) || host.__flyfishViewerZoomProvider || null
    : null;
};
