<script setup></script>

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
