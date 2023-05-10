<script setup>
onMounted(() => {
  document.getElementById('load').classList.add('d-none');
  if (!window.LoadingStatus) window.LoadingStatus = '';
});
const progress = useLocalStorage('progress', '');
</script>

<template>
  <section id="generator" class="generator-msg z-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
    <i class="zsm-loading-icon p-4 loading"></i>
    <h5 class="mt-2 text-wrap text-center">Trwa wczytywanie danych z aktualnego planu lekcji</h5>
    <h5 class="mt-2 text-wrap text-center">{{ progress }}</h5>
  </section>
</template>

<style lang="scss">
#generator.generator-msg {
  .loading {
    animation: spin 2s linear infinite;
  }
  i {
    font-size: 64px;
  }
}
</style>
