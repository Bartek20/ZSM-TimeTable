<script setup>
import appConfigs from "@/stores/configs";
import appData from "@/stores/data";

const oldMode = ref(appConfigs.value.viewMode);
const isPrinting = ref(false);

function printTimeTable() {
  if (isPrinting.value) return;
  isPrinting.value = true;
  oldMode.value = appConfigs.value.viewMode;
  appConfigs.value.viewMode = "old";
  document.body.classList.remove("preventPrint");
  window.setTimeout(() => {
    window.print();
    appConfigs.value.viewMode = oldMode.value;
    isPrinting.value = false;
    document.body.classList.add("preventPrint");
  }, 25);
}
const status = computed(() => appData.timetable.value.status);
const length = computed(() => appData.timetable.value.hours.length);
</script>

<template>
  <div class="configs__options" v-if="status == 200 && length > 0 && !isPrinting">
    <span class="configs__options__title"><b>Opcje</b></span>
    <div class="configs__options__option" @click="printTimeTable">
      <i class="configs__options__option__icon zsm-print-timetable-icon"></i>
      <span class="configs__options__option__name">Wydrukuj plan</span>
    </div>
  </div>
  <div v-else></div>
</template>

<style lang="scss">
.configs__options {
  margin-inline: 0.75rem;
  &__title {
    font-size: 1.1rem;
    + * {
      margin-top: 0.25rem;
    }
  }
  > *:not(span):not(label):not(:last-child) {
    margin-bottom: 0.25rem;
  }
  &__option {
    padding: 0.25rem 0.75rem 0.25rem 0;
    text-decoration: none;
    color: var(--sb-text);
    height: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &__icon {
      display: block;
      font-size: 20px;
      min-width: 40px;
      text-align: center;
    }
    &__name {
      width: 100%;
    }
    &:hover {
      background-color: var(--bg-sidebar-hover);
      color: var(--tt-text);
      border-radius: 6px;
    }
  }
}
.configs__options {
  margin-inline: 0.75rem;
  &__title {
    font-size: 1.1rem;
    + * {
      margin-top: 0.25rem;
    }
  }
  > *:not(span):not(label):not(:last-child) {
    margin-bottom: 0.25rem;
  }
  &__option {
    padding: 0.25rem 0.75rem 0.25rem 0;
    text-decoration: none;
    color: var(--sb-text);
    height: 50px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &__icon {
      display: block;
      font-size: 20px;
      min-width: 40px;
      text-align: center;
    }
    &__name {
      width: 100%;
    }
    &:hover {
      background-color: var(--bg-sidebar-hover);
      color: var(--tt-text);
      border-radius: 6px;
    }
  }
}
</style>
