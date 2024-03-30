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
const base = baseIndex != -1 ? args[ baseIndex + 1 ] : '/';
const BASE_URL = base ? base : '/';

const updateBroadcaster = {
	cacheDidUpdate: async ({
		cacheName,
		request,
		oldResponse,
		newResponse,
		event,
		state,
	}) => {
		if (!oldResponse) return
		if (!(oldResponse instanceof Response && newResponse instanceof Response)) return
		console.log(event, state)
		if (await oldResponse.text() != await newResponse.text()) window.postMessage('Timetable Update Available')
	}
}

export default {
	registerType: 'autoUpdate',
	includeManifestIcons: false,
	workbox: {
		globPatterns: [ '**/*.{js,css,png,svg,ico}', 'index.html' ],
		globIgnores: [ 'schoolData.js', 'schoolData.template.js', 'timetableData.js', 'timetableData.template.js' ],
		navigateFallback: `${BASE_URL}index.html`,
		navigateFallbackAllowlist: [ /uczen/, /nauczyciel/ ],
		navigateFallbackDenylist: [ timetableRegExp, /assets/ ],
		runtimeCaching: [
			{
				urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i,
				handler: 'CacheFirst',
				options: {
					cacheName: 'fonts-data',
					expiration: {
						maxEntries: 25,
						maxAgeSeconds: 60 * 60 * 24 * 365,
					},
					cacheableResponse: {
						statuses: [ 200 ],
					},
				},
			},
			{
				urlPattern: timetableRegExp,
				handler: 'NetworkFirst',
				options: {
					cacheName: 'timetables-data',
					networkTimeoutSeconds: 5,
					plugins: [
						updateBroadcaster
					],
					backgroundSync: {
						name: 'timetables-data-bs',
						options: {
							maxRetentionTime: 24 * 60,
						},
					},
					cacheableResponse: {
						statuses: [ 200 ],
					},
				},
			},
		],
	},
	manifest: {
		start_url: `${BASE_URL}?PWA=true`,
		id: `${BASE_URL}`,
		name: 'Plan Lekcji',
		short_name: 'Plan Lekcji',
		description: 'Aplikacja do przegladu szkolnego planu lekcji',
		categories: [
			"education",
			"productivity"
		],
		theme_color: '#ffffff',
		lang: 'pl-PL',
		dir: 'ltr',
		orientation: 'portrait',
		display_override: [
			'window-controls-overlay',
			'standalone',
			'browser'
		],
		display: 'standalone',
		capture_links: 'existing-client-navigate',
		launch_handler: {
			'client_mode': 'navigate-existing'
		},
		handle_links: 'preferred',
		scope_extensions: [
			{
				origin: 'zsm.resman.pl'
			},
		],
		prefer_related_applications: true,
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
				purpose: 'any'
			},
			{
				src: 'assets/images/safari-pinned-tab.svg',
				type: 'image/svg',
				purpose: 'maskable',
			},
		],
	},
};
