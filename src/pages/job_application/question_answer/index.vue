<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Question Answer'
useHead({
  title: 'Question Answer',
})
</script>


<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="elements"
  >
    <Promotion />
  </DefaultLayout>
</template>