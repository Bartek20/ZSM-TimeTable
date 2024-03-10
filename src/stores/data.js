const appData = useStorage(
	'appData',
	{
		list: {},
		timetable: {},
		parsed: {
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
