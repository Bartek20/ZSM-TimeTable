import { createRouter, createWebHistory } from 'vue-router';
import getCookie from '@/functions/getCookie';

var cookie = getCookie('selectedTimeTable');
if (cookie == undefined) cookie = 'o1';
const mode = cookie.charAt(0);
const id = cookie.replace(mode, '');

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			redirect: `/plan/${mode}/${id}`,
		},
		{
			path: '/plan/:mode([ons])/:id(\\d+)',
			name: 'plan',
			component: () => import('@/views/PlanView.vue'),
		},
		{
			path: '/print/:mode([ons])/:id(\\d+)',
			name: 'print',
			component: () => import('@/views/PrintView.vue'),
		},
		{
			path: '/:catchAll(.*)',
			name: '404',
			redirect: '/',
		},
	],
});

export default router;
