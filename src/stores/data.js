const appData = useStorage(
	'appData',
	{
		list: {},
		timetable: {},
		database: {
			rooms: {},
			teachers: {},
			classes: {},
			subjects: {},
		},
	},
	localStorage,
	{ mergeDefaults: true }
);

export default appData;
