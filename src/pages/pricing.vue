<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'

pageTitle.value = 'Pricing'
useHead({
  title: 'Pricing',
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
              <h2 class="title is-2">Pricing</h2>
              <p>
                Tenrol is currently free. We will always offer a free version
                <br />
                and will be announcing premium plans in the future.
              </p>
            </div>

            <!--Wrapper-->
            <div class="pricing-wrapper p-t-50">
              <!--Pricing plan-->
              <div class="pricing-plan">
                <div class="name">Free</div>
                <div class="price">$0</div>
                <div class="trial free">Forever free</div>
                <hr />
                <ul>
                  <li>
                    <strong>1</strong>
                    team members
                  </li>
                  <li>
                    <strong>3</strong>
                    Job Openings
                  </li>
                  <li>
                    <strong>3</strong>
                    Video Questions
                  </li>
                  <li>
                    <strong>1</strong>
                    Min/Video Questions
                  </li>
                </ul>
              </div>

              <!--Pricing plan-->
              <div class="pricing-plan paid is-featured">
                <div class="name">Premium</div>
                <div class="price">Custom</div>
                <div class="trial premium">Coming Soon</div>
                <hr />
                <ul>
                  <li>
                    <strong>Custom</strong>
                    team members
                  </li>
                  <li>
                    <strong>Custom</strong>
                    Job Openings
                  </li>
                  <li>
                    <strong>Custom</strong>
                    Video Questions
                  </li>
                  <li>Min/Video Questions</li>
                  <li>CSV Report exporting</li>
                  <li>Job opening analytics</li>
                  <li>More features soon</li>
                </ul>
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
@import '../scss/abstracts/_mixins.scss';
@import '../scss/pages/generic/_marketing.scss';

/* ==========================================================================
1. Confirm Account
========================================================================== */
.title-custom-1 {
  font-size: 1.8rem;
  text-align: center;
}
.trial {
  color: white !important;
  border: none !important;
  background: var(--primary);
}

.free {
  background: #ff5722 !important;
}
.premium {
  background: var(--primary) !important;
}
.pricing-plan {
  background-color: #fffaf5 !important;
  border: none !important;
}
.paid {
  border: 1px solid var(--primary) !important;
}
.promotion-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 840px;
  min-height: 400px;
  background-color: #fffaf5;

  .wrapper-outer {
    // @include vuero-s-card();

    display: flex;
    padding: 0;

    .wrapper-inner {
      .action-box {
        border: 1px solid var(--fade-grey-dark-3);

        background: none;
        border-radius: 0;
        // border-right: 1px solid var(--fade-grey-dark-3);

        .price {
          text-align: center;
          padding-top: 8px;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              font-size: 2.8rem;
              font-weight: 600;
              color: var(--dark-text);
              line-height: 1;

              &::before {
                position: relative;
                top: -12px;
                content: '$';
                font-size: 60%;
              }
            }

            &:nth-child(2) {
              font-size: 0.75rem;
              color: var(--light-text);
              text-transform: uppercase;
            }
          }
        }
      }
    }

    .side-wrapper {
      flex-grow: 2;
      padding: 40px;
      min-width: 40%;

      .side-inner {
        .side-title {
          font-family: var(--font);
          margin-bottom: 16px;

          h3 {
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
          }

          p {
            font-size: 0.9rem;
          }
        }

        .action-list {
          .media-flex {
            .icon-wrap {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 32px;
              width: 32px;
              min-width: 32px;
              border-radius: var(--radius-rounded);
              background: var(--white);
              border: 1px solid var(--fade-grey-dark-3);
              box-shadow: var(--light-box-shadow);
              color: var(--primary);

              svg {
                width: 16px;
                height: 16px;
                stroke-width: 3px;
              }
            }

            .flex-meta {
              span {
                font-weight: 400;
                font-size: 0.9rem;
              }

              p {
                font-size: 0.9rem;
                max-width: 240px;
              }
            }
          }
        }
      }
    }
  }

  .wrapper-inner {
    .action-box {
      @include vuero-s-card();

      padding: 40px;

      .box-content {
        text-align: center;
        font-family: var(--font);
        img {
          display: block;
          width: 100%;
          max-width: 220px;
          margin: 0 auto 8px auto;

          &.is-larger {
            max-width: 300px;
          }
        }

        h3 {
          font-size: 1.1rem;
          font-family: var(--font-alt);
          font-weight: 600;
          max-width: 320px;
          margin: 0 auto 8px auto;

          span {
            color: var(--primary);
          }
        }

        p {
          font-size: 0.9rem;
        }

        .buttons {
          margin: 0 auto;
          display: flex;
          justify-content: center;
          padding-top: 30px;
          padding-bottom: 5px;

          .button {
            margin: 0 4px;
            min-width: 180px;
          }
        }
      }
    }
  }
}
.price-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  max-width: 840px;
}

.is-dark {
  .promotion-page-wrapper {
    .wrapper-inner {
      .action-box {
        @include vuero-card--dark();
      }
    }
    .wrapper-outer {
      @include vuero-card--dark();
    }
  }
}

@media only screen and (max-width: 767px) {
  .promotion-page-wrapper {
    .wrapper-outer {
      flex-direction: column;

      .wrapper-inner {
        .action-box {
          padding: 20px 20px 40px 20px;
          border-right: none;
          border-bottom: 1px solid var(--fade-grey-dark-3);

          .box-content {
            .buttons {
              .button {
                min-width: 130px;
              }
            }
          }
        }
      }

      .side-wrapper {
        padding: 40px 20px;
      }
    }
  }
}
</style>
