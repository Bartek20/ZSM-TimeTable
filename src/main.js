import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import './assets/styles.scss';

import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
	immediate: true,
	onRegisteredSW(workerURL, r) {
		r &&
			setInterval(() => {
				r.update();
			}, 3600000);
	},
});

const app = createApp(App);

app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);

app.mount('#app');
