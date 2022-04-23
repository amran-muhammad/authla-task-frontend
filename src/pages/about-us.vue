<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'About Us'
useHead({
  title: 'About Us',
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
              <h2 class="title is-2">About Us</h2>
              <p>Welcome to Tenrol HR recruitment solution. <br /></p>
            </div>
            <div class="video-section p-t-50">
              <div class="columns is-vcentered">
                <div class="column is-8">
                  <div class="columns is-multiline b-columns-half-tablet-p">
                    <div class="column is-6">
                      <div class="py-2 medium:py-4">
                        <h4 class="title is-5 is-narrow">Who we are?</h4>
                        <p class="pt-2 max-w-3 text-medium">
                          The Tenrol team consists of talent in both software
                          development and business. They push the boundaries
                          when it comes to HR and recruitment software.
                        </p>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="py-2 medium:py-4">
                        <h4 class="title is-5 is-narrow">What do we do?</h4>
                        <p class="pt-2 max-w-3 text-medium">
                          Recruitment & HR teams can use our software to test
                          and interview candidates applying for a specific job
                          by simulating a face to face interview experience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="column is-4 is-relative is-centered-portrait">
                  <!--Video PLayer-->
                  <img
                    class="about-img"
                    src="/@src/assets/parts/features/about-1.png"
                    alt="3d design - our DNA laptop on top of desk cactus tree - tenrol.com recruitment solution"
                  />
                </div>
              </div>
              <div class="columns is-vcentered m-t-70">
                <div class="column is-4 is-relative is-centered-portrait">
                  <!--Video PLayer-->
                  <img
                    class="about-img"
                    src="/@src/assets/parts/features/about.png"
                    alt="3d design - our DNA laptop on top of desk cactus tree - tenrol.com recruitment solution"
                  />
                </div>
                <div class="column is-8">
                  <div class="columns is-multiline b-columns-half-tablet-p">
                    <div class="column is-6">
                      <div class="py-2 medium:py-4">
                        <h4 class="title is-5 is-narrow">Our goal</h4>
                        <p class="pt-2 max-w-3 text-medium">
                          We aim to become the best option for hiring and
                          recruiting, enabling job seekers to find the right
                          position matched to their skills and companies with
                          ease.
                        </p>
                      </div>
                    </div>
                    <div class="column is-6">
                      <div class="py-2 medium:py-4">
                        <h4 class="title is-5 is-narrow">Our vision</h4>
                        <p class="pt-2 max-w-3 text-medium">
                          As we grow, we will become the simplest and most
                          efficient way for recruitment simulation, utilizing
                          the best technologies such as artificial intelligence
                          as we go.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <LandingFooter />
      </div>
    </div>
  </MinimalLayout>
</template>

<style lang="scss" scoped>
.about-img {
  border-radius: 1rem;
  // border: 1px solid var(--fade-grey-dark-3);
  padding-top: 30px;
  padding-left: 20px;
  background-color: #fffaf5;
}
.video-section {
  max-width: 760px;
  display: block;
  margin: 0 auto;
}

// On Desktop
@media only screen and (min-width: 767px) {
  .is-6 {
    padding-left: 2rem;
  }
}
</style>