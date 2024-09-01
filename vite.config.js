import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import webfontDownload from 'vite-plugin-webfont-dl'
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
import { getNow, getBanner, generateBrowserConfigXML, generateHTACCESS, getCloudflareBeacon } from './configs/vite.plugins'
// PWA Config
import { VitePWA } from 'vite-plugin-pwa'
import pwaConfig from './configs/vite.pwa'
// Sentry setup
import { sentryVitePlugin } from '@sentry/vite-plugin'

const now = getNow()

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify('v3.2.1'),
    __SENTRY_DSN__: JSON.stringify(process.env.SENTRY_DSN_URL ?? ''),
    __VUE_PROD_DEVTOOLS__: true
  },
  server,
  preview: {
    port: 5173
  },
  plugins: [
    vue(),
    webfontDownload(
      [
        'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto:wght@400;700&display=swap&text=0123456789aAbBcCdDeEfFgGhHiIjJkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ%C4%85%C4%84%C4%87%C4%86%C4%99%C4%98%C5%82%C5%81%C5%84%C5%83%C3%B3%C3%93%C5%9B%C5%9A%C5%BA%C5%B9%C5%BC%C5%B9%21%40%23%24%25%5E%26*%28%29_%2B-%3D%5B%5D%7B%7D%7C%3B%3A%2C.%3C%3E%3F%2F%5C%27%22%7E%60'
      ],
      {
        injectAsStyleTag: true,
        embedFonts: false,
        fontsSubfolder: 'fonts'
      }
    ),
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
    terserOptions: {
      compress: {
        drop_debugger: false
      }
    },
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
          'vue-toastification': ['vue-toastification'],
          sentry: ['@sentry/vue', '@sentry/vite-plugin']
        }
      }
    },
    sourcemap: true
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/media";@import "@/assets/variables";'
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
