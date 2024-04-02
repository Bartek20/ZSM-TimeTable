<script setup>
	defineProps({
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
		mode: {
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
		if (element.tagName !== 'LABEL') element = element.parentElement;
		if (element.tagName !== 'LABEL') element = element.parentElement;
		if (!document.querySelector('.sidebar__menu--checkbox:checked')) element.parentElement.classList.add('only');
		element = element.control;
		element.checked = !element.checked;
	}
	function transitioned(e) {
		e.target.parentElement.classList.remove('only');
	}
</script>

<template>
	<input class="sidebar__menu--checkbox" type="radio" name="menu" :id="id" v-if="list.length > 0" />
	<div class="sidebar__menu" v-if="list.length > 0">
		<label class="sidebar__menu__label" @click="changeMenu" :for="id">
			<i class="sidebar__menu__label__icon" :class="icon"></i>
			<span class="sidebar__menu__label__text">{{ name }}</span>
			<i class="sidebar__menu__label__arrow zsm-arrow-icon"></i>
		</label>
		<div class="sidebar__menu__list" @transitionend="transitioned">
			<ul class="sidebar__menu__list__container">
				<li class="sidebar__menu__list__container__item" v-for="item in list">
					<RouterLink class="sidebar__menu__list__container__item__link" :to="{ name: 'plan', params: { mode: mode, id: item.id } }">
						<span class="sidebar__menu__list__container__item__link__text">{{ item.name }}</span>
					</RouterLink>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="scss">
	$extend-time: 0.4s;
	$compress-time: 0.2s;
	.sidebar__menu {
		&__label {
			display: flex;
			align-items: center;
			height: 40px;
			cursor: pointer;
			&__icon,
			&__arrow {
				display: block;
				font-size: 20px;
				min-width: 40px;
				text-align: center;
			}
			&__text {
				width: 100%;
			}
			&__arrow {
				transition: rotate $compress-time ease-in-out;
				min-width: 24px;
			}
		}
		&__list {
			display: grid;
			grid-template-rows: 0;
			transition: $compress-time grid-template-rows;
			&__container {
				overflow: hidden;
				list-style: none;
				&__item {
					&:not(:last-of-type) {
						margin-bottom: 0.125rem;
					}
					&__link {
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
						&__text {
							white-space: nowrap;
							overflow: hidden;
						}
					}
				}
			}
		}
	}
	.sidebar__menu--checkbox {
		display: none;
		&:checked + .sidebar__menu {
			.sidebar__menu__label__arrow,
			.sidebar__menu__list {
				transition-delay: $compress-time;
				transition-duration: $extend-time;
			}
			&.only {
				.sidebar__menu__label__arrow,
				.sidebar__menu__list {
					transition-delay: 0s;
				}
			}
			.sidebar__menu__label__arrow {
				rotate: 90deg;
				transition-property: rotate;
			}
			.sidebar__menu__list {
				grid-template-rows: 1fr;
				transition-property: grid-template-rows;
			}
		}
	}
</style>
