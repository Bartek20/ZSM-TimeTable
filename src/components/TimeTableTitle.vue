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
	function titleParser(title) {
		if (TEACHERS[title] == undefined) return title;
		title = TEACHERS[title];
		var out = title.name;
		if (title.surname) out = out + ' ' + title.surname;
		out = out + ' (' + title.code + ')';
		return out;
	}
</script>

<template>
	<div class="title text-center">
		<h3 class="mb-0 p-2">{{ titleParser(title) }}</h3>
	</div>
</template>

<style lang="scss">
	.title {
		height: 50px;
		white-space: nowrap;
	}
</style>
