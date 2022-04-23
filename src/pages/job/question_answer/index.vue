<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { computed, onMounted, ref, watchEffect, watchPostEffect } from 'vue'
import { useJobOpening } from '/@src/stores/jobOpening'
const jobOpening = useJobOpening()

import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Question Answer'
useHead({
  title: 'Question Answer' + jobOpening.job_opening_name,
})
</script>

<template>
  <GuestLayout :theme="defaultTheme" open-on-mounted default-sidebar="elements">
    <QuestionAnswer />
  </GuestLayout>
</template>
