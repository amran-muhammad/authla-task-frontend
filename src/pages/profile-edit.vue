<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { defaultTheme } from '/@src/state/defaultLayoutState'
import { useHead } from '@vueuse/head'

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Tenrol'
useHead({
  title: 'Tenrol - Company',
})
import { useUserStore } from '/@src/stores/userStore'
const host = import.meta.env.VITE_API_BASE_URL
const userStore = useUserStore()
</script>

<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="dashboard"
  >
    <div class="page-content-inner">
      <div class="page-content-inner">
        <!--Edit Profile-->
        <div class="account-wrapper">
          <div class="columns">
            <!--Navigation-->
            <div class="column is-4">
              <div class="account-box is-navigation">
                <VBlock
                  :title="userStore.userData.name"
                  :subtitle="userStore.userData.name"
                  center
                >
                  <template #icon> </template>
                </VBlock>

                <div class="account-menu">
                  <RouterLink
                    :to="{ name: 'profile-edit' }"
                    class="account-menu-item"
                  >
                    <i aria-hidden="true" class="lnil lnil-user-alt"></i>
                    <span>Personal</span>
                    <span class="end">
                      <i aria-hidden="true" class="fas fa-arrow-right"></i>
                    </span>
                  </RouterLink>
                </div>
              </div>
            </div>
            <div class="column is-8">
              <RouterView v-slot="{ Component }">
                <component :is="Component" />
              </RouterView>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>


<style lang="scss">
@import '../scss/abstracts/_mixins.scss';
@import '../scss/pages/profile/_user-profile.scss';
</style>
