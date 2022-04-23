<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'
import { isLargeScreen } from '/@src/state/responsiveState'
import VueScrollTo from 'vue-scrollto'

import { isDark } from '/@src/state/darkModeState'
import { useRouter } from 'vue-router'
import { useUserSession } from '/@src/stores/userSession'
const userSession = useUserSession()

const isMobileNavOpen = ref(false)
const router = useRouter()
const scrollTo = VueScrollTo.scrollTo

const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 30
})

watchEffect(() => {
  if (isLargeScreen.value) {
    isMobileNavOpen.value = false
    // isDark.value = false
  }
})
</script>

<template>
  <nav
    class="navbar is-fixed-top is-transparent"
    :class="[!isScrolling && 'is-docked', isMobileNavOpen && 'is-solid']"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <RouterLink :to="{ name: 'index' }" class="navbar-item">
        <div class="brand-icon">
          <AnimatedLogoNavbar width="34px" height="34px" />
        </div>
      </RouterLink>

      <a
        role="button"
        :class="[isMobileNavOpen && 'is-active']"
        class="navbar-burger burger"
        aria-label="menu"
        aria-expanded="false"
        tabindex="0"
        @click="isMobileNavOpen = !isMobileNavOpen"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu" :class="[isMobileNavOpen && 'is-active']">
      <div class="navbar-start">
        <div class="navbar-item">
          <RouterLink :to="{ name: 'index' }" class="nav-link is-scroll">
            <span :style="isDark ? 'color:#fff' : ''">Home</span>
          </RouterLink>
        </div>
        <div class="navbar-item">
          <RouterLink :to="{ name: 'pricing' }" class="nav-link is-scroll">
            <span :style="isDark ? 'color:#fff' : ''">Pricing</span>
          </RouterLink>
        </div>
        <div class="navbar-item">
          <RouterLink :to="{ name: 'contact-us' }" class="nav-link is-scroll">
            <span :style="isDark ? 'color:#fff' : ''"> Contact Us </span>
          </RouterLink>
        </div>
        <div class="navbar-item">
          <RouterLink :to="{ name: 'about-us' }" class="nav-link is-scroll">
            <span :style="isDark ? 'color:#fff' : ''">About Us</span>
          </RouterLink>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item is-theme-toggle">
          <label class="theme-toggle">
            <input
              id="navbar-night-toggle--daynight"
              v-model="isDark"
              type="checkbox"
            />
            <!-- <span class="toggler">
              <span class="dark">
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:moon"
                ></i>
              </span>
              <span class="light">
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:sun"
                ></i>
              </span>
            </span> -->
          </label>
        </div>

        <div v-if="!userSession.token" class="navbar-item">
          <RouterLink :to="{ name: 'login' }" class="nav-link">
            <span :style="isDark ? 'color:#fff' : ''">Sign in</span>
          </RouterLink>
        </div>
        <div v-if="!userSession.token" class="navbar-item">
          <VButton
            :to="{ name: 'registration' }"
            color="primary"
            rounded
            raised
          >
            <strong>Sign up</strong>
          </VButton>
        </div>
        <div v-if="userSession.token" class="navbar-item">
          <RouterLink :to="{ name: 'dashboard' }" class="nav-link">
            <span :style="isDark ? 'color:#fff' : ''">Dashboard</span>
          </RouterLink>
        </div>
        <div v-if="userSession.token" class="navbar-item">
          <VButton
            @click="userSession.logoutUser"
            color="primary"
            rounded
            raised
          >
            <strong>Logout</strong>
          </VButton>
        </div>
      </div>
    </div>
  </nav>
</template>