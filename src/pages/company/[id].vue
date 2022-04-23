<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { defaultTheme } from '/@src/state/defaultLayoutState'

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Tenrol - The future of hiring'
useHead({
  title: 'Tenrol - The future of hiring',
})
</script>


<template>
  <GuestLayout :theme="defaultTheme" open-on-mounted default-sidebar="elements">
    <Company />
  </GuestLayout>
</template>