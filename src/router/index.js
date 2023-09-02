import { createRouter, createWebHistory } from 'vue-router';

var selected = window.localStorage.getItem('selectedTimeTable') ?? 'o1';
const mode = selected.charAt(0);
const id = selected.replace(mode, '');

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/:user?',
			name: 'home',
			redirect: (to) => `/${['uczen', 'nauczyciel'].includes(to.params.user) ? to.params.user : 'uczen'}/${mode}/${id}`,
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
			component: () => import('@/views/PlanView.vue'),
		},
		{
			path: '/:user(uczen|nauczyciel)/:mode([ons])/:id(\\d+)/print',
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

router.beforeEach((to) => {
	if (to.params.user == 'uczen' && to.params.mode == 'n') return { name: 'plan', params: { user: 'uczen', mode: 'o', id: '1' } };
	if (to.name != 'plan') return;
	window.localStorage.setItem('selectedTimeTable', to.params.mode + to.params.id);
});

export default router;
