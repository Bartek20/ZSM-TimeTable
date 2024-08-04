<script setup>
const user = useRouteParams("user");
const mode = useRouteParams("mode");
const id = useRouteParams("id");
const overlay = ref();
function closeMenus() {
  document.querySelector("aside.sidebar")?.classList.remove("open");
  document.querySelector("aside.configs")?.classList.remove("open");
  overlay.value?.classList.remove("overlay--sidebar");
  overlay.value?.classList.remove("overlay--configs");
}
onMounted(() => {
  document.getElementById("loader-script")?.remove();
  document.getElementById("loader")?.remove();
});
</script>

<template>
  <AppSidebar />
  <AppTimeTable :key="user + mode + id" />
  <AppSettings />
  <div ref="overlay" class="overlay" @click="closeMenus"></div>
  <RouterLink
    v-if="user == 'uczen'"
    :to="{ name: 'plan', params: { user: 'nauczyciel' } }"
    style="display: none"
    id="teleporter"
  />
</template>

<style lang="scss">
.overlay {
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  transition: 0.4s background-color;
  &.overlay--configs {
    background-color: rgba(0 0 0 / 0.4);
    z-index: 10;
  }
  &.overlay + .exit-container {
    z-index: 25;
  }
  @include tablet {
    &.overlay--sidebar {
      background-color: rgba(0 0 0 / 0.4);
      z-index: 10;
    }
  }
  @include printer {
    display: none;
  }
}
</style>
