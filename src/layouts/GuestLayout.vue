<script setup lang="ts">
import { ref, watchPostEffect, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useJobOpening } from '../stores/jobOpening'

import { activePanel } from '/@src/state/activePanelState'
import { pageTitle } from '/@src/state/sidebarLayoutState'

export type SidebarTheme =
  | 'default'
  | 'color'
  | 'color-curved'
  | 'curved'
  | 'float'
  | 'labels'
  | 'labels-hover'

const props = withDefaults(
  defineProps<{
    theme?: SidebarTheme
    defaultSidebar?: string
    closeOnChange?: boolean
    openOnMounted?: boolean
    nowrap?: boolean
  }>(),
  {
    defaultSidebar: 'dashboard',
    theme: 'default',
  }
)

const route = useRoute()
const isMobileSidebarOpen = ref(false)
const isDesktopSidebarOpen = ref(false)
const activeMobileSubsidebar = ref(props.defaultSidebar)
const jobOpening = useJobOpening()

function switchSidebar(id: string) {
  if (id === activeMobileSubsidebar.value) {
    isDesktopSidebarOpen.value = !isDesktopSidebarOpen.value
  } else {
    isDesktopSidebarOpen.value = true
    activeMobileSubsidebar.value = id
  }
}

/**
 * watchPostEffect callback will be executed each time dependent reactive values has changed
 */
watchPostEffect(() => {
  const isOpen = isDesktopSidebarOpen.value
  const wrappers = document.querySelectorAll('.view-wrapper')

  wrappers.forEach((wrapper) => {
    if (isOpen === false) {
      wrapper.classList.remove('is-pushed-full')
    } else if (!wrapper.classList.contains('is-pushed-full')) {
      wrapper.classList.add('is-pushed-full')
    }
  })
})
watch(
  () => route.fullPath,
  () => {
    isMobileSidebarOpen.value = false

    if (props.closeOnChange && isDesktopSidebarOpen.value) {
      isDesktopSidebarOpen.value = false
    }
  }
)
onMounted(() => {
  pageTitle.value =
    window.document.title == 'Question Answer'
      ? jobOpening.job_opening_name
      : ' '
})
</script>

<template>
  <div class="sidebar-layout">
    <div class="view-wrapper">
      <div class="page-content-wrapper">
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <div v-else class="page-content is-relative">
          <div class="page-title has-text-centered">
            <div class="title-wrap">
              <h1 class="title is-4">{{ pageTitle }}</h1>
            </div>
            <!-- <Toolbar class="desktop-toolbar"> </Toolbar> -->
          </div>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
