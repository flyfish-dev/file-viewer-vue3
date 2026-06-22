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

`@file-viewer/vue3` 与纯 Web、Vue2、React、jQuery 和 Svelte standard component package 共享同一套 `@file-viewer/core` 能力，覆盖 PDF、Word、Excel、PPT、OFD、CAD/DWG/DXF/DWF、EPUB/UMD、压缩包、邮件、Markdown、代码高亮、图片、音频、视频、3D 模型、地理数据和结构化数据资产等预览链路。完整格式矩阵和参数说明见官方文档: https://doc.file-viewer.app/guide/formats

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
| `url` | 远程文件地址，适合对象存储、业务接口或内网文件服务返回的文件链接。 |
| `file` | `File`、`Blob` 或 `ArrayBuffer`，适合上传、本地选择和业务接口已取回的二进制。 |
| `buffer` | 直接传入 `ArrayBuffer`，适合解密、鉴权或自定义下载后再预览。 |
| `name` / `filename` | 显示文件名并辅助推断扩展名；当 URL 不含扩展名时建议显式传入。 |
| `type` | 显式指定扩展名或 MIME 线索，覆盖自动识别结果。 |
| `size` | 文件大小提示，用于生命周期上下文、加载状态和安全限制展示。 |
| `options` | 完整 `FileViewerOptions`，所有框架包保持同一套参数语义。 |
| `onEvent` / `onStateChange` | Pure Web、React、Svelte 等命令式包装层的统一事件和状态订阅；Vue 组件会映射为原生 emit。 |

## 实际组件属性

下面列的是每个标准组件包当前真实暴露的属性、事件和控制入口。需要 `buffer`、`name`、`type`、`size` 这类命令式挂载参数时，优先选择 React、Pure Web、Svelte、jQuery 或 Vue2 组件；Vue3 声明式组件保持 `url` / `file` / `options` 的简洁入口，复杂二进制来源请包装成带文件名的 `File`。

| 组件 | 实际属性 / 入口 | 事件入口 | 定制入口 |
| --- | --- | --- | --- |
| Vue 3 `@file-viewer/vue3` | `url`、`file`、`options` | `load-start`、`load-complete`、`unload-start`、`unload-complete`、`operation-before`、`operation-cancel`、`operation-availability-change`、`search-change`、`location-change`、`zoom-change` | 模板 `ref` 暴露 `FileViewerExpose`；适合声明式接入。`Blob` / `ArrayBuffer` 建议包装成带扩展名的 `File` 后传给 `file`。 |
| Vue 2.7 `@file-viewer/vue2.7` | `url`、`file`、`buffer`、`name`、`filename`、`type`、`size`、`options`、`containerClass`、`containerStyle` | `viewer-event` / `viewerEvent` | 组件实例暴露 controller handle 全量方法；适合 Vue 2.7 项目和历史 `@flyfish-group/file-viewer` 平滑升级。 |
| Vue 2.6 `@file-viewer/vue2.6` | 同 Vue 2.7 | `viewer-event` / `viewerEvent` | 独立 Vue 2.6 构建，不要求业务升级到 Vue 2.7。 |
| React `@file-viewer/react` | `ViewerMountOptions` + `div` 原生属性，如 `className`、`style`、`data-*`、`aria-*` | `onEvent`、`onStateChange` | `ref` 暴露 `FileViewerHandle`；`useFileViewer()` 会返回 `ref`、`props`、`state`、`handle`，便于自定义工具栏。 |
| React Legacy `@file-viewer/react-legacy` | 同 React 标准包 | `onEvent`、`onStateChange` | 面向 React 16.8 / 17；组件名和默认导出保持 legacy 生态友好。 |
| Pure Web `@file-viewer/web` | `mountViewer(container, ViewerMountOptions, ViewerCoreOptions?)` | `onEvent`、`onStateChange`、`controller.subscribe()` | 返回 `ViewerController`；同时提供 ESM、IIFE script 标签包和 `file-viewer-copy-assets`。 |
| jQuery `@file-viewer/jquery` | `$(el).fileViewer(ViewerMountOptions & { replace?: boolean })` | `onEvent`、`onStateChange` 或 `getFileViewerController(el).subscribe()` | 插件方法支持 `zoomIn`、`printRenderedHtml`、`searchDocument` 等；`replace:false` 可在同一节点上原地更新。 |
| Svelte `@file-viewer/svelte` | `ViewerMountOptions` + `className`、`containerStyle` | `on:viewerEvent`、`onEvent`、`onStateChange` | `bind:this` 暴露 controller handle；也提供 `use:fileViewer` action，action 额外支持 `replace`。 |

| Options 字段 | 说明 |
| --- | --- |
| `theme` | `light`、`dark` 或 `system`，优先级高于浏览器 `prefers-color-scheme`。 |
| `watermark` | 开启文字或图片水印，可设置透明度、旋转、间距、尺寸、字体和颜色。 |
| `toolbar` | 控制下载、打印、HTML 导出、缩放和工具栏位置，并支持操作级前置校验。 |
| `search` | 配置文档搜索、高亮 class、大小写、整词匹配、最大命中数和 debounce。 |
| `ai` | 控制文本结构采集、分块大小和最大文本长度，为溯源、定位、向量化和外部 AI 流程提供基础。 |
| `archive` | 配置压缩包 Worker/WASM、超时、缓存、包体限制和压缩包内单文件预览大小。 |
| `pdf` | 配置 PDF.js Worker、导航栏、目录、缩略图、旋转、流式读取、Range chunk 和凭据。 |
| `docx` / `spreadsheet` | DOCX 使用自研 @file-viewer/docx，默认 Worker 解析、连续流式阅读和异步分批渲染，可按需显式开启视觉分页；表格默认保真主线程渲染，Worker 可按需显式开启。 |
| `typst` / `data` / `cad` | 配置 Typst、SQLite、CAD/DWG/DXF/DWF 等 WASM、Worker、编码和渲染策略。 |
| `hooks` / `beforeOperation` | 统一生命周期 hooks 和操作前置校验，可用于审计、权限、埋点和安全控制。 |

## 工具栏定制

| 配置 | 说明 |
| --- | --- |
| `toolbar: false` | 隐藏内置工具栏，但不关闭下载、打印、导出、缩放等 controller API，适合完全自定义业务工具栏。 |
| `toolbar: true` | 使用默认内置工具栏，下载、打印、HTML 导出和缩放按钮都会按能力动态显隐。 |
| `download` / `print` / `exportHtml` / `zoom` | 表达业务是否允许展示对应按钮；最终仍会结合文件类型、渲染完成状态、导出适配器和缩放 provider 计算真实可用性。 |
| `position` | `auto`、`top`、`bottom-right`。默认 `auto`，PDF 自动悬浮右下角，减少和 PDF 自身页码 / 目录工具栏冲突。 |
| `beforeOperation` | 工具栏层统一前置校验，会在 `options.beforeOperation` 后执行。返回 `false` 或抛错都会取消本次操作。 |
| `beforeDownload` / `beforePrint` / `beforeExportHtml` | 单按钮前置校验；适合下载权限、打印审计、导出水印确认等细粒度业务规则。 |

完全自定义工具栏时，推荐关闭内置工具栏并使用组件 ref / controller 暴露的标准 API。不要在预览器外层用 CSS `transform: scale()` 做缩放；PDF、Excel、CAD、canvas 和文本层格式都应通过内部缩放 provider 保持坐标正确。

| 生态 | 推荐方式 |
| --- | --- |
| Vue 3 | 传 `:options="{ toolbar: false }"` 隐藏内置工具栏，通过模板 `ref` 调用 `downloadOriginalFile()`、`printRenderedHtml()`、`exportRenderedHtml()`、`zoomIn()`、`zoomOut()`、`resetZoom()`；用 `@operation-availability-change` 和 `@zoom-change` 同步按钮显隐与比例。 |
| Vue 2.7 / 2.6 | 同样设置 `toolbar:false`，通过 `$refs.viewer` 调用实例方法；监听 `@viewer-event`，在 `event.type === "operation-availability-change"` 或 `event.type === "zoom-change"` 时更新外部工具栏。 |
| React / React Legacy | 推荐 `useFileViewer({ options:{ toolbar:false } })`，把 `viewer.props` 传给组件，把按钮绑定到 `viewer.handle`，并读取 `viewer.state.availability` / `viewer.state.zoom` 控制禁用状态。 |
| Pure Web | `const controller = mountViewer(container, { options:{ toolbar:false }, onStateChange })`；外部 DOM 按钮调用 controller 方法，复杂场景可用 `controller.subscribe()` 做状态同步。 |
| jQuery | `$("#viewer").fileViewer({ options:{ toolbar:false } })`；按钮调用 `$("#viewer").fileViewer("zoomIn")` 或通过 `getFileViewerController($("#viewer")).subscribe()` 获取能力状态。 |
| Svelte | `<FileViewer bind:this={viewer} options={{ toolbar:false }} />`；按钮直接调用 `viewer.zoomIn()`、`viewer.printRenderedHtml()`，并用 `on:viewerEvent` / `onStateChange` 同步状态。 |

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
| PDF / DOCX / Excel | 按需配置 `options.pdf.workerUrl`、`options.pdf.cMapUrl`、`options.pdf.wasmUrl`、`options.pdf.standardFontDataUrl`、`options.docx.workerUrl`、`options.docx.workerJsZipUrl`、`options.spreadsheet.workerUrl`；DOCX 默认启用自研 Worker 解析，Excel Worker 需显式开启。 |
| Typst / SQLite / Archive | 按需配置 Typst compiler/renderer WASM、`data.sqlWasmUrl`、`archive.workerUrl` / `archive.wasmUrl`；Typst 仅使用本地 WASM 真实渲染，不访问公共 CDN。 |
| Drawing | Draw.io 默认使用随 viewer assets 分发的官方 diagrams.net 离线 viewer；路径特殊时可通过 `options.drawing.viewerScriptUrl` 覆盖，`preferOfficial:false` 才切到内置 SVG 兜底。 |
| 离线部署 | 运行时不依赖公共 CDN 或第三方在线资源；`file-viewer-copy-assets` 会复制 PDF、CAD、Typst、SQLite、压缩包、Draw.io、DOCX worker/JSZip 和 Office worker/vendor 资产。 |
| 部署原则 | 默认只在命中特定格式时异步加载对应依赖；没有命中的格式不会拉取重型 Worker、WASM 或解析库。 |

## 质量门禁

- 组件包只依赖 `@file-viewer/core` 和自身生态依赖，不嵌套引用其他框架组件包。
- 格式解析、搜索、缩放、打印、导出、水印、生命周期和 beforeOperation 语义全部来自同一个 core。
- 发布前需通过类型检查、组件 API 校验、README 生成校验、格式矩阵校验、独立仓库导出和浏览器 smoke。

完整参数、生命周期 hooks、beforeOperation、主题、水印、搜索、缩放、打印和导出说明见官方文档: https://doc.file-viewer.app/

在线 Demo: https://demo.file-viewer.app/ 。License: Apache-2.0。二开或商用请保留 Flyfish Viewer 来源说明；如果修复了通用兼容问题，也欢迎贡献回对应组件仓库。
<!-- FILE_VIEWER_GENERATED:END -->
