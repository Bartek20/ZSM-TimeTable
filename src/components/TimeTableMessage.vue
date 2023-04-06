<script setup>
import { MESSAGES } from '../functions/constants';
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
</script>

<template>
  <div class="timetable-msg d-flex flex-column justify-content-center align-items-center" v-if="isEmpty && !isError">
    <i class="zsm-empty-icon p-4"></i>
    <h5 class="mt-2 text-wrap">{{ MESSAGES.EMPTY[mode] }}</h5>
  </div>
  <div v-else class="timetable-msg d-flex flex-column justify-content-center align-items-center">
    <i class="zsm-empty-icon p-4"></i>
    <h5 class="mt-2 text-wrap">{{ MESSAGES.ERR[status] }}</h5>
  </div>
</template>

<style lang="scss">
#timetable {
  .timetable-msg {
    min-height: calc(100% - 96px);
    max-height: calc(100% - 96px);
    i {
      font-size: 64px;
    }
  }
}
</style>
