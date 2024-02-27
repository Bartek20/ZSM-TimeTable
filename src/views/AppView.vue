<script setup>
	const AppSidebar = defineAsyncComponent(() => import('@/components/Sidebar/AppSidebar.vue'));
	const AppTimeTable = defineAsyncComponent(() => import('@/components/TimeTable/AppTimeTable.vue'));
	const AppSettings = defineAsyncComponent(() => import('@/components/Settings/AppSettings.vue'));
	import appConfigs from '@/stores/configs';
	const user = useRouteParams('user');
	function closeMenus() {
		document.querySelector('aside.sidebar')?.classList.remove('open');
		document.querySelector('aside.configs')?.classList.remove('open');
		document.querySelector('.overlay')?.classList.remove('activeSidebar');
		document.querySelector('.overlay')?.classList.remove('activeConfigs');
	}
	onMounted(() => {
		document.getElementById('loader-styles')?.remove();
		document.getElementById('loader-script')?.remove();
		document.getElementById('loader')?.remove();
	});
</script>

<template>
	<AppSidebar />
	<AppTimeTable :key="user + appConfigs.currentTimeTable.mode + appConfigs.currentTimeTable.id" />
	<AppSettings />
	<div class="overlay" @click="closeMenus"></div>
	<RouterLink v-if="user == 'uczen'" :to="{ name: 'plan', params: { user: 'nauczyciel' } }" style="display: none" id="teleporter" />
</template>

<style lang="scss" scoped>
	.overlay {
		position: fixed;
		z-index: -1;
		width: 100%;
		height: 100%;
		transition: 0.4s background-color;
		&.activeConfigs {
			background-color: rgba(0 0 0 / 0.4);
			z-index: 10;
		}
		@include tablet {
			&.activeSidebar {
				background-color: rgba(0 0 0 / 0.4);
				z-index: 10;
			}
		}
		@include printer {
			display: none;
		}
	}
</style>
