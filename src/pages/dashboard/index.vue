<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { defaultTheme } from '/@src/state/defaultLayoutState'
import { useHead } from '@vueuse/head'

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Dashboard'
useHead({
  title: 'Dashboard',
})
</script>

<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="dashboard"
  >
    <div class="page-content-inner">
      <JobDashboard />
    </div>
  </DefaultLayout>
</template>

