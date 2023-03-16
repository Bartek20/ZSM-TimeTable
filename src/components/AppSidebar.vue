<script setup>
	import { computed } from 'vue';
	import SidebarHeader from '@/components/SidebarHeader.vue';
	import SidebarMenu from '@/components/SidebarMenu.vue';
	import SidebarFooter from '@/components/SidebarFooter.vue';
	import { usePlansStore } from '@/stores/plans';

	const plansStore = usePlansStore();
	const list = computed(() => plansStore.lists);
</script>

<template>
	<section id="sidebar">
		<SidebarHeader logo="/logo-zsm.png" />
		<nav class="list">
			<SidebarMenu id="o" symbol="zsm-user-graduate-icon" name="Klasy" :list="list.classes" />
			<SidebarMenu id="n" symbol="zsm-chalkboard-user-icon" name="Nauczyciele" :list="list.teachers" />
			<SidebarMenu id="s" symbol="zsm-door-closed-icon" name="Sale" :list="list.rooms" />
		</nav>
		<SidebarFooter />
	</section>
</template>

<style lang="scss">
	#sidebar {
		background-color: #fffffe;
		min-width: 240px;
		max-width: 240px;
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: white;
		.list {
			flex-grow: 1;
			overflow: auto;
			padding: 12px;
			padding-top: 0;
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}
</style>
