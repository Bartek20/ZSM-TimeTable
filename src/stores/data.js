const appData = useStorage(
	'appData',
	{
		list: {},
		timetable: {},
		parsed: {
			rooms: {},
			teachers: {},
			classes: {},
		},
	},
	localStorage,
	{ mergeDefaults: true }
);
export default appData;
