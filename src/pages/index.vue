<script setup lang="ts">
import { ref } from 'vue'
import { useHead } from '@vueuse/head'

import packageJson from '../../package.json'
// import { isDark, toggleDarkModeHandler } from '/@src/state/darkModeState'
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
    title: 'Why are other similar tools 10 times more expensive than Tenrol?',
    content: `The foundation of a great company is a great employee. So we enable companies to attract and manage more applications efficiently, intelligently, and cost-effectively. The tool should be affordable so that every company has access to it.`,
  },
]
type TabId = 'elements' | 'components' | 'forms' | 'plugins'
const activeTab = ref<TabId>('elements')

useHead({
  title: 'Tenrol - The future of hiring',
})
</script>

<template>
  <MinimalLayout theme="light">
    <div class="landing-page-wrapper">
      <!-- HERO -->
      <div class="hero is-fullheight rounded-hero is-active">
        <LandingNavigation />
        <div class="hero-body hero-pattern has-text-centered">
          <div class="container">
            <img
              class="header_img"
              src="/@src/assets/parts/hero.png"
              alt="3d man business suite searching for candidates job employment - tenrol.com recruitment solution"
            />

            <h1 class="title is-1 is-bold is-light">
              <span class="tenrol">Tenrol</span>, the Future of Hiring
            </h1>
            <h3 class="subtitle is-4 is-light">
              A brilliant solution help you reach and find the best talent on
              the market, every time.
            </h3>
          </div>
        </div>
      </div>

      <!-- SECTION: CARDS -->
      <section class="section">
        <div class="container">
          <div class="section-title has-text-centered">
            <h2 class="title">Start using Tenrol today for free</h2>
            <p>
              Streamlining the recruiting process for both recruiters and
              candidates.
            </p>
          </div>
          <div class="columns">
            <div class="column is-4">
              <VCard class="custom-img-card">
                <img
                  src="/@src/assets/parts/a_2.png"
                  alt="Company profile - Lady happy 3d design on office front desk - tenrol.com recruitment solution"
                />
                <div class="container">
                  <h3 class="title is-5 is-narrow pb-2">
                    Automated interviews
                  </h3>
                  <p class="pb-4">
                    Tenrol helps you select the best candidate by automating
                    interviews and finding the best match so you can get
                    successful hire each time.
                  </p>
                </div>
              </VCard>
            </div>
            <div class="column is-4">
              <VCard class="custom-img-card">
                <img
                  src="/@src/assets/parts/a_1.png"
                  alt="Automated interviews - Man business suite office drinking coffee - tenrol.com recruitment solution"
                />
                <div class="container">
                  <h3 class="title is-5 is-narrow pb-2">Company profile</h3>
                  <p class="pb-4">
                    With a highly optimized job opening structure, beautiful
                    design, and brilliant user experience you can maximize the
                    reach and usability.
                  </p>
                </div>
              </VCard>
            </div>
            <div class="column is-4">
              <VCard class="custom-img-card">
                <img
                  src="/@src/assets/parts/a_3.png"
                  alt="Automated interviews - Lady business office 3d design finishing tasks - tenrol.com recruitment solution"
                />
                <div class="container">
                  <h3 class="title is-5 is-narrow pb-2">
                    Build compelling job ads
                  </h3>
                  <p class="pb-4">
                    Highlight your company, even more, display published jobs
                    openings and more details about your company.
                  </p>
                </div>
              </VCard>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: SOCIAL -->
      <section class="section">
        <div class="section-title has-text-centered">
          <h2 class="title is-3">Simplify your hiring process and workflow</h2>
          <p>Find the ideal candidate faster.</p>
        </div>
        <div class="container social-container">
          <img
            class="social-image"
            src="/@src/assets/parts/social.png"
            alt="3d design social media broadcasting and sharing link - tenrol.com recruitment solution"
          />
          <div class="cta-block-narrow cta-block no-border">
            <div class="head-text">
              <h3>You can try it now</h3>
              <p>Discover Tenrol with a free plan</p>
            </div>
            <div class="head-action">
              <div class="buttons">
                <VButton
                  href="./registration"
                  class="action-button"
                  color="primary"
                  rounded
                >
                  Get Started
                </VButton>
                <a href="./login" class="button chat-button is-secondary">
                  Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: STEPS -->
      <section class="section">
        <div class="container features">
          <div class="section-title has-text-centered">
            <h2 class="title">Achieve hiring success every time</h2>
            <p>Post your job to job boards in less than 5 minutes</p>
          </div>
          <!-- Feature -->
          <div class="column is-12 features-desktop">
            <div class="columns is-vcentered">
              <div class="column featured-image" style="background: #2c73ff">
                <img
                  src="/@src/assets/parts/1.png"
                  alt="3d design creating job opening design phone - tenrol.com recruitment solution"
                />
              </div>
              <div class="is-divider-vertical" data-content="1"></div>
              <div class="column">
                <h3>Create a modern job opening post</h3>
                <p>
                  Customize the job interview to your needs by simulating the
                  actual face-to-face interview. Easily create customized job
                  ads with our easy-to-use editor.
                </p>
              </div>
            </div>
          </div>
          <div class="column is-12 features-desktop">
            <div class="columns is-vcentered">
              <div class="column">
                <h3>Receive more applications</h3>
                <p>
                  Each job opening generates a unique sharable link that can be
                  widely spread through social media or directly sent to your
                  candidates for quick and fast reach.
                </p>
              </div>

              <div class="is-divider-vertical" data-content="2"></div>
              <div class="column featured-image" style="background: #fad056">
                <img
                  src="/@src/assets/parts/2.png"
                  alt="3d social media icons - tenrol.com recruitment solution"
                />
              </div>
            </div>
          </div>
          <div class="column is-12 features-desktop">
            <div class="columns is-vcentered">
              <div class="column featured-image" style="background: #44c8fa">
                <img
                  src="/@src/assets/parts/3.png"
                  alt="3d design dashboard job interviews - tenrol.com recruitment solution"
                />
              </div>
              <div class="is-divider-vertical" data-content="3"></div>
              <div class="column">
                <h3>Manage candidates easily</h3>
                <p>
                  Our software enables you to evaluate candidates promptly. Our
                  automated system will notify and update the candidate with
                  each change in his application ensuring better communication
                  and more transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="container features-mobile">
          <div class="columns">
            <div class="column is-4">
              <VCard class="custom-img-card">
                <img
                  src="/@src/assets/parts/1.png"
                  alt="3d design creating job opening design phone - tenrol.com recruitment solution"
                />
                <div class="container">
                  <h3 class="title is-5 is-narrow pb-2">
                    1. Create a modern job opening post
                  </h3>
                  <p class="pb-4">
                    Customize the job interview to your needs by simulating the
                    actual face-to-face interview. Easily create customized job
                    ads with our easy-to-use editor.
                  </p>
                </div>
              </VCard>
            </div>
            <div class="column is-4">
              <VCard class="custom-img-card">
                <img
                  src="/@src/assets/parts/2.png"
                  alt="3d social media icons - tenrol.com recruitment solution"
                />
                <div class="container">
                  <h3 class="title is-5 is-narrow pb-2">
                    2. Receive more applications
                  </h3>
                  <p class="pb-4">
                    Our software enables you to evaluate candidates promptly.
                    Our automated system will notify and update the candidate
                    with each change in his application ensuring better
                    communication and more transparency.
                  </p>
                </div>
              </VCard>
            </div>
            <div class="column is-4">
              <VCard class="custom-img-card">
                <img
                  src="/@src/assets/parts/3.png"
                  alt="3d design dashboard job interviews - tenrol.com recruitment solution"
                />
                <div class="container">
                  <h3 class="title is-5 is-narrow pb-2">
                    3. Manage candidates easily
                  </h3>
                  <p class="pb-4">
                    Highlight your company, even more, display published jobs
                    openings and more details about your company.
                  </p>
                </div>
              </VCard>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: FEATURES -->
      <section class="section">
        <div class="container">
          <!--Title-->
          <div class="section-title has-text-centered">
            <h2 class="title">
              Recruiters can do their jobs more efficiently with Tenrol
            </h2>
            <p>
              Our HR software solutions are among the fastest-growing in the
              business!
            </p>
          </div>
          <div class="boxed-features">
            <div class="flex-card light-bordered hover-inset">
              <div class="flex-cell is-bordered">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/7.png"
                    alt="3d design - Job interview video recording - tenrol.com recruitment solution"
                  />
                </div>

                <h3>Customizable interviews</h3>
                <p>
                  You can quickly accept applications, access candidates the way
                  you prefer, by collecting necessary details or simulating a
                  face-to-face interview.
                </p>
              </div>
              <div class="flex-cell is-bordered">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/3.png"
                    alt="3d design - Broadcasting audio speaker - tenrol.com recruitment solution"
                  />
                </div>

                <h3>Great Reach</h3>
                <p>
                  Promote the job opening via social media and/or the candidates
                  you intend to interview with a sharable short link.
                </p>
              </div>
              <div class="flex-cell is-bordered">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/6.png"
                    alt="3d design - target aiming circle finding talent - tenrol.com recruitment solution"
                  />
                </div>
                <h3>Finding Talents</h3>
                <p>
                  Increase your talent pool with relevant candidates generated
                  through tenrol matching the best and highest-ranking
                  candidates for similar job interviews.
                </p>
              </div>
              <div class="flex-cell is-bordered no-border-edge">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/9.png"
                    alt="3d design -   inbox dashboard clean - tenrol.com recruitment solution"
                  />
                </div>
                <h3>Clean inbox</h3>
                <p>
                  You will no longer have to deal with hundreds of job
                  applications in your inbox. Get the best experience with our
                  easy-to-use dashboard.
                </p>
              </div>
              <div class="flex-cell">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/11.png"
                    alt="3d design - dashboard screenshot - tenrol.com recruitment solution"
                  />
                </div>
                <h3>Digitalized Hiring</h3>
                <p>
                  No more paper resumes screening applications, get the best
                  match, review and approve the best candidate, export reports.
                </p>
              </div>
              <div class="flex-cell">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/8.png"
                    alt="3d design - clock - tenrol.com recruitment solution"
                  />
                </div>
                <h3>Save Valuable Time</h3>
                <p>
                  Automation of interviews saves your recruitment team valuable
                  time spent assessing applicants and scheduling face-to-face
                  interviews.
                </p>
              </div>
              <div class="flex-cell">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/2.png"
                    alt="3d design - email - tenrol.com recruitment solution"
                  />
                </div>
                <h3>Automated E-mails</h3>
                <p>
                  No more repetitive and manual email communication with
                  candidates — use automatic rejections, approval, and much more
                  with just a click
                </p>
              </div>
              <div class="flex-cell no-border-edge">
                <div class="img-container">
                  <img
                    src="/@src/assets/parts/features/4.png"
                    alt="3d design - briefcase - tenrol.com recruitment solution"
                  />
                </div>
                <h3>Public profile</h3>
                <p>
                  Get your company’s unique profile link with public job opening
                  boards that you can embed in your own website to manage your
                  career page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION: FAQ -->
      <section class="section">
        <div class="container">
          <div class="section-title has-text-centered">
            <h2 class="title">Frequently Asked Questions</h2>
            <p>Please toggle the questions to find the answer!</p>
          </div>
          <div class="columns">
            <div class="column is-12">
              <VCollapse :items="faq" />
            </div>
          </div>
          <RouterLink :to="{ name: 'help-and-faq' }">
            <VButton class="action-button faq-button">
              View All the FAQ's
            </VButton>
          </RouterLink>
        </div>
      </section>

      <!-- FOOTER -->
      <LandingFooter />
    </div>
  </MinimalLayout>
</template>

<style lang="scss">
@import '../scss/abstracts/_mixins.scss';
@import '../scss/pages/demo/_landing.scss';
.faq-button {
  display: block;
  margin: 0 auto;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  font-size: 1.15rem !important;
  color: var(--primary);
  font-weight: 500;
}
.hero-pattern {
  background-image: url(/@src/assets/parts/pattern.png) !important;
  background-size: cover !important;
  background-position: center !important;
}

.tenrol {
  color: var(--primary);
  font-weight: bold !important;
}

.cta-block-narrow {
  max-width: 580px;
  margin: 50px auto 0 auto;
  h3 {
    color: var(--dark-text) !important;
    font-size: 1.2rem !important;
  }
}

.social-image {
  max-width: 500px;
  display: block;
  margin: 0 auto;
}
.social-container {
  background: #f2f2f2;
  border-radius: 10px;
  padding: 30px 20px;
  border: 1px solid var(--fade-grey-dark-3);
}
// Custom Card fix
.custom-img-card {
  padding: 0 !important;
  img {
    border-top-right-radius: 9px;
    border-top-left-radius: 9px;
  }
  .container {
    padding: 20px;
  }
}
.card {
  border-radius: 1rem !important;
  .card-image {
    border-radius: 1rem !important;
    img {
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
    }
  }
}

// Features
.features {
  .column {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  h3 {
    font-size: 1.5rem !important;
  }
}
.featured-image {
  border-radius: 1rem !important;
  img {
    margin: auto;
    max-width: 380px;
    display: block;
  }
}
.is-divider-vertical {
  min-height: 300px !important;
  padding: 5rem !important;

  &::before {
    top: 10px !important;
    bottom: 0 !important;
  }
  &::after {
    font-size: 1.4rem !important;
    background: #41b983 !important;
    color: white !important;
    border-radius: 50px !important;
    padding: 4px 13px !important;
    border: 6px solid white;
  }
}

.header_img {
  max-width: 480px;
}
.boxed-features {
  .flex-card {
    padding: 0 !important;
    .flex-cell {
      img {
        max-width: unset !important;
        width: 100px;
        // height: 100px;
      }
      .img-container {
        min-height: 120px;
      }
    }

    p {
      margin: 0 !important;
      max-width: unset !important;
      width: 100% !important;
    }
  }
}
.section {
  margin: 100px 0 !important;
}
// On Desktop
@media only screen and (min-width: 767px) {
  .features-mobile {
    display: none;
  }
}

// On Mobile
@media only screen and (max-width: 767px) {
  h2 {
    font-size: 1.6rem !important;
  }

  .features-desktop {
    display: none;
  }
  .header_img {
    margin-top: 50px;
    max-width: 100%;
    padding: 20px;
  }
  .social-image {
    max-width: 100%;
    padding: 20px;
  }
}
</style>
