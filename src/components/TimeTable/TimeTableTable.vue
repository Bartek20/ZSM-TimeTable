<script setup>
import appConfigs from "@/stores/configs";
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  dates: {
    type: Object,
    required: true,
  },
  title: {
    type: String,
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
  const [ hour, minute ] = clock.split(":");
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
  sTime.setHours(startTime[ 0 ], startTime[ 1 ], 0, 0);
  eTime.setHours(endTime[ 0 ], endTime[ 1 ] - 1, 59, 999);
  return current >= sTime && current <= eTime;
}
function getKey(lesson) {
  let out = lesson.subject + '/'
  if (lesson.teacher && lesson.room) {
    out += `o/${lesson.teacher}/${lesson.room}`
  } else if (lesson.className && lesson.room) {
    out += `n/${lesson.className}/${lesson.room}`
  } else if (lesson.className && lesson.teacher) {
    out += `s/${lesson.className}/${lesson.teacher}`
  }
  return out
}

const TIME = useDateFormat(useNow({ interval: 100 }), "d;HH:mm", {
  locales: "pl-PL",
});
const currentDay = ref(-1);
const currentLesson = ref(-1);
watch(
  [ TIME, () => props.data ],
  () => {
    const timeData = TIME.value.split(";");
    currentDay.value = parseInt(timeData[ 0 ]) - 1;
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
  <table class="timetable__table" v-if="appConfigs.user.viewMode == 'new'">
    <thead class="timetable__table__head">
      <tr class="timetable__table__head__row timetable__table__row--headings">
        <th>#</th>
        <th>Czas</th>
        <th :class="{ active: appConfigs.user.forceTablet || activeDay == i }" v-for="(day, i) in [
          'Poniedziałek',
          'Wtorek',
          'Środa',
          'Czwartek',
          'Piątek',
        ]" :key="day">
          {{ day }}
        </th>
      </tr>
    </thead>
    <tbody class="timetable__table__body">
      <template v-for="row in data" :key="`new/${title}/${row.nr}`">
        <tr class="timetable__table__body__row timetable__table__body__row--lessons">
          <th>{{ row.nr }}</th>
          <td>{{ row.hours.from }}<br />-<br />{{ row.hours.to }}</td>
          <td :class="{ active: appConfigs.user.forceTablet || activeDay == i }" v-for="(day, i) in row.lessons" :key="`new/${title}/${row.nr}/${i}`">
            <div :class="{
              current:
                appConfigs.user.showCurrent &&
                day.length > 0 &&
                currentLesson == row.nr &&
                currentDay == i,
            }">
              <TimeTableLesson v-for="lesson in day" :data="lesson" :key="getKey(lesson)" />
            </div>
          </td>
        </tr>
        <tr class="timetable__table__body__row timetable__table__body__row--break"
          v-if="appConfigs.user.showBreaks && row.break != 0" :class="{
            active: appConfigs.user.forceTablet || activeDay == currentDay,
            current:
              appConfigs.user.showCurrent && currentLesson == row.nr + 'break',
          }">
          <th></th>
          <td colspan="6">
            {{ `Przerwa ${row.break}-minutowa` }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <table class="timetable__old" border="1" cellspacing="0" v-else>
    <thead>
      <tr class="timetable__old__dates" v-if="dates.generated && dates.apply">
        <td colspan="7">
          <div>
            <div>Wygenerowano:&nbsp;{{ dates.generated }}</div>
            <h3>{{ title }}</h3>
            <div>Obowiązuje&nbsp;od:&nbsp;{{ dates.apply }}</div>
          </div>
        </td>
      </tr>
      <tr>
        <th>#</th>
        <th>Czas</th>
        <th v-for="day in [
          'Poniedziałek',
          'Wtorek',
          'Środa',
          'Czwartek',
          'Piątek',
        ]"
        :key="day">
          {{ day }}
        </th>
      </tr>
    </thead>
    <tbody>
      <template v-for="row in data" :key="`old/${title}/${row.nr}`">
        <tr>
          <th class="nrOld">{{ row.nr }}</th>
          <td class="timeOld">
            {{ row.hours.from }}&nbsp;-&nbsp;{{ row.hours.to }}
          </td>
          <td class="lessonOld" v-for="(day, i) in row.lessons" :key="`old/${title}/${row.nr}/${i}`">
            <div>
              <TimeTableLesson v-for="lesson in day" :data="lesson" :key="getKey(lesson)" />
            </div>
          </td>
        </tr>
        <tr v-if="appConfigs.user.showBreaks && row.break != 0">
          <th></th>
          <td colspan="6" class="timetable__old__break lessonOld">
            {{ `Przerwa ${row.break}-minutowa` }}
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style lang="scss">
// New View
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

      &:nth-child(even)>* {
        background-color: var(--tt-primary);
      }

      &:nth-child(odd)>* {
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

        td>div {
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

        &.current>* {
          animation: blink 2s linear infinite;
        }

        @include phone {
          &:not(.active)>* {
            animation: none;
          }
        }
      }
    }
  }
}

// Old View
.timetable__old {
  margin-inline: auto;
  padding-inline: 10px;
  padding-bottom: 10px;
  border-color: #c0c0c0;
  border-width: 0;

  @include printer {
    width: 100%;
  }

  &__dates {
    display: none;

    @include printer {
      display: table-row;
    }

    td {
      border: 0;
      padding-bottom: 10px !important;

      >div {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        flex-wrap: nowrap;
        flex-direction: row;
        gap: 12px;

        h3 {
          font-size: 1.5rem;
          text-align: center;
        }
      }

      font-size: 0.875rem !important;
    }
  }

  th,
  td {
    padding: 4px;
  }

  th {
    background-color: #e1e6f5;
    color: #2e448f;
    font-size: 0.875rem;

    &.nrOld {
      background-color: #e1e6f5;
      color: #2e448f;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
      padding-inline: 8px;
    }
  }

  td {
    font-size: 0.75rem;

    &.timeOld {
      background-color: #f0f2fa;
      color: #2e448f;
      font-weight: bold;
      vertical-align: middle;
      text-align: center;
      white-space: nowrap;
    }

    &.lessonOld {
      background-color: #ffffff;
      color: #000000;
      vertical-align: middle;
    }
  }

  &__break {
    text-align: center;
    padding: 6px !important;

    @include printer {
      padding: 4px !important;
    }
  }
}
</style>
