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
const plansStore = usePlansStore();
const screenWidth = ref(window.innerWidth);
window.addEventListener('resize', () => {
  screenWidth.value = window.innerWidth;
});
const props = defineProps({
  print: {
    type: Boolean,
    required: false,
    default: false,
  },
  mode: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
if (props.print) {
  const timer = window.setInterval(print, 1000);
  function print() {
    if (plan.value != undefined) {
      window.clearInterval(timer);
      window.print();
      window.close();
    }
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
const plan = computed(() => plansStore.plans[props.mode][props.id]);
const selectedDay = ref(DAY.value);
if (selectedDay.value > 4) selectedDay.value = 0;
const isEmpty = computed(() => {
  if (
    'days' in plan.value &&
    plan.value.days.length == 5 &&
    plan.value.days[0].length == 1 &&
    plan.value.days[0][0].length == 0 &&
    plan.value.days[1][0].length == 0 &&
    plan.value.days[2][0].length == 0 &&
    plan.value.days[3][0].length == 0 &&
    plan.value.days[4][0].length == 0
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
}
onMounted(() => {
  document.getElementById('load').classList.add('d-none');
});
await plansStore.loadPlan(props.mode, props.id);
</script>

<template>
  <section id="timetable" class="z-0 w-100 h-100">
    <TimeTableTitle :title="plan.title || ''" :print="device == 'Printer'" :mode="mode" :id="id" />
    <div
      v-if="plan && plan.days && !isEmpty && !isError"
      class="table-responsive"
      :style="{
        minHeight: device == 'Printer' ? 'auto' : `calc(100% - ${device == 'PC' ? '48px' : '96px'})`,
        maxHeight: device == 'Printer' ? 'auto' : `calc(100% - ${device == 'PC' ? '48px' : '96px'})`,
        overflow: device == 'Printer' ? 'hidden' : 'auto',
        fontSize: device == 'Printer' ? '0.9rem' : undefined,
        backgroundColor: device == 'Printer' ? undefined : '#cfe2ff',
      }"
    >
      <table
        class="table table-striped table-borderless table-hover position-relative mb-0"
        :class="{ 'table-sm': print, 'table-primary': !print, 'table-light': print }"
      >
        <thead class="text-center">
          <tr>
            <th class="z-2 position-sticky top-0 start-0">#</th>
            <th class="z-1 position-sticky top-0">Czas</th>
            <th class="z-1 position-sticky top-0" v-if="['PC', 'Printer'].includes(device)" v-for="day in DAYS">{{ day }}</th>
            <th class="z-1 position-sticky top-0" v-else>{{ DAYS[selectedDay] }}</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="nr in plan.days[0].length">
            <TimeTableLessonsRow
              :device="device"
              :hour="plan.hours[nr - 1]"
              :lessons="[
                plan.days[0][nr - 1],
                plan.days[1][nr - 1],
                plan.days[2][nr - 1],
                plan.days[3][nr - 1],
                plan.days[4][nr - 1],
              ]"
              :selectedDay="selectedDay"
            />
            <TimeTableBreakRow
              v-if="plan.hours[nr - 1] && plan.hours[nr]"
              :breakFrom="plan.hours[nr - 1].timeTo"
              :breakTo="plan.hours[nr].timeFrom"
              :isShown="(device == 'Phone' && DAY == selectedDay) || device == 'PC'"
            />
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-if="plan && !isEmpty && !isError && device == 'Phone'"
      class="row buttons text-center align-items-center m-0 fw-semibold fs-5"
    >
      <div class="col-6" @click="changeDay('Prev')">&lt; Poprzedni</div>
      <div class="col-6" @click="changeDay('Next')">Następny &gt;</div>
    </div>
    <TimeTableMessage
      v-if="isError || (isEmpty && typeof plan.status == 'number')"
      :isLoading="false"
      :isEmpty="isEmpty"
      :isError="isError"
      :mode="mode"
      :status="plan.status"
    />
  </section>
</template>

<style lang="scss">
#sidebar + #overlay + #timetable {
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
