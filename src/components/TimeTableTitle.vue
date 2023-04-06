<script setup>
import { TEACHERS } from '@/functions/constants';
import { useRoute } from 'vue-router';
const route = useRoute();
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
function titleParser(title) {
  if (TEACHERS[title] == undefined) return title;
  title = TEACHERS[title];
  var out = title.name;
  if (title.surname) out = out + ' ' + title.surname;
  out = out + ' (' + title.code + ')';
  return out;
}
function sidebarToggle() {
  const el = document.getElementById('sidebar');
  if (el) el.classList.toggle('toggled');
}
function timetablePrint() {
  window.open(`${import.meta.env.BASE_URL}/plan_nauczyciele/plany/${route.params.mode + route.params.id}.html`, '_blank');
}
</script>

<template>
  <div class="title">
    <div class="icon">
      <div class="sb-btn-open" @click="sidebarToggle">
        <i class="menu zsm-menu-icon"></i>
      </div>
    </div>
    <div class="text">
      <h3>{{ titleParser(title) }}</h3>
    </div>
    <div class="icon">
      <div class="btn-print">
        <i class="menu zsm-print-icon" @click="timetablePrint"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.row.title {
  align-items: center;
}
.icon {
  margin: auto;
  padding-inline: 12px;
  width: 56px;
  i {
    font-size: 32px;
    display: block;
  }
}
.text {
  width: calc(100% - 112px);
  display: flex;
  align-items: center;
  justify-content: center;
  h3 {
    overflow: hidden;
    margin: 0;
    white-space: nowrap;
  }
}
.sb-btn-open {
  display: none;
}
#sidebar + #overlay + #timetable {
  .sb-btn-open {
    @media (max-width: 991.98px) {
      display: flex;
      align-items: center;
    }
  }
}
.title {
  height: 50px;
  display: flex;
}
</style>
