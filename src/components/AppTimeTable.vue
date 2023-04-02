<script setup>
	import TimeTableRow from '@/components/TimeTableRow.vue';
	import TimeTableTitle from '@/components/TimeTableTitle.vue';
	import TimeTableMessage from './TimeTableMessage.vue';
	import { computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { usePlansStore } from '@/stores/plans';
	import { useTimeStore } from '@/stores/time';
	const router = useRouter();
	const plansStore = usePlansStore();
	const timeStore = useTimeStore();
	timeStore.getTime();
	const props = defineProps({
		print: {
			type: Boolean,
			required: false,
			default: false,
		},
		mode: {
			type: String,
			required: true
		},
		id: {
			type: String,
			required: true,
		},
	});
	if (props.print) {
		const timer = window.setInterval(print, 1000);
		function print() {
			if (plan.value != undefined) {
				window.clearInterval(timer);
				window.print();
			}
		}
	}
	const plan = computed(() => plansStore.plans[props.mode][props.id]);
	const currentLesson = computed(() => {
		const current = timeStore.TIME;
		var response = 999;
		if (props.print) return response;
		plan.value.hours.forEach((lesson) => {
			if (timeStore.checkBetween(lesson.timeFrom, lesson.timeTo)) response = lesson.number;
		});
		return response;
	});
	const currentDay = computed(() => timeStore.DAY);
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
		if (props.print || start == undefined || end == undefined) return false;
		return timeStore.checkBetween(start.timeTo, end.timeFrom) && timeStore.DAY < 5;
	}
	function setPlan(mode, id) {
		if (props.print || id == undefined) return;
		window.localStorage.setItem('selectedTimeTable', mode + id)
		router.push({ name: 'plan', params: { mode: mode, id: id } });
	}
	function sidebarToggle() {
		const el = document.getElementById('sidebar');
		if (el) el.classList.toggle('toggled');
	}
	const rowsNr = computed(() => {
		if (plan.value.days && plan.value.days.length == 5) return plan.value.days[0].length;
		return 0;
	});
	const isEmpty = computed(() => {
		if (
			'days' in plan.value &&
			plan.value.days.length == 5 &&
			plan.value.days[0].length == 1 &&
			plan.value.days[0][0].length == 0 &&
			plan.value.days[1][0].length == 0 &&
			plan.value.days[2][0].length == 0 &&
			plan.value.days[3][0].length == 0 &&
			plan.value.days[4][0].length == 0
		)
			return true;
		return false;
	});
	const isError = computed(() => {
		if ([404, 900].includes(plan.value.status)) return true;
		return false;
	});
	function getRow(nr) {
		return [
			plan.value.days[0][nr],
			plan.value.days[1][nr],
			plan.value.days[2][nr],
			plan.value.days[3][nr],
			plan.value.days[4][nr],
		];
	}
	onBeforeMount(() => plansStore.loadPlan(props.mode, props.id))
</script>

<template>
	<section id="timetable">
		<div v-if="!print" class="sb-btn-open" @click="sidebarToggle">
			<i class="menu zsm-menu-icon"></i>
		</div>
		<TimeTableTitle v-if="plan.title" :title="plan.title" :id="id" />
		<div v-if="plan && !isEmpty && !isError" class="table-responsive">
			<table class="table table-primary table-striped table-hover" :class="{ 'table-sm': print }">
				<thead>
					<tr>
						<th>#</th>
						<th>Czas</th>
						<th>Poniedziałek</th>
						<th>Wtorek</th>
						<th>Środa</th>
						<th>Czwartek</th>
						<th>Piątek</th>
					</tr>
				</thead>
				<tbody>
					<TimeTableRow
						@changePlan="setPlan"
						v-for="nr in rowsNr"
						:mode="mode"
						:hours="plan.hours[nr - 1]"
						:lessons="getRow(nr - 1)"
						:currentDay="currentDay"
						:currentLesson="currentLesson"
						:breakTime="calcBreak(plan.hours[nr - 1], plan.hours[nr])"
						:currentBreak="checkBreak(plan.hours[nr - 1], plan.hours[nr])" />
				</tbody>
			</table>
		</div>
		<TimeTableMessage v-if="isError || isEmpty && typeof plan.status == 'number'" :isEmpty="isEmpty" :isError="isError" :mode="mode" :status="plan.status" />
	</section>
</template>

<style lang="scss">
	#sidebar + #overlay + #timetable {
		padding-left: 240px;
		.sb-btn-open {
			display: none;
			position: fixed;
			top: 8px;
			left: 8px;
			i {
				font-size: 32px;
			}
		}
		@media (max-width: 991.98px) {
			padding-left: 0 !important;
			.sb-btn-open {
				display: block;
			}
		}
	}
	#timetable {
		width: 100%;
		position: relative;
		.table-responsive {
			max-height: calc(100vh - 50px);
			min-height: calc(100vh - 50px);
		}
		table {
			position: relative;
			margin-bottom: 0;
			thead th {
				text-align: center;
				position: sticky;
				top: 0;
				z-index: 5;
				&:first-child {
					z-index: 7;
					left: 0;
				}
			}
		}
	}
</style>
