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
import { useCompany } from '/@src/stores/company'
const host = import.meta.env.VITE_API_BASE_URL
const company = useCompany()
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
                  :title="company.extra_data.name"
                  :subtitle="company.data.name"
                  center
                >
                  <template #icon>
                    <VAvatar
                      size="large"
                      :picture="host + company.extra_data.logo"
                    />
                    <!-- badge="/images/icons/flags/united-states-of-america.svg" -->
                  </template>
                </VBlock>

                <div class="account-menu">
                  <RouterLink
                    :to="{ name: 'company-profile-edit' }"
                    class="account-menu-item"
                  >
                    <i aria-hidden="true" class="lnil lnil-user-alt"></i>
                    <span>Personal</span>
                    <span class="end">
                      <i aria-hidden="true" class="fas fa-arrow-right"></i>
                    </span>
                  </RouterLink>

                  <RouterLink
                    :to="{ name: 'company-profile-edit-company' }"
                    class="account-menu-item"
                  >
                    <i class="lnir lnir-briefcase" aria-hidden="true"></i>
                    <span>Company</span>
                    <span class="end">
                      <i aria-hidden="true" class="fas fa-arrow-right"></i>
                    </span>
                  </RouterLink>
                  <RouterLink
                    :to="{ name: 'company-profile-edit-settings' }"
                    class="account-menu-item"
                  >
                    <i aria-hidden="true" class="lnil lnil-cog"></i>
                    <span>Settings</span>
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
