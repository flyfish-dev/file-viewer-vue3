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

## 统一参数与事件

所有生态组件都围绕同一套 `ViewerMountOptions` 与 `FileViewerOptions` 工作，只是映射到各自框架的 props、事件、ref、action 或插件 API。

| 参数 | 说明 |
| --- | --- |
| `url` | 远程文件地址，适合 CDN、对象存储和业务接口返回的文件链接。 |
| `file` | `File`、`Blob` 或 `ArrayBuffer`，适合上传、本地选择和业务接口已取回的二进制。 |
| `buffer` | 直接传入 `ArrayBuffer`，适合解密、鉴权或自定义下载后再预览。 |
| `name` / `filename` | 显示文件名并辅助推断扩展名；当 URL 不含扩展名时建议显式传入。 |
| `type` | 显式指定扩展名或 MIME 线索，覆盖自动识别结果。 |
| `size` | 文件大小提示，用于生命周期上下文、加载状态和安全限制展示。 |
| `options` | 完整 `FileViewerOptions`，所有框架包保持同一套参数语义。 |
| `onEvent` / `onStateChange` | Pure Web、React、Svelte 等命令式包装层的统一事件和状态订阅；Vue 组件会映射为原生 emit。 |

| Options 字段 | 说明 |
| --- | --- |
| `theme` | `light`、`dark` 或 `system`，优先级高于浏览器 `prefers-color-scheme`。 |
| `watermark` | 开启文字或图片水印，可设置透明度、旋转、间距、尺寸、字体和颜色。 |
| `toolbar` | 控制下载、打印、HTML 导出、缩放和工具栏位置，并支持操作级前置校验。 |
| `search` | 配置文档搜索、高亮 class、大小写、整词匹配、最大命中数和 debounce。 |
| `ai` | 控制文本结构采集、分块大小和最大文本长度，为溯源、定位、向量化和外部 AI 流程提供基础。 |
| `archive` | 配置压缩包 Worker/WASM、超时、缓存、包体限制和压缩包内单文件预览大小。 |
| `pdf` | 配置 PDF.js Worker、导航栏、目录、旋转、流式读取、Range chunk 和凭据。 |
| `docx` / `spreadsheet` | 配置 Office Worker、渐进渲染和表格 Worker，保持大文件预览体验。 |
| `typst` / `data` / `cad` | 配置 Typst、SQLite、CAD/DWG/DXF/DWF 等 WASM、Worker、编码和渲染策略。 |
| `hooks` / `beforeOperation` | 统一生命周期 hooks 和操作前置校验，可用于审计、权限、埋点和安全控制。 |

## 生命周期与操作事件

| 事件 / hook | 说明 |
| --- | --- |
| `load-start` / `hooks.onLoadStart` | 开始解析或下载文档时触发，包含文件名、类型、来源、版本、URL、File 和 size。 |
| `load-complete` / `hooks.onLoadComplete` | 当前文档完成渲染时触发，包含耗时、来源上下文和版本号。 |
| `unload-start` / `hooks.onUnloadStart` | 替换、重置或组件卸载前触发，可用于保存状态或释放外部资源。 |
| `unload-complete` / `hooks.onUnloadComplete` | 旧文档释放完成后触发，reason 会标识 `replace`、`reset` 或 `component-unmount`。 |
| `operation-before` / `operation-cancel` | 下载、打印、HTML 导出和缩放前后触发；`beforeOperation` 返回 `false` 可取消操作。 |
| `operation-availability-change` | 当前格式是否可下载、可打印、可导出 HTML、可缩放发生变化时触发。 |
| `search-change` / `location-change` / `zoom-change` | 搜索命中、定位锚点和缩放状态变化时触发，用于外层同步 UI。 |

## 公共操作 API

| API | 说明 |
| --- | --- |
| `load` / `update` / `reload` / `destroy` | 命令式控制文档加载、参数更新、重新加载和销毁。 |
| `downloadOriginalFile()` | 下载原始文件，遵循 toolbar 与 `beforeOperation` 权限校验。 |
| `printRenderedHtml()` | 打印当前完整渲染内容，优先使用各格式的高保真打印适配器。 |
| `exportRenderedHtml()` | 导出当前渲染后的 HTML，用于归档、审计和离线查看。 |
| `zoomIn()` / `zoomOut()` / `resetZoom()` | 调用当前格式自己的缩放 provider，避免外层 CSS 缩放导致坐标偏移。 |
| `searchDocument()` / `nextSearchResult()` / `previousSearchResult()` | 打开文档级搜索并在命中之间导航，保持高亮状态。 |
| `collectDocumentAnchors()` / `scrollToAnchor()` / `scrollToLine()` | 采集页面、目录、标题或代码行锚点，并执行定位跳转。 |
| `getDocumentTextChunks()` | 获取结构化文本块，便于搜索、AI 溯源、向量化和外部索引。 |
| `getOperationAvailability()` / `getZoomState()` / `getSearchState()` | 读取当前能力、缩放和搜索状态，便于自定义工具栏。 |

## Worker、WASM 与私有化部署

| 资源 | 说明 |
| --- | --- |
| 通用 viewer assets | Pure Web 包提供 `file-viewer-copy-assets`，可把 Worker、WASM、vendor 和示例资源复制到业务静态目录。 |
| CAD / DWG / DXF / DWF | 按需配置 `options.cad.wasmPath`、`workerUrl`、`dwfWasmUrl`、`dxfEncoding`，支持自托管和内网部署。 |
| PDF / DOCX / Excel | 按需配置 `options.pdf.workerUrl`、`options.docx.workerUrl`、`options.spreadsheet.workerUrl`，大文件可走 Worker 与渐进渲染。 |
| Typst / SQLite / Archive | 按需配置 Typst compiler/renderer WASM、`data.sqlWasmUrl`、`archive.workerUrl` / `archive.wasmUrl`。 |
| 部署原则 | 默认只在命中特定格式时异步加载对应依赖；没有命中的格式不会拉取重型 Worker、WASM 或解析库。 |

## 质量门禁

- 组件包只依赖 `@file-viewer/core` 和自身生态依赖，不嵌套引用其他框架组件包。
- 格式解析、搜索、缩放、打印、导出、水印、生命周期和 beforeOperation 语义全部来自同一个 core。
- 发布前需通过类型检查、组件 API 校验、README 生成校验、格式矩阵校验、独立仓库导出和浏览器 smoke。

完整参数、生命周期 hooks、beforeOperation、主题、水印、搜索、缩放、打印和导出说明见官方文档: https://doc.flyfish.dev/

在线 Demo: https://viewer.flyfish.dev/ 。License: Apache-2.0。二开或商用请保留 Flyfish Viewer 来源说明；如果修复了通用兼容问题，也欢迎贡献回对应组件仓库。
<!-- FILE_VIEWER_GENERATED:END -->
