<script setup>
import appConfigs from "@/stores/configs";
defineProps({
  data: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <table class="timetable__old" border="1" cellspacing="0" cellpadding="4">
    <thead>
      <tr>
        <th>#</th>
        <th>Czas</th>
        <th
          v-for="day in [
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
    <tbody>
      <template v-for="row in data">
        <tr>
          <th class="nrOld">{{ row.nr }}</th>
          <td class="timeOld">{{ row.hours.from }}-{{ row.hours.to }}</td>
          <td class="lessonOld" v-for="(day, i) in row.lessons">
            <div>
              <TimeTableLessonOld v-for="lesson in day" :data="lesson" />
            </div>
          </td>
        </tr>
        <tr v-if="appConfigs.showBreaks && row.break != 0">
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
.timetable__old {
  margin-inline: auto;
  padding-inline: 10px;
  padding-bottom: 10px;
  border-color: #c0c0c0;
  border-width: 0;
  th {
    background-color: #e1e6f5;
    color: #2e448f;
    font-size: 13px;
    &.nrOld {
      background-color: #e1e6f5;
      color: #2e448f;
      font-weight: bold;
      text-align: center;
      vertical-align: middle;
      padding: 5px;
    }
  }
  td {
    font-size: 11px;
    &.timeOld {
      background-color: #f0f2fa;
      color: #2e448f;
      font-weight: bold;
      vertical-align: middle;
      text-align: center;
      white-space: nowrap;
      padding: 5px;
    }
    &.lessonOld {
      background-color: #ffffff;
      color: #000000;
      vertical-align: middle;
      padding: 5px;
    }
  }
  &__break {
    text-align: center;
  }
}
</style>
