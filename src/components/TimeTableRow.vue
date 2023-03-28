<script setup>
	import { MESSAGES } from '../functions/constants';
	import TimeTableCell from '@/components/TimeTableCell.vue';
	const props = defineProps({
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
		isEmpty: {
			type: Boolean,
			required: true,
		},
	});
	const emits = defineEmits(['changePlan']);
</script>

<template>
	<tr v-if="!isEmpty">
		<th scope="row">
			{{ hours.number }}
		</th>
		<td>
			{{ hours.timeFrom + ' - ' + hours.timeTo }}
		</td>
		<td v-for="(lesson, i) in lessons">
			<div class="cell" :class="{ current: currentLesson == hours.number && currentDay == i && lesson.length != 0 }">
				<TimeTableCell @changePlan="(mode, id) => $emit('changePlan', mode, id)" :mode="mode" :data="lesson" />
			</div>
		</td>
	</tr>
	<tr v-if="!isEmpty && breakTime != 0">
		<td colspan="7" :class="{ current: currentBreak }">
			{{ 'Przerwa ' + breakTime + '-minutowa' }}
		</td>
	</tr>
	<tr v-if="isEmpty">
		<td colspan="7" class="msg">
			<div>
				<i class="zsm-empty-icon"></i>
				<h5>{{ MESSAGES.EMPTY[mode] }}</h5>
			</div>
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
		.msg div {
			width: 100%;
			height: 100%;
			text-align: center;
			i {
				font-size: 48px;
				padding: 25px;
			}
			h5 {
				margin-top: 10px;
			}
		}
	}
</style>
