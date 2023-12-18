import App from './App.vue';
import router from './router';

import schoolData from './assets/schoolData.json';

import './assets/styles.scss';

const appConfigs = useStorage('appConfigs', {
	version: __APP_VERSION__,
	lastFetched: null,
	currentTimeTable: undefined,
	colorMode: 'light',
	showColors: true,
	showBreaks: true,
	showCompressed: false,
});

async function cacheTimeTables() {
	if (import.meta.env.MODE == 'development') return;
	const last = appConfigs.value.lastFetched;
	if (last != null && last + 86400000 > Date.now()) return;
	console.info('Fetching timetable updates started.');
	axios.get(`${import.meta.env.BASE_URL}school-data.json`);
	const res = await axios.get(`${schoolData.schoolTimeTableRootURL}lista.html?app=timetable`);
	const list = new TimeTableList(res.data).getList();
	const classMap = list.classes.map((obj) => axios.get(`${schoolData.schoolTimeTableRootURL}plany/o${obj.value}.html?app=timetable`));
	const teacherMap = list.teachers.map((obj) => axios.get(`${schoolData.schoolTimeTableRootURL}plany/n${obj.value}.html?app=timetable`));
	const roomMap = list.rooms.map((obj) => axios.get(`${schoolData.schoolTimeTableRootURL}plany/s${obj.value}.html?app=timetable`));
	await Promise.all([classMap, teacherMap, roomMap]);
	console.info('Fetching timetable updates finished.');
	appConfigs.value.lastFetched = Date.now();
}

function waitForWorker(SW) {
	return new Promise((resolve) => {
		const checkStatus = () => {
			if (SW.active) resolve();
			else setTimeout(checkStatus, 100);
		};
		checkStatus();
	});
}

const updateSW = registerSW({
	immediate: true,
	async onRegisteredSW(_, SW) {
		await waitForWorker(SW);
		if (window.localStorage.getItem('lastFetched') || (appConfigs.value.version != __APP_VERSION__ && (await window.caches.has('timetables-data')))) {
			console.info('Updating app version.');
			window.localStorage.removeItem('selectedTimeTable');
			window.localStorage.removeItem('lastFetched');
			await window.caches.delete('timetables-data');
			appConfigs.value.lastFetched = null;
			appConfigs.value.version = __APP_VERSION__;
		}
		if (!location.pathname.endsWith('/print')) cacheTimeTables();
		setInterval(() => {
			SW.update();
		}, 3600000);
	},
});
const colorScheme = useMediaQuery('(prefers-color-scheme: dark)');
appConfigs.value.colorMode = colorScheme.value ? 'dark' : 'light';
watch(colorScheme, (color) => {
	appConfigs.value.colorMode = color ? 'dark' : 'light';
});
const timetableData = useStorage('timetableData', {});
const DATA_URL = `${import.meta.env.BASE_URL}school-data.json`;
axios
	.get(DATA_URL)
	.then((res) => {
		timetableData.value = res.data;
	})
	.catch((err) => {
		console.error('Wczytywanie danych szkoły nie powiodło się:', err);
	});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
