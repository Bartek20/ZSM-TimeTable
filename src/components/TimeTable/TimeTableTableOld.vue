<script setup lang="js">
	import appData from '@/stores/data';
	import appConfigs from '@/stores/configs';
	 const props = defineProps({
		data: {
			type: Array,
			required: true,
		},
	});

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



	const TIME = useDateFormat(useNow({ interval: 100 }), 'd;HH:mm', {
		locales: 'pl-PL',
	});
	const currentDay = ref(-1);
	const currentLesson = ref(-1);
	watch(
		[TIME, () => props.data],
		() => {
			const timeData = TIME.value.split(';');
			currentDay.value = parseInt(timeData[0]) - 1;
			currentLesson.value = -1;
			props.data.forEach((row) => {
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
</script>

<template>
	<table class="timetable__old" border="1" cellspacing="0" cellpadding="4">
		<thead>
			<tr>
				<th>#</th>
				<th>Czas</th>
				<th v-for="day in ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek']">
					{{ day }}
				</th>
			</tr>
		</thead>
		<tbody>
			<template v-for="row in data">
				<tr>
					<th class="nrOld">{{ row.nr }}</th>
					<td class="timeOld">{{ row.hours.from }}-{{ row.hours.to }}</td>
					<td class="lessonOld" v-for="(day, i) in row.lessons">
						<div :class="{ current: appConfigs.showCurrent && day.length > 0 && currentLesson == row.nr && currentDay == i }">
							<TimeTableLessonOld v-for="lesson in day" :data="lesson" />
						</div>
					</td>
				</tr>
				<tr v-if="appConfigs.showBreaks && row.break != 0" :class="{ current: appConfigs.showCurrent && currentLesson == row.nr + 'break' }">
					<th></th>
					<td colspan="6" class="timetable__old__break lessonOld">
						{{ `Przerwa ${row.break}-minutowa` }}
					</td>
				</tr>
			</template>
		</tbody>
	</table>
</template>

<style lang="scss">
	.timetable__old {
		margin-inline: auto;
		padding-inline: 10px;
		border-color: #c0c0c0;
		border-width: 0;
		th {
			background-color: #e1e6f5;
			color: #2e448f;
			font-size: 13px;
			&.nrOld {
				background-color: #e1e6f5;
				color: #2e448f;
				font-weight: bold;
				text-align: center;
				vertical-align: middle;
				padding: 3px;
			}
		}
		td {
			font-size: 11px;
			&.timeOld {
				background-color: #f0f2fa;
				color: #2e448f;
				font-weight: bold;
				vertical-align: middle;
				text-align: center;
				white-space: nowrap;
				padding: 3px;
			}
			&.lessonOld {
				background-color: #ffffff;
				color: #000000;
				vertical-align: top;
				padding: 3px;
			}
		}
		&__break {
			text-align: center;
		}
	}
</style>
