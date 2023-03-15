<script setup>
	import TimeTableRow from '@/components/TimeTableRow.vue';
	import TimeTableTitle from '@/components/TimeTableTitle.vue';
	import { computed, onBeforeUnmount, onMounted } from 'vue';
	import { usePlansStore } from '@/stores/plans';
	import { useTimeStore } from '@/stores/time';
	const plansStore = usePlansStore();
	const timeStore = useTimeStore();
	timeStore.getTime();
	const props = defineProps({
		print: {
			type: Boolean,
			required: false,
			default: false,
		},
		id: {
			type: String,
			required: false,
		},
	});
	var ready = false;
	const plan = computed(() => {
		const e = props.print ? props.id : plansStore.selected;
		const mode = e.charAt(0);
		const id = e.replace(mode, '');
		var res = plansStore.plans[mode][id];
		if (res == undefined) {
			plansStore.getPlan(mode, id).then(() => {
				res = plansStore.plans[mode][id];
			});
		}
		ready = true;
		return res == undefined ? {} : res;
	});
	const mode = computed(() => {
		const e = props.print ? props.id : plansStore.selected;
		return e.charAt(0);
	});
	const currentLesson = computed(() => {
		const current = timeStore.TIME;
		var response = 999;
		Object.keys(plan.value.hours).forEach((lesson) => {
			const obj = plan.value.hours[lesson];
			if (timeStore.checkBetween(obj.timeFrom, obj.timeTo)) response = obj.number;
		});
		return response;
	});
	const currentDay = computed(() => timeStore.DAY);
	if (props.print) {
		const timer = window.setInterval(print, 1000);
		function print() {
			if (ready) {
				window.clearInterval(timer);
				window.print();
			}
		}
	}
	var timer = undefined;
	onMounted(() => {
		timer = window.setInterval(timeStore.getTime, 1000);
	});
	onBeforeUnmount(() => {
		window.clearInterval(timer);
	});
	function calcBreak(start, end) {
		if (start == undefined || end == undefined) return 0;
		const start_el = start.timeTo.split(':');
		const start_time = new Date();
		start_time.setHours(start_el[0], start_el[1], 0, 0);
		const end_el = end.timeFrom.split(':');
		const end_time = new Date();
		end_time.setHours(end_el[0], end_el[1], 0, 0);
		return (end_time - start_time) / 1000 / 60;
	}
	function checkBreak(start, end) {
		if (start == undefined || end == undefined) return false;
		return timeStore.checkBetween(start.timeTo, end.timeFrom);
	}
</script>

<template>
	<section id="timetable" :class="{ 'sidebar-open': !print }">
		<TimeTableTitle :title="plan.title" :id="print ? id : plansStore.selected" />
		<div class="table-responsive">
			<table class="table table-primary table-striped table-hover mb-0" :class="{ 'table-sm': print, 'table-responsive': !print }">
				<thead>
					<tr>
						<th scope="col" class="text-center">#</th>
						<th scope="col" class="text-center">Czas</th>
						<th scope="col" class="text-center">Poniedziałek</th>
						<th scope="col" class="text-center">Wtorek</th>
						<th scope="col" class="text-center">Środa</th>
						<th scope="col" class="text-center">Czwartek</th>
						<th scope="col" class="text-center">Piątek</th>
					</tr>
				</thead>
				<tbody>
					<TimeTableRow
						@changePlan="plansStore.setTimeTable"
						v-for="(row, i) in plan.days"
						:mode="mode"
						:hours="plan.hours[i]"
						:lessons="row"
						:currentDay="currentDay"
						:currentLesson="currentLesson"
						:breakTime="calcBreak(plan.hours[i], plan.hours[i + 1])"
						:currentBreak="checkBreak(plan.hours[i], plan.hours[i + 1])" />
				</tbody>
			</table>
		</div>
	</section>
</template>

<style lang="scss">
	#timetable {
		width: 100%;
		&.sidebar-open {
			padding-left: 240px;
		}
		table {
			tr {
				> th {
					min-width: auto;
				}
				> td {
					min-width: 180px;
					&.time {
						min-width: auto;
					}
				}
			}
		}
	}
</style>
