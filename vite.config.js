import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import autoprefixer from 'autoprefixer';
import banner from 'vite-plugin-banner';
import path from 'path';
import glob from 'glob';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

function getGlobs(pattern) {
	return glob.sync(pattern);
}

const root = process.env.ROOT_PATH || '/plan_lekcji/';

const now = new Intl.DateTimeFormat('en-US', {
	timeZone: 'Europe/Warsaw',
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	second: '2-digit',
}).format(new Date());

export default defineConfig({
	base: root,
	server: {
		base: '/',
		proxy: {
			plan_vulcan: {
				target: 'https://zsm.resman.pl',
				changeOrigin: true,
			},
		},
	},
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
				'@vueuse/core',
				{
					'@vueuse/router': ['useRouteParams'],
					'virtual:pwa-register': ['registerSW'],
					axios: [['default', 'axios']],
					'string-to-color': [['default', 'stc']],
					'chroma-js': [['default', 'chroma']],
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
				navigateFallbackAllowlist: [/uczen/, /nauczyciel/],
				navigateFallbackDenylist: [/plan_vulcan/, /assets/],
				runtimeCaching: [
					{
						urlPattern: /plan_vulcan/,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'timetables-data',
							networkTimeoutSeconds: 3,
							cacheableResponse: {
								statuses: [200],
							},
						},
					},
				],
			},
			manifest: {
				scope: root,
				id: root,
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
		banner((fileName) => {
			return `
        File name: ${fileName.slice(0, fileName.lastIndexOf('-')) + fileName.slice(fileName.lastIndexOf('.'))}
        Generated: ${now}
        App name: ZSM TimeTable
      `;
		}),
	],
	build: {
		minify: 'terser',
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vueuse: ['@vueuse/core', '@vueuse/router'],
					axios: ['axios'],
					color: ['chroma-js', 'string-to-color'],
					vue: ['vue', 'vue-router', 'pinia'],
					components: [].concat(getGlobs('./src/{views,functions,stores,router}/**/*')).concat(getGlobs('./src/components/{Sidebar,TimeTable}/**/*')),
				},
			},
		},
	},
	css: {
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
