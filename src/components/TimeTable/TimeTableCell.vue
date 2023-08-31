<script setup>
const props = defineProps({
  print: {
    type: Boolean,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});
const groups = computed(() => props.data.length);
</script>

<template>
  <div v-if="groups === 0"></div>
  <TimeTableLesson
    v-else
    v-for="i in groups"
    :print="print"
    :subject="data[i - 1].subject"
    :group="data[i - 1].groupName"
    :class_="{ id: data[i - 1].classId, name: data[i - 1].className }"
    :teacher="{ id: data[i - 1].teacherId, name: data[i - 1].teacher }"
    :room="{ id: data[i - 1].roomId, name: data[i - 1].room }"
  />
</template>
