import App from './App.vue';
import router from './router';

import './assets/styles.scss';

async function cacheTimeTables() {
	if (import.meta.env.MODE == 'development') return;
	const last = window.localStorage.getItem('lastFetched');
	if (last != null && last + 86400000 > Date.now()) return;
	console.info('Fetching timetable updates started.');
	axios.get(`${import.meta.env.BASE_URL}school-data.json`);
	const res = await axios.get('/plan_vulcan/lista.html');
	const list = new TimeTableList(res.data).getList();
	const classMap = list.classes.map((obj) => axios.get(`/plan_vulcan/plany/o${obj.value}.html`));
	const teacherMap = list.teachers.map((obj) => axios.get(`/plan_vulcan/plany/n${obj.value}.html`));
	const roomMap = list.rooms.map((obj) => axios.get(`/plan_vulcan/plany/s${obj.value}.html`));
	await Promise.all([classMap, teacherMap, roomMap]);
	console.info('Fetching timetable updates finished.');
	window.localStorage.setItem('lastFetched', Date.now());
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
		if (!location.pathname.endsWith('/print')) cacheTimeTables();
		setInterval(() => {
			SW.update();
		}, 3600000);
	},
});

const schoolData = useStorage('schoolData', {});
const DATA_URL = `${import.meta.env.BASE_URL}school-data.json`;
axios
	.get(DATA_URL)
	.then((res) => {
		schoolData.value = res.data;
	})
	.catch((err) => {
		console.error('Wczytywanie danych szkoły nie powiodło się:', err);
	});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
