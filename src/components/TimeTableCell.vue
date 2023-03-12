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
	});
	const emits = defineEmits([changePlan]);
	const groups = computed(() => props.data.length);
	const col1 = computed(() => (['n', 's'].includes(mode) ? data[0].className : data[0].teacher));
	const col2 = computed(() => (['o', 'n'].includes(mode) ? data[0].room : data[0].teacher));
</script>

<template>
	<div v-if="groups === 0">
		<div class="row">
			<div class="col-12">&nbsp;</div>
		</div>
		<div class="row">
			<div class="col-6">&nbsp;</div>
			<div class="col-6">&nbsp;</div>
		</div>
	</div>
	<div v-if="groups === 1">
		<div class="row">
			<div class="col-12">{{ data[0].subject }}</div>
		</div>
		<div class="row">
			<div class="col-6" @click="$emit('changePlan')">
				{{ ['n', 's'].includes(mode) ? data[0].className : data[0].teacher }}
			</div>
			<div class="col-6">{{ ['o', 'n'].includes(mode) ? data[0].room : data[0].teacher }}</div>
		</div>
	</div>
</template>
