import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import autoprefixer from 'autoprefixer';
import banner from 'vite-plugin-banner';
import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vite Configs
import server from './configs/vite.server';
// Vite Transform plugins
import { getNow, getBanner, parseHTML, generateBrowserConfigXML } from './configs/vite.plugins';
// PWA Config
import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from './configs/vite.pwa';

// Auto Imports
import { components, imports } from './configs/vite.components';

const now = getNow();

export default defineConfig({
	define: {
		__APP_VERSION__: JSON.stringify('v2.0.0'),
	},
	server,
	preview: {
		port: 5173,
	},
	plugins: [
		vue(),
		Components(components),
		AutoImport(imports),
		parseHTML(),
		generateBrowserConfigXML(),
		VitePWA(pwaConfig),
		banner((fileName) => getBanner(now, fileName)),
	],
	build: {
		minify: 'terser',
		assetsInlineLimit: 10240,
		cssCodeSplit: false,
		rollupOptions: {
		},
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
			'@bootstrap': path.resolve(__dirname, 'node_modules/bootstrap/scss'),
		},
	},
});
