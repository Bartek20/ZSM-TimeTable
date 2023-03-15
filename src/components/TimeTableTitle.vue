<script setup>
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
	});
</script>

<template>
	<div class="title text-center">
		<h3 class="mb-0 p-2">{{ title }}</h3>
	</div>
</template>
