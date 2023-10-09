<script setup>
	const user = useRouteParams('user');
	const mode = useRouteParams('mode');
	const props = defineProps({
		print: {
			type: Boolean,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		group: {
			type: String,
			required: false,
		},
		class_: {
			type: Object,
			required: false,
		},
		teacher: {
			type: Object,
			required: false,
		},
		room: {
			type: Object,
			required: false,
		},
	});
	const timetableData = useStorage('timetableData', {});
	const subjectName = computed(() => {
		if (!('subjects' in timetableData.value)) return props.subject;
		if (props.subject.includes('ckz')) return timetableData.value.subjects['praktyki'];
		if (timetableData.value.subjects[props.subject] == undefined) {
			console.warn('Nieznany przedmiot:', props.subject);
			return props.subject;
		}
		return timetableData.value.subjects[props.subject];
	});
	const colorDark = computed(() => stc(subjectName.value.replace(/ \([UR]{1}\)/, '')));
	const colorLight = computed(() => {
		const [r, g, b] = chroma.scale([colorDark.value, 'white'])(0.8)._rgb;
		return `rgb(${r}, ${g}, ${b})`;
	});
	const col1 = computed(() => {
		if (props.subject.includes('ckz'))
			return {
				name: '@',
			};
		const ver = ['n', 's'].includes(mode.value);
		if (ver)
			return {
				mode: 'o',
				id: props.class_.id,
				name: props.class_.name,
			};
		return {
			mode: 'n',
			id: user.value == 'nauczyciel' ? props.teacher.id : undefined,
			name: props.teacher.name,
		};
	});
	const col2 = computed(() => {
		if (props.subject.includes('ckz'))
			return {
				name: 'CKZ',
			};
		const ver = ['o', 'n'].includes(mode.value);
		if (ver)
			return {
				mode: 's',
				id: props.room.id,
				name: props.room.name,
			};
		return {
			mode: 'n',
			id: user.value == 'nauczyciel' ? props.teacher.id : undefined,
			name: props.teacher.name,
		};
	});
</script>
<template>
	<div
		class="lesson mb-2 px-2 py-1 rounded-2"
		:style="{
			backgroundColor: colorLight,
			boxShadow: `inset 0 0 0 9999px ${colorLight}`,
			borderColor: colorDark,
		}">
		<div class="row fw-bold" v-if="group">
			<div class="col-9 text-start text-nowrap">{{ subjectName }}</div>
			<div class="col-3 text-end ps-0">{{ group }}</div>
		</div>
		<div class="row fw-bold" v-else>
			<div class="col-12 text-start text-nowrap">{{ subjectName }}</div>
		</div>
		<div class="row">
			<div class="col-6 text-start" v-if="!print && col1.id">
				<RouterLink :to="{ name: 'plan', params: { user: user, mode: col1.mode, id: col1.id } }" class="text-muted text-decoration-none">{{
					col1.name
				}}</RouterLink>
			</div>
			<div class="col-6 text-start text-muted" v-else-if="!col1.id && col1.name">{{ col1.name }}</div>
			<div class="col-6 text-start text-muted" v-else>-</div>
			<div class="col-6 text-end" v-if="!print && col2.id">
				<RouterLink :to="{ name: 'plan', params: { user: user, mode: col2.mode, id: col2.id } }" class="text-muted text-decoration-none">{{
					col2.name
				}}</RouterLink>
			</div>
			<div class="col-6 text-end text-muted" v-else-if="!col2.id && col2.name">{{ col2.name }}</div>
			<div class="col-6 text-end text-muted" v-else>-</div>
		</div>
	</div>
</template>

<style lang="scss">
	.lesson {
		border: 0;
		border-bottom: 5px solid;
		&:last-child {
			margin: 0 !important;
		}
	}
</style>
