<script setup>
	import parseName from '@/functions/parseName';
	import setTitle from '@/functions/setTitle';
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';
	function openSidebar() {
		document.querySelector('aside.sidebar')?.classList.add('open');
		document.querySelector('.overlay')?.classList.add('overlay--sidebar');
	}
	function openConfigs() {
		document.querySelector('aside.configs')?.classList.add('open');
		document.querySelector('.overlay')?.classList.add('overlay--configs');
	}

	const mode = useRouteParams('mode');

	const title = computed(() => {
		const MODES = {
			o: 'classes',
			n: 'teachers',
			s: 'rooms',
		};
		const name = appData.timetable.value.title;
		if (!name) {
			switch (appData.timetable.value.status) {
				case 0:
					return;
				case 404:
					setTitle('Wybrany plan nie został odnaleziony.');
					return;
				case 500:
					setTitle('Wystąpił nieznany błąd.');
					return;
				case 900:
					setTitle('Pobieranie planu nie powiodło się.');
					return;
			}
		}
		if (!appConfigs.value.database[MODES[mode.value]][name]) parseName(mode.value, name);
		setTitle(appConfigs.value.database[MODES[mode.value]]?.[name]?.title ?? name);
		return appConfigs.value.database[MODES[mode.value]]?.[name]?.heading ?? name;
	});
	const headEl = ref(null);
	const { width: headElSize } = useElementSize(headEl);
	const titleEl = ref(null);
	const { width: titleElSize } = useElementSize(titleEl);
	const marquee = computed(() => {
		if (!headElSize.value) return false;
		if (!titleElSize.value) return false;
		if (titleElSize.value > headElSize.value) return true;
		return false;
	});
</script>

<template>
	<div class="timetable__header">
		<div
			class="timetable__header__button timetable__header__button--list"
			@click="openSidebar"
			v-tooltip.right="{ content: 'Lista', distance: 8, delay: { show: 300, hide: 0 }, triggers: ['hover'] }">
			<div>
				<i class="timetable__header__button__icon zsm-menu-icon"></i>
			</div>
		</div>
		<div ref="headEl" class="timetable__header__title" :class="{ noscroll: !marquee }">
			<h3 ref="titleEl" :class="{ marquee: marquee }">{{ title }}</h3>
			<h3 v-show="marquee" :class="{ marquee: marquee }">{{ title }}</h3>
		</div>
		<div
			class="timetable__header__button timetable__header__button--config"
			@click="openConfigs"
			v-tooltip.left="{ content: 'Ustawienia', distance: 8, delay: { show: 300, hide: 0 }, triggers: ['hover'] }">
			<div>
				<i class="timetable__header__button__icon zsm-settings-icon"></i>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	$icon: 48px;
	.timetable__header {
		--padding: 1rem;
		display: grid;
		grid-template-columns: 1fr $icon;
		@include tablet {
			grid-template-columns: $icon 1fr $icon;
		}
		@include printer {
			grid-template-columns: 1fr;
		}
		gap: var(--padding);
		color: var(--tt-text);
		&__button {
			display: flex;
			cursor: pointer;
			@include printer {
				display: none;
			}
			align-items: center;
			justify-content: center;
			&--list {
				display: none;
				@include tablet {
					display: flex;
				}
			}
			&__icon {
				font-size: 2.3rem;
			}
		}
		&__title {
			font-size: 1.5rem;
			display: flex;
			align-items: center;
			overflow: hidden;
			gap: 5rem;
			margin-left: var(--padding);
			@include tablet {
				margin-left: 0;
			}
			@include printer {
				margin-left: 0;
			}
			h3 {
				margin: 0;
				white-space: nowrap;
				@include printer {
					text-align: center;
				}
			}
			.marquee {
				animation: marquee 10s linear infinite;
				@include printer {
					animation: none;
					&:last-of-type {
						display: none;
					}
				}
			}
			&.noscroll {
				justify-content: center;
			}
		}
	}
</style>
