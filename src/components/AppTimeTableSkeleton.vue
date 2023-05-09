<script setup>
onMounted(() => {
  document.getElementById('load').classList.add('d-none');
});
</script>

<template>
  <section id="timetable" class="z-0 w-100 h-100">
    <TimeTableTitle :title="''" :print="false" :mode="''" :id="''" />
    <TimeTableMessage :isLoading="true" :isEmpty="false" :isError="false" :mode="''" :status="0" />
  </section>
</template>

<style lang="scss">
#sidebar + #overlay + #timetable {
  max-width: calc(100% - 240px);
  @media (max-width: 991.98px) {
    max-width: 100%;
  }
}
#timetable {
  .buttons {
    height: 48px;
    background-color: #cfe2ff;
  }
}
</style>
