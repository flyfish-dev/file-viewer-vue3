# @file-viewer/vue3

标准 Vue3 native 组件包。它维护 Vue3 组件生命周期和本地 controller，同时消费共享的 `@file-viewer/core` 底层契约与 core browser engine，提供插件安装、组件 props、生命周期事件、搜索/缩放/打印/导出等 ref API。

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

组件实例支持 `downloadOriginalFile()`、`printRenderedHtml()`、`exportRenderedHtml()`、`zoomIn()`、`zoomOut()`、`resetZoom()`、`searchDocument()`、`clearDocumentSearch()`、`nextSearchResult()`、`previousSearchResult()`、`collectDocumentAnchors()`、`scrollToAnchor()`、`scrollToLine()` 和 `getDocumentTextChunks()`。历史包名 `@flyfish-group/file-viewer3` 和 `file-viewer3` 会继续同步维护，用于兼容旧项目；新项目建议优先使用标准组件包 `@file-viewer/vue3`。

## 能力范围

`@file-viewer/vue3` 与纯 Web、Vue2、React、jQuery 和 Svelte standard component package 共享同一套 `@file-viewer/core` 能力，覆盖 PDF、Word、Excel、PPT、OFD、CAD/DWG/DXF/DWF、EPUB/UMD、压缩包、邮件、Markdown、代码高亮、图片、音频、视频、3D 模型、地理数据和结构化数据资产等预览链路。完整格式矩阵和参数说明见官方文档: https://doc.flyfish.dev/guide/formats

English README: [README.en.md](./README.en.md)。

<!-- FILE_VIEWER_GENERATED:START -->
## 生态包矩阵

所有标准组件包都只共享 `@file-viewer/core` 这个总底座，不依赖其他框架组件实现。core 内部负责格式矩阵、资源解析、browser/renderers、事件、操作 API、搜索、缩放、打印和导出；各框架组件包自己维护本地 controller、组件生命周期、类型出口和生态交互。

| 框架 | 标准 npm 包 | 入口格式 | GitHub | Gitee | 兼容历史包 |
| --- | --- | --- | --- | --- | --- |
| Vue 3 | `@file-viewer/vue3` | ESM, 类型声明 | [file-viewer-vue3](https://github.com/flyfish-dev/file-viewer-vue3) | [file-viewer-vue3](https://gitee.com/flyfish-dev/file-viewer-vue3) | `@flyfish-group/file-viewer3`, `file-viewer3` |
| Vue 2.7 | `@file-viewer/vue2.7` | ESM, 类型声明 | [file-viewer-vue2.7](https://github.com/flyfish-dev/file-viewer-vue2.7) | [file-viewer-vue2.7](https://gitee.com/flyfish-dev/file-viewer-vue2.7) | `@flyfish-group/file-viewer` |
| Vue 2.6 | `@file-viewer/vue2.6` | ESM, 类型声明 | [file-viewer-vue2.6](https://github.com/flyfish-dev/file-viewer-vue2.6) | [file-viewer-vue2.6](https://gitee.com/flyfish-dev/file-viewer-vue2.6) | 无 |
| React 18/19 | `@file-viewer/react` | ESM, 类型声明 | [file-viewer-react](https://github.com/flyfish-dev/file-viewer-react) | [file-viewer-react](https://gitee.com/flyfish-dev/file-viewer-react) | `@flyfish-group/file-viewer-react` |
| React 16.8/17 | `@file-viewer/react-legacy` | ESM, 类型声明 | [file-viewer-react-legacy](https://github.com/flyfish-dev/file-viewer-react-legacy) | [file-viewer-react-legacy](https://gitee.com/flyfish-dev/file-viewer-react-legacy) | 无 |
| Pure Web | `@file-viewer/web` | ESM, 类型声明, script 标签 IIFE, Worker/WASM viewer 资源, 复制静态资源 CLI | [file-viewer-web](https://github.com/flyfish-dev/file-viewer-web) | [file-viewer-web](https://gitee.com/flyfish-dev/file-viewer-web) | `@flyfish-group/file-viewer-web` |
| jQuery | `@file-viewer/jquery` | ESM, 类型声明 | [file-viewer-jquery](https://github.com/flyfish-dev/file-viewer-jquery) | [file-viewer-jquery](https://gitee.com/flyfish-dev/file-viewer-jquery) | 无 |
| Svelte | `@file-viewer/svelte` | Svelte 组件, ESM, 类型声明 | [file-viewer-svelte](https://github.com/flyfish-dev/file-viewer-svelte) | [file-viewer-svelte](https://gitee.com/flyfish-dev/file-viewer-svelte) | 无 |

## 格式支持矩阵

共享 core 当前覆盖 23 条预览链路、194 个扩展名。所有格式都按需异步加载，组件层只做生态适配，不互相嵌套。

| 预览链路 | 分类 | 扩展名 | 能力 | 加载 |
| --- | --- | --- | --- | --- |
| Word OpenXML | office | `.docx`, `.docm`, `.dotx`, `.dotm` | 下载, 打印(适配器), HTML(适配器), 缩放(Provider), 搜索 | 按需异步 |
| Word Binary | office | `.doc`, `.dot` | 下载, 打印(适配器), HTML(适配器), 缩放(Provider), 搜索 | 按需异步 |
| PowerPoint | office | `.pptx`, `.pptm`, `.potx`, `.potm`, `.ppsx`, `.ppsm` | 下载, 打印, HTML, 缩放(Provider), 搜索 | 按需异步 |
| Open Document | office | `.rtf`, `.odt`, `.odp` | 下载, 打印, HTML, 缩放(Provider), 搜索 | 按需异步 |
| Spreadsheet | office | `.xlsx`, `.xltx`, `.xlsm`, `.xlsb`, `.xls`, `.xlt`, `.xltm`, `.csv`, `.ods`, `.fods`, `.numbers` | 下载, 缩放(Provider), 搜索 | 按需异步 |
| PDF | document | `.pdf` | 下载, 打印(适配器), HTML(适配器), 缩放(Provider), 搜索(Provider) | 按需异步 |
| OFD | document | `.ofd` | 下载, 打印, HTML, 缩放(Provider), 搜索 | 按需异步 |
| Typst | document | `.typ`, `.typst` | 下载, 打印(适配器), HTML(适配器), 缩放(Provider), 搜索 | 按需异步 |
| Archive | archive | `.zip`, `.zipx`, `.7z`, `.rar`, `.tar`, `.gz`, `.gzip`, `.tgz`, `.bz2`, `.bzip2`, `.tbz`, `.tbz2`, `.xz`, `.txz`, `.lzma`, `.zst`, `.tzst`, `.cab`, `.ar`, `.cpio`, `.iso`, `.xar`, `.lha`, `.lzh`, `.jar`, `.war`, `.ear`, `.apk`, `.cbz`, `.cbr` | 下载, 搜索 | 按需异步 |
| Email | email | `.eml`, `.msg`, `.mbox` | 下载, HTML, 搜索 | 按需异步 |
| EDA | eda | `.olb`, `.dra` | 下载, 打印, HTML, 搜索 | 按需异步 |
| CAD | cad | `.dxf`, `.dwg`, `.dwf`, `.dwfx`, `.xps` | 下载, 打印, HTML, 缩放(Provider) | 按需异步 |
| 3D Model | model | `.glb`, `.gltf`, `.obj`, `.stl`, `.ply`, `.fbx`, `.dae`, `.3ds`, `.3mf`, `.amf`, `.usd`, `.usda`, `.usdc`, `.usdz`, `.kmz`, `.step`, `.stp`, `.iges`, `.igs`, `.ifc`, `.3dm`, `.pcd`, `.wrl`, `.vrml`, `.xyz`, `.vtk`, `.vtp` | 下载, 缩放(Provider) | 按需异步 |
| Geospatial | geo | `.geojson`, `.kml`, `.gpx`, `.shp` | 下载, 打印, HTML, 缩放(Provider), 搜索 | 按需异步 |
| Drawing | drawing | `.excalidraw`, `.drawio`, `.dio` | 下载, 打印, HTML, 缩放(Provider), 搜索 | 按需异步 |
| EPUB | ebook | `.epub` | 下载, HTML, 搜索(Provider) | 按需异步 |
| UMD | ebook | `.umd` | 下载, 打印, HTML, 缩放(Provider), 搜索 | 按需异步 |
| Image | image | `.gif`, `.jpg`, `.jpeg`, `.bmp`, `.tiff`, `.tif`, `.png`, `.svg`, `.webp`, `.avif`, `.ico`, `.heic`, `.heif`, `.jxl` | 下载, 打印, HTML, 缩放(Provider) | 按需异步 |
| Markdown | markdown | `.md`, `.markdown` | 下载, 打印, HTML, 搜索 | 按需异步 |
| Code and Text | code | `.txt`, `.json`, `.js`, `.mjs`, `.cjs`, `.css`, `.java`, `.py`, `.html`, `.htm`, `.jsx`, `.ts`, `.tsx`, `.xml`, `.log`, `.vue`, `.yaml`, `.yml`, `.ini`, `.sh`, `.bash`, `.sql`, `.go`, `.rs`, `.php`, `.c`, `.cpp`, `.cc`, `.h`, `.hpp`, `.cs`, `.diff`, `.jsonc`, `.json5`, `.ipynb`, `.toml`, `.proto`, `.hcl`, `.tex`, `.gv`, `.http`, `.react`, `.rb`, `.swift`, `.kt` | 下载, 打印, HTML, 搜索 | 按需异步 |
| Video | media | `.mp4`, `.webm`, `.m3u8` | 下载 | 按需异步 |
| Audio | media | `.mp3`, `.mpeg`, `.wav`, `.ogg`, `.oga`, `.opus`, `.m4a`, `.aac`, `.flac`, `.weba`, `.midi`, `.mid` | 下载 | 按需异步 |
| Data Asset | asset | `.ttf`, `.otf`, `.woff`, `.woff2`, `.psd`, `.ai`, `.eps`, `.sqlite`, `.wasm`, `.parquet`, `.avro`, `.webarchive` | 下载, HTML, 搜索 | 按需异步 |

完整参数、生命周期 hooks、beforeOperation、主题、水印、搜索、缩放、打印和导出说明见官方文档: https://doc.flyfish.dev/

在线 Demo: https://viewer.flyfish.dev/ 。License: Apache-2.0。二开或商用请保留 Flyfish Viewer 来源说明；如果修复了通用兼容问题，也欢迎贡献回对应组件仓库。
<!-- FILE_VIEWER_GENERATED:END -->
