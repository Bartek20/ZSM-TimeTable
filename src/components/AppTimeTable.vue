<script setup>
	import TimeTableRow from '@/components/TimeTableRow.vue';
	import TimeTableTitle from '@/components/TimeTableTitle.vue';
	import { computed, onBeforeUnmount, onMounted } from 'vue';
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
		id: {
			type: String,
			required: true,
		},
	});
	if (props.print) {
		var ready = false;
		const timer = window.setInterval(print, 1000);
		function print() {
			if (ready) {
				window.clearInterval(timer);
				window.print();
			}
		}
	}
	const plan = computed(() => {
		const e = props.id;
		const mode = e.charAt(0);
		const id = e.replace(mode, '');
		var res = plansStore.plans[mode][id];
		if (res == undefined) {
			plansStore.loadPlan(mode, id).then(() => {
				res = plansStore.plans[mode][id];
			});
		}
		ready = true;
		return res == undefined ? {} : res;
	});
	const mode = computed(() => {
		const e = props.id;
		return e.charAt(0);
	});
	const currentLesson = computed(() => {
		const current = timeStore.TIME;
		var response = 999;
		if (props.print) return response;
		Object.keys(plan.value.hours).forEach((lesson) => {
			const obj = plan.value.hours[lesson];
			if (timeStore.checkBetween(obj.timeFrom, obj.timeTo)) response = obj.number;
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
		document.cookie = `selectedTimeTable=${mode + id}; expires=Tue, 19 Jan 2038 04:14:07 GMT; path=/`;
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
	function getRow(nr) {
		return [plan.value.days[0][nr], plan.value.days[1][nr], plan.value.days[2][nr], plan.value.days[3][nr], plan.value.days[4][nr]];
	}
</script>

<template>
	<section id="timetable">
		<div v-if="!print" class="btn-open" @click="sidebarToggle">
			<i class="menu zsm-menu-icon"></i>
		</div>
		<TimeTableTitle v-if="plan.title" :title="plan.title" :id="id" />
		<div class="table-responsive">
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
						:currentBreak="checkBreak(plan.hours[nr - 1], plan.hours[nr])"
						:isEmpty="isEmpty" />
				</tbody>
			</table>
		</div>
	</section>
</template>

<style lang="scss">
	#sidebar + #overlay + #timetable {
		padding-left: 240px;
		.btn-open {
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
			.btn-open {
				display: block;
			}
		}
	}
	#timetable {
		width: 100%;
		position: relative;
		.table-responsive {
			max-height: calc(100vh - 50px);
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
