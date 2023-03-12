<script setup>
	import TimeTableCell from '@/components/TimeTableCell.vue';
	import { computed } from 'vue';
	import { usePlansStore } from '@/stores/plans';
	const plansStore = usePlansStore();
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
	if (props.print) {
		const timer = window.setInterval(print, 1000);
		function print() {
			if (ready) {
				window.clearInterval(timer);
				window.print();
			}
		}
	}
</script>

<template>
	<section id="timetable">
		<div class="title">{{ plan.title }}</div>
		<div class="table">
			<div class="day" v-for="day in plan.days">
				<div class="cell" v-for="lesson in day">
					<TimeTableCell @changePlan="plansStore.setTimeTable" :mode="mode" :data="lesson" />
				</div>
			</div>
		</div>
	</section>
</template>

<style lang="scss">
	#timetable {
		.table {
			display: flex;
			flex-direction: row;
		}
	}
</style>
