<script setup>
	import appData from '@/stores/data';
	import appConfigs from '@/stores/configs';

	const user = useRouteParams('user');

	const props = defineProps({
		data: {
			type: Object,
			required: true,
		},
	});

	const subject = computed(() => {
		const data = appData.value.school;
		const subject = props.data.subject;
		if (!('subjects' in data)) return subject;
		if (subject.includes('ckz')) return data.subjects['praktyki'].short;
		if (data.subjects[subject] == undefined) {
			console.warn('Nieznany przedmiot:', subject);
			return subject;
		}
		return data.subjects[subject].short;
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

	const colorDark = computed(() => (appConfigs.value.showColors ? stc(subject.value.replace(/ \([UR]{1}\)/, '')) : 'lightgray'));
	const colorLight = computed(() => {
		if (!appConfigs.value.showColors) return 'white';
		const [r, g, b] = chroma.scale([colorDark.value, 'white'])(0.8)._rgb;
		return `rgb(${r}, ${g}, ${b})`;
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
		background-color: v-bind(colorLight);
		box-shadow: inset 0 0 0 9999px v-bind(colorLight);
		border-bottom: 5px solid;
		border-color: v-bind(colorDark);
		white-space: nowrap;
		padding: 0.25rem 0.5rem;
		border-radius: 6px;
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
