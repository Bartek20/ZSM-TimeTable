import appConfigs from '../appConfigs';

const timetableParts = [
	// CSS
	'css/lista.css',
	'css/plan.css',
	// Images
	'images/logo_min.JPG',
	'images/minus.gif',
	'images/plan_logo.gif',
	'images/plus.gif',
	'images/pusty.gif',
	// Scripts
	'scripts/plan.js',
	'scripts/powrot.js',
	// Index
	'index.html',
	// Lista
	'lista.html',
	// Plany
	'plany/[ons]{1}\\d+.html',
];
const timetableRegExp = new RegExp(timetableParts.join('|'));

const argvs = process.argv;
const args = [];
argvs.forEach((arg) => args.push(...arg.split('=')));
const baseIndex = args.indexOf('--base');
const base = baseIndex != -1 ? args[baseIndex + 1] : '/';
const BASE_URL = base ? base : '/';

export default {
	registerType: 'autoUpdate',
	includeManifestIcons: false,
	workbox: {
		globPatterns: ['**/*.{js,css,png,svg,ico}', 'index.html'],
		globIgnores: ['cf-ins.js', 'schoolData.js', 'schoolData.template.js', 'timetableData.js', 'timetableData.template.js'],
		navigateFallback: `${BASE_URL}index.html`,
		navigateFallbackAllowlist: [/uczen/, /nauczyciel/],
		navigateFallbackDenylist: [timetableRegExp, /assets/],
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
						maxAgeSeconds: 60 * 60 * 24 * 365,
					},
					cacheableResponse: {
						statuses: [0, 200],
					},
				},
			},
			{
				urlPattern: timetableRegExp,
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
		start_url: `${BASE_URL}?PWA=true`,
		name: 'Plan Lekcji',
		short_name: 'Plan Lekcji',
		description: 'Aplikacja do przegladu szkolnego planu lekcji',
		theme_color: '#ffffff',
		lang: 'pl-PL',
		dir: 'ltr',
		orientation: 'portrait',
		icons: [
			{
				src: 'assets/images/android-chrome-192x192.png',
				sizes: '192x192',
				type: 'image/png',
			},
			{
				src: 'assets/images/android-chrome-256x256.png',
				sizes: '256x256',
				type: 'image/png',
			},
			{
				src: 'assets/images/android-chrome-512x512.png',
				sizes: '512x512',
				type: 'image/png',
			},
			{
				src: 'assets/images/safari-pinned-tab.svg',
				type: 'image/svg',
				purpose: 'maskable',
			},
		],
	},
};
