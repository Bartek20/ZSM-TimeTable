<script setup>
	const PWAStore = usePWAStore();
	if (window.installevent) {
		PWAStore.event = window.installevent;
		PWAStore.installed = false;
		window.installevent = undefined;
	}
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		PWAStore.event = e;
		PWAStore.installed = false;
	});
	window.removeEventListener('beforeinstallprompt', window.installhandler);
</script>

<template>
	<RouterView />
</template>

<style lang="scss">
	#app {
		display: grid;
		grid-template-columns: $sidebar-width 1fr;
		@include tablet {
			grid-template-columns: 1fr;
		}
		@include printer {
			grid-template-columns: 1fr;
		}
	}
</style>
