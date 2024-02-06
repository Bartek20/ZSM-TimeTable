import { createRouter, createWebHistory } from 'vue-router';

import appConfigs from '@/stores/configs';
import appData from '@/stores/data';

const selected = appConfigs.value.currentTimeTable ?? {
	mode: 'o',
	id: 1,
};

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/:user?',
			name: 'home',
			redirect: (to) => `/${['uczen', 'nauczyciel'].includes(to.params.user) ? to.params.user : 'uczen'}/${selected.mode}/${selected.id}`,
		},
		{
			path: '/plany/:plan([ons]\\d+.html)',
			name: 'redirector',
			redirect: (to) => {
				const plan = to.params.plan.replace('.html', '');
				const mode = plan.charAt(0);
				const id = plan.replace(mode, '');
				return `/uczen/${mode}/${id}`;
			},
		},
		{
			path: '/:user(uczen|nauczyciel)/:mode([ons])/:id(\\d+)',
			name: 'plan',
			component: () => import('@/views/AppView.vue'),
		},
		{
			path: '/:catchAll(.*)',
			name: '404',
			redirect: '/',
		},
	],
});

router.beforeEach((to) => {
	if (to.name != 'plan') return;
	// Prevent students from accessing teacher's timetables.
	if (to.params.user == 'uczen' && to.params.mode == 'n') return { name: 'plan', params: { user: 'uczen', mode: 'o', id: '1' } };
	// Set current timetable
	appConfigs.value.currentTimeTable = {
		mode: to.params.mode,
		id: to.params.id,
	};
	appData.value.timetable = { status: 0 };
});

export default router;
