import { tryOnMounted } from '@vueuse/shared'
import { ref } from 'vue'
import { useResizeObserver, unrefElement } from '@vueuse/core'

export function useElementScrollbarSize (target) {
  const width = ref(0)
  const height = ref(0)

  const { stop } = useResizeObserver(target, ([entry]) => {
    const target = entry.target
    width.value = target.offsetWidth - target.clientWidth
    height.value = target.offsetHeight - target.clientHeight
  })

  tryOnMounted(() => {
    const ele = unrefElement(target)
    if (ele) {
      width.value = 'offsetWidth' in ele && 'clientWidth' in ele ? ele.offsetWidth - ele.clientWidth : 0
      height.value = 'offsetHeight' in ele && 'clientHeight' in ele ? ele.offsetHeight - ele.clientHeight : 0
    }
  })

  return {
    width,
    height,
    stop
  }
}
