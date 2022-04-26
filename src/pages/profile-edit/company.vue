<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Company Profile'
useHead({
  title: 'Company Profile',
})
</script>

<template>
  <EditCompanyProfile />
</template>
