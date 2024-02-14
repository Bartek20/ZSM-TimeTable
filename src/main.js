import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import schoolData from '../public/schoolData';

import appConfigs from '@/stores/configs';
import loadSchoolData from '@/functions/loadSchoolData';
import log from '@/functions/logger';
import validateApp from '@/functions/appVersionControl';
import colorHandler from '@/functions/colorModeHandler';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');

async function cacheTimeTables() {
	if (import.meta.env.MODE == 'development') return;
	const last = appConfigs.value.lastFetched;
	if (last != null && last + 86400000 > Date.now()) return;
	console.info('Fetching timetable updates started.');
	const res = await axios.get(`${schoolData.schoolTimeTableRootURL}lista.html`);
	const list = new TimeTableList(res.data).getList();
	const classMap = list.classes.map((obj) => axios.get(`${schoolData.schoolTimeTableRootURL}plany/o${obj.value}.html`));
	const teacherMap = list.teachers.map((obj) => axios.get(`${schoolData.schoolTimeTableRootURL}plany/n${obj.value}.html`));
	const roomMap = list.rooms.map((obj) => axios.get(`${schoolData.schoolTimeTableRootURL}plany/s${obj.value}.html`));
	await Promise.all([...classMap, ...teacherMap, ...roomMap]);
	console.info('Fetching timetable updates finished.');
	appConfigs.value.lastFetched = Date.now();
}

const updateSW = registerSW({
	immediate: true,
	async onRegisteredSW(_, SW) {
		// Waiting for Service Worker to install
		await new Promise((resolve) => {
			const checkStatus = () => {
				if (SW.active) resolve();
				else setTimeout(checkStatus, 100);
			};
			checkStatus();
		});
		// Service Worker Installed working
		await validateApp();
		cacheTimeTables();
		setInterval(() => {
			SW.update();
		}, 3600000);
	},
});

axios.defaults.headers.get['Cache-Control'] = 'no-cache';

colorHandler();
loadSchoolData();

if (import.meta.env.MODE != 'development') {
	log(
		'info',
		'Witaj użytkowniku!\nWidzę, że zainteresowało cię działanie mojej aplikacji.\nJeśli masz jakieś pomysły na udoskonalenie jej zapraszam do kontaktu poprzez wątek na githubie:\nhttps://github.com/Bartek20/ZSM-TimeTable/issues'
	);
	log('warn', 'Jeśli jednak jesteś tu z innego powodu zalecam wycofanie się i zamknięcie tego okna.\nZ pozdrowieniami autor kodu.');
}
