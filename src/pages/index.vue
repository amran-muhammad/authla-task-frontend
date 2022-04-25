<script setup lang="ts">
import { ref } from 'vue'
import packageJson from '../../package.json'
// import { isDark, toggleDarkModeHandler } from '/@src/state/darkModeState'
type TabId = 'elements' | 'components' | 'forms' | 'plugins'
const activeTab = ref<TabId>('elements')
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
              src="/@src/assets/parts/contact.png"
              alt="3d man business suite searching for candidates job employment - tenrol.com recruitment solution"
            />

            <h1 class="title is-1 is-bold is-light">
              <span class="tenrol">Teacher Appointment System</span>
            </h1>
          </div>
        </div>
      </div>

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
