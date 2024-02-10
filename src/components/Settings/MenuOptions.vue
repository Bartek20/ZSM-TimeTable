<script setup>
	import appConfigs from '@/stores/configs';
	import appData from '@/stores/data';
	import schoolData from '../../../public/schoolData';
</script>

<template>
	<div class="options" v-if="appData.timetable.status == 200">
		<span><b>Opcje</b></span>
		<a
			class="option"
			:href="`${schoolData.schoolTimeTableRootURL}plany/${appConfigs.currentTimeTable.mode}${appConfigs.currentTimeTable.id}.html`"
			target="_blank">
			<i class="zsm-old-timetable-icon"></i>
			<span>Otwórz oryginalny plan</span>
		</a>
		<div class="option" @click="printTimeTable">
			<i class="zsm-print-timetable-icon"></i>
			<span>Wydrukuj plan</span>
		</div>
	</div>
	<div v-else></div>
</template>

<style lang="scss" scoped>
	.options {
		margin-inline: 0.75rem;
		> span {
			font-size: 1.1rem;
			+ * {
				margin-top: 0.25rem;
			}
		}
		> *:not(span):not(:last-child) {
			margin-bottom: 0.25rem;
		}
		.option {
			padding: 0.25rem 0.75rem 0.25rem 0;
			text-decoration: none;
			color: var(--sb-text);
			height: 50px;
			display: flex;
			align-items: center;
			cursor: pointer;
			i {
				display: block;
				font-size: 20px;
				min-width: 40px;
				text-align: center;
			}
			span {
				width: 100%;
			}
			&:hover {
				background-color: var(--bg-sidebar-hover);
				color: var(--tt-text);
				border-radius: 6px;
			}
		}
	}
</style>
