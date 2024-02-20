const appConfigs = useStorage(
	'appConfigs',
	{
		// PWA Configs
		version: undefined,
		lastFetched: null,
		// School Data configured in schoolData.js
		school: {
			shortName: undefined,
			homeURL: '/',
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
		// Router - Saving last route
		currentTimeTable: {
			mode: 'o',
			id: 1,
		},
		// Settings
		colorMode: 'light',
		showColors: true,
		showBreaks: true,
		shortLessons: false,
		showCompressed: false, // Doesn't do anything rn
		forceTablet: false,
	},
	localStorage,
	{ mergeDefaults: true }
);

export default appConfigs;
