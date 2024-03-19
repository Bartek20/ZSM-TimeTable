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
		// Parsed data store
		database: {
			rooms: {},
			teachers: {},
			classes: {},
			subjects: {},
		},
		// History
		history: [],
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
