<script setup>
	import appConfigs from '@/stores/configs';

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
			return { short: subject };
		}
		return subjectData;
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
</script>

<template>
	<span class="lessonOldData">
		<span class="subject" v-if="data.groupName">{{ subject.short }} ({{ data.groupName }})</span>
		<span class="subject" v-else>{{ subject.short }}</span>
		&nbsp;
		<!-- Column #1 -->
		<RouterLink v-if="col1.id" :to="{ name: 'plan', params: { user: user, mode: col1.mode, id: col1.id } }">{{ col1.name }}</RouterLink>
		<span v-else-if="!col1.id && col1.name">{{ col1.name }}</span>
		<span v-else>-</span>
		&nbsp;
		<!-- Column #2 -->
		<RouterLink v-if="col2.id" :to="{ name: 'plan', params: { user: user, mode: col2.mode, id: col2.id } }" class="text-muted text-decoration-none">{{
			col2.name
		}}</RouterLink>
		<span v-else-if="!col2.id && col2.name">{{ col2.name }}</span>
		<span v-else>-</span>
		<br />
	</span>
</template>

<style lang="scss">
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
