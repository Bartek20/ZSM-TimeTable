<script setup>
const props = defineProps({
  breakFrom: {
    type: String,
    required: true,
  },
  breakTo: {
    type: String,
    required: true,
  },
  isShown: {
    type: Boolean,
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
const breakTime = computed(() => {
  const start_el = props.breakFrom.split(':');
  const start_time = new Date();
  start_time.setHours(start_el[0], start_el[1], 0, 0);
  const end_el = props.breakTo.split(':');
  const end_time = new Date();
  end_time.setHours(end_el[0], end_el[1], 0, 0);
  return (end_time - start_time) / 1000 / 60;
});
const isActive = ref(checkBetween(props.breakFrom, props.breakTo));
watch(TIME, () => {
  const out = checkBetween(props.breakFrom, props.breakTo);
  if (isActive.value != out) isActive.value = out;
});
</script>

<template>
  <tr class="text-nowrap align-middle" v-if="breakTime != 0">
    <td colspan="7" class="text-center break" :class="{ current: isActive && isShown && DAY < 5 }">
      {{ 'Przerwa ' + breakTime + '-minutowa' }}
    </td>
  </tr>
</template>

<style lang="scss">
.break.current {
  background-color: rgba(var(--bs-info-rgb), 1);
}
</style>
