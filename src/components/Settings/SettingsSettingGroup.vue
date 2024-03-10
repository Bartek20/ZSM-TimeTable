<script setup>
	const props = defineProps({
		name: {
			type: String,
			required: true,
		},
		options: {
			type: Array,
			required: true,
		},
	});
	const color = defineModel({ required: true });
	const optsLen = computed(() => props.options.length);
</script>

<template>
	<div>
		<span>{{ name }}</span>
		<div class="configs__options">
			<template v-for="option in options">
				<input class="configs__options__checkbox" type="radio" :name="name" :value="option.value" v-model="color" :id="option.value" />
				<label class="configs__options__label" :for="option.value">
					<i class="configs__options__label__icon" :class="option.class"></i>
					<span class="configs__options__label__name">{{ option.name }}</span>
				</label>
			</template>
		</div>
	</div>
</template>

<style lang="scss">
	.configs__options {
		margin-top: 0.25rem;
		display: grid;
		grid-template-columns: repeat(v-bind(optsLen), 1fr);
		gap: 5px;
		align-content: center;
		&__checkbox {
			display: none;
			&:checked + .configs__options__label {
				background-color: $accent-color;
				color: white;
			}
		}
		&__label {
			transition: 0.4s;
			display: flex;
			flex-direction: column;
			text-align: center;
			cursor: pointer;
			padding: 0.5rem;
			border-radius: 0.25rem;
			min-width: 100%;
			&:hover {
				background-color: var(--bg-sidebar-hover);
			}
		}
	}
</style>
