<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref, watchEffect, watchPostEffect } from 'vue'
import { useJobOpening } from '/@src/stores/jobOpening'
const jobOpening = useJobOpening()

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'New Job Opening'
useHead({
  title: 'New Job Opening',
})
onMounted(() => {
  jobOpening.newData()
})
</script>

<template>
  <div class="page-content-inner">
    <FormLayoutJobOpening />
  </div>
</template>
