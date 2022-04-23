<route lang="yaml">
meta:
  requiresAuth: true
</route>

<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Account Settings'
useHead({
  title: 'Account Settings',
})
</script>

<template>
  <EditSettings />
</template>
