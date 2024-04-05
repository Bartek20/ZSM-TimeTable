<script setup>
	import appConfigs from '@/stores/configs';
	import parseLesson from '@/functions/parseLesson';

	const user = useRouteParams('user');

	const props = defineProps({
		data: {
			type: Object,
			required: true,
		},
	});

	const lessonData = computed(() => parseLesson(props.data));

	const gridArea = computed(() => (props.data.groupName ? '3fr 1fr' : '1fr'));
</script>

<template>
	<div
		class="lesson"
		v-tooltip.top="{
			content: `<b>${lessonData.subject.full ? lessonData.subject.full : lessonData.subject.short}</b>`,
			html: true,
			distance: 12,
			overflowPadding: 40,
			shift: false,
			delay: { show: 500, hide: 0 },
			disposeTimeout: 0,
			triggers: ['hover', 'touch'],
			container: '.timetable__container',
		}" v-if="appConfigs.viewMode == 'new'">
		<div class="row">
			<!-- Subject -->
			<div>
				<b>{{ lessonData.subject.short }}</b>
			</div>
			<!-- Group -->
			<div v-if="data.groupName">
				<b>{{ data.groupName }}</b>
			</div>
		</div>
		<div class="row">
			<!-- Column #1 -->
			<div v-if="lessonData.columns.left.id">
				<RouterLink :to="{ name: 'plan', params: { user: user, mode: lessonData.columns.left.mode, id: lessonData.columns.left.id } }" class="text-muted text-decoration-none">{{
					lessonData.columns.left.name
				}}</RouterLink>
			</div>
			<div v-else-if="!lessonData.columns.left.id && lessonData.columns.left.name">{{ lessonData.columns.left.name }}</div>
			<div v-else>-</div>
			<!-- Column #2 -->
			<div v-if="lessonData.columns.right.id">
				<RouterLink :to="{ name: 'plan', params: { user: user, mode: lessonData.columns.right.mode, id: lessonData.columns.right.id } }" class="text-muted text-decoration-none">{{
					lessonData.columns.right.name
				}}</RouterLink>
			</div>
			<div v-else-if="!lessonData.columns.right.id && lessonData.columns.right.name">{{ lessonData.columns.right.name }}</div>
			<div v-else>-</div>
		</div>
	</div>
	<span class="lessonOldData" v-else>
		<span class="subject" v-if="data.groupName">{{ lessonData.subject.short }} ({{ data.groupName }})</span>
		<span class="subject" v-else>{{ lessonData.subject.short }}</span>
		&nbsp;
		<!-- Column #1 -->
		<RouterLink v-if="lessonData.columns.left.id" :to="{ name: 'plan', params: { user: user, mode: lessonData.columns.left.mode, id: lessonData.columns.left.id } }">{{ lessonData.columns.left.name }}</RouterLink>
		<span v-else-if="!lessonData.columns.left.id && lessonData.columns.left.name">{{ lessonData.columns.left.name }}</span>
		<span v-else>-</span>
		&nbsp;
		<!-- Column #2 -->
		<RouterLink v-if="lessonData.columns.right.id" :to="{ name: 'plan', params: { user: user, mode: lessonData.columns.right.mode, id: lessonData.columns.right.id } }" class="text-muted text-decoration-none">{{
			lessonData.columns.right.name
		}}</RouterLink>
		<span v-else-if="!lessonData.columns.right.id && lessonData.columns.right.name">{{ lessonData.columns.right.name }}</span>
		<span v-else>-</span>
		<br />
	</span>
</template>

<style lang="scss">
	// New View
	.lesson {
		background-color: v-bind('lessonData.colors.light');
		box-shadow: inset 0 0 0 9999px v-bind('lessonData.colors.light');
		border-bottom: 5px solid;
		border-color: v-bind('lessonData.colors.dark');
		white-space: nowrap;
		padding: 0.25rem 0.5rem;
		border-radius: 0.25rem;
		min-width: 150px;
		&:not(:last-child) {
			margin-bottom: 5px;
		}
		.row {
			display: grid;
			gap: 0.5rem;
			:last-child {
				text-align: end;
			}
			:first-child {
				text-align: start;
			}
			&:nth-child(1) {
				grid-template-columns: v-bind(gridArea);
				color: black;
				margin-bottom: 3px;
			}
			&:nth-child(2) {
				grid-template-columns: 1fr 1fr;
				a,
				div {
					color: rgba(33, 37, 41, 0.75);
				}
			}
		}
	}
	// Old View
	.lessonOldData {
		white-space: nowrap;
		.subject {
			color: #000000;
			font-weight: bold;
		}
		a {
			color: #2e448f;
		}
	}
</style>
