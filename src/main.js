import App from './App.vue';
import router from './router';

import './assets/styles.scss';

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
		window.WorkerReady = true;
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
