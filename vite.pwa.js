import schoolData from './public/schoolData';

const timetableRoot = (() => {
	const path = schoolData.schoolTimeTableRootURL.match(/\/(.*)\//);
	return new RegExp(path ? path[1] : schoolData.schoolTimeTableRootURL);
})();

const args = process.argv.slice(3);
const BASE_URL = args[0] == '--base' ? args[1] : '/';

export default {
	registerType: 'autoUpdate',
	workbox: {
		globPatterns: ['**/*.{js,css}', 'index.html'],
		globIgnores: ['schoolData.js', 'schoolData.template.js', 'timetableData.js', 'timetableData.template.js'],
		navigateFallback: `${BASE_URL}index.html`,
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
						maxAgeSeconds: 60 * 60 * 24 * 365,
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
		start_url: '?PWA=true',
		name: schoolData.pwaName,
		short_name: schoolData.pwaShortName,
		description: schoolData.pwaDescription,
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
