<script setup>
	import { computed } from 'vue';

	const props = defineProps({
		mode: {
			type: String,
			required: true,
		},
		data: {
			type: Array,
			required: true,
		},
		current: {
			type: Boolean,
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
</script>

<template>
	<div v-if="groups === 0"></div>
	<div v-else v-for="i in groups">
		<div class="row" v-if="data[i - 1].groupName">
			<div class="col-10 font-weight-bold">{{ data[i - 1].subject }}</div>
			<div class="col-2 font-weight-bold">{{ data[i - 1].groupName }}</div>
		</div>
		<div class="row" v-else>
			<div class="col-12 font-weight-bold">{{ data[i - 1].subject }}</div>
		</div>
		<div class="row">
			<div class="col-6 text-start" @click="$emit('changePlan', col1[i - 1].mode, col1[i - 1].id)">{{ col1[i - 1].name }}</div>
			<div class="col-6 text-end" @click="$emit('changePlan', col2[i - 1].mode, col2[i - 1].id)">{{ col2[i - 1].name }}</div>
		</div>
	</div>
</template>
