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

	const data = computed(() => {
		const src = appData.value.timetable;
		let out = [];
		const rows = src.hours?.length || 0;
		for (let i = 0; i < rows; i++) {
			out.push({
				nr: src.hours[i].number,
				hours: {
					from: src.hours[i].timeFrom,
					to: src.hours[i].timeTo,
				},
				break: calcBreak(src.hours[i]?.timeTo, src.hours[i + 1]?.timeFrom),
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
	await loadTimeTable(appConfigs.value.currentTimeTable.mode, appConfigs.value.currentTimeTable.id);
</script>

<template>
	<div class="timetable">
		<TimeTableMessage v-if="message" :icon="message.icon" :text="message.msg" />
		<table v-else>
			<thead>
				<tr>
					<th class="z-2 position-sticky top-0 start-0">#</th>
					<th class="z-1 position-sticky top-0">Czas</th>
					<th
						class="z-1 position-sticky top-0"
						:class="{ active: appConfigs.forceTablet || activeDay == i }"
						v-for="(day, i) in ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek']">
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
							<TimeTableLesson v-for="lesson in day" :data="lesson" />
						</td>
					</tr>
					<tr v-if="row.break != 0">
						<td colspan="7">{{ `Przerwa ${row.break}-minutowa` }}</td>
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
				z-index: 1;
			}
			th:nth-child(1) {
				left: 0;
				z-index: 2;
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
				z-index: 1;
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
		}
	}
</style>
