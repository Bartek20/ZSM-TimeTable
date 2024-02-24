<script setup>
	const props = defineProps({
		activeDay: {
			type: Number,
			required: true,
		},
		message: {
			type: Object,
			required: false,
		},
	});
	import loadTimeTable from '@/functions/fetchTimeTable';
	import appData from '@/stores/data';
	import appConfigs from '@/stores/configs';

	function calcBreak(from, to) {
		if (!from || !to) return 0;
		const start_el = from.split(':');
		const start_time = new Date();
		start_time.setHours(start_el[0], start_el[1], 0, 0);
		const end_el = to.split(':');
		const end_time = new Date();
		end_time.setHours(end_el[0], end_el[1], 0, 0);
		return (end_time - start_time) / 1000 / 60;
	}
	function addTime(clock, time) {
		const padClock = (part) => (part < 10 ? '0' + part : part);
		if (!clock || !time) return undefined;
		const [hour, minute] = clock.split(':');
		const date = new Date();
		date.setHours(hour, minute, 0, 0);
		date.setTime(date.getTime() + time * 60000);
		return padClock(date.getHours()) + ':' + padClock(date.getMinutes());
	}
	function checkBetween(from, to) {
		if (!from || !to) return false;
		const current = new Date();
		const sTime = new Date();
		const eTime = new Date();
		const startTime = from.split(':');
		const endTime = to.split(':');
		sTime.setHours(startTime[0], startTime[1], 0, 0);
		eTime.setHours(endTime[0], endTime[1] - 1, 59, 999);
		return current >= sTime && current <= eTime;
	}

	const data = computed(() => {
		const src = appData.value.timetable;
		const shortHours =
			appData.value.timetable.hours?.map((hour) => {
				return appConfigs.value.timetable.shortLessons[hour.number];
			}) || [];
		const hours = appConfigs.value.shortLessons && src.hours.length == shortHours.length ? shortHours : src.hours;
		let out = [];
		const rows = hours?.length || 0;
		for (let i = 0; i < rows; i++) {
			out.push({
				nr: hours[i].number,
				hours: {
					from: hours[i].timeFrom,
					to: hours[i].timeTo,
				},
				break: calcBreak(hours[i]?.timeTo, hours[i + 1]?.timeFrom),
				lessons: {
					0: src.days[0][i],
					1: src.days[1][i],
					2: src.days[2][i],
					3: src.days[3][i],
					4: src.days[4][i],
				},
			});
		}
		return out;
	});
	const TIME = useDateFormat(useNow({ interval: 100 }), 'd;HH:mm', {
		locales: 'pl-PL',
	});
	const currentDay = ref(-1);
	const currentLesson = ref(-1);
	watch(
		[TIME, data],
		() => {
			const timeData = TIME.value.split(';');
			currentDay.value = parseInt(timeData[0]) - 1;
			currentLesson.value = -1;
			data.value.forEach((row) => {
				if (checkBetween(row.hours.from, row.hours.to)) {
					currentLesson.value = row.nr;
					return;
				}
				if (checkBetween(row.hours.to, addTime(row.hours.to, row.break))) {
					currentLesson.value = row.nr + 'break';
					return;
				}
			});
		},
		{ immediate: true }
	);
	await loadTimeTable(appConfigs.value.currentTimeTable.mode, appConfigs.value.currentTimeTable.id);
</script>

<template>
	<div class="timetable">
		<TimeTableMessage v-if="message" :icon="message.icon" :text="message.msg" />
		<table class="timetableTable" v-else>
			<thead>
				<tr>
					<th>#</th>
					<th>Czas</th>
					<th :class="{ active: appConfigs.forceTablet || activeDay == i }" v-for="(day, i) in ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek']">
						{{ day }}
					</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="row in data">
					<tr>
						<th>{{ row.nr }}</th>
						<td>{{ row.hours.from }}<br />-<br />{{ row.hours.to }}</td>
						<td :class="{ active: appConfigs.forceTablet || activeDay == i }" v-for="(day, i) in row.lessons">
							<div :class="{ current: appConfigs.showCurrent && currentLesson == row.nr && currentDay == i }">
								<TimeTableLesson v-for="lesson in day" :data="lesson" />
							</div>
						</td>
					</tr>
					<tr v-if="appConfigs.showBreaks && row.break != 0">
						<th></th>
						<td
							colspan="6"
							:class="{ active: appConfigs.forceTablet || activeDay == currentDay, current: appConfigs.showCurrent && currentLesson == row.nr + 'break' }">
							{{ `Przerwa ${row.break}-minutowa` }}
						</td>
					</tr>
				</template>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scoped>
	.timetable {
		height: 100%;
		max-height: 100%;
		min-height: 100%;
		position: relative;
		overflow: auto;
		@include printer {
			overflow: visible;
		}
	}
	table {
		width: 100%;
		border-collapse: collapse;
		color: var(--tt-text);
		th,
		td {
			padding: 0.5rem;
			text-align: center;
		}
		@include phone {
			th:not(:nth-child(1)):not(:nth-child(2)):not(.active),
			td:not(:first-of-type):not(.active) {
				display: none;
			}
		}
		thead {
			position: relative;
			text-align: center;
			th {
				background-color: var(--tt-primary);
				position: sticky;
				top: 0;
				z-index: 2;
			}
			th:nth-child(1) {
				left: 0;
				z-index: 3;
			}
			th:nth-child(1),
			th:nth-child(2) {
				max-width: min-content;
			}
		}
		tbody {
			th {
				position: sticky;
				left: 0;
				z-index: 2;
			}
			tr {
				break-inside: avoid;
			}
			tr:nth-child(even) > * {
				background-color: var(--tt-primary);
			}
			tr:nth-child(odd) > * {
				background-color: var(--tt-secondary);
			}
			th,
			td:nth-child(2) {
				max-width: fit-content;
				text-align: center;
			}
			td:first-child:last-child {
				&.current {
					animation: blink 2s linear infinite;
				}
				@include phone {
					&:not(.active) {
						animation: none;
					}
				}
			}
			td > div {
				margin: -0.5rem;
				padding: 0.5rem;
				&.current {
					border-radius: 0.5rem;
					animation: blink 2s linear infinite;
				}
			}
		}
	}
</style>
