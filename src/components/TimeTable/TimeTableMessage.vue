<script setup>
	const MESSAGES = {
		ERR: {
			404: {
				icon: 'zsm-not-found-error-icon',
				msg: 'Wybrany plan nie został odnaleziony',
			},
			900: {
				icon: 'zsm-offline-error-icon',
				msg: 'Pobieranie planu nie powiodło się. Najprawdopodobniej jesteś offline.',
			},
			999: {
				icon: 'zsm-unknown-error-icon',
				msg: 'Wystąpił nieznany błąd. Skontaktuj się z twórcą aplikacji.',
			},
		},
		EMPTY: {
			o: 'Wybrana klasa nie ma w planie żadnych zajęć',
			n: 'Wybrany nauczyciel nie ma w planie żadnych lekcji',
			s: 'W wybranej sali nie ma żadnych lekcji',
		},
	};

	const mode = useRouteParams('mode');

	const props = defineProps({
		isLoading: {
			type: Boolean,
			required: true,
		},
		isEmpty: {
			type: Boolean,
			required: true,
		},
		isError: {
			type: Boolean,
			required: true,
		},
		status: {
			type: Number,
			required: true,
		},
	});
	const title = useTitle();
	onMounted(() => {
		if (props.isLoading) title.value = 'Wczytywanie | ZSM Plan Lekcji';
		else if (props.isEmpty && !props.isError) title.value = MESSAGES.EMPTY[mode] + ' | ZSM Plan Lekcji';
		else title.value = MESSAGES.ERR[props.status].msg + ' | ZSM Plan Lekcji';
	});
	const color = computed(() => (props.isEmpty && !props.isError ? '#cfe2ff' : undefined));
</script>

<template>
	<div class="timetable-msg d-flex flex-column justify-content-center align-items-center" v-if="isLoading">
		<i class="zsm-loading-icon p-4 loading"></i>
		<h5 class="mt-2 text-wrap text-center">Trwa wczytywanie planu lekcji</h5>
	</div>
	<div class="timetable-msg d-flex flex-column justify-content-center align-items-center" v-else-if="isEmpty && !isError">
		<i class="zsm-empty-error-icon p-4"></i>
		<h5 class="mt-2 text-wrap text-center">{{ MESSAGES.EMPTY[mode] }}</h5>
	</div>
	<div class="timetable-msg d-flex flex-column justify-content-center align-items-center" v-else>
		<i class="p-4" :class="MESSAGES.ERR[status].icon"></i>
		<h5 class="mt-2 text-wrap text-center">{{ MESSAGES.ERR[status].msg }}</h5>
	</div>
</template>

<style lang="scss">
	#timetable {
		.timetable-msg {
			background-color: v-bind(color);
			min-height: calc(100% - 48px);
			max-height: calc(100% - 48px);
			padding-bottom: 48px;
			.loading {
				animation: spin 2s linear infinite;
			}
			i {
				font-size: 64px;
			}
		}
	}
</style>
