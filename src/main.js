import App from './App.vue';
import router from './router';

import './assets/styles.scss';

const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_, r) {
    window.WorkerReady = true;
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
