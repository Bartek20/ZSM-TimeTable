<script setup>
	import { RouterView } from 'vue-router';
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
		min-width: 100vw;
		min-height: 100vh;
		background-color: #efedfe !important;
	}
	#app {
		display: flex;
		flex-direction: row;
	}
</style>
