<script setup>
const props = defineProps({
  device: {
    type: String,
    required: true,
  },
  hour: {
    type: Object,
    required: true,
  },
  lessons: {
    type: Array,
    required: true,
  },
  selectedDay: {
    type: Number,
    required: true,
  },
});
const DAY_NAME = useDateFormat(useNow({ interval: 3600000 }), 'dddd', {
  locales: 'pl-PL',
});
const DAY = computed(() => {
  const DAYS = {
    poniedziałek: 0,
    wtorek: 1,
    środa: 2,
    czwartek: 3,
    piątek: 4,
    sobota: 5,
    niedziela: 6,
  };
  return DAYS[DAY_NAME.value];
});
const TIME = useDateFormat(useNow({ interval: 1000 }), 'HH:mm', {
  locales: 'pl-PL',
});
const mode = useRouteParams('mode');
const width = computed(() => (props.device == 'Printer' ? 'auto' : '200px'));
const isActive = ref(checkBetween(props.hour.timeFrom, props.hour.timeTo));
watch(TIME, () => {
  const out = checkBetween(props.hour.timeFrom, props.hour.timeTo);
  if (isActive != out) isActive.value = out;
});
</script>

<template>
  <tr class="text-nowrap align-middle">
    <th class="minw-auto text-center position-sticky start-0" scope="row">
      {{ hour.number }}
    </th>
    <td class="minw-auto text-center">
      {{ hour.timeFrom + ' - ' + hour.timeTo }}
    </td>
    <td v-if="['PC', 'Printer'].includes(device)" v-for="(lesson, i) in lessons">
      <div class="cell m-n2 p-2" :class="{ current: isActive && DAY == i && lesson.length != 0 }">
        <TimeTableCell :print="device == 'Printer'" :mode="mode" :data="lesson" />
      </div>
    </td>
    <td v-else>
      <div class="cell m-n2 p-2" :class="{ current: isActive && DAY == selectedDay && lessons[selectedDay].length != 0 }">
        <TimeTableCell :print="false" :mode="mode" :data="lessons[selectedDay]" />
      </div>
    </td>
  </tr>
</template>

<style>
td:not(:first-of-type) {
  min-width: v-bind(width);
}
.cell.current {
  border-radius: 10px;
  animation: blink 2s linear infinite;
  background-color: rgba(var(--bs-info-rgb), 1);
}
</style>
