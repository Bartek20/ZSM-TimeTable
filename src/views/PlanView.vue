<script setup>
const plansStore = usePlansStore();
const mode = useRouteParams('mode');
const id = useRouteParams('id');
async function load() {
  const last = window.localStorage.getItem('lastFetched');
  if (import.meta.env.MODE == 'development') return;
  if (last != null && last + 86400000 > Date.now()) return;
  console.log('Waiting for SW before fetching...');
  var i = 0;
  while (window.WorkerReady == undefined && i < 600) {
    await sleep(100);
    i++;
  }
  await sleep(3000);
  console.log('Fetching timetable updates...');
  plansStore.getTimeTable();
  window.localStorage.setItem('lastFetched', Date.now());
}
load();
</script>

<template>
  <Suspense>
    <AppSidebar />
    <template #fallback>
      <AppSidebarSkeleton />
    </template>
  </Suspense>
  <Suspense :timeout="0">
    <AppTimeTable :print="false" :mode="mode" :id="id" :key="mode + id" />
    <template #fallback>
      <AppTimeTableSkeleton />
    </template>
  </Suspense>
</template>
