import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import autoprefixer from 'autoprefixer'
import banner from 'vite-plugin-banner'

import path from 'path'

// Vite Configs
import server from './configs/vite.server'
// Auto Imports
import { components, imports } from './configs/vite.components'
// Vite Transform plugins
import {
  getNow,
  getBanner,
  generateBrowserConfigXML,
  generateHTACCESS,
  getCloudflareBeacon
} from './configs/vite.plugins'
// PWA Config
import { VitePWA } from 'vite-plugin-pwa'
import pwaConfig from './configs/vite.pwa'
// Sentry setup
import { sentryVitePlugin } from '@sentry/vite-plugin'

const now = getNow()

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v3.1.2'),
    __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_DSN_URL ?? ''),
    __VUE_PROD_DEVTOOLS__: true
  },
  server,
  preview: {
    port: 5173
  },
  plugins: [
    vue(),
    Components(components),
    AutoImport(imports),
    getCloudflareBeacon(),
    generateBrowserConfigXML(),
    generateHTACCESS(),
    VitePWA(pwaConfig),
    banner((fileName) => getBanner(now, fileName)),
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'tata2676',
      project: 'zsm-timetable'
    })
  ],
  build: {
    minify: 'terser',
    assetsInlineLimit: 10240,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          '@vueuse': ['@vueuse/core', '@vueuse/router'],
          axios: ['axios'],
          'chroma-js': ['chroma-js'],
          'string-to-color': ['string-to-color'],
          vue: ['vue'],
          'vue-router': ['vue-router'],
          'floating-vue': ['floating-vue'],
          sentry: ['@sentry/vue', '@sentry/vite-plugin']
        }
      }
    },
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@import "@/assets/media";@import "@/assets/variables";'
      }
    },
    postcss: {
      plugins: [autoprefixer({})]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
