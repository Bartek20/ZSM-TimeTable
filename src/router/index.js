import { createRouter, createWebHistory } from 'vue-router';

import appConfigs from '@/stores/configs';
import appData from '@/stores/data';
import log from '@/functions/logger';

let selected = appConfigs.value.currentTimeTable;

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/:user?',
			name: 'home',
			redirect: (to) =>
				`/${['uczen', 'nauczyciel'].includes(to.params.user) ? to.params.user : 'uczen'}/${['o', 'n', 's'].includes(selected?.mode) ? selected.mode : 'o'}/${
					typeof selected?.id == 'number' ? selected.id : 1
				}`,
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
	if (to.name == '404' || to.name == 'home' || to.name == 'redirector') {
		if (to.redirectedFrom.name == '404' || to.redirectedFrom.name == 'home' || to.redirectedFrom == 'redirector') {
			log('warn', 'Doszło do pętli przekierowań:', to);
			return { name: 'plan', params: { user: 'uczen', mode: 'o', id: '1' } };
		}
		return;
	}
	if (to.name != 'plan') return;
	// Prevent students from using old view
	if (to.params.user == 'uczen') appConfigs.value.viewMode = 'new';
	// Prevent students from accessing teacher's timetables.
	if (to.params.user == 'uczen' && to.params.mode == 'n') return { name: 'plan', params: { user: 'uczen', mode: 'o', id: '1' } };
	// Set current timetable
	appConfigs.value.currentTimeTable = {
		mode: to.params.mode,
		id: to.params.id,
	};
	appData.value.timetable = { status: 0 };
});
router.afterEach((_to, _from, failure) => {
	if (failure) log('error', 'Wystąpił błąd przy przekierowaniu:', failure);
});

export default router;
