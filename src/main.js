import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import './assets/styles.scss';

import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 1000;

const updateSW = registerSW({
	immediate: true,
	onNeedRefresh() {
		console.log('Update found');
		window.updatable = true;
	},
	onRegisteredSW(workerURL, r) {
		console.log('SW Registered');
		console.log(r);
		r &&
			setInterval(() => {
				console.log('Updating...');
				r.update();
			}, intervalMS);
	},
});

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);

app.mount('#app');
