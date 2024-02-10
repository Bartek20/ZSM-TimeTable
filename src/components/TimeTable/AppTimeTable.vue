<script setup>
	import appData from '@/stores/data';
	import appConfigs from '@/stores/configs';
	const message = computed(() => {
		switch (appData.value.timetable.status) {
			case 404:
				return {
					icon: 'zsm-not-found-icon',
					msg: 'Wybrany plan nie został odnaleziony',
				};
			case 500:
				return {
					icon: 'zsm-error-icon',
					msg: 'Wystąpił nieznany błąd. Skontaktuj się z twórcą aplikacji.',
				};
			case 900:
				return {
					icon: 'zsm-offline-icon',
					msg: 'Pobieranie planu nie powiodło się. Najprawdopodobniej jesteś offline.',
				};
			case 200:
				if (appData.value.timetable.hours.length == 0) {
					const MESSAGES = {
						o: 'Wybrana klasa nie ma w planie żadnych zajęć',
						n: 'Wybrany nauczyciel nie ma w planie żadnych lekcji',
						s: 'W wybranej sali nie ma żadnych lekcji',
					};
					return {
						icon: 'zsm-empty-icon',
						msg: MESSAGES[appConfigs.value.currentTimeTable.mode],
					};
				}
				return undefined;
		}
	});

	const DAY = useDateFormat(useNow({ interval: 3600000 }), 'd', {
		locales: 'pl-PL',
	});
	const activeDay = ref(DAY.value > 4 ? 0 : parseInt(DAY.value));
	function changeDay(dir) {
		if (dir) activeDay.value == 4 ? (activeDay.value = 0) : (activeDay.value += 1);
		else activeDay.value == 0 ? (activeDay.value = 4) : (activeDay.value -= 1);
		document.querySelector('.timetable').scrollTo({
			top: 0,
			behavior: 'instant',
		});
	}
</script>

<template>
	<main :class="{ forced: appConfigs.forceTablet }">
		<TimeTableHeader />
		<Suspense :timeout="0">
			<TimeTableContent :activeDay="activeDay" :message="message" />
			<template #fallback>
				<TimeTableMessage icon="zsm-loading-icon loading" text="Trwa wczytywanie planu lekcji" />
			</template>
		</Suspense>
		<div class="controls" v-if="!appConfigs.forceTablet && !message">
			<div @click="changeDay(0)">&lt; Poprzedni</div>
			<div @click="changeDay(1)">Następny &gt;</div>
		</div>
	</main>
</template>

<style lang="scss" scoped>
	main {
		font-family: 'Roboto', sans-serif;
		display: grid;
		height: 100%;
		max-height: 100%;
		min-height: 100%;
		grid-template-rows: $header-height 1fr;
		@include phone {
			&:not(.forced) {
				grid-template-rows: $header-height 1fr 48px;
			}
		}
		background-color: var(--bg-timetable);
		.controls {
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
			div {
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
