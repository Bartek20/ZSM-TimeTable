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
