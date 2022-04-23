
<script setup lang="ts">
import ApexChart from 'vue3-apexcharts'

import { customersOptions } from '/@src/data/dashboards/personal-v1/customersChart'
import { teamGaugeOptions } from '/@src/data/dashboards/personal-v1/teamGaugeChart'
import { profitChartOptions } from '/@src/data/dashboards/personal-v1/profitChart'
import hrQuote from '/@src/data/landing/hr-quote.json'
import type { VAvatarProps } from '/@src/components/base/avatar/VAvatar.vue'
import * as usersData from '/@src/data/dashboards/personal-v2/users'
import { useCompany } from '/@src/stores/company'
import { onMounted } from 'vue-demi'
import { useJobOpening } from '/@src/stores/jobOpening'
const random = Math.floor(Math.random() * 101)
const quotes = hrQuote
// const avatarStack1 = usersData.avatarStack1 as VAvatarProps[]
// TODO: Get latest user avatars or initial names from recent applicants

const company = useCompany()
const jobOpening = useJobOpening()
const host = import.meta.env.VITE_API_BASE_URL
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v4">
    <div class="columns">
      <div class="column is-8">
        <div class="columns is-multiline">
          <!--Header-->
          <div class="column is-12">
            <div class="illustration-header-2">
              <div class="header-meta">
                <h3>Hello, {{ company.data.name.replace(/ .*/, '') }}.</h3>
                <p>
                  Do you have a new position to post? You can post a new
                  position by clicking the button below.
                </p>
                <VButton
                  :to="{ name: 'job_opening-new' }"
                  light
                  outlined
                  icon="feather:plus"
                >
                  New Job Opening
                </VButton>
              </div>
              <div class="header-image">
                <img
                  src="/@src/assets/illustrations/dashboards/personal/desk.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-4">
        <div class="dashboard-card is-upgrade">
          <div class="cta-content">
            <!-- <i class="lnir lnir-quotation" aria-hidden="true"></i> -->
            <p class="dark-inverted">
              {{ quotes[random].quote }}
            </p>
            <p class="dark-inverted">
              <b>- {{ quotes[random].writer }}</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="personal-dashboard personal-dashboard-v1">
    <!--Personal Dashboard V1-->

    <!--Body-->
    <div class="dashboard-body">
      <div class="columns is-multiline">
        <!--Card-->
        <div class="column is-6">
          <div class="dashboard-card stats">
            <div class="people p-b-40">
              <div class="left">
                <span class="dark-inverted">Total Interviews</span>
                <span>
                  <a href="./job_application" class="is-dark-primary"
                    >{{
                      company.data_stats.new_application
                        ? company.data_stats.new_application
                        : '0'
                    }}
                    interviews</a
                  >
                  this month</span
                >
              </div>
              <!-- <div class="right">
               </div> -->
            </div>
            <div class="stats-wrapper">
              <div class="columns is-multiline is-flex-tablet-p">
                <div class="column is-6">
                  <a href="./job_application" class="dashboard-card dash_links">
                    <VBlock
                      :title="
                        company.data_stats.new_application
                          ? company.data_stats.new_application
                          : '0'
                      "
                      subtitle="New applications"
                      center
                    >
                      <template #icon>
                        <VIconBox color="primary" bordered rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:bell"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
                <div class="column is-6">
                  <a href="./job_application" class="dashboard-card dash_links">
                    <VBlock
                      :title="
                        company.data_stats.total_application
                          ? company.data_stats.total_application
                          : '0'
                      "
                      subtitle="Total Applications"
                      center
                    >
                      <template #icon>
                        <VIconBox color="info" bordered rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:file-text"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
                <div class="column is-6">
                  <a href="./job_opening" class="dashboard-card dash_links">
                    <VBlock
                      :title="
                        company.data_stats.job_opening
                          ? company.data_stats.job_opening
                          : '0'
                      "
                      subtitle="Active Jobs"
                      center
                    >
                      <template #icon>
                        <VIconBox color="purple" bordered rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:briefcase"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
                <div class="column is-6">
                  <a href="./job_opening" class="dashboard-card dash_links">
                    <VBlock
                      :title="
                        company.data_stats.total_job
                          ? company.data_stats.total_job
                          : '0'
                      "
                      subtitle="Total Jobs"
                      center
                    >
                      <template #icon>
                        <VIconBox color="danger" bordered rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:archive"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Card-->
        <div class="column is-6">
          <div class="dashboard-card">
            <ApexChart
              :height="customersOptions.chart.height"
              :type="customersOptions.chart.type"
              :series="customersOptions.series"
              :options="customersOptions"
            >
            </ApexChart>
          </div>
        </div>
      </div>
      <div class="columns">
        <div v-if="company.extra_data.package == 'free'" class="column is-8">
          <div class="column is-12 dashboard-card">
            <VBlock
              title="Free plan"
              subtitle="You are using the free Tenrol version."
            >
              <template #icon>
                <VIconBox size="small" bordered>
                  <i class="lnir lnir-leaf" aria-hidden="true"></i>
                </VIconBox>
              </template>
              <template #action>
                <VButton to="pricing" color="primary"
                  >Upgrade to Premium</VButton
                >
              </template>
            </VBlock>
          </div>
        </div>
        <div v-else class="column is-8">
          <div class="column is-12 dashboard-card">
            <VBlock
              title="Premium plan"
              :subtitle="
                'Your plan includes total of ' +
                company.extra_data.slot +
                ' Jobs with ' +
                company.extra_data.video_question_slot +
                ' video questions ' +
                company.extra_data.screening_question_slot +
                ' text questions each '
              "
            >
              <template #icon>
                <VIconBox size="small" bordered color="yellow">
                  <i class="lnir lnir-crown-alt" aria-hidden="true"></i>
                </VIconBox>
              </template>
            </VBlock>
          </div>
        </div>
        <div class="column is-4">
          <a
            v-tooltip.primary.rounded="
              'Click to view company profile in a new tab'
            "
            target="_blank"
            :href="
              jobOpening.origin +
              '/company/' +
              (company.extra_data.slug != null
                ? company.extra_data.slug
                : company.extra_data.id)
            "
            class="column is-12 dashboard-card"
          >
            <VBlock
              :title="company.extra_data.name"
              subtitle="Company Profile"
              center
            >
              <template #icon>
                <VAvatar
                  size="small"
                  :picture="host + company.extra_data.logo"
                />
              </template>
              <template #action>
                <!-- <VButton color="primary" rounded>View</VButton> -->
              </template>
            </VBlock>
            <!-- <VBlock title="Company" subtitle="View pubic profile"> </VBlock> -->
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
.dash_links:hover {
  opacity: 0.7;
}
.lifestyle-dashboard-v4 {
  padding-bottom: 20px;
  padding-top: 50px;
}

.stats {
  min-height: 350px;
}

.dashboard-tile {
  margin: 8px;
  @include vuero-s-card();

  font-family: var(--font);

  .tile-head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-family: var(--font-alt);
      color: var(--dark-text);
      font-weight: 600;
    }
  }

  .tile-body {
    font-size: 2rem;
    padding: 4px 0 8px 0;

    span {
      color: var(--dark-text);
      font-weight: 600;
    }
  }

  .tile-foot {
    span {
      &:first-child {
        font-weight: 500;

        svg {
          height: 16px;
          width: 16px;
          margin-right: 6px;
          stroke-width: 3px;
        }
      }

      &:nth-child(2) {
        color: var(--light-text);
        font-size: 0.9rem;
      }
    }
  }
}
.is-dark {
  .dashboard-tile,
  .dashboard-card {
    @include vuero-card--dark();
  }
}
.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v1 {
  .dashboard-header {
    display: flex;
    align-items: center;
    font-family: var(--font);
    margin-bottom: 30px;

    .start {
      margin-left: 12px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.3rem;
        color: var(--dark-text);
      }
    }

    .end {
      margin-left: auto;
      display: flex;
      justify-content: flex-end;

      .button {
        margin-left: 10px;
      }
    }
  }

  .dashboard-body {
    .dashboard-card {
      @include vuero-s-card();
      border-radius: var(--radius-large) !important;
      border: 1px solid var(--fade-grey-dark-3);
      font-family: var(--font);

      > h4,
      .ApexCharts-title-text {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 12px;
      }

      .quick-stats {
        .quick-stats-inner {
          display: flex;
          flex-wrap: wrap;
          // margin-left: -8px;
          margin-right: -8px;

          .quick-stat {
            width: calc(50% - 16px);
            padding: 40px 20px;
            background: var(--widget-grey);
            margin: 8px;
            // border-radius: var(--radius-large);
            transition: all 0.3s;

            ::v-deep(.media-flex-center) {
              .flex-meta {
                span {
                  &:first-child {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: var(--dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }

    .dashboard-card {
      &.is-upgrade {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--primary-light-8);

        padding: 20px 40px;
        min-height: 320px;
        border-radius: var(--radius-large) !important;
        border: 1px solid var(--fade-grey-dark-3) !important;
        .lnil,
        .lnir {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 4rem;
          opacity: 0.3;
        }

        .cta-content {
          text-align: center;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1.2rem;
            color: var(--smoke-white);
            margin-bottom: 8px;
          }
        }

        .link {
          display: block;
          font-family: var(--font-alt);
          font-weight: 500;
          margin-top: 0.5rem;

          &:hover {
            color: var(--smoke-white);
            opacity: 0.6;
          }
        }
      }
      &.is-gauge {
        position: relative;

        .people {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          z-index: 5;

          .v-avatar {
            margin: 0 4px;
          }
        }
      }
    }
  }
}
.lifestyle-dashboard-v4 {
  .dashboard-card {
    &.is-upgrade {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--smoke-white);
      font-family: var(--font);
      padding: 20px 40px;
      min-height: 250px;
      border-radius: var(--radius-large);
      border: 1px solid var(--fade-grey-dark-3);
      .lnil,
      .lnir {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .cta-content {
        text-align: center;

        h4 {
          font-family: var(--font-alt);
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
      }

      .link {
        display: block;
        font-family: var(--font-alt);
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
  .illustration-header-2 {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 250px;
    border-radius: var(--radius-large);
    background: var(--primary);
    font-family: var(--font);
    .header-image {
      width: 240px;
      padding: 10px 0px 20px 0px;

      // img {
      //   position: absolute;
      //   top: 0;
      //   left: -50px;
      //   display: block;
      //   pointer-events: none;
      // }
    }
    @media screen and (max-width: 1024px) {
      .header-image {
        display: none !important;
      }
      .header-meta {
        padding: 40px !important;
      }
    }

    .header-meta {
      margin-left: 30px;
      padding-right: 40px;

      h3 {
        color: var(--smoke-white);
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 1.4rem;
        max-width: 290px;
      }

      p {
        font-weight: 400;
        color: var(--smoke-white-dark-2);
        margin-bottom: 16px;
        max-width: 320px;
      }

      .action-link {
        span {
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-right: 6px;
        }

        i {
          font-size: 12px;
        }
      }
    }
  }

  .writing-stats {
    display: flex;
    margin-bottom: 1rem;
    margin-left: -8px;
    margin-right: -8px;

    .writing-stat {
      @include vuero-l-card();

      margin: 8px;
      width: calc(33.3% - 16px);
      padding: 12px;

      span {
        display: block;

        &:first-child {
          font-family: var(--font-alt);
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 5px;
          color: var(--light-text);
        }

        &:nth-child(2) {
          font-family: var(--font);
          font-weight: 700;
          font-size: 1.8rem;
          color: var(--dark-text);
        }
      }
    }
  }

  .featured-authors {
    @include vuero-l-card();

    padding: 20px;

    .featured-authors-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .featured-authors-list {
      .featured-authors-item {
        &:not(:last-child) {
          margin-bottom: 20px;
        }

        .media-flex-center {
          .flex-end {
            span {
              font-family: var(--font-alt);
              font-weight: 600;
              color: var(--dark-text);
            }
          }
        }
      }
    }
  }

  .updates {
    @include vuero-l-card();

    padding: 20px;
    margin-top: 8px;

    .updates-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .updates-list {
      .update-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        p {
          font-size: 0.9rem;
        }

        span {
          display: block;
          min-width: 60px;
          text-align: right;
          font-family: var(--font);
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--dark-text);
        }
      }
    }
  }

  .articles-feed {
    background: var(--widget-grey);
    padding: 30px;
    border-radius: 12px;

    .articles-feed-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .articles-feed-subheader {
      margin-bottom: 20px;

      .selector {
        .button {
          font-size: 0.8rem;
          border-radius: 50px;
          margin-right: 4px;

          &.is-selected {
            background: var(--primary);
            color: var(--white);
            border-color: var(--primary);
            box-shadow: var(--primary-box-shadow);
          }
        }
      }
    }

    .articles-feed-list {
      .articles-feed-list-inner {
        .articles-feed-item {
          display: block;

          &:not(:last-child) {
            margin-bottom: 20px;
          }

          .featured-image {
            height: 180px;
            overflow: hidden;
            border-top-left-radius: 18px;
            border-top-right-radius: 18px;

            img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .featured-content {
            position: relative;
            padding: 25px;
            border-radius: 18px;
            background: var(--white);
            margin-top: -40px;
            z-index: 1;

            h4,
            p {
              margin-bottom: 10px;
            }

            h4 {
              font-family: var(--font-alt);
              font-size: 1rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            .media-flex-center {
              .flex-meta {
                span {
                  font-size: 0.8rem;
                }
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-v4 {
    .dashboard-card {
      &.is-upgrade {
        background: var(--dark-sidebar-light-2);
        border-color: var(--dark-sidebar-light-12);
      }
    }

    .illustration-header-2 {
      background: var(--dark-sidebar);
      box-shadow: none;
    }

    .writing-stats {
      .writing-stat {
        @include vuero-card--dark();
      }
    }

    .updates,
    .featured-authors {
      @include vuero-card--dark();
    }

    .articles-feed {
      background: var(--dark-sidebar-light-8);

      .articles-feed-subheader {
        .selector {
          .button {
            &.is-selected {
              background: var(--primary) !important;
              border-color: var(--primary) !important;
              box-shadow: var(--primary-box-shadow) !important;
              color: var(--white) !important;
            }
          }
        }
      }

      .articles-feed-list {
        .articles-feed-list-inner {
          .articles-feed-item {
            .featured-content {
              background: var(--dark-sidebar);
            }
          }
        }
      }
    }
  }
  .personal-dashboard-v1 {
    .dashboard-header {
      .start {
        h3 {
          color: var(--dark-dark-text);
        }
      }
    }

    .dashboard-body {
      .dashboard-card {
        @include vuero-card--dark();

        &.is-upgrade {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: var(--primary-box-shadow);
        }

        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              background: var(--dark-sidebar-light-2);
              border: 1px solid var(--dark-sidebar-light-12);

              .media-flex-center {
                .flex-meta {
                  span {
                    &:first-child {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .personal-dashboard-v1 {
    .dashboard-header {
      text-align: center;
      flex-direction: column;

      .start {
        margin: 10px auto;
      }

      .end {
        margin: 0;
        justify-content: space-between;
      }
    }

    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 10px 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .personal-dashboard-v1 {
    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 2px 0 0 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}
.people {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  .left {
    span {
      display: block;
      font-family: var(--font);
      &:first-child {
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
      }
      &:nth-child(2) {
        font-size: 0.9rem;
        color: var(--light-text);
        a {
          font-weight: 500;
          color: var(--primary);
        }
      }
    }
  }
}
</style>