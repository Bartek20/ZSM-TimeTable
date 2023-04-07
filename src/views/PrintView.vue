<script setup>
const plansStore = usePlansStore();
const route = useRoute();
const mode = route.params.mode;
const id = route.params.id;
await plansStore.loadPlan(mode, id);
</script>

<template>
  <AppTimeTable :print="true" :mode="mode" :id="id" :key="mode + id" />
</template>
