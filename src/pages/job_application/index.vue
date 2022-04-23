<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { defaultTheme } from '/@src/state/defaultLayoutState'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Job Applications'
useHead({
  title: 'Job Applications',
})
</script>

<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="dashboard"
  >
    <!-- Content Wrapper -->
    <div class="page-content-inner">
      <JobsDashboard />
    </div>
  </DefaultLayout>
</template>


