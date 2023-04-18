<script setup>
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
});
const emits = defineEmits(['selectList']);
</script>

<template>
  <li class="menu-item sub-menu position-relative">
    <a href="#" @click="$emit('selectList', $event)" class="d-flex align-items-center px-3 text-decoration-none">
      <span class="menu-icon text-center d-inline-block me-2 rounded-1">
        <i :class="symbol" class="d-inline-block"></i>
      </span>
      <span class="menu-title overflow-hidden text-nowrap flex-grow-1">{{ name }}</span>
    </a>
    <div class="sub-menu-list visible position-static translate-0-0 ps-3 overflow-hidden z-999">
      <ul class="m-0 p-0 list-unstyled">
        <SidebarLink v-for="el in list" :mode="id" :id="el.value" :name="el.name" />
      </ul>
    </div>
  </li>
</template>

<style lang="scss">
$text-color: #7d84ab;
$secondary-text-color: #dee2ec;
$bg-color: #0c1e35;
$secondary-bg-color: #0b1a2c;
.menu {
  .menu-item {
    a {
      height: 50px;
      color: $text-color;
      .menu-icon {
        font-size: 1.2rem;
        width: 35px;
        min-width: 35px;
        height: 35px;
        line-height: 35px;
        transition: color 0.3s;
      }
      .menu-title {
        font-size: 0.9em;
        text-overflow: ellipsis;
        transition: color 0.3s;
      }
      &:hover {
        .menu-title {
          color: $secondary-text-color;
        }
        .menu-icon {
          color: $secondary-text-color;
          i {
            animation: swing ease-in-out 0.5s 1 alternate;
          }
        }
        &::after {
          border-color: $secondary-text-color !important;
        }
      }
    }
    &.sub-menu {
      > a {
        &::after {
          content: '';
          transition: transform 0.3s;
          border-right: 2px solid currentcolor;
          border-bottom: 2px solid currentcolor;
          width: 5px;
          height: 5px;
          transform: rotate(-45deg);
        }
      }
      > .sub-menu-list {
        display: none;
      }
      &.open {
        > a {
          color: $secondary-text-color;
          &::after {
            transform: rotate(45deg);
          }
        }
      }
    }
  }
  > ul > .sub-menu.open {
    background-color: rgba($secondary-bg-color, 0.5);
  }
}
</style>
