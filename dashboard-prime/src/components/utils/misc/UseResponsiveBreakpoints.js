import { useWindowSize } from '@vueuse/core'
import { computed, watch, ref } from 'vue'
import ResponsiveBreakpoints from '@/components/utils/misc/ResponsiveBreakpoints.js'

export const useResponsiveBreakpoints = () => {

  const windowSize = useWindowSize()

  const currentWidth = ref(windowSize.width)
  watch(() => windowSize.width,
    (newWidth) => {
      currentWidth.value = newWidth
    }
  )

  // true when less than small (xs)
  const sm = computed(() => {
    return currentWidth.value < ResponsiveBreakpoints.sm
  })
  // md = true when small or smaller
  const md = computed(() => currentWidth.value < ResponsiveBreakpoints.md)
  // lg = true when md or smaller
  const lg = computed(() => currentWidth.value < ResponsiveBreakpoints.lg)
  // xl = true when lg or smaller (anything xl or larger, then all of these are false)
  const xl = computed(() => currentWidth.value < ResponsiveBreakpoints.xl)

  const width = computed(() => currentWidth.value)
  return {
    currentWidth,
    width,
    sm,
    md,
    lg,
    xl
  }
}