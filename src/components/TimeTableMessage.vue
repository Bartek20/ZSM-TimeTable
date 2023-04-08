<script setup>
const props = defineProps({
  isEmpty: {
    type: Boolean,
    required: true,
  },
  isError: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
});
onMounted(() => {
  if (props.isEmpty && !props.isError) document.title = MESSAGES.EMPTY[props.mode] + ' | ZSM Plan Lekcji';
  else document.title = MESSAGES.ERR[props.status].msg + ' | ZSM Plan Lekcji';
});
const color = computed(() => (props.isEmpty && !props.isError ? '#cfe2ff' : undefined));
</script>

<template>
  <div class="timetable-msg d-flex flex-column justify-content-center align-items-center" v-if="isEmpty && !isError">
    <i class="zsm-empty-error-icon p-4"></i>
    <h5 class="mt-2 text-wrap text-center">{{ MESSAGES.EMPTY[mode] }}</h5>
  </div>
  <div v-else class="timetable-msg d-flex flex-column justify-content-center align-items-center">
    <i class="p-4" :class="MESSAGES.ERR[status].icon"></i>
    <h5 class="mt-2 text-wrap text-center">{{ MESSAGES.ERR[status].msg }}</h5>
  </div>
</template>

<style lang="scss">
#timetable {
  .timetable-msg {
    background-color: v-bind(color);
    min-height: calc(100% - 48px);
    max-height: calc(100% - 48px);
    padding-bottom: 48px;
    i {
      font-size: 64px;
    }
  }
}
</style>
