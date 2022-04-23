<script setup lang="ts">
import { defaultTheme } from '/@src/state/defaultLayoutState'
</script>

<template>
  <GuestLayout :theme="defaultTheme" open-on-mounted default-sidebar="elements">
    <!-- Content Wrapper -->
    <RouterView v-slot="{ Component }">
      <transition name="translate-page-y" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </GuestLayout>
</template>
