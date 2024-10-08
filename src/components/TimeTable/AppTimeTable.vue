<script setup>
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';
	const mode = useRouteParams('mode');
	const message = computed(() => {
		switch (appData.timetable.value.status) {
			case 'FETCHING':
				return {
					icon: 'zsm-loading-icon loading',
					msg: 'Trwa wczytywanie planu lekcji',
				};
			case 'NOT_FOUND':
				return {
					icon: 'zsm-not-found-icon',
					msg: 'Wybrany plan nie został odnaleziony',
				};
			case 'UNKNOWN':
				return {
					icon: 'zsm-error-icon',
					msg: 'Wystąpił nieznany błąd. Skontaktuj się z twórcą aplikacji.',
				};
			case 'CORS_ERROR':
				return {
					icon: 'zsm-error-icon',
					msg: 'Pobieranie planu nie powiodło się. Wystąpił błąd po stronie serwera.',
				};
			case 'OFFLINE':
				return {
					icon: 'zsm-offline-icon',
					msg: 'Pobieranie planu nie powiodło się. Najprawdopodobniej jesteś offline.',
				};
			case 'OK':
				if (appData.timetable.value.hours.length === 0) {
					const MESSAGES = {
						o: 'Wybrana klasa nie ma w planie żadnych zajęć',
						n: 'Wybrany nauczyciel nie ma w planie żadnych lekcji',
						s: 'W wybranej sali nie ma żadnych lekcji',
					};
					return {
						icon: 'zsm-empty-icon',
						msg: MESSAGES[mode.value],
					};
				}
				return undefined;
			default:
				return {
					icon: 'zsm-error-icon',
					msg: 'Wystąpił nieznany błąd. Skontaktuj się z twórcą aplikacji.',
				};
		}
	});

	const DAY = useDateFormat(useNow({interval: 3600000}), 'd', {
		locales: 'pl-PL',
	});
	const activeDay = ref(DAY.value === '6' || DAY.value === '0' ? 0 : parseInt(DAY.value) - 1);
	function changeDay(dir) {
		if (dir) activeDay.value === 4 ? (activeDay.value = 0) : (activeDay.value += 1);
		else activeDay.value === 0 ? (activeDay.value = 4) : (activeDay.value -= 1);
		document.querySelector('.timetable').scrollTo({
			top: 0,
			behavior: 'instant',
		});
	}
</script>

<template>
	<main
		class="timetable"
		:class="{
			'timetable--forced': appConfigs.user.forceTablet,
			'timetable--old': appConfigs.user.viewMode === 'old',
		}">
		<TimeTableHeader />
		<Suspense :timeout="0">
			<TimeTableContent :activeDay="activeDay" :message="message" />
			<template #fallback>
				<TimeTableMessage icon="zsm-loading-icon loading" text="Trwa wczytywanie planu lekcji" />
			</template>
		</Suspense>
		<div class="timetable__controls" v-if="!appConfigs.user.forceTablet && appConfigs.user.viewMode === 'new' && !message">
			<div class="timetable__controls__button" @click="changeDay(0)">&lt; Poprzedni</div>
			<div class="timetable__controls__button" @click="changeDay(1)">Następny &gt;</div>
		</div>
	</main>
</template>

<style lang="scss">
	.timetable {
		font-family: 'Roboto', sans-serif;
		display: grid;
		height: 100%;
		max-height: 100%;
		min-height: 100%;
		grid-template-rows: $header-height 1fr;
		background-color: var(--bg-timetable);

		@include phone {
			&:not(&--forced):not(&--old) {
				grid-template-rows: $header-height 1fr 48px;
			}
		}

		@include printer {
			grid-template-rows: 1fr;
		}

		&__controls {
			display: none;
			align-items: center;
			justify-items: center;
			font-size: 1.4rem;
			white-space: nowrap;
			color: var(--tt-text);

			@include phone {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 10px;
			}

			&__button {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
			}
		}
	}
</style>
