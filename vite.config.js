import { fileURLToPath, URL } from 'node:url';
const path = require('path');

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,png,jpg,ico,ttf,woff,woff2}', 'index.html'],
        navigateFallback: '/index.html',
        navigateFallbackAllowlist: [/^\/plan/, /^\/print/],
        navigateFallbackDenylist: [/data/, /assets/],
        runtimeCaching: [
          {
            urlPattern: /data/,
            handler: 'NetworkFirst',
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
        id: 'https://zsm-timetable.pages.dev/',
        name: 'ZSM Plan Lekcji',
        short_name: 'ZSM Plan Lekcji',
        description: 'Aplikacja do przeglądu planu lekcji w Zespole Szkół Mechanicznych w Rzeszowie',
        theme_color: '#ffffff',
        lang: 'pl-PL',
        dir: 'ltr',
        orientation: 'portrait',
        icons: [
          {
            src: '/assets/images/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/assets/images/android-chrome-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/assets/images/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/assets/images/safari-pinned-tab.svg',
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
