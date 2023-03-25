<script setup>
	import { computed } from 'vue';
	import stc from 'string-to-color';
	import chroma from 'chroma-js';
	import { LESSONS } from '../functions/constants';

	const props = defineProps({
		mode: {
			type: String,
			required: true,
		},
		data: {
			type: Array,
			required: true,
		},
	});
	const emits = defineEmits(['changePlan']);
	const groups = computed(() => props.data.length);
	const col1 = computed(() => {
		const mode = ['n', 's'].includes(props.mode);
		var response = [];
		for (let i = 0; i < groups.value; i++) {
			if (mode)
				response[i] = response[i] = {
					mode: 'o',
					id: props.data[i].classId,
					name: props.data[i].className,
				};
			else
				response[i] = {
					mode: 'n',
					id: props.data[i].teacherId,
					name: props.data[i].teacher,
				};
		}
		return response;
	});
	const col2 = computed(() => {
		const mode = ['o', 'n'].includes(props.mode);
		var response = [];
		for (let i = 0; i < groups.value; i++) {
			if (mode)
				response[i] = {
					mode: 's',
					id: props.data[i].roomId,
					name: props.data[i].room,
				};
			else
				response[i] = {
					mode: 'n',
					id: props.data[i].teacherId,
					name: props.data[i].teacher,
				};
		}
		return response;
	});
	function getColor(subject, mod = 0) {
		if (mod != 0) {
			const [r, g, b] = chroma.scale([stc(subject.replace(/ \([UR]{1}\)/, '')), 'white'])(mod)._rgb;
			return `rgb(${r}, ${g}, ${b})`;
		}
		return stc(subject.replace(/ \([UR]{1}\)/, ''));
	}
	function subjectParser(subject) {
		if (subject.includes('ckz')) return LESSONS['praktyki'];
		if (LESSONS[subject] == undefined) return subject;
		return LESSONS[subject];
	}
</script>

<template>
	<div v-if="groups === 0"></div>
	<div
		class="lesson px-2 py-1 mb-2"
		:style="{ backgroundColor: getColor(subjectParser(data[i - 1].subject), 0.8), borderColor: getColor(subjectParser(data[i - 1].subject)) }"
		v-else
		v-for="i in groups">
		<div class="row" v-if="data[i - 1].groupName">
			<div class="col-9 fw-bold text-start text-nowrap">{{ subjectParser(data[i - 1].subject) }}</div>
			<div class="col-3 ps-0 fw-bold text-end">{{ data[i - 1].groupName }}</div>
		</div>
		<div class="row" v-else>
			<div class="col-12 fw-bold text-nowrap">{{ subjectParser(data[i - 1].subject) }}</div>
		</div>
		<div class="row">
			<div class="col-6 text-muted text-start" @click="$emit('changePlan', col1[i - 1].mode, col1[i - 1].id)">{{ col1[i - 1].name }}</div>
			<div class="col-6 text-muted text-end" @click="$emit('changePlan', col2[i - 1].mode, col2[i - 1].id)">{{ col2[i - 1].name }}</div>
		</div>
	</div>
</template>

<style lang="scss">
	.lesson {
		border-radius: 6px;
		border: 0;
		border-bottom: 5px solid;
	}
	.lesson:last-child {
		margin: 0 !important;
	}
</style>
