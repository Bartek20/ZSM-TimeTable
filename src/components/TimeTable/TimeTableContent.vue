<script setup>
	const TimeTableTable = defineAsyncComponent(() => import('@/components/TimeTable/TimeTableTable.vue'))
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
	import appConfigs from '@/stores/configs';
	import loadTimeTable from '@/functions/fetchTimeTable';

	await loadTimeTable(appConfigs.value.currentTimeTable.mode, appConfigs.value.currentTimeTable.id);
</script>

<template>
	<div class="timetable">
		<TimeTableMessage v-if="message" :icon="message.icon" :text="message.msg" />
		<TimeTableTable v-else />
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
</style>
