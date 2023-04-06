<script setup>
import { computed } from 'vue';
import stc from 'string-to-color';
import chroma from 'chroma-js';
import { LESSONS } from '../functions/constants';

const props = defineProps({
  print: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});
const groups = computed(() => props.data.length);
const col1 = computed(() => {
  if (props.data[0].subject.includes('ckz'))
    return [
      {
        name: '@',
      },
    ];
  const mode = ['n', 's'].includes(props.mode);
  var response = [];
  for (let i = 0; i < groups.value; i++) {
    if (mode)
      response[i] = response[i] = {
        mode: 'o',
        id: props.data[i].classId,
        name: props.data[i].className,
      };
    else
      response[i] = {
        mode: 'n',
        id: props.data[i].teacherId,
        name: props.data[i].teacher,
      };
  }
  return response;
});
const col2 = computed(() => {
  if (props.data[0].subject.includes('ckz'))
    return [
      {
        name: 'CKZ',
      },
    ];
  const mode = ['o', 'n'].includes(props.mode);
  var response = [];
  for (let i = 0; i < groups.value; i++) {
    if (mode)
      response[i] = {
        mode: 's',
        id: props.data[i].roomId,
        name: props.data[i].room,
      };
    else
      response[i] = {
        mode: 'n',
        id: props.data[i].teacherId,
        name: props.data[i].teacher,
      };
  }
  return response;
});
function getColor(subject, mod = 0) {
  if (mod != 0) {
    const [r, g, b] = chroma.scale([stc(subject.replace(/ \([UR]{1}\)/, '')), 'white'])(mod)._rgb;
    return `rgb(${r}, ${g}, ${b})`;
  }
  return stc(subject.replace(/ \([UR]{1}\)/, ''));
}
function subjectParser(subject) {
  if (subject.includes('ckz')) return LESSONS['praktyki'];
  if (LESSONS[subject] == undefined) return subject;
  return LESSONS[subject];
}
</script>

<template>
  <div v-if="groups === 0"></div>
  <div
    class="lesson mb-2 px-2 py-1 rounded-2"
    :style="{
      backgroundColor: getColor(subjectParser(data[i - 1].subject), 0.8),
      borderColor: getColor(subjectParser(data[i - 1].subject)),
    }"
    v-else
    v-for="i in groups"
  >
    <div class="row fw-bold" v-if="data[i - 1].groupName">
      <div class="col-9 text-start text-nowrap">{{ subjectParser(data[i - 1].subject) }}</div>
      <div class="col-3 text-end ps-0">{{ data[i - 1].groupName }}</div>
    </div>
    <div class="row fw-bold" v-else>
      <div class="col-12 text-start text-nowrap">{{ subjectParser(data[i - 1].subject) }}</div>
    </div>
    <div class="row">
      <div class="col-6 text-start" v-if="!print && col1[i - 1].id">
        <RouterLink
          :to="{ name: 'plan', params: { mode: col1[i - 1].mode, id: col1[i - 1].id } }"
          class="text-muted text-decoration-none"
          >{{ col1[i - 1].name }}</RouterLink
        >
      </div>
      <div class="col-6 text-start text-muted" v-else>{{ col1[i - 1].name }}</div>
      <div class="col-6 text-end" v-if="!print && col2[i - 1].id">
        <RouterLink
          :to="{ name: 'plan', params: { mode: col2[i - 1].mode, id: col2[i - 1].id } }"
          class="text-muted text-decoration-none"
          >{{ col2[i - 1].name }}</RouterLink
        >
      </div>
      <div class="col-6 text-end text-muted" v-else>{{ col2[i - 1].name }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.lesson {
  border: 0;
  border-bottom: 5px solid;
  &:last-child {
    margin: 0 !important;
  }
}
</style>
