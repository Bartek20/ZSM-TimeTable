import schoolData from './public/schoolData';

const root = process.env.ROOT_PATH || '/plan_lekcji/';

const timetableRoot = (() => {
	const path = schoolData.schoolTimeTableRootURL.match(/\/(.*)\//);
	return new RegExp(path ? path[1] : schoolData.schoolTimeTableRootURL);
})();

export default {
	registerType: 'autoUpdate',
	workbox: {
		globPatterns: ['**/*.{js,css,png,ico,xml}', 'index.html'],
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
};
