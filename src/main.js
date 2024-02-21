import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import appConfigs from '@/stores/configs';
import log from '@/functions/logger';
import validateApp from '@/functions/appVersionControl';
import colorHandler from '@/functions/colorModeHandler';

(async () => {
	// Fetch School Data
	try {
		const schoolData = await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}schoolData.js?t=${Date.now()}`);
		appConfigs.value.school.homeURL = schoolData.default.schoolHomeURL;
		appConfigs.value.school.timetableURL = schoolData.default.schoolTimeTableRootURL;
		appConfigs.value.school.logoDescription = schoolData.default.schoolLogoDescription || 'Logo Szkoły';
	} catch (e) {
		log('error', 'Wystąpił błąd przy wczytywaniu danych szkoły:\n', e);
	}
	// Fetch TimeTable Data
	try {
		const timetableData = await import(/* @vite-ignore */ `${import.meta.env.BASE_URL}timetableData.js?t=${Date.now()}`);
		appConfigs.value.timetable.shortLessons = timetableData.default.shortLessons || [];
		appConfigs.value.timetable.levels = timetableData.default.levels || {};
		appConfigs.value.timetable.classes = timetableData.default.classes || {};
		appConfigs.value.timetable.teachers = timetableData.default.teachers || {};
		appConfigs.value.timetable.rooms = timetableData.default.rooms || {};
		appConfigs.value.timetable.subjects = timetableData.default.subjects || {};
	} catch (e) {
		log('error', 'Wystąpił błąd przy wczytywaniu danych planu lekcji:\n', e);
	}
	// Prevent app from running without required data
	if (!appConfigs.value.school.timetableURL) {
		const loader = document.body.querySelector('#loader');
		loader.querySelector('h1').innerText = 'Wystąpił błąd przy wczytywaniu aplikacji';
		loader.querySelector('p').innerText = 'Nie udało się wczytać wymaganych danych.\nSprawdź połączenie z siecią i spróbuj ponownie później.';
		return;
	}
	// Try to lock screen orientation
	try {
		await screen.orientation.lock('portrait');
	} catch (e) {
		log('warn', 'Nie udało się zablokować orientacji ekranu:\n', e);
	}
	// Render application
	const app = createApp(App);
	app.use(createPinia());
	app.use(router);
	app.mount('#app');
})();

async function cacheTimeTables() {
	if (!appConfigs.value.school.timetableURL) return;
	if (import.meta.env.MODE == 'development') return;
	const last = appConfigs.value.lastFetched;
	if (last != null && last + 86400000 > Date.now()) return;
	console.info('Fetching timetable updates started.');
	const res = await axios.get(`${appConfigs.value.school.timetableURL}lista.html`);
	const list = new TimeTableList(res.data).getList();
	const classMap = list.classes.map((obj) => axios.get(`${appConfigs.value.school.timetableURL}plany/o${obj.value}.html`));
	const teacherMap = list.teachers.map((obj) => axios.get(`${appConfigs.value.school.timetableURL}plany/n${obj.value}.html`));
	const roomMap = list.rooms.map((obj) => axios.get(`${appConfigs.value.school.timetableURL}plany/s${obj.value}.html`));
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

if (import.meta.env.MODE != 'development') {
	log(
		'info',
		'Witaj użytkowniku!\nWidzę, że zainteresowało cię działanie mojej aplikacji.\nJeśli masz jakieś pomysły na udoskonalenie jej zapraszam do kontaktu poprzez wątek na githubie:\nhttps://github.com/Bartek20/ZSM-TimeTable/issues'
	);
	log('warn', 'Jeśli jednak jesteś tu z innego powodu zalecam wycofanie się i zamknięcie tego okna.\nZ pozdrowieniami autor kodu.');
}
