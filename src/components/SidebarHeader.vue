<script setup>
	const props = defineProps({
		logo: {
			type: String,
			required: true,
		},
	});
</script>

<template>
	<header>
		<img :src="logo" />
	</header>
</template>

<style lang="scss">
	header {
		flex-shrink: 0;
		height: 200px;
		img {
			display: block;
			margin: auto;
			padding: 25px;
			height: 100%;
			aspect-ratio: 1 /1;
		}
	}
</style>
