<script setup>
	import { TEACHERS } from '@/functions/constants';
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
	});
	function titleParser(subject) {
		if (TEACHERS[subject] == undefined) return subject;
		return TEACHERS[subject];
	}
</script>

<template>
	<div class="title text-center">
		<h3 class="mb-0 p-2">{{ titleParser(title) }}</h3>
	</div>
</template>
