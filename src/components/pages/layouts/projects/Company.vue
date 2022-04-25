<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useNotyf from '/@src/composable/useNotyf'
import moment from 'moment'

const route = useRoute()
const router = useRouter()

import { useCompany } from '/@src/stores/company'
import { useJobOpening } from '/@src/stores/jobOpening'
const host = import.meta.env.VITE_API_BASE_URL
const company = useCompany()
const jobOpening: any = useJobOpening()
const errorMessageEmail = ref('')
const centeredActionsOpen = ref(false)
import { Notyf } from 'notyf'

const filter_jobs_by_status_and_deadline = computed(() => {
  return company.data.comp_view.job_opening.filter(
    (job: any) =>
      (job.status = 'Open' && moment(job.applicationdeadline).isAfter())
  )
})

const notyf = new Notyf()
const item: any = {}
const checkEmail = () => {
  if (jobOpening.reminderEmail.email == '') {
    errorMessageEmail.value = 'Please enter your email first'
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      jobOpening.reminderEmail.email
    )
  ) {
    errorMessageEmail.value = 'Must be a valid email'
  }
}
const changeModal = (item: any) => {
  centeredActionsOpen.value = true
  item = item
}
const handleMailForm = async () => {
  if (jobOpening.reminderEmail.email == '') {
    errorMessageEmail.value = 'Please enter your email first'
    return
  } else if (
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      jobOpening.reminderEmail.email
    )
  ) {
    errorMessageEmail.value = 'Must be a valid email'
    return
  }
  jobOpening.reminderEmail.job_id = item.slug != null ? item.slug : item.id
  jobOpening.reminderEmail.deadline = item.applicationdeadline
  jobOpening.reminderEmail.company = item.company.name
  jobOpening.reminderEmail.title = item.job_title
  jobOpening.reminderEmail.overview = item.intro
  jobOpening.sendReminder()
  notyf.success('We have sent the job link to your email')
  centeredActionsOpen.value = false
}

onMounted(() => {
  company.getCurrentData(route.fullPath.split('/company/')[1])
  console.log('company', company.data_view)
})
</script>

<template>
  <div class="project-details">
    <VModal
      :open="centeredActionsOpen"
      actions="center"
      @close="centeredActionsOpen = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Apply later"
          :subtitle="
            jobOpening.reminderEmail.showForm
              ? 'We’ll send a link to this job to your email.'
              : 'We have sent the job link to your email'
          "
        />
        <Form v-if="jobOpening.reminderEmail.showForm">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl @keyup="checkEmail" icon="feather:mail">
                <input
                  id="reminder_email_id"
                  v-model="jobOpening.reminderEmail.email"
                  type="email"
                  class="input"
                  :class="errorMessageEmail != '' ? 'errorBorder' : ''"
                  placeholder="Email"
                />

                <p v-if="errorMessageEmail != ''" class="help is-danger">
                  {{ errorMessageEmail }}
                </p>
              </VControl>
            </VField>
          </div>
        </Form>
      </template>
      <template #action>
        <VButton @click="handleMailForm" color="primary" raised>{{
          !jobOpening.reminderEmail.loading ? 'Send Email' : 'Loading ..'
        }}</VButton>
      </template>
    </VModal>
    <VCard v-if="company.data.comp_view" color="  card-company p-t-50 p-b-50">
      <div class="columns company">
        <div class="column is-2 logo">
          <VAvatar size="xl" :picture="host + company.data.comp_view.logo" />
        </div>
        <div class="column is-10 profile-header">
          <h3 class="title is-4 is-narrow is-thin">
            {{ company.data.comp_view.name }}
          </h3>
          <p class="">
            {{ company.data.comp_view.description }}
          </p>
          <div class="profile-stats">
            <div class="profile-stat">
              <i aria-hidden="true" class="lnil lnil-map-marker"></i>
              <span
                >{{
                  company.data.comp_view.city
                    ? company.data.comp_view.city + ', '
                    : ''
                }}{{ company.data.comp_view.country }}</span
              >
            </div>
            <div class="separator"></div>
            <div class="profile-stat">
              <i aria-hidden="true" class="lnil lnil-user-alt"></i>
              <span
                >{{ company.data.comp_view.number_of_employee }} Employees</span
              >
            </div>
            <div
              :class="
                !company.data.comp_view.website &&
                !company.data.comp_view.linkedin &&
                !company.data.comp_view.twitter &&
                !company.data.comp_view.facebook
                  ? ''
                  : 'separator'
              "
            ></div>
            <div class="socials">
              <a
                v-if="company.data.comp_view.website"
                :href="company.data.comp_view.website"
                target="_blank"
                ><i aria-hidden="true" class="fas fa-globe"></i
              ></a>
              <a
                v-if="company.data.comp_view.linkedin"
                :href="company.data.comp_view.linkedin"
                target="_blank"
                ><i aria-hidden="true" class="fab fa-linkedin-in"></i
              ></a>
              <a
                v-if="company.data.comp_view.twitter"
                :href="company.data.comp_view.twitter"
                target="_blank"
                ><i aria-hidden="true" class="fab fa-twitter"></i
              ></a>
              <a
                v-if="company.data.comp_view.facebook"
                :href="company.data.comp_view.facebook"
                target="_blank"
                ><i aria-hidden="true" class="fab fa-facebook-f"></i
              ></a>
            </div>
          </div>
        </div>
      </div>
    </VCard>

    <!-- Jobs  -->
    <div v-if="company.data.comp_view" class="columns is-multiline jobs m-t-50">
      <div
        v-for="(item, key) in filter_jobs_by_status_and_deadline"
        :key="key"
        class="column is-4"
      >
        <div v-if="moment(item.applicationdeadline).isAfter()">
          <VCardAdvanced>
            <template #header-left>
              <h3 class="title is-5">{{ item.job_title }}</h3>
            </template>
            <template #header-right>
              <VIconButton
                title="Remind Me Later"
                @click="changeModal(item)"
                icon="feather:bookmark"
                outlined
                circle
              />
            </template>
            <template #content>
              <p>
                {{ item.intro }}
              </p>
            </template>
            <template #footer-left>
              <VTags addons>
                <VTag outlined label="Deadline" />
                <VTag
                  outlined
                  color="solid"
                  :label="
                    '  ' + moment(item.applicationdeadline).format('DD/MM/YYYY')
                  "
                />
              </VTags>
            </template>
            <template #footer-right>
              <div class="tags">
                <VButton
                  bold
                  class="m-b-10"
                  :href="
                    jobOpening.origin +
                    '/job/' +
                    (item.slug != null ? item.slug : item.id)
                  "
                  color="primary"
                  >Apply Now</VButton
                >
              </div>
            </template>
          </VCardAdvanced>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/profile/_user-profile.scss';
.errorBorder {
  border: 1px solid red;
  border-radius: 7px;
}
.empty {
  max-width: 27rem;
  margin: 5rem auto;
  background: white;
  padding: 3rem;
  border-radius: 1rem;
  text-align: center;
  border: 3px dashed #e3dbdb;
  opacity: 0.7;
  p {
    font-size: 1.2rem;
  }
}
.view-wrapper {
  margin-top: 0px !important;
}
.card-company {
  border-radius: var(--radius-large);
  background-image: url(/@src/assets/parts/pattern.png) !important;
  background-size: cover !important;
  background-position: center !important;
  .separator {
    opacity: 0.5;
  }
}

.company {
  max-width: 720px;
  margin: 0 auto;
  .avatar {
    border: 4px solid whitesmoke;
  }
}
.card-body {
  padding-top: 5px !important   ;
  p {
    font-size: 0.9rem;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 90%;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* after 3 line show ... */
    -webkit-box-orient: vertical;
    min-height: 60px;
  }
}

.card-head {
  .left {
    // h3 {
    //   overflow: hidden !important;
    //   text-overflow: ellipsis;
    //   display: -webkit-box;
    //   width: 100%;
    //   -webkit-line-clamp: 1;
    //   -webkit-box-orient: vertical;
    // }
  }
  .icon {
    color: var(--light-text);
  }
  border-bottom: none !important;
}
.searched-count {
  font-family: var(--font-alt);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--dark-text);
}
.btn-apply {
  width: 70%;
}
.btn-reminder {
  width: 27%;
}
/* ==========================================================================
1. Project Details
========================================================================== */
@media only screen and (min-width: 767px) {
  .poweredby {
    max-width: 200px;

    margin: 0 auto;
  }
}
@media only screen and (max-width: 766px) {
  .poweredby {
    margin: 0px 20px 0px 20px;
  }
}

ul {
  list-style: disc !important;
  margin-left: 30px;
}
.flex-meta span:first-child,
.media-flex-center .flex-meta > a:first-child {
  font-size: 1.4rem !important;
}

.job-title {
  margin: 0 0 50px 0;
  h1 {
    font-size: 1.4rem;
    font-weight: 500;
  }
}

.profile-header {
  text-align: left;

  > img {
    display: block;
    margin: 0 auto;
    max-width: 300px;
  }

  .v-avatar {
    margin: 0 auto 12px auto;
  }

  .anim-icon {
    margin-bottom: 12px;
  }

  .title {
    margin-bottom: 6px;
  }

  p {
    font-size: 1rem;
    margin: 0 auto;
    line-height: 1.3;
  }

  .profile-stats {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 12px 0;

    .profile-stat {
      display: flex;
      align-items: center;
      color: var(--light-text);
      font-family: var(--font);

      span {
        font-size: 0.9rem;
      }

      i {
        font-size: 1.2rem;
        margin-right: 6px;
      }
    }

    .separator {
      height: 25px;
      width: 2px;
      border-right: 1px solid var(--fade-grey-dark-6);
      margin: 0 10px;
    }

    .socials {
      display: flex;
      justify-content: center;

      a {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 28px;
        width: 28px;
        background: var(--white);
        border: 1px solid var(--fade-grey-dark-6);
        box-shadow: var(--light-box-shadow);
        border-radius: var(--radius-rounded);
        margin: 0 2px;
        transition: all 0.3s;

        &:hover {
          border-color: var(--primary);

          i {
            color: var(--primary);
          }
        }

        i {
          font-size: 0.9rem;
          color: var(--light-text);
          transition: color 0.3s;
        }
      }
    }
  }
}

.box-video {
  width: 100%;
  min-height: 170px;
  border-radius: 0.25rem;
}
video {
  background-color: #000;
  border-radius: 0.25rem;
  margin-bottom: 10px;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}

.is-navbar {
  .project-details {
    padding-top: 30px;
  }
}

.project-details {
  .tabs-wrapper {
    .tabs-inner {
      .tabs {
        margin: 0 auto;
        background: var(--white);
      }
    }
  }

  .project-details-inner {
    // padding: 20px 0;

    .project-details-card {
      // @include vuero-s-card();

      padding: 40px;

      .card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin-bottom: 20px;

        .title-wrap {
          h3 {
            font-family: var(--font-alt);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--dark-text);
            line-height: 1.2;
            transition: all 0.3s;
          }
        }
      }

      .project-overview {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px 0;

        p {
          max-width: 420px;
        }
      }

      .project-features {
        display: flex;
        padding: 25px 0;
        border-top: 1px solid var(--fade-grey-dark-3);
        border-bottom: 1px solid var(--fade-grey-dark-3);

        .project-feature {
          margin-right: 20px;
          width: calc(25% - 20px);

          i {
            font-size: 1.6rem;
            color: var(--primary);
            margin-bottom: 8px;
          }

          h4 {
            font-family: var(--font-alt);
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--dark);
          }

          p {
            line-height: 1.2;
            font-size: 0.85rem;
            color: var(--light-text);
            margin-bottom: 0;
          }
        }
      }

      .project-files {
        padding: 20px 0;

        h4 {
          font-family: var(--font-alt);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--primary);
          margin-bottom: 12px;
        }

        .file-box {
          display: flex;
          align-items: center;
          padding: 8px;
          background: var(--white);
          border: 1px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            border-color: var(--fade-grey-dark-3);
            box-shadow: var(--light-box-shadow);
          }

          img {
            display: block;
            width: 48px;
            min-width: 48px;
            height: 48px;
          }

          .meta {
            margin-left: 12px;
            line-height: 1.3;

            span {
              display: block;

              &:first-child {
                font-family: var(--font-alt);
                font-size: 0.9rem;
                font-weight: 600;
                color: var(--dark-text);
              }

              &:nth-child(2) {
                font-size: 0.9rem;
                color: var(--light-text);

                i {
                  position: relative;
                  top: -3px;
                  font-size: 0.3rem;
                  color: var(--light-text);
                  margin: 0 4px;
                }
              }
            }
          }

          .dropdown {
            margin-left: auto;
          }
        }
      }
    }

    .side-card {
      @include vuero-s-card();

      padding: 40px;
      margin-bottom: 1.5rem;

      h4 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        color: var(--primary);
        margin-bottom: 16px;
      }
    }

    .project-team-card {
      @include vuero-s-card();

      padding: 40px;
      max-width: 940px;
      display: block;
      margin: 0 auto;

      .column {
        padding: 1.5rem;

        &:nth-child(odd) {
          border-right: 1px solid var(--fade-grey-dark-3);
        }

        &.has-border-bottom {
          border-bottom: 1px solid var(--fade-grey-dark-3);
        }
      }
    }

    .task-grid {
      .grid-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;

        h3 {
          font-family: var(--font-alt);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark-text);
          line-height: 1.2;
        }

        .filter {
          display: flex;
          align-items: center;
          background: var(--white);
          padding: 8px 24px;
          border-radius: 100px;

          > span {
            font-family: var(--font-alt);
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--dark-text);
            margin-right: 20px;
          }

          .multiselect {
            min-width: 140px;

            .multiselect-input {
              border: none;
            }
          }
        }
      }

      .task-card {
        @include vuero-s-card();

        min-height: 200px;
        display: flex !important;
        flex-direction: column;
        justify-content: space-between;
        padding: 30px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          transform: translateY(-5px);
          box-shadow: var(--light-box-shadow);
        }

        .title-wrap {
          h3 {
            font-size: 1.1rem;
            font-family: var(--font-alt);
            font-weight: 600;
            color: var(--dark-text);
            line-height: 1.2;
            margin-bottom: 4px;
          }

          span {
            font-family: var(--font);
            font-size: 0.9rem;
            color: var(--light-text);
          }
        }

        .content-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .left {
            .avatar-stack {
              margin-bottom: 6px;
            }

            .attachments {
              display: flex;
              align-items: center;

              i {
                font-size: 15px;
                color: var(--light-text);
              }

              span {
                margin-left: 2px;
                font-size: 0.9rem;
                font-family: var(--font);
                color: var(--light-text);
              }
            }
          }
        }
      }
    }
  }
}

/* ==========================================================================
2. Project Details Dark Mode
========================================================================== */

.is-dark {
  .project-details {
    .project-details-inner {
      .project-details-card {
        @include vuero-card--dark();

        .card-head {
          .title-wrap {
            h3 {
              color: var(--dark-dark-text) !important;
            }
          }
        }

        .project-features {
          border-color: var(--dark-sidebar-light-12);

          .project-feature {
            i {
              color: var(--primary);
            }

            h4 {
              color: var(--dark-dark-text);
            }
          }
        }

        .project-files {
          h4 {
            color: var(--primary);
          }

          .file-box {
            background: var(--dark-sidebar-light-3);

            &:hover {
              border-color: var(--dark-sidebar-light-10);
            }

            .meta {
              span {
                &:first-child {
                  color: var(--dark-dark-text);
                }
              }
            }
          }
        }
      }

      .side-card {
        @include vuero-card--dark();

        h4 {
          color: var(--primary);
        }
      }

      .project-team-card {
        @include vuero-card--dark();

        .column {
          border-color: var(--dark-sidebar-light-12);
        }
      }

      .task-grid {
        .grid-header {
          h3 {
            color: var(--dark-dark-text);
          }

          .filter {
            background: var(--dark-sidebar-light-1) !important;
            border-color: var(--dark-sidebar-light-4) !important;

            > span {
              color: var(--dark-dark-text);
            }
          }
        }

        .task-card {
          @include vuero-card--dark();

          .title-wrap {
            h3 {
              color: var(--dark-dark-text);
            }
          }
        }
      }
    }
  }
}

/* ==========================================================================
3. Media Queries
========================================================================== */

@media only screen and (max-width: 767px) {
  .project-details {
    .project-details-inner {
      .project-details-card {
        padding: 30px;

        .project-overview {
          flex-direction: column;

          p {
            margin-bottom: 20px;
          }
        }

        .project-features {
          flex-wrap: wrap;

          .project-feature {
            width: calc(50% - 20px);
            text-align: center;
            margin: 0 10px;

            &:first-child,
            &:nth-child(2) {
              margin-bottom: 20px;
            }
          }
        }
      }

      .project-team-card {
        padding: 30px;

        .column {
          border-right: none !important;
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .project-details {
    .project-details-inner {
      .project-details-card {
        .project-files {
          .columns {
            display: flex;

            .column {
              min-width: 50%;
            }
          }
        }
      }

      .project-team-card {
        .columns {
          display: flex;

          .column {
            min-width: 50%;
          }
        }
      }

      .task-grid {
        .columns {
          display: flex;

          .column {
            min-width: 50%;
          }
        }
      }
    }
  }
}

ul {
  list-style: disc !important;
  margin-left: 30px;
}
</style>
