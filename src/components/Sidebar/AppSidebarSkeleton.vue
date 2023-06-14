<script setup>
function sidebarClose() {
  const el = document.getElementById('sidebar');
  if (el) {
    el.classList.toggle('toggled');
  }
}
</script>

<template>
  <section id="sidebar" class="z-4 minh-100 mh-100 h-100 position-relative overflow-x-hidden">
    <div class="sb-btn-close position-absolute z-7 d-none" @click="sidebarClose">
      <i class="menu zsm-close-icon"></i>
    </div>
    <div class="image-wrapper position-absolute inset-0 overflow-hidden z-5">
      <img class="w-100 h-100 object-fit-cover object-position-center" src="/assets/images/sidebar-bg.jpg" alt="" />
    </div>
    <div class="sidebar-layout z-6 minh-100 mh-100 h-100 d-flex flex-column position-relative">
      <SidebarHeader />
      <div class="sidebar-content flex-grow-1 my-2 overflow-y-auto">
        <nav class="menu open-current-submenu"></nav>
      </div>
      <SidebarFooter />
    </div>
  </section>
  <section id="sidebarOverlay" class="z-n1 position-fixed inset-0" @click="sidebarClose"></section>
</template>

<style lang="scss">
$sidebar-width: 240px;
#sidebar {
  color: #7d84ab;
  min-width: $sidebar-width;
  max-width: $sidebar-width;
  @media (max-width: 991.98px) {
    transition: left 0.3s;
    position: fixed !important;
    top: 0;
    left: 0;
    &:not(.toggled) {
      left: -#{$sidebar-width};
    }
  }
  .sb-btn-close {
    right: 8px;
    top: 8px;
    font-size: 32px;
    @media (max-width: 991.98px) {
      display: block !important;
    }
  }
  .image-wrapper {
    background-color: #0c1e35;
  }
  .sidebar-layout {
    background-color: rgba(#0c1e35, 0.7);
    .sidebar-content {
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
      }
      &:hover {
        &::-webkit-scrollbar-thumb {
          background-color: lighten(#0c1e35, 15);
        }
      }
      &::-webkit-scrollbar {
        width: 6px;
        background-color: #0c1e35;
      }
    }
  }
}
@media (max-width: 991.98px) {
  #sidebar.toggled + #sidebarOverlay {
    z-index: 3 !important;
    background-color: rgba(0, 0, 0, 0.4);
  }
}
</style>
