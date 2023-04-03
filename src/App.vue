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
	html {
		height: 100%;
	}
	body {
		width: 100vw;
		height: 100%;
		background-color: #cfe2ff !important;
	}
	#app {
		height: 100%;
		max-width: 100%;
		display: flex;
		flex-wrap: nowrap;
	}
</style>
