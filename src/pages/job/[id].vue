<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref, watchEffect, watchPostEffect } from 'vue'
import { useJobOpening } from '/@src/stores/jobOpening'
import { defaultTheme } from '/@src/state/defaultLayoutState'
const jobOpening: any = useJobOpening()

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Job'
let titleMadeFromUrl = window.location.pathname
  .substring(5)
  .split('-')
  .map((data) => data.charAt(0).toUpperCase() + data.slice(1))
  .join(' ')
  .replace(/[0-9]/g, '')

useHead({
  title: 'Job - ' + titleMadeFromUrl,
})
</script>


<template>
  <GuestLayout :theme="defaultTheme" open-on-mounted default-sidebar="elements">
    <!-- Content Wrapper -->
    <Job />
  </GuestLayout>
</template>