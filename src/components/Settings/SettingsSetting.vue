<script setup>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const status = defineModel({ required: true });
</script>

<template>
  <label class="configs__setting">
    <i class="configs__setting__icon" :class="icon"></i>
    <span class="configs__setting__text">{{ name }}</span>
    <div class="configs__setting__toggle">
      <input
        class="configs__setting__toggle__checkbox"
        type="checkbox"
        v-model="status"
      />
      <div class="configs__setting__toggle__slider"></div>
    </div>
  </label>
</template>

<style lang="scss">
.configs__setting {
  &:first-of-type {
    display: none;
    @include phone {
      display: flex;
    }
  }
  padding: 0.25rem 0.75rem 0.25rem 0;
  text-decoration: none;
  color: var(--sb-text);
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &__icon {
    display: block;
    font-size: 20px;
    min-width: 40px;
    text-align: center;
  }
  &__text {
    width: 100%;
  }
  &__toggle {
    position: relative;
    display: inline-block;
    min-width: 40px;
    height: 23px;
    &__checkbox {
      display: none;
      &:checked + .configs__setting__toggle__slider {
        background-color: $accent-color;
        &::before {
          transform: translateX(17px);
        }
      }
      &:focus + .configs__setting__toggle__slider {
        box-shadow: 0 0 1px $accent-color;
      }
    }
    &__slider {
      position: absolute;
      inset: 0;
      background-color: lighten(red, 10);
      transition: 0.4s;
      border-radius: 34px;
      &:before {
        position: absolute;
        content: "";
        height: 17px;
        width: 17px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
    }
  }
  &:hover {
    background-color: var(--bg-sidebar-hover);
    color: var(--tt-text);
    border-radius: 6px;
  }
}
</style>
