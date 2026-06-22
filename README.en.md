# @file-viewer/vue3

The standard Vue 3 native component package for Flyfish File Viewer. It owns the Vue 3 component lifecycle and local controller while consuming the shared `@file-viewer/core` contracts and core browser engine. It exposes plugin install, component props, lifecycle events, search, zoom, print, export, and document-location ref APIs.

```bash
npm install vue @file-viewer/vue3
```

```ts
import { createApp } from 'vue'
import FileViewer from '@file-viewer/vue3'
import '@file-viewer/vue3/dist/file-viewer3.css'

import App from './App.vue'

createApp(App).use(FileViewer).mount('#app')
```

```vue
<template>
  <section style="height: 100vh">
    <file-viewer
      ref="viewer"
      url="/example/demo.pdf"
      :options="{
        theme: 'light',
        toolbar: { position: 'bottom-right' }
      }"
      @load-complete="handleLoadComplete"
    />
  </section>
</template>
```

The component instance exposes `downloadOriginalFile()`, `printRenderedHtml()`, `exportRenderedHtml()`, `zoomIn()`, `zoomOut()`, `resetZoom()`, `searchDocument()`, `clearDocumentSearch()`, `nextSearchResult()`, `previousSearchResult()`, `collectDocumentAnchors()`, `scrollToAnchor()`, `scrollToLine()`, and `getDocumentTextChunks()`. The historical packages `@flyfish-group/file-viewer3` and `file-viewer3` remain supported for compatibility with existing projects; new integrations should prefer the standard component package package `@file-viewer/vue3`.

## Capabilities

`@file-viewer/vue3` shares the same `@file-viewer/core` contracts with the Pure Web, Vue 2, React, jQuery, and Svelte standard component packages. It supports PDF, Word, Excel, PowerPoint, OFD, CAD/DWG/DXF/DWF, EPUB/UMD, archives, email, Markdown, highlighted code, images, audio, video, 3D models, geospatial files, and structured data assets. See the complete format matrix and option reference at https://doc.file-viewer.app/guide/formats

<!-- FILE_VIEWER_GENERATED:START -->
## Ecosystem Matrix

Every standard component package shares `@file-viewer/core` as the only common foundation, and no framework component package depends on another framework implementation. Core owns format metadata, source loading, browser/renderers, events, operation APIs, search, zoom, print, and export; each framework package owns its local controller, component lifecycle, type exports, and ecosystem-specific interaction layer.

| Framework | Standard npm package | Entrypoints | GitHub | Gitee | Historical aliases |
| --- | --- | --- | --- | --- | --- |
| Vue 3 | `@file-viewer/vue3` | ESM, type declarations | [file-viewer-vue3](https://github.com/flyfish-dev/file-viewer-vue3) | [file-viewer-vue3](https://gitee.com/flyfish-dev/file-viewer-vue3) | `@flyfish-group/file-viewer3`, `file-viewer3` |
| Vue 2.7 | `@file-viewer/vue2.7` | ESM, type declarations | [file-viewer-vue2.7](https://github.com/flyfish-dev/file-viewer-vue2.7) | [file-viewer-vue2.7](https://gitee.com/flyfish-dev/file-viewer-vue2.7) | `@flyfish-group/file-viewer` |
| Vue 2.6 | `@file-viewer/vue2.6` | ESM, type declarations | [file-viewer-vue2.6](https://github.com/flyfish-dev/file-viewer-vue2.6) | [file-viewer-vue2.6](https://gitee.com/flyfish-dev/file-viewer-vue2.6) | none |
| React 18/19 | `@file-viewer/react` | ESM, type declarations | [file-viewer-react](https://github.com/flyfish-dev/file-viewer-react) | [file-viewer-react](https://gitee.com/flyfish-dev/file-viewer-react) | `@flyfish-group/file-viewer-react` |
| React 16.8/17 | `@file-viewer/react-legacy` | ESM, type declarations | [file-viewer-react-legacy](https://github.com/flyfish-dev/file-viewer-react-legacy) | [file-viewer-react-legacy](https://gitee.com/flyfish-dev/file-viewer-react-legacy) | none |
| Pure Web | `@file-viewer/web` | ESM, type declarations, script tag IIFE, worker/WASM viewer assets, asset copy CLI | [file-viewer-web](https://github.com/flyfish-dev/file-viewer-web) | [file-viewer-web](https://gitee.com/flyfish-dev/file-viewer-web) | `@flyfish-group/file-viewer-web` |
| jQuery | `@file-viewer/jquery` | ESM, type declarations | [file-viewer-jquery](https://github.com/flyfish-dev/file-viewer-jquery) | [file-viewer-jquery](https://gitee.com/flyfish-dev/file-viewer-jquery) | none |
| Svelte | `@file-viewer/svelte` | Svelte component, ESM, type declarations | [file-viewer-svelte](https://github.com/flyfish-dev/file-viewer-svelte) | [file-viewer-svelte](https://gitee.com/flyfish-dev/file-viewer-svelte) | none |

## Format Support Matrix

The shared core currently covers 23 preview pipelines and 194 file extensions. Renderers stay lazy-loaded, and component packages only adapt their own ecosystem without nesting through another framework implementation.

| Preview pipeline | Category | Extensions | Capabilities | Loading |
| --- | --- | --- | --- | --- |
| Word OpenXML | office | `.docx`, `.docm`, `.dotx`, `.dotm` | download, print(adapter), HTML export(adapter), zoom(provider), search | lazy async |
| Word Binary | office | `.doc`, `.dot` | download, print(adapter), HTML export(adapter), zoom(provider), search | lazy async |
| PowerPoint | office | `.pptx`, `.pptm`, `.potx`, `.potm`, `.ppsx`, `.ppsm` | download, print, HTML export, zoom(provider), search | lazy async |
| Open Document | office | `.rtf`, `.odt`, `.odp` | download, print, HTML export, zoom(provider), search | lazy async |
| Spreadsheet | office | `.xlsx`, `.xltx`, `.xlsm`, `.xlsb`, `.xls`, `.xlt`, `.xltm`, `.csv`, `.ods`, `.fods`, `.numbers` | download, zoom(provider), search | lazy async |
| PDF | document | `.pdf` | download, print(adapter), HTML export(adapter), zoom(provider), search(provider) | lazy async |
| OFD | document | `.ofd` | download, print, HTML export, zoom(provider), search | lazy async |
| Typst | document | `.typ`, `.typst` | download, print(adapter), HTML export(adapter), zoom(provider), search | lazy async |
| Archive | archive | `.zip`, `.zipx`, `.7z`, `.rar`, `.tar`, `.gz`, `.gzip`, `.tgz`, `.bz2`, `.bzip2`, `.tbz`, `.tbz2`, `.xz`, `.txz`, `.lzma`, `.zst`, `.tzst`, `.cab`, `.ar`, `.cpio`, `.iso`, `.xar`, `.lha`, `.lzh`, `.jar`, `.war`, `.ear`, `.apk`, `.cbz`, `.cbr` | download, search | lazy async |
| Email | email | `.eml`, `.msg`, `.mbox` | download, HTML export, search | lazy async |
| EDA | eda | `.olb`, `.dra` | download, print, HTML export, search | lazy async |
| CAD | cad | `.dxf`, `.dwg`, `.dwf`, `.dwfx`, `.xps` | download, print, HTML export, zoom(provider) | lazy async |
| 3D Model | model | `.glb`, `.gltf`, `.obj`, `.stl`, `.ply`, `.fbx`, `.dae`, `.3ds`, `.3mf`, `.amf`, `.usd`, `.usda`, `.usdc`, `.usdz`, `.kmz`, `.step`, `.stp`, `.iges`, `.igs`, `.ifc`, `.3dm`, `.pcd`, `.wrl`, `.vrml`, `.xyz`, `.vtk`, `.vtp` | download, zoom(provider) | lazy async |
| Geospatial | geo | `.geojson`, `.kml`, `.gpx`, `.shp` | download, print, HTML export, zoom(provider), search | lazy async |
| Drawing | drawing | `.excalidraw`, `.drawio`, `.dio` | download, print, HTML export, zoom(provider), search | lazy async |
| EPUB | ebook | `.epub` | download, HTML export, search(provider) | lazy async |
| UMD | ebook | `.umd` | download, print, HTML export, zoom(provider), search | lazy async |
| Image | image | `.gif`, `.jpg`, `.jpeg`, `.bmp`, `.tiff`, `.tif`, `.png`, `.svg`, `.webp`, `.avif`, `.ico`, `.heic`, `.heif`, `.jxl` | download, print, HTML export, zoom(provider) | lazy async |
| Markdown | markdown | `.md`, `.markdown` | download, print, HTML export, search | lazy async |
| Code and Text | code | `.txt`, `.json`, `.js`, `.mjs`, `.cjs`, `.css`, `.java`, `.py`, `.html`, `.htm`, `.jsx`, `.ts`, `.tsx`, `.xml`, `.log`, `.vue`, `.yaml`, `.yml`, `.ini`, `.sh`, `.bash`, `.sql`, `.go`, `.rs`, `.php`, `.c`, `.cpp`, `.cc`, `.h`, `.hpp`, `.cs`, `.diff`, `.jsonc`, `.json5`, `.ipynb`, `.toml`, `.proto`, `.hcl`, `.tex`, `.gv`, `.http`, `.react`, `.rb`, `.swift`, `.kt` | download, print, HTML export, search | lazy async |
| Video | media | `.mp4`, `.webm`, `.m3u8` | download | lazy async |
| Audio | media | `.mp3`, `.mpeg`, `.wav`, `.ogg`, `.oga`, `.opus`, `.m4a`, `.aac`, `.flac`, `.weba`, `.midi`, `.mid` | download | lazy async |
| Data Asset | asset | `.ttf`, `.otf`, `.woff`, `.woff2`, `.psd`, `.ai`, `.eps`, `.sqlite`, `.wasm`, `.parquet`, `.avro`, `.webarchive` | download, HTML export, search | lazy async |

## Shared Options And Events

Every ecosystem package uses the same `ViewerMountOptions` and `FileViewerOptions` semantics, mapped to framework-native props, events, refs, actions, or plugin APIs.

| Option | Description |
| --- | --- |
| `url` | Remote file URL from object storage, business APIs, or intranet file services. |
| `file` | `File`, `Blob`, or `ArrayBuffer` for uploads, local selection, or already-fetched binary data. |
| `buffer` | Direct `ArrayBuffer` input after custom download, authorization, or decryption. |
| `name` / `filename` | Display name and extension hint. Pass it explicitly when the URL has no useful extension. |
| `type` | Explicit extension or MIME hint that overrides automatic detection. |
| `size` | File size hint used in lifecycle context, loading states, and safety limits. |
| `options` | The shared `FileViewerOptions` surface. Every component package keeps the same semantics. |
| `onEvent` / `onStateChange` | Unified event and state subscriptions for imperative wrappers such as Pure Web, React, and Svelte. Vue maps the same events to native emits. |

## Actual Component Props

The table below lists the real props, event channel, and customization entry for every standard package. If you need imperative mount fields such as `buffer`, `name`, `type`, or `size`, prefer React, Pure Web, Svelte, jQuery, or Vue 2. The Vue 3 declarative component intentionally keeps the compact `url` / `file` / `options` entry; wrap raw binary input as a named `File` when extension detection matters.

| Component | Actual props / entry | Event channel | Customization entry |
| --- | --- | --- | --- |
| Vue 3 `@file-viewer/vue3` | `url`, `file`, `options` | `load-start`, `load-complete`, `unload-start`, `unload-complete`, `operation-before`, `operation-cancel`, `operation-availability-change`, `search-change`, `location-change`, `zoom-change` | Template refs expose `FileViewerExpose`. For `Blob` / `ArrayBuffer`, prefer wrapping it as a named `File` so extension detection stays deterministic. |
| Vue 2.7 `@file-viewer/vue2.7` | `url`, `file`, `buffer`, `name`, `filename`, `type`, `size`, `options`, `containerClass`, `containerStyle` | `viewer-event` / `viewerEvent` | The component instance exposes the full controller handle. This is the Vue 2.7 line behind the historical `@flyfish-group/file-viewer` package. |
| Vue 2.6 `@file-viewer/vue2.6` | Same as Vue 2.7 | `viewer-event` / `viewerEvent` | Separate Vue 2.6 build for long-lived applications that cannot move to Vue 2.7. |
| React `@file-viewer/react` | `ViewerMountOptions` plus native `div` props such as `className`, `style`, `data-*`, and `aria-*` | `onEvent`, `onStateChange` | `ref` exposes `FileViewerHandle`; `useFileViewer()` returns `ref`, `props`, `state`, and `handle` for custom toolbars. |
| React Legacy `@file-viewer/react-legacy` | Same as the React package | `onEvent`, `onStateChange` | Targets React 16.8 / 17 with a legacy-friendly component export. |
| Pure Web `@file-viewer/web` | `mountViewer(container, ViewerMountOptions, ViewerCoreOptions?)` | `onEvent`, `onStateChange`, `controller.subscribe()` | Returns `ViewerController`; also ships ESM, script-tag IIFE, and the `file-viewer-copy-assets` CLI. |
| jQuery `@file-viewer/jquery` | `$(el).fileViewer(ViewerMountOptions & { replace?: boolean })` | `onEvent`, `onStateChange`, or `getFileViewerController(el).subscribe()` | Plugin methods include `zoomIn`, `printRenderedHtml`, and `searchDocument`; `replace:false` updates the same node in place. |
| Svelte `@file-viewer/svelte` | `ViewerMountOptions` plus `className` and `containerStyle` | `on:viewerEvent`, `onEvent`, `onStateChange` | `bind:this` exposes the controller handle; the `use:fileViewer` action is also available and adds `replace`. |

| Options Field | Description |
| --- | --- |
| `theme` | `light`, `dark`, or `system`. This takes precedence over browser `prefers-color-scheme`. |
| `watermark` | Text or image watermark with opacity, rotation, gap, size, font, and color controls. |
| `toolbar` | Controls download, print, HTML export, zoom, toolbar position, and operation-level preflight checks. |
| `search` | Document search, highlight class names, case sensitivity, whole-word matching, max matches, and debounce. |
| `ai` | Text collection, chunk size, and max text length for provenance, location, vectorization, and external AI workflows. |
| `archive` | Archive Worker/WASM URLs, timeout, cache, archive limits, and nested entry preview limits. |
| `pdf` | PDF.js worker, navigation pane, outline, thumbnails, rotation, streaming, range chunk size, and credentials. |
| `docx` / `spreadsheet` | DOCX uses the self-maintained @file-viewer/docx engine with Worker parsing, continuous flow reading, and async rendering by default; visual pagination is opt-in. Spreadsheet keeps fidelity-first main-thread parsing with Worker opt-in. |
| `typst` / `data` / `cad` | Typst, SQLite, CAD/DWG/DXF/DWF WASM, worker, encoding, and rendering strategy options. |
| `hooks` / `beforeOperation` | Shared lifecycle hooks and operation preflight checks for audit, permission, telemetry, and safety controls. |

## Toolbar Customization

| Config | Description |
| --- | --- |
| `toolbar: false` | Hides the built-in toolbar without disabling controller APIs such as download, print, export, and zoom. Use this for a fully custom business toolbar. |
| `toolbar: true` | Uses the default built-in toolbar. Download, print, HTML export, and zoom buttons are still shown only when the active renderer supports them. |
| `download` / `print` / `exportHtml` / `zoom` | Expresses whether the host allows a button. Final availability is still computed from file type, render readiness, export adapter, and zoom provider state. |
| `position` | `auto`, `top`, or `bottom-right`. The default `auto` floats PDF actions at bottom right to avoid conflicting with the PDF page / outline toolbar. |
| `beforeOperation` | Toolbar-level preflight that runs after `options.beforeOperation`. Returning `false` or throwing cancels the operation. |
| `beforeDownload` / `beforePrint` / `beforeExportHtml` | Operation-specific preflight for download permission, print audit, export confirmation, and similar business rules. |

For fully custom toolbars, hide the built-in toolbar and call the standard ref / controller APIs from your own UI. Do not implement zoom with an outer CSS `transform: scale()`; PDF, Excel, CAD, canvas-based, and text-layer renderers should use their internal zoom providers to keep coordinates correct.

| Ecosystem | Recommended pattern |
| --- | --- |
| Vue 3 | Pass `:options="{ toolbar: false }"`, call `downloadOriginalFile()`, `printRenderedHtml()`, `exportRenderedHtml()`, `zoomIn()`, `zoomOut()`, and `resetZoom()` through the template ref, and sync buttons with `@operation-availability-change` plus `@zoom-change`. |
| Vue 2.7 / 2.6 | Use `toolbar:false`, call instance methods through `$refs.viewer`, and listen to `@viewer-event` for `operation-availability-change` or `zoom-change`. |
| React / React Legacy | Prefer `useFileViewer({ options:{ toolbar:false } })`; pass `viewer.props` to the component, bind custom buttons to `viewer.handle`, and read `viewer.state.availability` / `viewer.state.zoom`. |
| Pure Web | Use `mountViewer(container, { options:{ toolbar:false }, onStateChange })`; custom DOM buttons call controller methods, and `controller.subscribe()` covers more advanced state sync. |
| jQuery | Use `$("#viewer").fileViewer({ options:{ toolbar:false } })`; buttons can call `$("#viewer").fileViewer("zoomIn")` or read capability state through `getFileViewerController($("#viewer")).subscribe()`. |
| Svelte | Use `<FileViewer bind:this={viewer} options={{ toolbar:false }} />`; buttons call `viewer.zoomIn()` / `viewer.printRenderedHtml()`, with `on:viewerEvent` or `onStateChange` for state sync. |

## Lifecycle And Operation Events

| Event / hook | Description |
| --- | --- |
| `load-start` / `hooks.onLoadStart` | Fires when parsing or downloading starts. Context includes filename, type, source, version, URL, File, and size. |
| `load-complete` / `hooks.onLoadComplete` | Fires when the current document has rendered. Context includes duration, source data, and version. |
| `unload-start` / `hooks.onUnloadStart` | Fires before replace, reset, or component unmount so external state or resources can be saved. |
| `unload-complete` / `hooks.onUnloadComplete` | Fires after the previous document is released. The reason is `replace`, `reset`, or `component-unmount`. |
| `operation-before` / `operation-cancel` | Fires around download, print, HTML export, and zoom actions. Returning `false` from `beforeOperation` cancels the action. |
| `operation-availability-change` | Fires when download, print, HTML export, or zoom support changes for the active format. |
| `search-change` / `location-change` / `zoom-change` | Fires when search matches, document anchors, or zoom state changes so host UIs can stay in sync. |

## Public Operation API

| API | Description |
| --- | --- |
| `load` / `update` / `reload` / `destroy` | Imperatively load, update, reload, and destroy the viewer. |
| `downloadOriginalFile()` | Downloads the original file while respecting toolbar and `beforeOperation` checks. |
| `printRenderedHtml()` | Prints the complete rendered document using the best available per-format print adapter. |
| `exportRenderedHtml()` | Exports rendered HTML for archiving, audit, or offline review. |
| `zoomIn()` / `zoomOut()` / `resetZoom()` | Uses the active renderer zoom provider instead of outer CSS transforms that can break coordinates. |
| `searchDocument()` / `nextSearchResult()` / `previousSearchResult()` | Runs document-level search and navigates highlighted matches. |
| `collectDocumentAnchors()` / `scrollToAnchor()` / `scrollToLine()` | Collects pages, outline items, headings, or code-line anchors and scrolls to them. |
| `getDocumentTextChunks()` | Returns structured text chunks for search, AI provenance, vectorization, and external indexes. |
| `getOperationAvailability()` / `getZoomState()` / `getSearchState()` | Reads current capability, zoom, and search state for custom toolbars. |

## Workers, WASM, And Private Deployment

| Asset | Description |
| --- | --- |
| Shared viewer assets | The Pure Web package ships `file-viewer-copy-assets` to copy workers, WASM, vendor files, and examples into your static directory. |
| CAD / DWG / DXF / DWF | Configure `options.cad.wasmPath`, `workerUrl`, `dwfWasmUrl`, and `dxfEncoding` for self-hosted or intranet deployment. |
| PDF / DOCX / Excel | Configure `options.pdf.workerUrl`, `options.pdf.cMapUrl`, `options.pdf.wasmUrl`, `options.pdf.standardFontDataUrl`, `options.docx.workerUrl`, `options.docx.workerJsZipUrl`, and `options.spreadsheet.workerUrl`; DOCX Worker parsing is enabled by default while Excel Worker remains explicit opt-in. |
| Typst / SQLite / Archive | Configure Typst compiler/renderer WASM, `data.sqlWasmUrl`, and `archive.workerUrl` / `archive.wasmUrl` as needed; Typst renders through local WASM only and never falls back to a public CDN. |
| Drawing | Draw.io uses the official diagrams.net offline viewer shipped with viewer assets by default; override `options.drawing.viewerScriptUrl` for custom paths, or set `preferOfficial:false` for the built-in SVG fallback. |
| Offline deployment | Runtime preview code does not depend on public CDN or third-party online assets; `file-viewer-copy-assets` copies PDF, CAD, Typst, SQLite, archive, Draw.io, DOCX worker/JSZip, and Office worker/vendor assets. |
| Deployment principle | Heavy workers, WASM files, and parser libraries stay lazy-loaded and are only requested when the active file type needs them. |

## Quality Gates

- Component packages only depend on `@file-viewer/core` and their own ecosystem dependencies. They do not nest through another framework component package.
- Format parsing, search, zoom, print, export, watermark, lifecycle, and beforeOperation semantics all come from the same core.
- Releases should pass type checks, component API verification, README generation checks, format-matrix verification, standalone repository export, and browser smoke tests.

See the official documentation for options, lifecycle hooks, beforeOperation, theme, watermark, search, zoom, print, and export APIs: https://doc.file-viewer.app/

Online demo: https://demo.file-viewer.app/. License: Apache-2.0. For second development or commercial use, keep clear Flyfish Viewer attribution; shared compatibility fixes are welcome in the matching component repository.
<!-- FILE_VIEWER_GENERATED:END -->
