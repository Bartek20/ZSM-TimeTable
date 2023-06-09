<script setup>
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
  axios.get(`${import.meta.env.BASE_URL}school-data.json`);
  const res = await axios.get('/plan_vulcan/lista.html');
  const list = new TimeTableList(res.data).getList();
  list.classes.forEach((obj) => {
    axios.get(`/plan_vulcan/plany/o${obj.value}.html`);
  });
  list.teachers.forEach((obj) => {
    axios.get(`/plan_vulcan/plany/n${obj.value}.html`);
  });
  list.rooms.forEach((obj) => {
    axios.get(`/plan_vulcan/plany/s${obj.value}.html`);
  });
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
