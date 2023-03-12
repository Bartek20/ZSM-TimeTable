import { fileURLToPath, URL } from 'node:url';
const path = require('path');

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		//VitePWA({
		//registerType: 'autoUpdate',
		//			workbox: {
		//				globPatterns: ['**/*.{js,css,html,ico,png,svg}']
		//			},
		//injectRegister: 'script',
		//devOptions: {
		//	enabled: true
		//}
		//})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
		},
	},
});
