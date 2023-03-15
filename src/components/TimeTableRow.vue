<script setup>
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
	});
	const emits = defineEmits(['changePlan']);
</script>

<template>
	<tr>
		<th scope="row" class="text-center align-middle">
			{{ hours.number }}
		</th>
		<td class="time text-center text-nowrap align-middle">
			{{ hours.timeFrom + ' - ' + hours.timeTo }}
		</td>
		<td v-for="(lesson, i) in lessons" class="align-middle" :class="{ 'bg-info': currentLesson == hours.number && currentDay == i && lesson.length != 0 }">
			<TimeTableCell @changePlan="(mode, id) => $emit('changePlan', mode, id)" :mode="mode" :data="lesson" />
		</td>
	</tr>
	<tr v-if="breakTime != 0">
		<th class="text-center" :class="{ 'bg-info': currentBreak }">-</th>
		<td colspan="6" class="text-center" :class="{ 'bg-info': currentBreak }">
			{{ 'Przerwa ' + breakTime + '-minutowa' }}
		</td>
	</tr>
</template>

<style lang="scss">
	td.bg-info {
		box-shadow: none;
	}
</style>
