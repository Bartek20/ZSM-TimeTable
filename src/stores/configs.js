const appConfigs = useStorage('appConfigs', {
	version: undefined,
	lastFetched: null,
	currentTimeTable: {
		mode: 'o',
		id: 1,
	},
	colorMode: 'light',
	showColors: true,
	showBreaks: true,
	showCompressed: false,
	forceTablet: false,
});

export default appConfigs;
