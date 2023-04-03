import { createRouter, createWebHistory } from 'vue-router';

var selected = window.localStorage.getItem('selectedTimeTable');
if (selected == null) selected = 'o1';
const mode = selected.charAt(0);
const id = selected.replace(mode, '');

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

router.beforeEach((to) => {
  if (to.name != 'plan') return;
  window.localStorage.setItem('selectedTimeTable', to.params.mode + to.params.id);
});

export default router;
