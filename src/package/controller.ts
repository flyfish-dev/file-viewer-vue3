import { createViewer } from '@file-viewer/core';
import {
  DEFAULT_FILE_VIEWER_SOURCE_FILENAME,
  getExtension,
  normalizeFilename,
  readFileViewerBuffer,
  resolveFileViewerSourceFilename,
  wrapFileViewerFileRef,
  type FileViewerAiOptions,
  type FileViewerArchiveOptions,
  type FileViewerCadOptions,
  type FileViewerDocxOptions,
  type FileViewerDocumentAnchor,
  type FileViewerDocumentChunk,
  type FileViewerEvent,
  type FileViewerEventHandler,
  type FileViewerEventType,
  type FileViewerFileRef,
  type FileViewerInstance,
  type FileViewerOperationAvailability,
  type FileViewerOptions,
  type FileViewerPdfOptions,
  type FileViewerSpreadsheetOptions,
  type FileViewerPublicApi,
  type FileViewerSource,
  type FileViewerSearchOptions,
  type FileViewerSearchState,
  type FileViewerThemeMode,
  type FileViewerToolbarOptions,
  type FileViewerToolbarPosition,
  type FileViewerTypstOptions,
  type FileViewerWatermarkOptions,
  type FileViewerZoomState,
  type RendererRegistry,
  type RendererSession,
} from '@file-viewer/core';

export type FileRef = FileViewerFileRef;

export type ViewerWatermarkOptions = FileViewerWatermarkOptions;
export type ViewerToolbarPosition = FileViewerToolbarPosition;
export type ViewerToolbarOptions = FileViewerToolbarOptions;
export type ViewerArchiveOptions = FileViewerArchiveOptions;
export type ViewerPdfOptions = FileViewerPdfOptions;
export type ViewerSpreadsheetOptions = FileViewerSpreadsheetOptions;
export type ViewerDocxOptions = FileViewerDocxOptions;
export type ViewerTypstOptions = FileViewerTypstOptions;
export type ViewerCadOptions = FileViewerCadOptions;
export type ViewerSearchOptions = FileViewerSearchOptions;
export type ViewerAiOptions = FileViewerAiOptions;
export type ViewerThemeMode = FileViewerThemeMode;
export type ViewerOptions = FileViewerOptions;
export type ViewerEventType = FileViewerEventType;
export type ViewerEvent = FileViewerEvent;
export type ViewerEventHandler = FileViewerEventHandler;

export interface ViewerMountOptions {
  url?: string;
  file?: FileRef;
  buffer?: ArrayBuffer;
  name?: string;
  filename?: string;
  type?: string;
  size?: number;
  options?: ViewerOptions;
  onEvent?: ViewerEventHandler;
}

export interface ViewerSourceInput {
  url?: string;
  file?: FileRef;
  buffer?: ArrayBuffer;
  filename?: string;
  name?: string;
  type?: string;
  size?: number;
}

export interface ViewerFetchInput {
  url: string;
  signal?: AbortSignal;
  source: ViewerSourceInput;
}

export type ViewerFetchFile = (
  input: ViewerFetchInput
) => Promise<FileRef | null | undefined>;

export interface ViewerCoreOptions {
  registry?: RendererRegistry;
  fetchFile?: ViewerFetchFile;
  onError?: (error: unknown, source: ViewerSourceInput) => void;
}

export interface ViewerController {
  readonly container: HTMLElement;
  load(options: ViewerMountOptions): Promise<void>;
  update(options?: ViewerMountOptions): Promise<void>;
  reload(): Promise<void>;
  destroy(): void;
  getApi(): FileViewerPublicApi | FileViewerInstance | null;
  downloadOriginalFile(): Promise<void>;
  printRenderedHtml(): Promise<void>;
  exportRenderedHtml(): Promise<void>;
  zoomIn(): Promise<FileViewerZoomState | null>;
  zoomOut(): Promise<FileViewerZoomState | null>;
  resetZoom(): Promise<FileViewerZoomState | null>;
  searchDocument(query: string): Promise<FileViewerSearchState | null>;
  clearDocumentSearch(): Promise<FileViewerSearchState | null>;
  nextSearchResult(): Promise<FileViewerSearchState | null>;
  previousSearchResult(): Promise<FileViewerSearchState | null>;
  collectDocumentAnchors(): Promise<FileViewerDocumentAnchor[]>;
  scrollToAnchor(anchor: FileViewerDocumentAnchor | string): Promise<boolean>;
  scrollToLine(line: number): Promise<boolean>;
  getDocumentTextChunks(): FileViewerDocumentChunk[];
  getOperationAvailability(): FileViewerOperationAvailability | null;
}

export type ViewerControllerAccessor = () => ViewerController | null;

export interface ViewerControllerHandle {
  load(options: ViewerMountOptions): Promise<void>;
  update(options?: ViewerMountOptions): Promise<void>;
  reload(): Promise<void>;
  destroy(): void;
  getController(): ViewerController | null;
  getApi(): FileViewerPublicApi | FileViewerInstance | null;
}

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const hasSource = (options: ViewerMountOptions = {}) => {
  return !!(options.url || options.file || options.buffer);
};

const toViewerSourceInput = (options: ViewerMountOptions = {}): ViewerSourceInput => ({
  url: options.url,
  file: options.file,
  buffer: options.buffer,
  filename: options.filename || options.name,
  name: options.name,
  type: options.type,
  size: options.size,
});

const canUseFetch = () => typeof fetch === 'function';

const defaultFetchFile: ViewerFetchFile = async ({ url, signal }) => {
  if (!canUseFetch()) {
    throw new Error('fetch is not available in the current environment.');
  }

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
  }
  return response.blob();
};

const resolveViewerSourceFilename = (source: ViewerSourceInput) => {
  return normalizeFilename(
    source.filename || source.name || resolveFileViewerSourceFilename({
      file: source.file,
      url: source.url,
      fallback: DEFAULT_FILE_VIEWER_SOURCE_FILENAME,
    }),
    source.type ? `preview.${source.type}` : DEFAULT_FILE_VIEWER_SOURCE_FILENAME
  );
};

const resolveViewerLoadSource = async (
  source: ViewerSourceInput,
  options: {
    fetchFile?: ViewerFetchFile;
    signal?: AbortSignal;
  } = {}
): Promise<FileViewerSource> => {
  const filename = resolveViewerSourceFilename(source);
  const type = source.type || getExtension(filename);

  if (source.buffer) {
    return {
      buffer: source.buffer,
      filename,
      type,
      size: source.size ?? source.buffer.byteLength,
      url: source.url,
    };
  }

  if (source.file) {
    const file = wrapFileViewerFileRef(source.file, filename);
    return {
      file,
      buffer: await readFileViewerBuffer(file),
      filename: file.name || filename,
      type: type || getExtension(file.name),
      size: source.size ?? file.size,
      url: source.url,
    };
  }

  if (source.url) {
    const fileRef = await (options.fetchFile || defaultFetchFile)({
      url: source.url,
      signal: options.signal,
      source,
    });
    if (!fileRef) {
      throw new Error('Downloaded file is empty.');
    }

    const file = wrapFileViewerFileRef(fileRef, filename);
    return {
      file,
      buffer: await readFileViewerBuffer(file),
      filename: file.name || filename,
      type: type || getExtension(file.name),
      size: source.size ?? file.size,
      url: source.url,
    };
  }

  return {
    filename,
    type,
  };
};

export const createViewerControllerHandle = (
  getController: ViewerControllerAccessor,
  dispose: () => void
): ViewerControllerHandle => ({
  load(options) {
    return getController()?.load(options) ?? Promise.resolve();
  },
  update(options) {
    return getController()?.update(options) ?? Promise.resolve();
  },
  reload() {
    return getController()?.reload() ?? Promise.resolve();
  },
  destroy() {
    dispose();
  },
  getController,
  getApi() {
    return getController()?.getApi() ?? null;
  },
});

const callApi = async <Result>(
  api: FileViewerInstance | null,
  action: (api: FileViewerInstance) => Promise<Result> | Result,
  fallback: Result
) => {
  if (!api) {
    return fallback;
  }
  return action(api);
};

const isAbortError = (error: unknown) => {
  return Boolean(error && typeof error === 'object' && (error as { name?: string }).name === 'AbortError');
};

export const mountViewer = (
  container: HTMLElement,
  initialOptions: ViewerMountOptions = {},
  coreOptions: ViewerCoreOptions = {}
): ViewerController => {
  if (!isBrowser()) {
    throw new Error('Flyfish File Viewer can only be mounted in a browser DOM environment.');
  }

  let disposed = false;
  let currentOptions: ViewerMountOptions = initialOptions;
  let currentSource: ViewerSourceInput | null = hasSource(currentOptions)
    ? toViewerSourceInput(currentOptions)
    : null;
  let abortController: AbortController | null = null;
  const instance = createViewer(container, {
    registry: coreOptions.registry,
    options: currentOptions.options,
    onEvent: event => {
      currentOptions.onEvent?.(event);
    },
  });

  const cancel = () => {
    abortController?.abort();
    abortController = null;
  };

  const loadSource = async (nextSource: ViewerSourceInput): Promise<RendererSession | null> => {
    cancel();
    currentSource = nextSource;
    abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const controller = abortController;
    try {
      const resolvedSource = await resolveViewerLoadSource(nextSource, {
        fetchFile: coreOptions.fetchFile,
        signal: controller?.signal,
      });
      return await instance.load(resolvedSource);
    } catch (error) {
      if (isAbortError(error) && controller?.signal.aborted) {
        return null;
      }
      coreOptions.onError?.(error, nextSource);
      throw error;
    } finally {
      if (abortController === controller) {
        abortController = null;
      }
    }
  };

  if (currentSource) {
    void loadSource(currentSource);
  }

  const controller: ViewerController = {
    container,
    async load(nextOptions) {
      if (disposed) return;
      currentOptions = nextOptions;
      instance.updateOptions(currentOptions.options || {});
      if (hasSource(currentOptions)) {
        await loadSource(toViewerSourceInput(currentOptions));
      }
    },
    async update(nextOptions = {}) {
      if (disposed) return;
      currentOptions = {
        ...currentOptions,
        ...nextOptions,
        options: nextOptions.options ?? currentOptions.options,
      };
      instance.updateOptions(currentOptions.options || {});
      if (hasSource(currentOptions)) {
        await loadSource(toViewerSourceInput(currentOptions));
      } else {
        currentSource = null;
        await instance.load({ filename: DEFAULT_FILE_VIEWER_SOURCE_FILENAME });
      }
    },
    async reload() {
      if (disposed) return;
      if (currentSource) {
        await loadSource(currentSource);
      }
    },
    destroy() {
      if (disposed) return;
      disposed = true;
      cancel();
      void instance.destroy('component-unmount');
      container.innerHTML = '';
    },
    getApi() {
      return instance;
    },
    downloadOriginalFile() {
      return callApi(instance, api => api.download(), undefined);
    },
    printRenderedHtml() {
      return callApi(instance, api => api.print(), undefined);
    },
    exportRenderedHtml() {
      return callApi(
        instance,
        api => api.exportHtml({ download: true }).then(() => undefined),
        undefined
      );
    },
    zoomIn() {
      return callApi(instance, api => api.zoomIn(), null);
    },
    zoomOut() {
      return callApi(instance, api => api.zoomOut(), null);
    },
    resetZoom() {
      return callApi(instance, api => api.resetZoom(), null);
    },
    searchDocument(query) {
      return callApi(instance, api => api.search(query), null);
    },
    clearDocumentSearch() {
      return callApi(instance, api => api.clearSearch(), null);
    },
    nextSearchResult() {
      return callApi(instance, api => api.nextSearchResult(), null);
    },
    previousSearchResult() {
      return callApi(instance, api => api.previousSearchResult(), null);
    },
    collectDocumentAnchors() {
      return callApi(instance, api => api.collectDocumentAnchors(), []);
    },
    scrollToAnchor(anchor) {
      return callApi(instance, api => api.scrollToDocumentAnchor(anchor), false);
    },
    scrollToLine(line) {
      return callApi(instance, api => api.scrollToLine(line), false);
    },
    getDocumentTextChunks() {
      return instance.getDocumentTextChunks();
    },
    getOperationAvailability() {
      return instance.getCapabilities();
    },
  };

  return controller;
};
