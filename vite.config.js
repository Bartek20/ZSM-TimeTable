import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { sentryVitePlugin } from '@sentry/vite-plugin';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import autoprefixer from 'autoprefixer';
import banner from 'vite-plugin-banner';

import path from 'path';

// Vite Configs
import server from './configs/vite.server';
// Auto Imports
import { components, imports } from './configs/vite.components';
// Vite Transform plugins
import { getNow, getBanner, parseHTML, generateBrowserConfigXML, generateHTACCESS, getCloudflareBeacon } from './configs/vite.plugins';
// PWA Config
import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from './configs/vite.pwa';

const now = getNow();

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify('v2.0.0'),
		__VUE_PROD_DEVTOOLS__: true,
	},
	server,
	preview: {
		port: 5173,
	},
	plugins: [
		vue(),
		Components(components),
		AutoImport(imports),
		getCloudflareBeacon(process.env.CF_BEACON_TOKEN),
		parseHTML(),
		generateBrowserConfigXML(),
		generateHTACCESS(),
		VitePWA(pwaConfig),
		banner((fileName) => getBanner(now, fileName)),
		!process.env.CF_PAGES
			? sentryVitePlugin({
					org: 'home-vnd',
					project: 'zsm-timetable',
			  })
			: undefined,
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
					pinia: ['pinia'],
					'floating-vue': ['floating-vue'],
					sentry: ['@sentry/vue'],
				},
			},
		},
		sourcemap: true,
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@import "@/assets/media";@import "@/assets/variables";',
			},
		},
		postcss: {
			plugins: [autoprefixer({})],
		},
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
		},
	},
});
