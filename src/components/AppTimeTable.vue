<script setup>
	import TimeTableRow from '@/components/TimeTableRow.vue';
	import TimeTableTitle from '@/components/TimeTableTitle.vue';
	import TimeTableMessage from './TimeTableMessage.vue';
	import { ref, computed, onBeforeMount, onBeforeUnmount, onMounted } from 'vue';
	import { useRouter } from 'vue-router';
	import { usePlansStore } from '@/stores/plans';
	import { useTimeStore } from '@/stores/time';
	const DAYS = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek']
	const router = useRouter();
	const plansStore = usePlansStore();
	const timeStore = useTimeStore();
	timeStore.getTime();
	const screenWidth = ref(window.innerWidth)
	window.addEventListener('resize', () => {
		screenWidth.value = window.innerWidth
	})
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
	const device = computed(() => {
		if (screenWidth.value < 576) return 'Phone'
		return 'PC'
	})
	const plan = computed(() => plansStore.plans[props.mode][props.id]);
	const currentLesson = computed(() => {
		const current = timeStore.TIME;
		var response = 999;
		if (props.print || !('hours' in plan.value)) return response;
		plan.value.hours.forEach((lesson) => {
			if (timeStore.checkBetween(lesson.timeFrom, lesson.timeTo)) response = lesson.number;
		});
		return response;
	});
	const currentDay = computed(() => timeStore.DAY);
	const selectedDay = ref(timeStore.DAY);
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
	function changeDay(d) {
		if (d == 'Prev') selectedDay.value == 0 ? selectedDay.value = 4 : selectedDay.value -= 1
		else selectedDay.value == 4 ? selectedDay.value = 0 : selectedDay.value += 1
	}
</script>

<template>
	<section id="timetable">
		<TimeTableTitle :title="plan.title || ''" :id="id" />
		<div v-if="plan && !isEmpty && !isError" class="table-responsive" :style="{ minHeight: `calc(100% - ${device == 'PC' ? '50px' : '100px'})`, maxHeight: `calc(100% - ${device == 'PC' ? '50px' : '100px'})` }">
			<table class="table table-primary table-striped table-hover" :class="{ 'table-sm': print }">
				<thead>
					<tr>
						<th>#</th>
						<th>Czas</th>
						<th v-if="device == 'PC'" v-for="day in DAYS">{{ day }}</th>
						<th v-else>{{ DAYS[selectedDay] }}</th>
					</tr>
				</thead>
				<tbody>
					<TimeTableRow
						v-for="nr in rowsNr"
						:device="device"
						:print="print"
						:mode="mode"
						:hours="plan.hours[nr - 1]"
						:lessons="getRow(nr - 1)"
						:selectedDay="selectedDay"
						:currentDay="currentDay"
						:currentLesson="currentLesson"
						:breakTime="calcBreak(plan.hours[nr - 1], plan.hours[nr])"
						:currentBreak="checkBreak(plan.hours[nr - 1], plan.hours[nr])" />
				</tbody>
			</table>
		</div>
		<div v-if="plan && !isEmpty && !isError && device == 'Phone'" class="row buttons">
			<div class="col-6" @click="changeDay('Prev')">&lt; Poprzedni</div>
			<div class="col-6" @click="changeDay('Next')">Następny &gt;</div>
		</div>
		<TimeTableMessage v-if="isError || isEmpty && typeof plan.status == 'number'" :isEmpty="isEmpty" :isError="isError" :mode="mode" :status="plan.status" />
	</section>
</template>

<style lang="scss">
	#sidebar + #overlay + #timetable {
		max-width: calc(100% - 240px);
		@media (max-width: 991.98px) {
			max-width: 100%;
		}
	}
	#timetable {
		width: 100%;
		height: 100%;
		.buttons {
			text-align: center;
			font-size: large;
			font-weight: 700;
			height: 50px;
			align-items: center;
			margin: 0;
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
