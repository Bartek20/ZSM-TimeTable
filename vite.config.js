import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import autoprefixer from 'autoprefixer';
import banner from 'vite-plugin-banner';
import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Vite Configs
import server from './vite.server';
// Vite Transform plugins
import { getNow, getBanner, parseHTML, generateBrowserConfigXML } from './vite.plugins';
// PWA Config
import { VitePWA } from 'vite-plugin-pwa';
import pwaConfig from './vite.pwa';
// Auto Imports
import { components, imports } from './vite.components';

const args = process.argv.slice(2)
const root = (args[0] == '--path') ? args[1] : '/plan_lekcji/';
const now = getNow();

export default defineConfig({
	base: root,
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
			output: {
				// manualChunks: {
				// 	vue: ['vue', 'vue-router', 'pinia'],
				// 	functions: getGlobs('./src/{views,functions,stores,router}/**/*'),
				// 	components: getGlobs('./src/components/{Sidebar,TimeTable,Settings}/**/*'),
				// },
			},
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
