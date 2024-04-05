<script setup>
	defineProps({
		activeDay: {
			type: Number,
			required: true,
		},
		message: {
			type: Object,
			required: false,
		},
	});
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';
	import loadTimeTable from '@/functions/fetchTimeTable';

	const mode = useRouteParams('mode');
	const id = useRouteParams('id');

	await loadTimeTable(mode.value, id.value);
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
		const src = appData.timetable.value;
		const shortHours =
			appData.timetable.value.hours?.map((hour) => {
				return appConfigs.value.timetable.shortLessons[hour.number];
			}) || [];
		const hours = appConfigs.value.shortLessons && src.hours?.length === shortHours.length ? shortHours : src.hours;
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
</script>

<template>
	<TimeTableMessage v-if="message" :icon="message.icon" :text="message.msg" />
	<div class="timetable__container" v-else>
		<TimeTableTable :data="data" :activeDay="activeDay" />
	</div>
</template>

<style lang="scss">
	.timetable__container {
		height: 100%;
		max-height: 100%;
		min-height: 100%;
		position: relative;
		overflow: auto;
		@include printer {
			overflow: visible;
		}
	}
</style>
