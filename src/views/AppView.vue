<script setup>
	const AppSidebar = defineAsyncComponent({
		loader: () => import('@/components/Sidebar/AppSidebar.vue'),
		loadingComponent: '<div></div>',
		delay: 0,
	});
	const AppTimeTable = defineAsyncComponent({
		loader: () => import('@/components/TimeTable/AppTimeTable.vue'),
		loadingComponent: '<div></div>',
		delay: 0,
	});
	const AppSettings = defineAsyncComponent({
		loader: () => import('@/components/Settings/AppSettings.vue'),
		loadingComponent: '<div></div>',
		delay: 0,
	});
	const user = useRouteParams('user');
	const mode = useRouteParams('mode')
	const id = useRouteParams('id')
	function closeMenus() {
		document.querySelector('aside.sidebar')?.classList.remove('open');
		document.querySelector('aside.configs')?.classList.remove('open');
		document.querySelector('.overlay')?.classList.remove('overlay--sidebar');
		document.querySelector('.overlay')?.classList.remove('overlay--configs');
	}
	onMounted(() => {
		document.getElementById('loader-styles')?.remove();
		document.getElementById('loader-script')?.remove();
		document.getElementById('loader')?.remove();
	});
</script>

<template>
	<AppSidebar />
	<AppTimeTable :key="user + mode + id" />
	<AppSettings />
	<div class="overlay" @click="closeMenus"></div>
	<RouterLink v-if="user == 'uczen'" :to="{ name: 'plan', params: { user: 'nauczyciel' } }" style="display: none" id="teleporter" />
</template>

<style lang="scss">
	.overlay {
		position: fixed;
		z-index: -1;
		width: 100%;
		height: 100%;
		transition: 0.4s background-color;
		&.overlay--configs {
			background-color: rgba(0 0 0 / 0.4);
			z-index: 10;
		}
		@include tablet {
			&.overlay--sidebar {
				background-color: rgba(0 0 0 / 0.4);
				z-index: 10;
			}
		}
		@include printer {
			display: none;
		}
	}
</style>
