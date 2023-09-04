<script setup>
	const mode = useRouteParams('mode');
	const props = defineProps({
		title: {
			type: String,
			required: true,
		},
		print: {
			type: Boolean,
			required: true,
		},
		isEmpty: {
			type: Boolean,
			required: true,
		},
	});
	const color = computed(() => ((props.print && !props.isEmpty) || props.title == '' ? undefined : '#cfe2ff'));
	const reftitle = useTitle();
	const schoolData = useStorage('schoolData', {});
	const titleParser = computed(() => {
		var title = props.title;
		if (title == '') return title;
		if (mode.value == 'o') {
			if (!('classes' in schoolData.value)) return title;
			const reg = title.match(/(\d\w+) (\d)([\w ]+)/);
			if (!reg) return title;
			const data = {
				class: reg[1],
				specialities: reg[3].split(' '),
			};
			var out = data.class;
			data.specialities.forEach((speciality) => {
				if (schoolData.value.classes[speciality] == undefined) {
					console.warn('Nieznany kierunek:', speciality);
					out = out + ' ' + speciality;
				} else {
					out = out + ' ' + speciality;
				}
			});
			return out;
		} else if (mode.value == 'n') {
			if (!('teachers' in schoolData.value)) return title;
			if (schoolData.value.teachers[title] == undefined) {
				const symbol = props.print ? ' - ' : ' | ';
				reftitle.value = title + symbol + 'Plan Lekcji';
				console.warn('Nieznany nauczyciel:', title);
				return title;
			}
			title = schoolData.value.teachers[title];
			var out = title.name;
			if (title.surname) out = out + ' ' + title.surname;
			const symbol = props.print ? ' - ' : ' | ';
			reftitle.value = out + symbol + 'Plan Lekcji';
			out = out + ' (' + title.code + ')';
			return out;
		}
		return title;
	});
	const titleEl = ref(null);
	const { width } = useWindowSize();
	const marquee = computed(() => {
		if (!width.value) return false;
		if (!titleEl.value) return false;
		if ((titleEl.value.classList.contains('marquee') ? titleEl.value.offsetWidth - 60 : titleEl.value.offsetWidth) > titleEl.value.parentElement.offsetWidth)
			return true;
		return false;
	});
	function sidebarToggle() {
		const el = document.getElementById('sidebar');
		if (el) el.classList.toggle('toggled');
	}
	function infoOpen() {
		const el = document.getElementById('info');
		if (el) el.classList.toggle('toggled');
	}
	onMounted(() => {
		const symbol = props.print ? ' - ' : ' | ';
		reftitle.value = titleParser.value.replace(/ \(.*\)/g, '') + symbol + 'Plan Lekcji';
	});
</script>

<template>
	<div class="timetable-header d-flex">
		<TimeTableInfo v-if="title != '' && !print && !isEmpty" :title="title" />
		<div class="fn-btn m-auto px-2">
			<div v-if="!print" class="sb-btn-open d-none align-items-center" @click="sidebarToggle">
				<i class="d-block zsm-menu-icon"></i>
			</div>
		</div>
		<div class="text d-flex align-items-center overflow-hidden" :class="{ 'justify-content-center': !marquee }">
			<h3 ref="titleEl" class="m-0 text-nowrap" :class="{ marquee: marquee }">{{ titleParser }}</h3>
			<h3 v-show="marquee" class="m-0 text-nowrap" :class="{ marquee: marquee }">{{ titleParser }}</h3>
		</div>
		<div class="fn-btn m-auto px-2">
			<div v-if="title != '' && !print && !isEmpty" class="btn-info" @click="infoOpen">
				<i class="d-block zsm-info-icon"></i>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
	$header-height: 48px;
	.timetable-header {
		background-color: v-bind(color);
		height: $header-height;
		.fn-btn {
			width: $header-height;
			i {
				font-size: 32px;
			}
		}
		.text {
			width: calc(100% - ($header-height * 2));
			gap: 5rem;
			.marquee {
				padding-inline: 30px;
				animation: marquee 10s linear infinite;
			}
		}
	}
	#sidebar + #sidebarOverlay + #timetable {
		.sb-btn-open {
			@media (max-width: 991.98px) {
				display: flex !important;
			}
		}
	}
	@keyframes marquee {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-100% - 5rem));
		}
	}
</style>
