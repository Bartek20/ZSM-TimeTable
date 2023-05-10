<script setup>
const progress = useStorage('progress', '');
progress.value = '';
const currentData = useStorage('schoolData', {});
const classes = ref([]);

const specialities = ref({});
const teachers = ref({});
const subjects = ref({});
onMounted(() => {
  document.getElementById('load').classList.add('d-none');
});

function loadList() {
  return new Promise(async (resolve) => {
    var out = [];
    const URL = `${location.host != 'zsm.resman.pl' ? import.meta.env.BASE_URL : '/'}plan_nauczyciele/lista.html`;
    const res = await axios.get(URL);
    const lists = new TimeTableList(res.data).getList();
    classes.value = lists.classes;
    lists.teachers.forEach((teacher) => out.push(teacher.name));
    out.forEach((teacher) => (teachers.value[teacher] = currentData.value.teachers[teacher]));
    progress.value = `1 / ${classes.value.length + 1}`;
    resolve();
  });
}
function loadPlans() {
  return new Promise(async (resolve) => {
    var out = {
      specialities: [],
      subjects: [],
    };
    for (let i = 1; i <= classes.value.length; i++) {
      const URL = `${location.host != 'zsm.resman.pl' ? import.meta.env.BASE_URL : '/'}plan_nauczyciele/plany/o${i}.html`;
      const res = await axios.get(URL);
      const TT = new TimeTable(res.data);
      TT.getTitle()
        .match(/(\d\w+) (\d)([\w ]+)/)[3]
        .split(' ')
        .forEach((speciality) => out.specialities.push(speciality));
      const days = TT.getDays();
      days.forEach((day) => {
        day.forEach((lesson) => {
          lesson.forEach((group) =>
            group.subject.includes('ckz') ? out.subjects.push('praktyki') : out.subjects.push(group.subject)
          );
        });
      });
      progress.value = `${i + 1} / ${classes.value.length + 1}`;
    }
    out.specialities = Array.from(new Set(out.specialities));
    out.specialities.forEach((speciality) => (specialities.value[speciality] = currentData.value.classes[speciality]));
    out.subjects = Array.from(new Set(out.subjects));
    out.subjects.forEach((subject) => (subjects.value[subject] = currentData.value.subjects[subject]));
    resolve();
  });
}
await loadList();
await loadPlans();
progress.value = '';
</script>

<template>
  <section id="generator" class="z-0 w-100 h-100"></section>
</template>

<style lang="scss">
#timetable {
  max-width: calc(100% - 240px);
}
</style>
