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
const schoolData = useStorage('schoolData', {});
function titleParser(title) {
  if (!('teachers' in schoolData.value)) return title;
  if (schoolData.value.teachers[title] == undefined) {
    if (props.id == 'n') console.warn('Nieznany nauczyciel:', title);
    return title;
  }
  const data = schoolData.value.teachers[title];
  var out = '';
  switch (title) {
    case 'c.Centrum Kształcenia Zawodowego (CK)':
      out = 'CKZ (' + data.code + ')';
      break;
    case 'A.Aeroklub Rzeszowski (AA)':
    case 'E.Emeaero (EE)':
    case 'H.Heli One (HO)':
    case 'L.LineTech (LL)':
    case 'P.Pratt Whitney AeroPower (PT)':
    case 'S.Salony fryzjerskie (FR)':
      out = data.name + ' (' + data.code + ')';
      break;
    default:
      out = data.name.charAt(0) + '. ';
      if (data.surname) out = out + data.surname + ' ';
      out = out + '(' + data.code + ')';
      break;
  }
  return out;
}
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
        <li v-for="el in list" class="menu-item">
          <RouterLink
            class="d-flex align-items-center px-3 text-decoration-none"
            :to="{ name: 'plan', params: { mode: id, id: el.value } }"
          >
            <span class="menu-title">{{ titleParser(el.name) }}</span>
          </RouterLink>
        </li>
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
