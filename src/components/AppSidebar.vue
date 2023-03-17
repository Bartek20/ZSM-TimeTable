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
	<input id="sidebar-btn" type="checkbox" />
	<section id="sidebar">
		<label class="sidebar-toggle" for="sidebar-btn"><i class="menu zsm-close-icon"></i></label>
		<SidebarHeader logo="/logo-zsm.png" />
		<nav class="list">
			<SidebarMenu id="o" symbol="zsm-student-icon" name="Klasy" :list="list.classes" />
			<SidebarMenu id="n" symbol="zsm-teacher-icon" name="Nauczyciele" :list="list.teachers" />
			<SidebarMenu id="s" symbol="zsm-room-icon" name="Sale" :list="list.rooms" />
		</nav>
		<SidebarFooter />
	</section>
</template>

<style lang="scss">
	#sidebar-btn {
		display: none;
	}
	#sidebar {
		z-index: 999;
		transition: left 0.5s ease-in-out;
		background-color: #fffffe;
		min-width: 240px;
		max-width: 240px;
		position: fixed;
		top: 0;
		left: 0px;
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: white;
		.sidebar-toggle {
			display: none;
			.menu {
				color: black;
				right: 8px;
				top: 8px;
				position: absolute;
				font-size: 32px;
			}
		}
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
	@media (max-width: 991.98px) {
		#sidebar {
			left: -240px;
			.sidebar-toggle {
				display: block;
			}
		}
		#sidebar-btn:checked + #sidebar {
			left: 0;
		}
	}
</style>
