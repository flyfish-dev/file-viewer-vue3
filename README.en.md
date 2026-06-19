# @file-viewer/vue3

The standard Vue 3 native wrapper for Flyfish File Viewer. It owns the Vue 3 component lifecycle and local controller while consuming the shared `@file-viewer/core` contracts and core browser engine. It exposes plugin install, component props, lifecycle events, search, zoom, print, export, and document-location ref APIs.

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

The component instance exposes `downloadOriginalFile()`, `printRenderedHtml()`, `exportRenderedHtml()`, `zoomIn()`, `zoomOut()`, `resetZoom()`, `searchDocument()`, `clearDocumentSearch()`, `nextSearchResult()`, `previousSearchResult()`, `collectDocumentAnchors()`, `scrollToAnchor()`, `scrollToLine()`, and `getDocumentTextChunks()`. The historical packages `@flyfish-group/file-viewer3` and `file-viewer3` remain supported for compatibility with existing projects; new integrations should prefer the standard wrapper package `@file-viewer/vue3`.

## Capabilities

`@file-viewer/vue3` shares the same `@file-viewer/core` contracts with the Pure Web, Vue 2, React, jQuery, and Svelte wrappers. It supports PDF, Word, Excel, PowerPoint, OFD, CAD/DWG/DXF/DWF, EPUB/UMD, archives, email, Markdown, highlighted code, images, audio, video, 3D models, geospatial files, and structured data assets. See the complete format matrix and option reference at https://doc.flyfish.dev/guide/formats

<!-- FILE_VIEWER_GENERATED:START -->
## Ecosystem Matrix

Every standard wrapper shares `@file-viewer/core` as the only common foundation, and no wrapper depends on another wrapper. Core owns format metadata, source loading, browser/renderers, events, operation APIs, search, zoom, print, and export; each framework wrapper owns its local controller, component lifecycle, type exports, and ecosystem-specific interaction layer.

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

The shared core currently covers 23 preview pipelines and 194 file extensions. Renderers stay lazy-loaded, and wrapper packages only adapt their own ecosystem without nesting through another wrapper.

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

See the official documentation for options, lifecycle hooks, beforeOperation, theme, watermark, search, zoom, print, and export APIs: https://doc.flyfish.dev/

Online demo: https://viewer.flyfish.dev/. License: Apache-2.0. For second development or commercial use, keep clear Flyfish Viewer attribution; shared compatibility fixes are welcome in the matching wrapper repository.
<!-- FILE_VIEWER_GENERATED:END -->
