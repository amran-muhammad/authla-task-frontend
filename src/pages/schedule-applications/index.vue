<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { defaultTheme } from '/@src/state/defaultLayoutState'
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


