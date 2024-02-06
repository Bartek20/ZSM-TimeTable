const appData = useStorage('appData', {
	list: {},
	timetable: {},
	school: {},
	parsed: {
		rooms: {},
		teachers: {},
		classes: {},
	},
});
export default appData;
