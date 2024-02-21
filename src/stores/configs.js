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
		// Router - Saving last route
		currentTimeTable: {
			mode: 'o',
			id: 1,
		},
		// Settings
		colorMode: 'light',
		forceTablet: false,
		shortLessons: false,
		showCurrent: true,
		showColors: true,
		showBreaks: true,
		showCompressed: false, // Doesn't do anything rn
	},
	localStorage,
	{ mergeDefaults: true }
);

export default appConfigs;
