<script setup>
const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  print: {
    type: Boolean,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  group: {
    type: String,
    required: false,
  },
  class_: {
    type: Object,
    required: false,
  },
  teacher: {
    type: Object,
    required: false,
  },
  room: {
    type: Object,
    required: false,
  },
});
const schoolData = useStorage('schoolData', {});
const subjectName = computed(() => {
  if (!('subjects' in schoolData.value)) return props.subject;
  if (props.subject.includes('ckz')) return schoolData.value.subjects['praktyki'];
  if (schoolData.value.subjects[props.subject] == undefined) {
    console.warn('Nieznany przedmiot:', props.subject);
    return props.subject;
  }
  return schoolData.value.subjects[props.subject];
});
const colorDark = computed(() => stc(subjectName.value.replace(/ \([UR]{1}\)/, '')));
const colorLight = computed(() => {
  const [r, g, b] = chroma.scale([colorDark.value, 'white'])(0.8)._rgb;
  return `rgb(${r}, ${g}, ${b})`;
});
const col1 = computed(() => {
  if (props.subject.includes('ckz'))
    return {
      name: '@',
    };
  const mode = ['n', 's'].includes(props.mode);
  if (mode)
    return {
      mode: 'o',
      id: props.class_.id,
      name: props.class_.name,
    };
  return {
    mode: 'n',
    id: props.teacher.id,
    name: props.teacher.name,
  };
});
const col2 = computed(() => {
  if (props.subject.includes('ckz'))
    return {
      name: 'CKZ',
    };
  const mode = ['o', 'n'].includes(props.mode);
  if (mode)
    return {
      mode: 's',
      id: props.room.id,
      name: props.room.name,
    };
  return {
    mode: 'n',
    id: props.teacher.id,
    name: props.teacher.name,
  };
});
</script>
<template>
  <div
    class="lesson mb-2 px-2 py-1 rounded-2"
    :style="{
      backgroundColor: colorLight,
      boxShadow: `inset 0 0 0 9999px ${colorLight}`,
      borderColor: colorDark,
    }"
  >
    <div class="row fw-bold" v-if="group">
      <div class="col-9 text-start text-nowrap">{{ subjectName }}</div>
      <div class="col-3 text-end ps-0">{{ group }}</div>
    </div>
    <div class="row fw-bold" v-else>
      <div class="col-12 text-start text-nowrap">{{ subjectName }}</div>
    </div>
    <div class="row">
      <div class="col-6 text-start" v-if="!print && col1.id">
        <RouterLink :to="{ name: 'plan', params: { mode: col1.mode, id: col1.id } }" class="text-muted text-decoration-none">{{
          col1.name
        }}</RouterLink>
      </div>
      <div class="col-6 text-start text-muted" v-else>{{ col1.name }}</div>
      <div class="col-6 text-end" v-if="!print && col2.id">
        <RouterLink :to="{ name: 'plan', params: { mode: col2.mode, id: col2.id } }" class="text-muted text-decoration-none">{{
          col2.name
        }}</RouterLink>
      </div>
      <div class="col-6 text-end text-muted" v-else>{{ col2.name }}</div>
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
