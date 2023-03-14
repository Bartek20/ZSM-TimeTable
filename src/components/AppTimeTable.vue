<script setup>
	import TimeTableCell from '@/components/TimeTableCell.vue';
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
		const current = timeStore.TIME
		var response = undefined;
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
	}var timer = undefined
	onMounted(() => {
		timer = window.setInterval(timeStore.getTime, 1000)
	})
	onBeforeUnmount(() => {
		window.clearInterval(timer)
	})
</script>

<template>
	<section id="timetable">
		<div class="title">{{ plan.title }}</div>
		<div class="table-responsive">
			<table class="table table-hover table-responsive">
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
					<tr v-for="(row, i) in plan.days">
						<th scope="row" class="text-center align-middle">{{ plan.hours[i].number }}</th>
						<td class="text-center text-nowrap align-middle">{{ plan.hours[i].timeFrom + ' - ' + plan.hours[i].timeTo }}</td>
						<td :class="{ 'bg-info': currentLesson == plan.hours[i].number && currentDay == 0 && row[0].length != 0 }">
							<TimeTableCell
								@changePlan="plansStore.setTimeTable"
								:mode="mode"
								:data="row[0]" />
						</td>
						<td :class="{ 'bg-info': currentLesson == plan.hours[i].number && currentDay == 1 && row[1].length != 0 }">
							<TimeTableCell
								@changePlan="plansStore.setTimeTable"
								:mode="mode"
								:data="row[1]" />
						</td>
						<td :class="{ 'bg-info': currentLesson == plan.hours[i].number && currentDay == 2 && row[2].length != 0 }">
							<TimeTableCell
								@changePlan="plansStore.setTimeTable"
								:mode="mode"
								:data="row[2]" />
						</td>
						<td :class="{ 'bg-info': currentLesson == plan.hours[i].number && currentDay == 3 && row[3].length != 0 }">
							<TimeTableCell
								@changePlan="plansStore.setTimeTable"
								:mode="mode"
								:data="row[3]" />
						</td>
						<td :class="{ 'isActive': currentLesson == plan.hours[i].number && currentDay == 4 && row[4].length != 0 }">
							<TimeTableCell
								@changePlan="plansStore.setTimeTable"
								:mode="mode"
								:data="row[4]" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>

<style lang="scss">
	#timetable {
		width: 100%;
	}
</style>
