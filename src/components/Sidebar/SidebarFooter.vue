<script setup>
const PWAStore = usePWAStore();
const plan = useStorage('plan', {
  apply_date: undefined,
  days: [[], [], [], [], []],
  gen_date: undefined,
  hours: [],
  status: undefined,
  title: undefined,
});
function getFooter() {
  const date = new Date().getFullYear();
  var result = '2023';
  if (date != '2023') {
    result = result + ' - ' + date;
  }
  return result;
}
const appStatus = computed(() => PWAStore.status());
const dates = computed(() => {
  const obj = plan.value;
  if (!obj || obj.status == 0 || obj.gen_date == undefined || obj.apply_date == undefined) return undefined;
  return {
    gen: obj.gen_date,
    apply: obj.apply_date,
  };
});
</script>
<template>
  <footer class="text-white text-center w-100">
    <div class="px-4 py-2 app" @click="PWAStore.install" v-if="appStatus == 'installable'">
      <i class="zsm-download-icon pe-1"></i><strong>Zainstaluj Aplikację</strong>
    </div>
    <div class="px-4 py-2 dates" v-if="dates">
      <strong>Wygenerowano: </strong>
      <p class="m-0">{{ dates.gen }}</p>
      <strong>Obowiązuje od: </strong>
      <p class="m-0">{{ dates.apply }}</p>
    </div>
    <div class="px-4 py-2 copy">
      <i class="zsm-copyright-icon pe-1"></i>{{ getFooter() }}<br /><strong>Bartłomiej Radoń</strong>
    </div>
  </footer>
</template>

<style lang="scss">
footer div {
  font-size: 0.9rem;
  &.app {
    background-color: cadetblue;
  }
  &.dates {
    background-color: darkslategray;
  }
  &.copy {
    background-color: teal;
  }
  i {
    font-size: 14px;
  }
}
</style>
