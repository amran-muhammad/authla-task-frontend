<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import { defaultTheme } from '/@src/state/defaultLayoutState'

pageTitle.value = 'Job'
useHead({
  title: 'Job',
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
      <ProjectDetailsV1 />
    </div>
  </DefaultLayout>
</template>
