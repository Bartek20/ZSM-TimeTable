<script setup>
	const DAYS = ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'];
	const DAYS_IDS = {
		poniedziałek: 0,
		wtorek: 1,
		środa: 2,
		czwartek: 3,
		piątek: 4,
		sobota: 5,
		niedziela: 6,
	};
	const mode = useRouteParams('mode');
	const id = useRouteParams('id');
	const props = defineProps({
		print: {
			type: Boolean,
			required: false,
			default: false,
		},
	});

	const screenWidth = ref(window.innerWidth);
	window.addEventListener('resize', () => {
		screenWidth.value = window.innerWidth;
	});

	if (props.print) {
		const timer = window.setInterval(print, 1000);
		function print() {
			if (plan.value != undefined && !isEmpty.value && !isError.value) {
				window.clearInterval(timer);
				window.print();
				window.close();
			} else if (isEmpty.value || isError.value) window.close();
		}
	}
	const device = computed(() => {
		if (props.print) return 'Printer';
		if (screenWidth.value < 576) return 'Phone';
		return 'PC';
	});
	const DAY_NAME = useDateFormat(useNow({ interval: 3600000 }), 'dddd', {
		locales: 'pl-PL',
	});
	const DAY = computed(() => DAYS_IDS[DAY_NAME.value]);
	const plan = useStorage('plan', {
		apply_date: undefined,
		days: [[], [], [], [], []],
		gen_date: undefined,
		hours: [],
		status: undefined,
		title: undefined,
	});
	const selectedDay = ref(DAY.value);
	if (selectedDay.value > 4) selectedDay.value = 0;
	const isEmpty = computed(() => {
		if (
			'days' in plan.value &&
			plan.value.days.length == 5 &&
			plan.value.days[0].length == 0 &&
			plan.value.days[1].length == 0 &&
			plan.value.days[2].length == 0 &&
			plan.value.days[3].length == 0 &&
			plan.value.days[4].length == 0
		)
			return true;
		return false;
	});
	const isError = computed(() => {
		if ([404, 900].includes(plan.value.status)) return true;
		return false;
	});
	function changeDay(d) {
		if (d == 'Prev') selectedDay.value == 0 ? (selectedDay.value = 4) : (selectedDay.value -= 1);
		else selectedDay.value == 4 ? (selectedDay.value = 0) : (selectedDay.value += 1);
		document.querySelector('.table-responsive').scrollTo({
			top: 0,
			behavior: 'instant',
		});
	}
	onMounted(() => {
		document.getElementById('load').classList.add('d-none');
	});
	async function loadPlan(mode, id) {
		var res;
		try {
			res = await axios.get(`/plan_nauczyciele/plany/${mode}${id}.html`);
		} catch (err) {
			console.error('Wystąpił błąd przy wczytywaniu planu:\n', err);
			if (err.response && err.response.status == 404) {
				plan.value = {
					status: 404,
				};
			} else if (err.code == 'ERR_NETWORK') {
				plan.value = {
					status: 900,
				};
			} else
				plan.value = {
					status: 999,
				};
			return;
		}
		if (res == undefined) {
			plan.value = {
				status: 999,
			};
			return;
		}
		if (!res.data.includes('table')) {
			plan.value = {
				status: 404,
			};
		}
		const TT = new TimeTable(res.data);
		const result = {
			title: TT.getTitle(),
			hours: TT.getHours(),
			days: TT.getDays(),
			gen_date: TT.getGeneratedDate(),
			apply_date: TT.getVersionInfo(),
			status: 200,
		};
		const lessonsNr = result.days[0].length;
		for (let i = 0; i < lessonsNr; i++) {
			if (
				result.days[0][0].length == 0 &&
				result.days[1][0].length == 0 &&
				result.days[2][0].length == 0 &&
				result.days[3][0].length == 0 &&
				result.days[4][0].length == 0
			) {
				result.days[0].shift();
				result.days[1].shift();
				result.days[2].shift();
				result.days[3].shift();
				result.days[4].shift();
				result.hours.shift();
			} else break;
		}
		plan.value = result;
	}
	await loadPlan(mode.value, id.value);
</script>

<template>
	<section id="timetable" class="z-0 w-100 h-100">
		<TimeTableTitle :title="plan.title || ''" :print="device == 'Printer'" :isEmpty="isEmpty" />
		<div
			v-if="plan && plan.days && !isEmpty && !isError"
			class="table-responsive"
			:style="{
				minHeight: device == 'Printer' ? 'auto' : `calc(100% - ${device == 'PC' ? '48px' : '96px'})`,
				maxHeight: device == 'Printer' ? 'auto' : `calc(100% - ${device == 'PC' ? '48px' : '96px'})`,
				overflow: device == 'Printer' ? 'hidden' : 'auto',
				fontSize: device == 'Printer' ? '0.9rem' : undefined,
				backgroundColor: device == 'Printer' ? undefined : '#cfe2ff',
			}">
			<table
				class="table table-striped table-borderless table-hover position-relative mb-0"
				:class="{
					'table-sm': print,
					'table-primary': !print,
					'table-light': print,
				}">
				<thead class="text-center">
					<tr>
						<th class="z-2 position-sticky top-0 start-0">#</th>
						<th class="z-1 position-sticky top-0">Czas</th>
						<th class="z-1 position-sticky top-0" v-if="['PC', 'Printer'].includes(device)" v-for="day in DAYS">
							{{ day }}
						</th>
						<th class="z-1 position-sticky top-0" v-else>
							{{ DAYS[selectedDay] }}
						</th>
					</tr>
				</thead>
				<tbody>
					<template v-for="nr in plan.days[0].length">
						<TimeTableLessonsRow
							:device="device"
							:hour="plan.hours[nr - 1]"
							:lessons="[plan.days[0][nr - 1], plan.days[1][nr - 1], plan.days[2][nr - 1], plan.days[3][nr - 1], plan.days[4][nr - 1]]"
							:selectedDay="selectedDay" />
						<TimeTableBreakRow
							v-if="plan.hours[nr - 1] && plan.hours[nr]"
							:breakFrom="plan.hours[nr - 1].timeTo"
							:breakTo="plan.hours[nr].timeFrom"
							:isShown="(device == 'Phone' && DAY == selectedDay) || device == 'PC'" />
					</template>
				</tbody>
			</table>
		</div>
		<div v-if="plan && !isEmpty && !isError && device == 'Phone'" class="row buttons text-center align-items-center m-0 fw-semibold fs-5">
			<div class="col-6" @click="changeDay('Prev')">&lt; Poprzedni</div>
			<div class="col-6" @click="changeDay('Next')">Następny &gt;</div>
		</div>
		<TimeTableMessage
			v-if="isError || (isEmpty && typeof plan.status == 'number')"
			:isLoading="false"
			:isEmpty="isEmpty"
			:isError="isError"
			:status="plan.status" />
	</section>
</template>

<style lang="scss">
	#sidebar + #sidebarOverlay + #timetable {
		max-width: calc(100% - 240px);
		@media (max-width: 991.98px) {
			max-width: 100%;
		}
	}
	#timetable {
		.buttons {
			height: 48px;
			background-color: #cfe2ff;
		}
	}
</style>
