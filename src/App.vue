<script setup>
import { RouterView } from 'vue-router';
import { usePWAStore } from './stores/pwa';
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
  background-color: #cfe2ff !important;
}
</style>
