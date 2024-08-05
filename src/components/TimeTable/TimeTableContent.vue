<script setup>
defineProps({
  activeDay: {
    type: Number,
    required: true,
  },
  message: {
    type: Object,
    required: false,
  },
});
import appConfigs from "@/stores/configs";
import appData from "@/stores/data";
import loadTimeTable from "@/functions/fetchTimeTable";

const mode = useRouteParams("mode");
const id = useRouteParams("id");

await loadTimeTable(mode.value, id.value);
function calcBreak(from, to) {
  if (!from || !to) return 0;
  const start_el = from.split(":");
  const start_time = new Date();
  start_time.setHours(start_el[0], start_el[1], 0, 0);
  const end_el = to.split(":");
  const end_time = new Date();
  end_time.setHours(end_el[0], end_el[1], 0, 0);
  return (end_time - start_time) / 1000 / 60;
}
const dates = computed(() => {
  return {
    generated: appData.timetable.value.gen_date,
    apply: appData.timetable.value.apply_date,
  };
});
const title = computed(() => {
  const MODES = {
    o: "classes",
    n: "teachers",
    s: "rooms",
  };
  const name = appData.timetable.value.title;
  if (!name) {
    switch (appData.timetable.value.status) {
      case 0:
        return "";
      case 404:
        setTitle("Wybrany plan nie został odnaleziony.");
        return "";
      case 500:
        setTitle("Wystąpił nieznany błąd.");
        return "";
      case 900:
        setTitle("Pobieranie planu nie powiodło się.");
        return "";
    }
  }
  if (!appConfigs.value.database[MODES[mode.value]][name])
    parseName(mode.value, name);
  setTitle(appConfigs.value.database[MODES[mode.value]]?.[name]?.title ?? name);
  return appConfigs.value.database[MODES[mode.value]]?.[name]?.heading ?? name;
});
const data = computed(() => {
  const src = appData.timetable.value;
  const shortHours =
    appData.timetable.value.hours?.map((hour) => {
      return appConfigs.value.timetable.shortLessons[hour.number];
    }) || [];
  const hours =
    appConfigs.value.user.shortLessons &&
    src.hours?.length === shortHours.length
      ? shortHours
      : src.hours;
  let out = [];
  const rows = hours?.length || 0;
  for (let i = 0; i < rows; i++) {
    out.push({
      nr: hours[i].number,
      hours: {
        from: hours[i].timeFrom,
        to: hours[i].timeTo,
      },
      break: calcBreak(hours[i]?.timeTo, hours[i + 1]?.timeFrom),
      lessons: {
        0: src.days[0][i],
        1: src.days[1][i],
        2: src.days[2][i],
        3: src.days[3][i],
        4: src.days[4][i],
      },
    });
  }
  return out;
});
</script>

<template>
  <TimeTableMessage v-if="message" :icon="message.icon" :text="message.msg" />
  <div class="timetable__container" v-else>
    <TimeTableTable
      :data="data"
      :dates="dates"
      :title="title"
      :activeDay="activeDay"
    />
  </div>
</template>

<style lang="scss">
.timetable__container {
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  position: relative;
  overflow: auto;

  @include printer {
    overflow: visible;
    width: 100%;
  }
}
</style>
