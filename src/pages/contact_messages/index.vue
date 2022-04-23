<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import { defaultTheme } from '/@src/state/defaultLayoutState'
pageTitle.value = 'Contact Messages'
useHead({
  title: 'Contact Messages',
})
</script>

<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="elements"
  >
    <Message />
  </DefaultLayout>
</template>

