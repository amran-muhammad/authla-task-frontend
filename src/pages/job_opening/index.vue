<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import { defaultTheme } from '/@src/state/defaultLayoutState'

pageTitle.value = 'Job Openings'
useHead({
  title: 'Job Openings',
})
</script>

<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="elements"
  >
    <!-- Content Wrapper -->
    <div class="page-content-inner">
      <DataListJobOpening />
    </div>
  </DefaultLayout>
</template>

