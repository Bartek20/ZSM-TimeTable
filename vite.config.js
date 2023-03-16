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
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
			},
			manifest: {
				name: 'ZSM Plan Lekcji',
				short_name: 'ZSM Plan Lekcji',
				description: 'Aplikacja do przeglądu planu lekcji w Zespole Szkół Mechanicznych w Rzeszowie',
				theme_color: '#ffffff',
				lang: 'pl-PL',
				icons: [
					{
						src: 'android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'android-chrome-256x256.png',
						sizes: '256x256',
						type: 'image/png',
					},
				],
			},
			injectRegister: 'script',
		}),
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap'),
		},
	},
});
