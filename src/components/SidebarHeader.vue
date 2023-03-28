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
		<img :src="logo" alt="Szkolne Logo Zespołu Szkół Mechanicznych w Rzeszowie" />
	</header>
</template>

<style lang="scss">
	header {
		flex-shrink: 0;
		height: 200px;
		text-align: center;
		img {
			padding: 25px;
			height: 100%;
			aspect-ratio: 1 /1;
		}
	}
</style>
