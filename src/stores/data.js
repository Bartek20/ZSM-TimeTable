const appDataState = createGlobalState(() => {
	const list = ref({});
	const timetable = ref({});

	return {list, timetable};
});

const appData = appDataState();

export default appData;
