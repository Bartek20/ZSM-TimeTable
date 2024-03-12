const appConfigs = useStorage(
	'appConfigs',
	{
		// PWA Configs
		version: undefined,
		lastFetched: null,
		// School Data configured in schoolData.js
		school: {
			homeURL: undefined,
			timetableURL: undefined,
			logoDescription: 'Logo Szkoły',
		},
		// Timetable Data configured in timetableData.js
		timetable: {
			shortLessons: [],
			levels: {},
			classes: {},
			teachers: {},
			rooms: {},
			subjects: {},
		},
		database: {
			rooms: {},
			teachers: {},
			classes: {},
			subjects: {},
		},
		// Router - Saving last route
		currentTimeTable: {
			mode: 'o',
			id: 1,
		},
		// Settings
		colorMode: 'light',
		viewMode: 'new',
		forceTablet: false,
		shortLessons: false,
		showCurrent: true,
		showColors: true,
		showBreaks: true,
	},
	localStorage,
	{ mergeDefaults: true }
);

export default appConfigs;
