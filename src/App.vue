<script setup>
	import { RouterView } from 'vue-router';
	import { usePWAStore } from './stores/pwa';
	const PWAStore = usePWAStore();
	window.addEventListener('beforeinstallprompt', (e) => {
		e.preventDefault();
		PWAStore.event = e;
		PWAStore.installed = false;
	});
</script>

<template>
	<Suspense>
		<RouterView />
	</Suspense>
</template>

<style>
	*,
	*::before,
	*::after {
		user-select: none;
		-webkit-user-select: none;
		-webkit-user-drag: none;
	}
	body {
		width: 100vw;
		height: 100vh;
		max-width: 100%;
		max-height: 100%;
		background-color: #cfe2ff !important;
	}
	#app {
		display: flex;
		flex-direction: row;
	}
</style>
