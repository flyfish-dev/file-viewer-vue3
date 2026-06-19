import { fileURLToPath, URL } from 'node:url'

import type { UserConfigExport } from 'vite'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'

export default defineConfig(ctx => {
  const alias: Record<string, string> = {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    events: 'events',
    path: 'path-browserify',
    stream: 'stream-browserify',
    zlib: 'browserify-zlib'
  }

  if (ctx.mode !== 'lib') {
    alias['@file-viewer/core'] = fileURLToPath(new URL('../../core/src/index.ts', import.meta.url))
  }

  const config: UserConfigExport = {
    plugins: [vue(), vueJsx()],
    base: './',
    resolve: {
      alias
    }
  }

  if (ctx.mode === 'lib') {
    config.plugins?.push(dts({ rollupTypes: true }))
    config.build = {
      target: 'es2015',
      copyPublicDir: false,
      emptyOutDir: true,
      lib: {
        entry: fileURLToPath(new URL('src/package/index.ts', import.meta.url)),
        name: 'fileViewerVue3',
        formats: ['es'],
        fileName: format => format === 'es' ? 'index.mjs' : 'index.umd.js'
      },
      rollupOptions: {
        external: ['vue', '@file-viewer/core'],
        output: {
          chunkFileNames: 'components/[name].js'
        }
      }
    }
    config.worker = {
      rollupOptions: {
        output: {
          entryFileNames: 'worker/[name].js'
        }
      }
    }
  }

  return config
})
