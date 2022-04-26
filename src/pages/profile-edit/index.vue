<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'User Profile'
useHead({
  title: 'User Profile',
})
</script>

<template>
  <EditPersonalProfile />
</template>
