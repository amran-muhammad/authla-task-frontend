<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { defaultTheme } from '/@src/state/defaultLayoutState'
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Settings'
useHead({
  title: 'Settings',
})
</script>

<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="elements"
  >
    <div class="page-content-inner">
      <SettingsProfile />
    </div>
  </DefaultLayout>
</template>




