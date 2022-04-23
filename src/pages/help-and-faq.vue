<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'
const faq = [
  {
    title:
      'Can I understand the details about how many candidates viewed my job?',
    content: `After posting your job, you'll see insights on which channels are most effective. You can track how many candidates viewed your ad and how many applications you received from a specific job link. When looking for new talent, you can use this information to better understand where you need to be more visible.`,
  },
  {
    title: 'Can I really use Tenrol for free?',
    content: `Yes, it's completely free! There is, however, a limit of 3 job ads at a time. As your business grows, you can easily upgrade the plan to meet your needs. Please contact us at info@tenrol.com for more information and a comparison of premium products.`,
  },
  {
    title: 'Do I pay a commission when I hire a candidate through Tenrol?',
    content: `No, you don't have to pay us a commission when hiring through us. However, you can choose to upgrade to the premium plan to help you unlock tons of features that can help make the hiring process easier.`,
  },
  {
    title: 'What kind of customer support can I expect?',
    content: `Our customer support team is here to help with all your questions.
You get access to chat, email support, and phone support.`,
  },

  {
    title: 'Why are other similar tools 10 times more expensive than Tenrol?',
    content: `The foundation of a great company is a great employee. So we enable companies to attract and manage more applications efficiently, intelligently, and cost-effectively. The tool should be affordable so that every company has access to it.`,
  },
  {
    title: 'Can I test creating job ads first?',
    content: `Yes, you can! Tenrol gives you the ability to create a free account and create your first job ad. Creating online job listings with this tool is free, so don't hesitate to explore a new way of attracting more talent to your company`,
  },
]
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
              <h2 class="title is-2">Frequently Asked Questions</h2>
              <p>
                These are some of the most asked questions we receive regarding
                Tenrol.
                <br />
                Reach out to us through email if you have any more questions.
              </p>
            </div>
            <div class="container m-t-50">
              <div class="columns">
                <div class="column is-12">
                  <VCollapse :items="faq" />
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
  border: 1px solid var(--fade-grey-dark-3);
}

// On Desktop
@media only screen and (min-width: 767px) {
  .is-6 {
    padding-left: 2rem;
  }
}
</style>