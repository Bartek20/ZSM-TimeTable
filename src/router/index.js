import { createRouter, createWebHistory } from 'vue-router';
import AppView from '../views/AppView.vue';
import DevView from '../views/DevView.vue';
import PlanView from '../views/PlanView.vue';
import PrintView from '../views/PrintView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: AppView,
		},
		{
			path: '/plan/:mode/:id',
			name: 'plan',
			component: PlanView,
		},
		{
			path: '/print/:mode/:id',
			name: 'print',
			component: PrintView,
		},
		{
			path: '/dev',
			name: 'dev',
			component: DevView,
		},
		{
			path: '/dev/:i',
			name: 'dev1',
			component: DevView,
		},
	],
});

export default router;
