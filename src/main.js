import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import vueAwesomeSidebar from 'vue-awesome-sidebar';
import 'vue-awesome-sidebar/dist/vue-awesome-sidebar.css';

import './assets/styles.scss';

const app = createApp(App);

app.use(vueAwesomeSidebar);
app.use(createPinia().use(piniaPluginPersistedstate));
app.use(router);

app.mount('#app');
