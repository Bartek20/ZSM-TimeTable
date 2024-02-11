<script setup>
	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		list: {
			type: Array,
			required: true,
		},
	});
	function changeMenu(e) {
		e.preventDefault();
		let element = e.target;
		if (element.tagName != 'LABEL') element = element.parentElement;
		if (element.tagName != 'LABEL') element = element.parentElement;
		element = element.control;
		element.checked = !element.checked;
	}
</script>

<template>
	<input type="radio" name="menu" :id="id" />
	<div class="menu" v-if="list.length > 0">
		<label @click="changeMenu" :for="id">
			<i :class="icon"></i>
			<span>{{ name }}</span>
			<i class="zsm-arrow-icon"></i>
		</label>
		<div>
			<ul>
				<li v-for="item in list">
					<RouterLink :to="{ name: 'plan', params: { mode: 'o', id: item.id } }">
						<span>{{ item.name }}</span>
					</RouterLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.menu {
		label {
			display: flex;
			align-items: center;
			height: 40px;
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
			i:last-of-type {
				transition: rotate 0.2s ease-in-out;
			}
		}
		div {
			display: grid;
			grid-template-rows: 0;
			transition: 0.2s grid-template-rows;
			> ul {
				overflow: hidden;
			}
			ul {
				list-style: none;
				li {
					&:not(:last-of-type) {
						margin-bottom: 0.125rem;
					}
					a {
						height: 40px;
						padding-left: 0.5rem;
						display: flex;
						align-items: center;
						width: 100%;
						text-decoration: none;
						color: var(--sb-text);
						&.router-link-active,
						&:hover {
							background-color: var(--bg-sidebar-hover);
							color: var(--tt-text);
							border-radius: 6px;
						}
					}
				}
			}
		}
	}
	input[name='menu'] {
		display: none;
		&:checked + .menu {
			label i:last-of-type {
				rotate: 90deg;
				transition: 0.4s rotate 0.2s;
			}
			div {
				grid-template-rows: 1fr;
				transition: 0.4s grid-template-rows 0.2s;
			}
		}
	}
</style>
