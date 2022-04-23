<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Contact Us'
useHead({
  title: 'Contact Us',
})
</script>

<template>
  <MinimalLayout theme="light">
    <div class="landing-page-wrapper">
      <!-- Hero and Navbar -->
      <div id="vuero-landing" class="hero is-fullheight rounded-hero is-active">
        <LandingNavigation />

        <div class="section">
          <div class="container">
            <!--Title-->
            <div class="section-title has-text-centered">
              <h2 class="title is-2">Contact Us</h2>
              <p>
                Learn what makes us one of the fastest growing HR software
                solutions!
              </p>
            </div>

            <FormContact />
          </div>
        </div>

        <LandingFooter />
      </div>
    </div>
  </MinimalLayout>
</template>
