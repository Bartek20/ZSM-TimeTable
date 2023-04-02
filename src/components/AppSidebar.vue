<script setup>
	import SidebarHeader from '@/components/SidebarHeader.vue';
	import SidebarMenu from '@/components/SidebarMenu.vue';
	import SidebarFooter from '@/components/SidebarFooter.vue';
	import { usePlansStore } from '@/stores/plans';

	import { createPopper } from '@popperjs/core';
	import { computed, onMounted, onUpdated } from 'vue';
	const plansStore = usePlansStore();
	const list = computed(() => plansStore.lists);

	var updatePoppersTimeout;
	const ANIMATION_DURATION = 300;
	const slideUp = (target, duration = ANIMATION_DURATION) => {
		const { parentElement } = target;
		parentElement.classList.remove('open');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = `${duration}ms`;
		target.style.boxSizing = 'border-box';
		target.style.height = `${target.offsetHeight}px`;
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		window.setTimeout(() => {
			target.style.display = 'none';
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
		}, duration);
	};
	const slideDown = (target, duration = ANIMATION_DURATION) => {
		const { parentElement } = target;
		parentElement.classList.add('open');
		target.style.removeProperty('display');
		let { display } = window.getComputedStyle(target);
		if (display === 'none') display = 'block';
		target.style.display = display;
		const height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.boxSizing = 'border-box';
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = `${duration}ms`;
		target.style.height = `${height}px`;
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		window.setTimeout(() => {
			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
		}, duration);
	};
	const slideToggle = (target, duration = ANIMATION_DURATION) => {
		if (window.getComputedStyle(target).display === 'none') return slideDown(target, duration);
		return slideUp(target, duration);
	};
	class PopperObject {
		instance = null;
		reference = null;
		popperTarget = null;
		constructor(reference, popperTarget) {
			this.init(reference, popperTarget);
		}
		init(reference, popperTarget) {
			this.reference = reference;
			this.popperTarget = popperTarget;
			this.instance = createPopper(this.reference, this.popperTarget, {
				placement: 'right',
				strategy: 'fixed',
				resize: true,
				modifiers: [
					{
						name: 'computeStyles',
						options: {
							adaptive: false,
						},
					},
					{
						name: 'flip',
						options: {
							fallbackPlacements: ['left', 'right'],
						},
					},
				],
			});
			const ro = new ResizeObserver(() => {
				this.instance.update();
			});
			ro.observe(this.popperTarget);
			ro.observe(this.reference);
		}
		hide() {
			this.instance.state.elements.popper.style.visibility = 'hidden';
		}
	}
	function sidebarSetup() {
		const SUB_MENU_ELS = document.querySelectorAll('.menu > ul > .menu-item.sub-menu');
		const FIRST_SUB_MENUS_BTN = document.querySelectorAll('.menu > ul > .menu-item.sub-menu > a');
		class Poppers {
			subMenuPoppers = [];
			constructor() {
				this.init();
			}
			init() {
				SUB_MENU_ELS.forEach((element) => {
					this.subMenuPoppers.push(new PopperObject(element, element.lastElementChild));
					this.closePoppers();
				});
			}
			togglePopper(target) {
				if (window.getComputedStyle(target).visibility === 'hidden') target.style.visibility = 'visible';
				else target.style.visibility = 'hidden';
			}
			updatePoppers() {
				this.subMenuPoppers.forEach((element) => {
					element.instance.state.elements.popper.style.display = 'none';
					element.instance.update();
				});
			}
			closePoppers() {
				this.subMenuPoppers.forEach((element) => {
					element.hide();
				});
			}
		}
		const PoppersInstance = new Poppers();
		updatePoppersTimeout = () => {
			setTimeout(() => {
				PoppersInstance.updatePoppers();
			}, ANIMATION_DURATION);
		};
		FIRST_SUB_MENUS_BTN.forEach((element) => {
			element.addEventListener('click', () => {
				const parentMenu = element.closest('.menu.open-current-submenu');
				if (parentMenu)
					parentMenu
						.querySelectorAll(':scope > ul > .menu-item.sub-menu > a')
						.forEach((el) => window.getComputedStyle(el.nextElementSibling).display !== 'none' && slideUp(el.nextElementSibling));
				slideToggle(element.nextElementSibling);
			});
		});
	}
	onMounted(sidebarSetup);
	onUpdated(sidebarSetup);
	function sidebarClose() {
		const el = document.getElementById('sidebar');
		if (el) {
			el.classList.toggle('toggled');
		}
	}
	await plansStore.loadList()
</script>

<template>
	<section id="sidebar">
		<div class="sb-btn-close" @click="sidebarClose"><i class="menu zsm-close-icon"></i></div>
		<div class="image-wrapper">
			<img src="/assets/images/sidebar-bg.jpg" alt="" />
		</div>
		<div class="sidebar-layout">
			<SidebarHeader logo="/assets/images/logo.png" />
			<div class="sidebar-content">
				<nav class="menu open-current-submenu">
					<ul>
						<SidebarMenu id="o" symbol="zsm-student-icon" name="Klasy" :list="list.classes" />
						<SidebarMenu id="n" symbol="zsm-teacher-icon" name="Nauczyciele" :list="list.teachers" />
						<SidebarMenu id="s" symbol="zsm-room-icon" name="Sale" :list="list.rooms" />
					</ul>
				</nav>
			</div>
			<SidebarFooter />
		</div>
	</section>
	<section id="overlay" @click="sidebarClose"></section>
</template>

<style lang="scss">
	$bg-color: #0c1e35;
	$sidebar-width: 240px;
	#sidebar {
		color: #7d84ab;
		overflow-x: hidden !important;
		width: $sidebar-width;
		position: fixed;
		top: 0;
		left: 0;
		min-height: 100%;
		max-height: 100%;
		height: 100%;
		transition: left 0.3s;
		z-index: 10;
		@media (max-width: 991.98px) {
			&:not(.toggled) {
				left: -#{$sidebar-width};
			}
		}
		.sb-btn-close {
			display: none;
			right: 8px;
			top: 8px;
			position: absolute;
			font-size: 32px;
			z-index: 100;
			@media (max-width: 991.98px) {
				display: block;
			}
		}
		.image-wrapper {
			overflow: hidden;
			position: absolute;
			inset: 0;
			z-index: 3;
			background-color: $bg-color;
			> img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				object-position: center;
			}
		}
		.sidebar-layout {
			min-height: 100%;
			max-height: 100%;
			display: flex;
			flex-direction: column;
			position: relative;
			background-color: rgba($bg-color, 0.7);
			z-index: 5;
			.sidebar-content {
				flex-grow: 1;
				margin: 10px 0;
				overflow-y: auto;
				&::-webkit-scrollbar-thumb {
					border-radius: 4px;
				}
				&:hover {
					&::-webkit-scrollbar-thumb {
						background-color: lighten($bg-color, 15);
					}
				}
				&::-webkit-scrollbar {
					width: 6px;
					background-color: $bg-color;
				}
			}
		}
	}
	#overlay {
		position: fixed;
		inset: 0;
		z-index: -999;
	}
	#sidebar.toggled + #overlay {
		z-index: 1;
	}
</style>
