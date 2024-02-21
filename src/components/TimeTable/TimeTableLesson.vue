<script setup>
	import appConfigs from '@/stores/configs';
	import parseColor from '@/functions/parseColor';

	const user = useRouteParams('user');

	const props = defineProps({
		data: {
			type: Object,
			required: true,
		},
	});

	const subject = computed(() => {
		const subject = props.data.subject;
		let subjectData = appConfigs.value.timetable.subjects[subject];
		if (subject.includes('ckz')) subjectData = appConfigs.value.timetable.subjects['praktyki'];
		if (subjectData == undefined) {
			addUnknowns('subjects', subject);
			return subject;
		}
		return subjectData.short;
	});

	const col1 = computed(() => {
		if (props.data.subject.includes('ckz'))
			return {
				name: '@',
			};
		const ver = ['n', 's'].includes(appConfigs.value.currentTimeTable.mode);
		if (ver)
			return {
				mode: 'o',
				id: props.data.classId,
				name: props.data.className,
			};
		return {
			mode: 'n',
			id: user.value == 'nauczyciel' ? props.data.teacherId : undefined,
			name: props.data.teacher,
		};
	});
	const col2 = computed(() => {
		if (props.data.subject.includes('ckz'))
			return {
				name: 'CKZ',
			};
		const ver = ['o', 'n'].includes(appConfigs.value.currentTimeTable.mode);
		if (ver)
			return {
				mode: 's',
				id: props.data.roomId,
				name: props.data.room,
			};
		return {
			mode: 'n',
			id: user.value == 'nauczyciel' ? props.data.teacherId : undefined,
			name: props.data.teacher,
		};
	});
	const colors = computed(() => {
		if (!appConfigs.value.showColors)
			return {
				light: 'white',
				dark: 'lightgray',
			};
		return parseColor(subject.value);
	});

	const gridArea = computed(() => (props.data.groupName ? '3fr 1fr' : '1fr'));
</script>

<template>
	<div class="lesson">
		<div class="row">
			<!-- Subject -->
			<div>
				<b>{{ subject }}</b>
			</div>
			<!-- Group -->
			<div v-if="data.groupName">
				<b>{{ data.groupName }}</b>
			</div>
		</div>
		<div class="row">
			<!-- Column #1 -->
			<div v-if="col1.id">
				<RouterLink :to="{ name: 'plan', params: { user: user, mode: col1.mode, id: col1.id } }" class="text-muted text-decoration-none">{{
					col1.name
				}}</RouterLink>
			</div>
			<div v-else-if="!col1.id && col1.name">{{ col1.name }}</div>
			<div v-else>-</div>
			<!-- Column #2 -->
			<div v-if="col2.id">
				<RouterLink :to="{ name: 'plan', params: { user: user, mode: col2.mode, id: col2.id } }" class="text-muted text-decoration-none">{{
					col2.name
				}}</RouterLink>
			</div>
			<div v-else-if="!col2.id && col2.name">{{ col2.name }}</div>
			<div v-else>-</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.lesson {
		background-color: v-bind('colors.light');
		box-shadow: inset 0 0 0 9999px v-bind('colors.light');
		border-bottom: 5px solid;
		border-color: v-bind('colors.dark');
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
</style>
