<script setup lang="ts">
import { ref, watchPostEffect, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

import { activePanel } from '/@src/state/activePanelState'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import { useUserSession } from '/@src/stores/userSession'

const userSession = useUserSession()
const userStore = useUserStore()
const router = useRouter()

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
  pageTitle.value = window.document.title
})
</script>

<template>
  <div class="sidebar-layout">
    <div class="app-overlay"></div>

    <!-- Mobile navigation -->
    <MobileNavbar
      :is-open="isMobileSidebarOpen"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #brand>
        <RouterLink :to="{ name: 'index' }" class="navbar-item is-brand">
          <AnimatedLogoSidebar width="38px" height="38px" />
        </RouterLink>

        <div class="brand-end">
          <!-- <NotificationsMobileDropdown /> -->
          <UserProfileDropdown />
        </div>
      </template>
    </MobileNavbar>

    <!-- Mobile sidebar links -->
    <MobileSidebar
      :is-open="isMobileSidebarOpen"
      :theme="props.theme"
      @toggle="isMobileSidebarOpen = !isMobileSidebarOpen"
    >
      <template #links>
        <li>
          <RouterLink :to="{ name: 'dashboard' }" data-content="Dashboard">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:activity"
            ></i>
          </RouterLink>
        </li>

        <li
          v-if="
            userStore.userData.type == 'teacher' ||
            userStore.userData.type == 'admin'
          "
        >
          <RouterLink :to="{ name: 'schedules' }" data-content="Schedules">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:grid"
            ></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            :to="{ name: 'schedule-applications' }"
            data-content="Applications"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:box"
            ></i>
          </RouterLink>
        </li>
        <li v-if="userStore.userData.type == 'admin'">
          <RouterLink :to="{ name: 'students' }" data-content="Students">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:users"
            ></i>
          </RouterLink>
        </li>
        <!-- Job Openings -->
        <li v-if="userStore.userData.type == 'admin'">
          <RouterLink :to="{ name: 'teachers' }" data-content="Teachers">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:users"
            ></i>
          </RouterLink>
        </li>
      </template>
    </MobileSidebar>

    <!-- Mobile subsidebar links -->
    <!-- <transition name="slide-x">
      <LayoutsMobileSubsidebar
        v-if="isMobileSidebarOpen && activeMobileSubsidebar === 'layout'"
      />
      <DashboardsMobileSubsidebar
        v-else-if="
          isMobileSidebarOpen && activeMobileSubsidebar === 'dashboard'
        "
      />
      <ComponentsMobileSubsidebar
        v-else-if="
          isMobileSidebarOpen && activeMobileSubsidebar === 'components'
        "
      />
      <ElementsMobileSubsidebar
        v-else-if="isMobileSidebarOpen && activeMobileSubsidebar === 'elements'"
      />
    </transition> -->

    <!-- Desktop navigation -->
    <CircularMenu />

    <Sidebar :theme="props.theme" :is-open="isDesktopSidebarOpen">
      <template #links>
        <!-- Dashboards -->
        <li>
          <RouterLink :to="{ name: 'dashboard' }" data-content="Dashboards">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:bar-chart-2"
            ></i>
          </RouterLink>
        </li>

        <!-- Job Application -->
        <li
          v-if="
            userStore.userData.type == 'teacher' ||
            userStore.userData.type == 'admin'
          "
        >
          <RouterLink :to="{ name: 'schedules' }" data-content="Schedules">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:briefcase"
            ></i>
          </RouterLink>
        </li>

        <!-- Job Openings -->
        <li>
          <RouterLink
            :to="{ name: 'schedule-applications' }"
            data-content="Applications"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:users"
            ></i>
          </RouterLink>
        </li>
        <!-- Job Openings -->
        <li v-if="userStore.userData.type == 'admin'">
          <RouterLink :to="{ name: 'students' }" data-content="Students">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:users"
            ></i>
          </RouterLink>
        </li>
        <!-- Job Openings -->
        <li v-if="userStore.userData.type == 'admin'">
          <RouterLink :to="{ name: 'teachers' }" data-content="Teachers">
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:users"
            ></i>
          </RouterLink>
        </li>
        <!-- Job Openings -->
      </template>

      <template #bottom-links>
        <!-- Switch Sidebar  Layouts -->
        <li class="is-hidden-touch">
          <LayoutSwitcher />
        </li>

        <!-- Search -->
        <!-- <li class="right-panel-trigger is-hidden-touch">
          <a
            aria-label="Display search panel"
            data-content="Search"
            @click="activePanel = 'search'"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather-search"
            />
          </a>
          <a
            aria-label="Close all panels"
            class="is-hidden is-inactive"
            @click="activePanel = 'none'"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather-x"
            />
          </a>
        </li> -->

        <!-- Settings -->
        <!-- <li class="is-hidden-touch">
          <RouterLink
            id="open-settings"
            :to="{ name: 'settings' }"
            data-content="Settings"
          >
            <i
              aria-hidden="true"
              class="iconify sidebar-svg"
              data-icon="feather:settings"
            ></i>
          </RouterLink>
        </li> -->

        <!-- Profile Dropdown -->
        <li>
          <UserProfileDropdown up />
        </li>
      </template>
    </Sidebar>

    <!-- <transition name="slide-x">
      <ComponentsSubsidebar
        v-if="isDesktopSidebarOpen && activeMobileSubsidebar === 'components'"
        @close="isDesktopSidebarOpen = false"
      />
      <ElementsSubsidebar
        v-else-if="
          isDesktopSidebarOpen && activeMobileSubsidebar === 'elements'
        "
        @close="isDesktopSidebarOpen = false"
      />
      <DashboardsSubsidebar
        v-else-if="
          isDesktopSidebarOpen && activeMobileSubsidebar === 'dashboard'
        "
        @close="isDesktopSidebarOpen = false"
      />
      <LayoutsSubsidebar
        v-else-if="isDesktopSidebarOpen && activeMobileSubsidebar === 'layout'"
        @close="isDesktopSidebarOpen = false"
      />
    </transition> -->

    <!-- <LanguagesPanel /> -->
    <ActivityPanel />
    <SearchPanel />
    <TaskPanel />

    <div class="view-wrapper">
      <div class="page-content-wrapper">
        <template v-if="props.nowrap">
          <slot></slot>
        </template>
        <div v-else class="page-content is-relative">
          <div class="page-title has-text-centered">
            <!-- Sidebar Trigger -->
            <div class="vuero-hamburger nav-trigger push-resize">
              <span class="menu-toggle has-chevron">
                <span
                  :class="[isDesktopSidebarOpen && 'active']"
                  class="icon-box-toggle"
                >
                  <span class="rotate">
                    <i aria-hidden="true" class="icon-line-top"></i>
                    <i aria-hidden="true" class="icon-line-center"></i>
                    <i aria-hidden="true" class="icon-line-bottom"></i>
                  </span>
                </span>
              </span>
            </div>

            <div class="title-wrap">
              <h1 class="title is-4">{{ pageTitle }}</h1>
            </div>

            <Toolbar class="desktop-toolbar">
              <!-- 
              <a
                class="toolbar-link right-panel-trigger"
                aria-label="View activity panel"
                @click="activePanel = 'activity'"
              >
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:grid"
                ></i>
              </a> -->
            </Toolbar>
          </div>

          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>
