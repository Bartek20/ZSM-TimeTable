const appData = useStorage(
	'appData',
	{
		list: {},
		timetable: {},
		school: {},
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
