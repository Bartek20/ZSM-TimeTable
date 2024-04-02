<script setup>
import appConfigs from "@/stores/configs";
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  activeDay: {
    type: Number,
    required: true,
  },
});

function addTime(clock, time) {
  const padClock = (part) => (part < 10 ? "0" + part : part);
  if (!clock || !time) return undefined;
  const [hour, minute] = clock.split(":");
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setTime(date.getTime() + time * 60000);
  return padClock(date.getHours()) + ":" + padClock(date.getMinutes());
}
function checkBetween(from, to) {
  if (!from || !to) return false;
  const current = new Date();
  const sTime = new Date();
  const eTime = new Date();
  const startTime = from.split(":");
  const endTime = to.split(":");
  sTime.setHours(startTime[0], startTime[1], 0, 0);
  eTime.setHours(endTime[0], endTime[1] - 1, 59, 999);
  return current >= sTime && current <= eTime;
}

const TIME = useDateFormat(useNow({ interval: 100 }), "d;HH:mm", {
  locales: "pl-PL",
});
const currentDay = ref(-1);
const currentLesson = ref(-1);
watch(
  [TIME, () => props.data],
  () => {
    const timeData = TIME.value.split(";");
    currentDay.value = parseInt(timeData[0]) - 1;
    currentLesson.value = -1;
    props.data.forEach((row) => {
      if (checkBetween(row.hours.from, row.hours.to)) {
        currentLesson.value = row.nr;
        return;
      }
      if (checkBetween(row.hours.to, addTime(row.hours.to, row.break))) {
        currentLesson.value = row.nr + "break";
      }
    });
  },
  { immediate: true },
);
</script>

<template>
  <table class="timetable__table">
    <thead class="timetable__table__head">
      <tr class="timetable__table__head__row timetable__table__row--headings">
        <th>#</th>
        <th>Czas</th>
        <th
          :class="{ active: appConfigs.forceTablet || activeDay == i }"
          v-for="(day, i) in [
            'Poniedziałek',
            'Wtorek',
            'Środa',
            'Czwartek',
            'Piątek',
          ]"
        >
          {{ day }}
        </th>
      </tr>
    </thead>
    <tbody class="timetable__table__body">
      <template v-for="row in data">
        <tr
          class="timetable__table__body__row timetable__table__body__row--lessons"
        >
          <th>{{ row.nr }}</th>
          <td>{{ row.hours.from }}<br />-<br />{{ row.hours.to }}</td>
          <td
            :class="{ active: appConfigs.forceTablet || activeDay == i }"
            v-for="(day, i) in row.lessons"
          >
            <div
              :class="{
                current:
                  appConfigs.showCurrent &&
                  day.length > 0 &&
                  currentLesson == row.nr &&
                  currentDay == i,
              }"
            >
              <TimeTableLessonNew v-for="lesson in day" :data="lesson" />
            </div>
          </td>
        </tr>
        <tr
          class="timetable__table__body__row timetable__table__body__row--break"
          v-if="appConfigs.showBreaks && row.break != 0"
          :class="{
            active: appConfigs.forceTablet || activeDay == currentDay,
            current:
              appConfigs.showCurrent && currentLesson == row.nr + 'break',
          }"
        >
          <th></th>
          <td colspan="6">
            {{ `Przerwa ${row.break}-minutowa` }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style lang="scss">
.timetable__table {
  width: 100%;
  border-collapse: collapse;
  color: var(--tt-text);
  th,
  td {
    padding: 0.5rem;
    text-align: center;
  }
  @include phone {
    th:not(:nth-child(1)):not(:nth-child(2)):not(.active),
    td:not(:first-of-type):not(.active) {
      display: none;
    }
  }
  &__head {
    position: relative;
    th {
      background-color: var(--tt-primary);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    th:nth-child(1) {
      left: 0;
      z-index: 3;
      min-width: 35px;
      width: 35px;
    }
    th:nth-child(2) {
      left: 35px;
      z-index: 3;
      width: 60px;
    }
  }
  &__body {
    &__row {
      break-inside: avoid;
      &:nth-child(even) > * {
        background-color: var(--tt-primary);
      }
      &:nth-child(odd) > * {
        background-color: var(--tt-secondary);
      }
      th {
        position: sticky;
        left: 0;
        z-index: 1;
      }
      &--lessons {
        td:nth-child(2) {
          position: sticky;
          left: 35px;
          z-index: 1;
        }
        td > div {
          margin: -0.5rem;
          padding: 0.5rem;
          &.current {
            border-radius: 0.5rem;
            animation: blink 2s linear infinite;
          }
        }
      }
      &--break {
        td {
          z-index: 1;
          position: sticky;
          left: 0;
          right: 0;
        }
        &.current > * {
          animation: blink 2s linear infinite;
        }
        @include phone {
          &:not(.active) > * {
            animation: none;
          }
        }
      }
    }
  }
}
</style>
