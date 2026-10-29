/// <reference types="vite/client" />

declare module '*.css'
declare module '*?raw' {
  const source: string
  export default source
}
declare module '*?url' {
  const url: string
  export default url
}
declare module '*?worker&inline' {
  const workerConstructor: {
    new (): Worker
  }
  export default workerConstructor
}
