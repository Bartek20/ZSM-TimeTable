<script setup>
const plansStore = usePlansStore();
const mode = useRouteParams('mode');
const id = useRouteParams('id');
</script>

<template>
  <Suspense :timeout="0">
    <AppTimeTable :print="true" :mode="mode" :id="id" :key="mode + id" />
    <template #fallback>
      <AppTimeTableSkeleton />
    </template>
  </Suspense>
</template>
