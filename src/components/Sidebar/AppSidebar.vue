<script setup>
	const list = useStorage('lists', {
		classes: [],
		teachers: [],
		rooms: [],
	});

	const user = useRouteParams('user');

	const SB_ANIMATION_DURATION = 300;

	const slideUp = (target, duration = SB_ANIMATION_DURATION) => {
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
	const slideDown = (target, duration = SB_ANIMATION_DURATION) => {
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
	const slideToggle = (target, duration = SB_ANIMATION_DURATION) => {
		if (window.getComputedStyle(target).display === 'none') return slideDown(target, duration);
		return slideUp(target, duration);
	};
	function selectList(el) {
		var element = el.target;
		if (element.tagName != 'A') element = element.parentElement;
		if (element.tagName != 'A') element = element.parentElement;
		const parentMenu = element.closest('.menu.open-current-submenu');
		if (parentMenu)
			parentMenu
				.querySelectorAll(':scope > ul > .menu-item.sub-menu > a')
				.forEach((el) => window.getComputedStyle(el.nextElementSibling).display !== 'none' && slideUp(el.nextElementSibling));
		slideToggle(element.nextElementSibling);
		document.querySelector('.sidebar-content').scrollTo({
			top: 0,
			behavior: 'instant',
		});
	}
	function sidebarClose() {
		const el = document.getElementById('sidebar');
		if (el) el.classList.toggle('toggled');
	}
	async function loadList() {
		var res;
		try {
			res = await axios.get('/plan_nauczyciele/lista.html');
		} catch (err) {
			console.error('Wystąpił błąd przy wczytywaniu listy:\n', err);
			return;
		}
		if (res == undefined) return;
		const TTList = new TimeTableList(res.data);
		list.value = TTList.getList();
	}
	await loadList();
</script>

<template>
	<section id="sidebar" class="z-4 minh-100 mh-100 h-100 position-relative overflow-x-hidden">
		<div class="sb-btn-close position-absolute z-7 d-none" @click="sidebarClose">
			<i class="menu zsm-close-icon"></i>
		</div>
		<div class="image-wrapper position-absolute inset-0 overflow-hidden z-5">
			<img class="w-100 h-100 object-fit-cover object-position-center" src="/assets/images/sidebar-bg.jpg" alt="" />
		</div>
		<div class="sidebar-layout z-6 minh-100 mh-100 h-100 d-flex flex-column position-relative">
			<SidebarHeader />
			<div class="sidebar-content flex-grow-1 my-2 overflow-y-auto">
				<nav class="menu open-current-submenu">
					<ul class="m-0 p-0 list-unstyled">
						<SidebarMenu v-if="list.classes.length" @selectList="selectList" id="o" symbol="zsm-student-icon" name="Klasy" :list="list.classes" />
						<SidebarMenu
							v-if="user == 'nauczyciel' && list.teachers.length"
							@selectList="selectList"
							id="n"
							symbol="zsm-teacher-icon"
							name="Nauczyciele"
							:list="list.teachers" />
						<SidebarMenu v-if="list.rooms.length" @selectList="selectList" id="s" symbol="zsm-room-icon" name="Sale" :list="list.rooms" />
					</ul>
				</nav>
			</div>
			<SidebarFooter />
		</div>
	</section>
	<section id="sidebarOverlay" class="z-n1 position-fixed inset-0" @click="sidebarClose"></section>
</template>

<style lang="scss">
	$sidebar-width: 240px;
	#sidebar {
		color: #7d84ab;
		min-width: $sidebar-width;
		max-width: $sidebar-width;
		@media (max-width: 991.98px) {
			transition: left 0.3s;
			position: fixed !important;
			top: 0;
			left: 0;
			&:not(.toggled) {
				left: -#{$sidebar-width};
			}
		}
		.sb-btn-close {
			right: 8px;
			top: 8px;
			font-size: 32px;
			@media (max-width: 991.98px) {
				display: block !important;
			}
		}
		.image-wrapper {
			background-color: #0c1e35;
		}
		.sidebar-layout {
			background-color: rgba(#0c1e35, 0.7);
			.sidebar-content {
				&::-webkit-scrollbar-thumb {
					border-radius: 4px;
				}
				&:hover {
					&::-webkit-scrollbar-thumb {
						background-color: lighten(#0c1e35, 15);
					}
				}
				&::-webkit-scrollbar {
					width: 6px;
					background-color: #0c1e35;
				}
			}
		}
	}
	@media (max-width: 991.98px) {
		#sidebar.toggled + #sidebarOverlay {
			z-index: 3 !important;
			background-color: rgba(0, 0, 0, 0.4);
		}
	}
</style>
