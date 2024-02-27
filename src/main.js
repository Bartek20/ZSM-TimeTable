import 'floating-vue/dist/style.css';
import './assets/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { vTooltip } from 'floating-vue';

import App from './App.vue';
import router from './router';

import appConfigs from '@/stores/configs';
import log from '@/functions/logger';
import validateApp from '@/functions/appVersionControl';
import colorHandler from '@/functions/colorModeHandler';

import * as Sentry from '@sentry/vue';

// Sentry error reporting
Sentry.init({
	dsn: 'https://8ef437ed0e23a12d1519678510d08a0c@o4506820645158912.ingest.sentry.io/4506820647190528',
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration({
			maskAllText: false,
			blockAllMedia: false,
		}),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, //  Capture 100% of the transactions
	// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
	tracePropagationTargets: [/.*/],
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function checkScrollStyllability() {
	const style = document.createElement('style');
	style.textContent = `
	.scrolltest {
		position: fixed;
		visibility: hidden;
		z-index: -1000;
		overflow: scroll;
		width: 100px;
		background: transparent;
		height: 100px;
		top: 0;
		left: 0;
	}
	.scrolltest::-webkit-scrollbar {
		width: 3px
	}
	.scrolltest::-webkit-scrollbar-track {
		background: red;
	}
	.scrolltest::-webkit-scrollbar-thumb {
		background: green;
	}`;
	const test = document.createElement('div');
	test.classList.add('scrolltest');
	document.head.appendChild(style);
	document.body.appendChild(test);
	if (test.clientWidth != 97) document.body.classList.add('notstyllablescroll');
	if (test.clientWidth != 97 && test.clientWidth != 100) document.body.classList.add('thinscroll');
	log(
		'info',
		'Scroll test finished with following result:\nCustom scrollbar:',
		test.clientWidth != 97 ? (test.clientWidth != 100 ? 'Not supported (thin scrollbar applied)' : 'Not supported (normal scrollbar applied)') : 'Supported'
	);
	style.remove();
	test.remove();
}
checkScrollStyllability();

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
	app.directive('tooltip', vTooltip);
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
