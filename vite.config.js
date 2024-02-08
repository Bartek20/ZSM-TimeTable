import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';
import autoprefixer from 'autoprefixer';
import banner from 'vite-plugin-banner';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import schoolData from './public/schoolData';

function getGlobs(pattern) {
	return glob.sync(pattern);
}
function parseHTML(variables) {
	return {
		name: 'parseHTML',
		transformIndexHtml(html) {
			Object.keys(variables).forEach((key) => {
				const regex = new RegExp(`%${key}%`, 'g');
				html = html.replace(regex, variables[key]);
			});
			return html;
		},
	};
}
function generateBrowserConfigXML() {
	return {
		name: 'generateBrowserConfigXML',
		async writeBundle(outputOptions, bundle) {
			const xmlTemplate = `<?xml version="1.0" encoding="utf-8"?><browserconfig><msapplication><tile><square70x70logo src="${root}assets/images/mstile-70x70.png"/><square150x150logo src="${root}assets/images/mstile-150x150.png"/><square310x310logo src="${root}assets/images/mstile-310x310.png"/><wide310x150logo src="${root}assets/images/mstile-310x150.png"/><TileColor>#da532c</TileColor></tile></msapplication></browserconfig>`;
			try {
				fs.writeFileSync((outputOptions.dir || outputOptions.file) + '/browserconfig.xml', xmlTemplate, 'utf-8');
			} catch (error) {
				console.error('Błąd podczas generowania browserconfig.xml:', error);
			}
		},
	};
}

const root = process.env.ROOT_PATH || '/plan_lekcji/';
const htmlVariables = {
	APP_ROOT: root,
	schoolROOT: schoolData.schoolTimeTableRootURL,
};
const timetableRoot = (() => {
	const path = schoolData.schoolTimeTableRootURL.match(/\/(.*)\//);
	return new RegExp(path ? path[1] : schoolData.schoolTimeTableRootURL);
})();

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
	define: {
		__APP_VERSION__: JSON.stringify('v2.0.0'),
	},
	server: {
		proxy: {
			'/plan_vulcan': {
				target: 'https://zsm.resman.pl',
				changeOrigin: true,
				secure: false,
				ws: true,
				configure: (proxy, _options) => {
					proxy.on('error', (err, _req, _res) => {
						console.log('proxy error', err);
					});
					proxy.on('proxyReq', (proxyReq, req, _res) => {
						console.log('Sending Request to the Target:', req.method, req.url);
					});
					proxy.on('proxyRes', (proxyRes, req, _res) => {
						console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
					});
				},
			},
		},
	},
	preview: {
    port: 5173,
  },
	plugins: [
		vue(),
		Components({
			dirs: ['src/components'],
			extensions: ['vue'],
		}),
		AutoImport({
			include: [/\.js$/, /\.vue$/, /\.vue\?vue/, /\.json$/],
			imports: [
				'vue',
				'vue-router',
				'pinia',
				'@vueuse/core',
				{
					'@vueuse/router': ['useRouteParams'],
					'virtual:pwa-register': ['registerSW'],
					'@nozbe/microfuzz': [['default', 'createFuzzySearch']],
					axios: [['default', 'axios']],
					'string-to-color': [['default', 'stc']],
					'chroma-js': [['default', 'chroma']],
				},
			],
			dirs: ['src/functions', 'src/stores', 'src/assets'],
			vueTemplate: true,
		}),
		parseHTML(htmlVariables),
		generateBrowserConfigXML(),
		VitePWA({
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: ['**/*.{js,css,png,ico,xml,webmanifest}', 'index.html'],
				globIgnores: ['schoolData.js', 'schoolData.template.js', 'timetableData.js', 'timetableData.template.js'],
				navigateFallback: `${root}index.html`,
				navigateFallbackAllowlist: [/uczen/, /nauczyciel/],
				navigateFallbackDenylist: [timetableRoot, /assets/],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365,
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: 'CacheFirst',
						options: {
							cacheName: 'gstatic-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
							},
							cacheableResponse: {
								statuses: [0, 200],
							},
						},
					},
					{
						urlPattern: timetableRoot,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'timetables-data',
							networkTimeoutSeconds: 5,
							backgroundSync: {
								name: 'timetables-data-bs',
								options: {
									maxRetentionTime: 24 * 60,
								},
							},
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
				start_url: root + '?PWA=true',
				name: schoolData.pwaName,
				short_name: schoolData.pwaShortName,
				description: schoolData.pwaDescription,
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
		assetsInlineLimit: 10240,
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				manualChunks: {
					vue: ['vue', 'vue-router', 'pinia'],
					functions: getGlobs('./src/{views,functions,stores,router}/**/*'),
					components: getGlobs('./src/components/{Sidebar,TimeTable,Settings}/**/*'),
				},
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
