<script setup>
	const props = defineProps({
		icon: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	});
	const status = defineModel({ required: true });
</script>

<template>
	<label>
		<i :class="icon"></i>
		<span>{{ name }}</span>
		<div class="toggle">
			<input type="checkbox" v-model="status" />
			<div class="slider"></div>
		</div>
	</label>
</template>

<style lang="scss" scoped>
	label {
		&:first-of-type {
			display: none;
			@include phone {
				display: flex;
			}
		}
		padding: 0.25rem 0.75rem 0.25rem 0;
		text-decoration: none;
		color: var(--sb-text);
		height: 50px;
		display: flex;
		align-items: center;
		cursor: pointer;
		i {
			display: block;
			font-size: 20px;
			min-width: 40px;
			text-align: center;
		}
		span {
			width: 100%;
		}
		&:hover {
			background-color: var(--bg-sidebar-hover);
			color: var(--tt-text);
			border-radius: 6px;
		}
	}
	.toggle {
		position: relative;
		display: inline-block;
		min-width: 40px;
		height: 23px;
		input[type='checkbox'] {
			display: none;
			&:checked + .slider {
				background-color: #2196f3;
				&:before {
					transform: translateX(17px);
				}
			}
			&:focus + .slider {
				box-shadow: 0 0 1px #2196f3;
			}
		}
		.slider {
			position: absolute;
			inset: 0;
			background-color: lighten(red, 10);
			transition: 0.4s;
			border-radius: 34px;
			&:before {
				position: absolute;
				content: '';
				height: 17px;
				width: 17px;
				left: 3px;
				bottom: 3px;
				background-color: white;
				transition: 0.4s;
				border-radius: 50%;
			}
		}
	}
</style>
