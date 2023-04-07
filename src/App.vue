<script setup>
const PWAStore = usePWAStore();
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  PWAStore.event = e;
  PWAStore.installed = false;
});
</script>

<template>
  <Suspense>
    <RouterView />
  </Suspense>
</template>

<style>
*,
*::before,
*::after {
  user-select: none;
}
body {
  background-color: #f8f9fa !important;
}
</style>
