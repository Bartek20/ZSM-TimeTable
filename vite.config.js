import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { fileURLToPath, URL } from 'node:url';
const path = require('path');

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const root = process.env.ROOT_PATH || '/development/';

// https://vitejs.dev/config/
export default defineConfig({
  base: root,
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
    }),
    AutoImport({
      include: [/\.js$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        {
          'virtual:pwa-register': ['registerSW'],
          '@wulkanowy/timetable-parser': ['TimetableList', 'Table'],
          axios: [['default', 'axios']],
          'string-to-color': [['default', 'stc']],
          'chroma-js': [['default', 'chroma']],
          'pinia-plugin-persistedstate': [['default', 'piniaPluginPersistedstate']],
        },
      ],
      dirs: ['src/functions', 'src/stores'],
      vueTemplate: true,
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,png,jpg,ico,ttf,woff,woff2}', 'index.html'],
        navigateFallback: `${root}index.html`,
        navigateFallbackAllowlist: [/plan/, /print/],
        navigateFallbackDenylist: [/plan_nauczyciele/, /assets/],
        runtimeCaching: [
          {
            urlPattern: /plan_nauczyciele/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'timetables-data',
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
      manifest: {
        scope: root,
        id: `https://zsm-timetable.pages.dev${root}`,
        name: 'ZSM Plan Lekcji',
        short_name: 'ZSM Plan Lekcji',
        description: 'Aplikacja do przeglądu planu lekcji w Zespole Szkół Mechanicznych w Rzeszowie',
        theme_color: '#ffffff',
        lang: 'pl-PL',
        dir: 'ltr',
        orientation: 'portrait',
        icons: [
          {
            src: `${root}assets/images/android-chrome-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${root}assets/images/android-chrome-256x256.png`,
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: `${root}assets/images/android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: `${root}assets/images/safari-pinned-tab.svg`,
            type: 'image/svg',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
    },
  },
});
