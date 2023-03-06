import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/ViewSidebar.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: HomeView
		},
		{
			path: '/print/:mode/:id',
			name: 'print',
			component: HomeView
		},
	]
})

export default router
