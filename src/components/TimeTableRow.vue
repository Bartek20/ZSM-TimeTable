<script setup>
	import TimeTableCell from '@/components/TimeTableCell.vue';
	const props = defineProps({
		device: {
			type: String,
			required: true,
		},
		print: {
			type: Boolean,
			required: true
		},
		mode: {
			type: String,
			required: true,
		},
		hours: {
			type: Object,
			required: true,
		},
		lessons: {
			type: Array,
			required: true,
		},
		selectedDay: {
			type: Number,
			required: true,
		},
		currentDay: {
			type: Number,
			required: true,
		},
		currentLesson: {
			type: Number,
			required: true,
		},
		breakTime: {
			type: Number,
			required: true,
		},
		currentBreak: {
			type: Boolean,
			required: true,
		},
	});
</script>

<template>
	<tr>
		<th scope="row">
			{{ hours.number }}
		</th>
		<td>
			{{ hours.timeFrom + ' - ' + hours.timeTo }}
		</td>
		<td v-if="device == 'PC'" v-for="(lesson, i) in lessons">
			<div class="cell" :class="{ current: currentLesson == hours.number && currentDay == i && lesson.length != 0 }">
				<TimeTableCell :print="print" :mode="mode" :data="lesson" />
			</div>
		</td>
		<td v-else>
			<div class="cell" :class="{ current: currentLesson == hours.number && currentDay == selectedDay && lessons[selectedDay].length != 0 }">
				<TimeTableCell :print="print" :mode="mode" :data="lessons[selectedDay]" />
			</div>
		</td>
	</tr>
	<tr v-if="breakTime != 0">
		<td colspan="7" class="break" :class="{ current: currentBreak && ((device == 'Phone' && currentDay == selectedDay) || device == 'PC') }">
			{{ 'Przerwa ' + breakTime + '-minutowa' }}
		</td>
	</tr>
</template>

<style lang="scss">
	tbody tr {
		th,
		td:first-of-type {
			text-align: center;
			min-width: auto;
		}
		td:not(:first-of-type) {
			min-width: 200px;
		}
		vertical-align: middle;
		white-space: nowrap;
		.cell {
			margin: -8px;
			padding: 8px;
			&.current {
				border-radius: 10px;
				animation: blink 2s linear infinite;
				background-color: rgba(var(--bs-info-rgb), 1);
			}
		}
		.break.current {
			background-color: rgba(var(--bs-info-rgb), 1);
		}
		th[scope='row'] {
			position: sticky;
			left: 0;
		}
		th[colspan='7'] {
			text-align: center;
			position: sticky;
			left: 0;
			right: 0;
		}
	}
</style>
