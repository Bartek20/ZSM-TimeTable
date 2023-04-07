<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  print: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});
const color = computed(() => (props.print || props.title == '' ? undefined : '#cfe2ff'));
function titleParser(title) {
  if (TEACHERS[title] == undefined) {
    const symbol = props.print ? ' - ' : ' | ';
    document.title = title + symbol + 'Plan Lekcji';
    return title;
  }
  title = TEACHERS[title];
  var out = title.name;
  if (title.surname) out = out + ' ' + title.surname;
  const symbol = props.print ? ' - ' : ' | ';
  document.title = out + symbol + 'Plan Lekcji';
  out = out + ' (' + title.code + ')';
  return out;
}
function sidebarToggle() {
  const el = document.getElementById('sidebar');
  if (el) el.classList.toggle('toggled');
}
function timetablePrint() {
  window.open(`${import.meta.env.BASE_URL}print/${props.mode}/${props.id}`, '_blank');
}
</script>

<template>
  <div class="timetable-header d-flex">
    <div class="fn-btn m-auto px-2">
      <div v-if="!print" class="sb-btn-open d-none align-items-center" @click="sidebarToggle">
        <i class="d-block zsm-menu-icon"></i>
      </div>
    </div>
    <div class="text d-flex align-items-center justify-content-center">
      <h3 class="m-0 text-nowrap overflow-hidden">{{ titleParser(title) }}</h3>
    </div>
    <div class="fn-btn m-auto px-2">
      <div v-if="title != '' && !print" class="btn-print" @click="timetablePrint">
        <i class="d-block zsm-print-icon"></i>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$header-height: 48px;
.timetable-header {
  background-color: v-bind(color);
  height: $header-height;
  .fn-btn {
    width: $header-height;
    i {
      font-size: 32px;
    }
  }
  .text {
    width: calc(100% - ($header-height * 2));
  }
}
#sidebar + #overlay + #timetable {
  .sb-btn-open {
    @media (max-width: 991.98px) {
      display: flex !important;
    }
  }
}
</style>
