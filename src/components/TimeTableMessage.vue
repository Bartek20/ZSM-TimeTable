<script setup>
	import { MESSAGES } from '../functions/constants';
	const props = defineProps({
		isEmpty: {
			type: Boolean,
			required: true,
		},
		isError: {
			type: Boolean,
			required: true,
		},
		mode: {
			type: String,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
	});
</script>

<template>
	<div class="msg empty" v-if="isEmpty && !isError">
		<i class="zsm-empty-icon"></i>
		<h5>{{ MESSAGES.EMPTY[mode] }}</h5>
	</div>
	<div v-else class="msg error">
		<i class="zsm-empty-icon"></i>
		<h5>{{ MESSAGES.ERR[status] }}</h5>
	</div>
</template>

<style lang="scss">
#timetable {
	.msg {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			&.empty {
				min-height: calc(100vh - 100px);
			max-height: calc(100vh - 100px);
			}
			&.error {
				min-height: 100vh;
				max-height: 100vh;
			}
			i {
				font-size: 64px;
				padding: 25px;
			}
			h5 {
				margin-top: 10px;
				white-space: normal;
			}
		}
}
</style>
