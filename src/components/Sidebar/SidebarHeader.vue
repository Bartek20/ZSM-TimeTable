<script setup>
	import schoolData from '../../assets/schoolData.json';
</script>

<template>
	<header class="text-center">
		<a :href="schoolData.schoolHomeURL" target="_blank" rel="noopener noreferrer">
			<img class="p-4" src="/assets/images/logo.png" :alt="schoolData.schoolLogoDescription" />
		</a>
	</header>
</template>

<style lang="scss">
	header {
		max-height: 200px;
	}
</style>
