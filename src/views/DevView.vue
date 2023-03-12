<script setup>
	import { ref } from 'vue';

	const collapsed = ref(false);
	const miniMenu = ref(false);

	const update = () => {
		collapsed.value = !collapsed.value;
	};

	const updateminiMenu = () => {
		miniMenu.value = !miniMenu.value;
	};

	const testmENU = [
		{
			name: 'Klasy',
			icon: { class: 'zsm-user-graduate-icon' },
			href: '/dev',
			children: [
				{
					name: 'level 1.1',
					icon: { class: 'd-none' },
				},
				{
					name: 'level 1.2',
					icon: { class: 'd-none' },
				},
			],
		},
		{
			name: 'Nauczyciele',
			icon: { class: 'zsm-chalkboard-user-icon' },
			href: '/dev',
			children: [
				{
					href: { path: '/styles', hash: '#sass-varibles' },
					name: 'level 2.1',
					icon: { class: 'd-none' },
				},
				{
					href: { path: '/styles', hash: '#csss-varibles' },
					name: 'level 2.2',
					icon: { class: 'd-none' },
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
					icon: { class: 'd-none' },
				},
			],
		},
		{
			name: 'Sale',
			icon: { class: 'zsm-door-closed-icon' },
			href: '/dev',
			children: [
				{
					href: { path: '/styles', hash: '#sass-varibles' },
					name: 'level 2.1',
				},
				{
					href: { path: '/styles', hash: '#csss-varibles' },
					name: 'level 2.2',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
				{
					href: { path: '/styles', hash: '#www-varibles' },
					name: 'level 2.3',
				},
			],
		},
	];
</script>

<template>
	<div class="hello" @click="update">close</div>
	<div class="hello2" @click="updateminiMenu">updateminiMenu</div>
	<VueAwesomeSideBar
		:menu="testmENU"
		v-model:miniMenu="miniMenu"
		v-model:collapsed="collapsed"
		@item-click="hanc"
		vueRouterEnabel
		:autoCollapse="600"
		menuType="simple"
		:closeOpenMenuOnHrefPush="true">
	</VueAwesomeSideBar>
	{{ miniMenu }}
</template>
<style lang="scss">
	.hello {
		position: absolute;
		left: 50%;
	}
	.hello2 {
		position: absolute;
		left: 60%;
	}
	i.menu-icon {
		width: 30px !important;
		text-align: center;
	}
</style>
