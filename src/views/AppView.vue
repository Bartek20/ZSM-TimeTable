<script setup>
	import appConfigs from '@/stores/configs';
	const user = useRouteParams('user');
	function closeMenus() {
		document.querySelector('aside.sidebar')?.classList.remove('open');
		document.querySelector('aside.configs')?.classList.remove('open');
		document.querySelector('.overlay')?.classList.remove('active');
	}
	onMounted(() => {
		document.getElementById('loader-styles')?.remove();
		document.getElementById('loader-script')?.remove();
		document.getElementById('loader')?.remove();
	});
</script>

<template>
	<AppSidebar />
	<AppTimeTable :key="appConfigs.currentTimeTable.mode + appConfigs.currentTimeTable.id" />
	<div class="overlay" @click="closeMenus"></div>
	<RouterLink v-if="user == 'uczen'" :to="{ name: 'plan', params: { user: 'nauczyciel' } }" style="display: none" id="teleporter" />
</template>

<style lang="scss" scoped>
	.overlay {
		position: fixed;
		z-index: -1;
		width: 100%;
		height: 100%;
		background-color: rgba(0 0 0 / 0.4);
		&.active {
			z-index: 10;
		}
	}
</style>
