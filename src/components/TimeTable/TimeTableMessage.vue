<script setup>
	const props = defineProps({
		icon: {
			type: String,
			reuired: true,
		},
		text: {
			type: String,
			required: true,
		},
	});
</script>

<template>
	<div class="message">
		<i :class="icon"></i>
		<h5>{{ text }}</h5>
	</div>
</template>

<style lang="scss" scoped>
	.message {
		text-align: center;
		display: grid;
		align-content: center;
		justify-items: center;
		height: 100%;
		color: var(--tt-text);
		.loading {
			animation: spin 2s linear infinite;
		}
		i {
			font-size: 4rem;
			margin-bottom: 0.5rem;
		}
		h5 {
			font-size: 1.5rem;
			max-width: 90%;
		}
	}
</style>
