<script setup>
	const props = defineProps({
		options: {
			type: Array,
			required: true,
		},
	});
	const color = defineModel({ required: true });
</script>

<template>
	<div class="options">
		<template v-for="option in options">
			<input type="radio" name="colorMode" :value="option.value" v-model="color" :id="option.value" />
			<label :for="option.value">
				<i :class="option.class"></i>
				<span>{{ option.name }}</span>
			</label>
		</template>
	</div>
</template>

<style lang="scss" scoped>
	.options {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 5px;
		align-content: center;
		input[type='radio'] {
			display: none;
			&:checked + label {
				background-color: #2196f3;
				color: white;
			}
		}
		label {
			display: flex;
			flex-direction: column;
			text-align: center;
			cursor: pointer;
			padding: 0.5rem;
			border-radius: 0.25rem;
			&:hover {
				background-color: var(--bg-sidebar-hover);
			}
		}
	}
</style>
