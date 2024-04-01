<script setup>
const props = defineProps({
  icon: {
    type: String,
    reuired: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="timetable__message">
    <i class="timetable__message__icon" :class="icon"></i>
    <b class="timetable__message__text">{{ text }}</b>
  </div>
</template>

<style lang="scss">
.timetable__message {
  text-align: center;
  display: grid;
  align-content: center;
  justify-items: center;
  height: 100%;
  color: var(--tt-text);
  .loading {
    animation: spin 2s linear infinite;
  }
  &__icon {
    font-size: 4rem;
    margin-bottom: 0.5rem;
  }
  &__text {
    font-size: 1.5rem;
    max-width: 90%;
  }
}
</style>
