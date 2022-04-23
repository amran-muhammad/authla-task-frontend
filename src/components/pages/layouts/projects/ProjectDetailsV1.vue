<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

import { useJobOpening } from '/@src/stores/jobOpening'
import { useJobApplication } from '/@src/stores/jobApplication'

import { useI18n } from 'vue-i18n'
import * as yup from 'yup'
import axios from 'axios'
import { Notyf } from 'notyf'
const host = import.meta.env.VITE_API_BASE_URL

const notyf = new Notyf()
const { t } = useI18n()
const jobApplication = useJobApplication()
const jobOpening = useJobOpening()
let app_message = ref('Applied Successfully!')

// Define a validation schema
const schema = yup.object({
  email: yup.string().required(t('Email is required!')),
  name: yup.string().required(t('Name is required!')),
  phone: yup.string().required(t('Phone is required!')),
})
let warning = ref(false)

const handleForm = async (values: typeof schema) => {
  jobApplication.pc.process_complete = 'loading'
  if (jobApplication.data.cv == '') {
    jobApplication.pc.process_complete = 'no'
    return notyf.error('You must upload the cv!')
  }
  jobApplication.data.company_id = jobOpening.data.company_id
  jobApplication.data.job_opening_id = jobOpening.data.id
  jobApplication.save().then((data: any) => {
    if (data.data.warning) {
      jobApplication.pc.process_complete = 'no'
      warning.value = true
      app_message.value = data.data.warning
      jobApplication.resetData()
      return
    } else if (data.data.status == true) {
      if (
        jobOpening.data.question.length == 0 &&
        jobOpening.data.video_question.length == 0
      ) {
        jobApplication.pc.process_complete = 'yes'
        jobApplication.resetData()
        return
      }
      router.push('/job_application/question_answer')
    } else {
      notyf.error('Something Went Wrong!')
    }
  })
}

const copylink = (text: string) => {
  var textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    notyf.success('Link is been copied to clipboard')
  } catch (err) {
    console.log('Oops, unable to copy')
  }

  document.body.removeChild(textArea)
}

// Define a validation schema for email reminder input
const schemaMail = yup.object({
  reminder_email: yup
    .string()
    .email('Must be a valid email')
    .max(255)
    .required('Please enter your email first'),
})

const handleMailForm = async (values: typeof schemaMail) => {
  jobOpening.reminderEmail.job_id = jobOpening.data.id
  jobOpening.reminderEmail.deadline = jobOpening.data.applicationdeadline
  jobOpening.reminderEmail.company = jobOpening.data.company.name
  jobOpening.reminderEmail.title = jobOpening.data.job_title
  jobOpening.reminderEmail.overview = jobOpening.data.intro
  jobOpening.sendReminder()
}

let old_data: string = ''
const filesChange = async (e: any) => {
  if (e.target.files[0].type != 'application/pdf') {
    return notyf.error('Resume file format must be pdf')
  }
  let formData = new FormData()
  if (old_data != '') {
    formData.append('old_file', old_data)
  }
  formData.append('file', e.target.files[0])
  jobApplication.data.filesize =
    Number(e.target.files[0].size / 1000000).toFixed(2) + 'MB'
  let res: any = await axios.post(
    host + '/job-application-question/v1/cv-upload',
    formData,
    {
      headers: { 'content-type': 'multipart/form-data' },
    }
  )

  if (res.status == 200) {
    jobApplication.data.cv = res.data.data
    old_data = res.data.data
    notyf.success(res.data.msg)
  }
}

onMounted(() => {
  jobOpening.getCurrentData(route.query.job)
})
</script>

<template>
  <Form :validation-schema="schema" @submit="handleForm">
    <div class="project-details">
      <div class="tabs-wrapper is-triple-slider">
        <div class="tab-content is-active">
          <VProgress
            v-if="jobApplication.pc.process_complete == 'loading'"
            size="tiny"
            color="success"
          />
          <VMessage
            v-if="jobApplication.pc.process_complete == 'yes'"
            color="success"
            >{{ app_message }}</VMessage
          >
          <div class="columns">
            <div v-if="jobOpening.data.company.logo" class="column is-1">
              <VAvatar
                size="xl"
                :picture="host + jobOpening.data.company.logo"
              />
            </div>
            <div class="column is-9">
              <div class="profile-header">
                <h3 class="m-l-25 title is-4 is-narrow is-thin">
                  {{ jobOpening.data.company.name }}
                </h3>
                <p class="m-l-25">
                  {{ jobOpening.data.company.description }}
                </p>
                <div class="m-l-25 profile-stats">
                  <div class="profile-stat">
                    <i aria-hidden="true" class="lnil lnil-map-marker"></i>
                    <span
                      >{{
                        jobOpening.data.city ? jobOpening.data.city + ', ' : ''
                      }}{{ jobOpening.data.country }}</span
                    >
                  </div>
                  <div class="separator"></div>
                  <div class="profile-stat">
                    <i aria-hidden="true" class="lnil lnil-user-alt"></i>
                    <span
                      >{{
                        jobOpening.data.company.number_of_employee
                      }}
                      Employees</span
                    >
                  </div>
                  <div
                    :class="
                      !jobOpening.data.company.website &&
                      !jobOpening.data.company.linkedin &&
                      !jobOpening.data.company.twitter &&
                      !jobOpening.data.company.facebook
                        ? ''
                        : 'separator'
                    "
                  ></div>
                  <div class="socials">
                    <a
                      v-if="jobOpening.data.company.website"
                      :href="jobOpening.data.company.website"
                      target="_blank"
                      ><i aria-hidden="true" class="fas fa-globe"></i
                    ></a>
                    <a
                      v-if="jobOpening.data.company.linkedin"
                      :href="jobOpening.data.company.linkedin"
                      target="_blank"
                      ><i aria-hidden="true" class="fab fa-linkedin-in"></i
                    ></a>
                    <a
                      v-if="jobOpening.data.company.twitter"
                      :href="jobOpening.data.company.twitter"
                      target="_blank"
                      ><i aria-hidden="true" class="fab fa-twitter"></i
                    ></a>
                    <a
                      v-if="jobOpening.data.company.facebook"
                      :href="jobOpening.data.company.facebook"
                      target="_blank"
                      ><i aria-hidden="true" class="fab fa-facebook-f"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns project-details-inner">
            <div class="column is-8">
              <VCardAdvanced class="m-b-20">
                <template #header-right>
                  <p>Job #: {{ jobOpening.data.id }}</p>
                </template>
                <template #content>
                  <div class="columns">
                    <div class="column is-12 p-l-50 p-r-50">
                      <div class="job-title">
                        <VBlock
                          :title="jobOpening.data.job_title"
                          :subtitle="jobOpening.data.employment_type"
                          center
                        >
                          <template #icon>
                            <VIconBox size="medium">
                              <i
                                class="iconify"
                                data-icon="feather:briefcase"
                              ></i>
                            </VIconBox>
                          </template>
                        </VBlock>
                      </div>

                      <b v-if="jobOpening.data.intro">Overview</b>
                      <p v-if="jobOpening.data.intro">
                        {{ jobOpening.data.intro }}
                      </p>
                      <br />
                      <b v-if="jobOpening.data.task">Tasks</b>
                      <span
                        v-if="
                          jobOpening.data.task && jobOpening.data.task[0] == '<'
                        "
                      >
                        <p v-html="jobOpening.data.task"></p>
                      </span>
                      <p v-else>
                        {{ jobOpening.data.task }}
                      </p>
                      <br />
                      <b v-if="jobOpening.data.requirements">Requirements</b>
                      <span
                        v-if="
                          jobOpening.data.requirements &&
                          jobOpening.data.requirements[0] == '<'
                        "
                      >
                        <p v-html="jobOpening.data.requirements"></p>
                      </span>
                      <p v-else>
                        {{ jobOpening.data.requirements }}
                      </p>
                      <br />
                      <b v-if="jobOpening.data.benefits">Benefits</b>
                      <span
                        v-if="
                          jobOpening.data.benefits &&
                          jobOpening.data.benefits[0] == '<'
                        "
                      >
                        <p v-html="jobOpening.data.benefits"></p>
                      </span>
                      <p v-else>
                        {{ jobOpening.data.benefits }}
                      </p>
                      <br />
                      <b v-if="jobOpening.data.closing">Closing</b>
                      <p v-if="jobOpening.data.closing">
                        {{ jobOpening.data.closing }}
                      </p>
                      <hr />
                      <VField grouped multiline>
                        <VControl>
                          <VTags addons>
                            <VTag label="Salary" color="solid" outlined />
                            <VTag
                              v-if="jobOpening.data.salary_range == 1"
                              :label="
                                jobOpening.data.salary_start +
                                ' - ' +
                                jobOpening.data.salary_end
                              "
                            />
                            <VTag
                              v-else
                              :label="jobOpening.data.salary_start"
                            />
                          </VTags>
                        </VControl>
                        <VControl v-if="jobOpening.data.rangeOfExperience == 1">
                          <VTags addons>
                            <VTag label="Experience" color="solid" outlined />
                            <VTag
                              :label="
                                jobOpening.data.years_of_experience_start +
                                ' - ' +
                                jobOpening.data.years_of_experience_end +
                                ' years'
                              "
                            />
                          </VTags>
                        </VControl>
                        <VControl v-else>
                          <VTags addons>
                            <VTag label="Experience" color="solid" outlined />
                            <VTag
                              :label="
                                jobOpening.data.year_of_experiences_start +
                                ' years'
                              "
                            />
                          </VTags>
                        </VControl>
                        <VControl>
                          <VTags addons>
                            <VTag label="Is remote" color="solid" outlined />
                            <VTag
                              :label="
                                jobOpening.data.is_remote == 1 ? 'yes' : 'no'
                              "
                            />
                          </VTags>
                        </VControl>
                        <VControl>
                          <VTags addons>
                            <VTag
                              label="Min Education"
                              color="solid"
                              outlined
                            />
                            <VTag :label="jobOpening.data.minimum_education" />
                          </VTags>
                        </VControl>
                      </VField>
                    </div>
                  </div>
                </template>
                <template #footer-left> </template>
                <template #footer-right>
                  <p v-if="jobOpening.data.applicationdeadline">
                    Deadline:
                    {{ jobOpening.data.applicationdeadline.split('-')[2] }}/{{
                      jobOpening.data.applicationdeadline.split('-')[1]
                    }}/{{ jobOpening.data.applicationdeadline.split('-')[0] }}
                  </p>
                </template>
              </VCardAdvanced>
            </div>
            <div class="column is-4">
              <div class="side-card">
                <div class="account-box is-form is-footerless">
                  <div class="form-body">
                    <!--Fieldset-->
                    <div class="fieldset">
                      <div class="fieldset-heading">
                        <h4>Interested?</h4>
                      </div>
                      <div class="columns is-multiline">
                        <!--Field-->
                        <div class="column is-12">
                          <Field v-slot="{ field, errorMessage }" name="name">
                            <VField>
                              <label>Full Name</label>
                              <VControl
                                icon="feather:user"
                                :has-error="Boolean(errorMessage)"
                              >
                                <input
                                  v-model="jobApplication.data.name"
                                  v-bind="field"
                                  type="text"
                                  class="input"
                                  placeholder="name"
                                  autocomplete="name"
                                />
                                <p v-if="errorMessage" class="help is-danger">
                                  {{ errorMessage }}
                                </p>
                              </VControl>
                            </VField>
                          </Field>
                        </div>
                        <!--Field-->

                        <div class="column is-12">
                          <Field v-slot="{ field, errorMessage }" name="email">
                            <VField>
                              <label>E-mail</label>
                              <VControl
                                icon="feather:mail"
                                :has-error="Boolean(errorMessage)"
                              >
                                <input
                                  v-model="jobApplication.data.email"
                                  v-bind="field"
                                  type="text"
                                  class="input"
                                  placeholder="email"
                                  autocomplete="email"
                                />
                                <p v-if="errorMessage" class="help is-danger">
                                  {{ errorMessage }}
                                </p>
                              </VControl>
                            </VField>
                          </Field>
                        </div>

                        <!--Field-->
                        <div class="column is-12">
                          <Field v-slot="{ field, errorMessage }" name="phone">
                            <VField>
                              <label>Phone</label>
                              <VControl
                                icon="feather:phone"
                                :has-error="Boolean(errorMessage)"
                              >
                                <input
                                  v-model="jobApplication.data.phone"
                                  v-bind="field"
                                  type="text"
                                  class="input"
                                  placeholder="phone"
                                  autocomplete="phone"
                                />
                                <p v-if="errorMessage" class="help is-danger">
                                  {{ errorMessage }}
                                </p>
                              </VControl>
                            </VField>
                          </Field>
                        </div>

                        <!--Field-->
                        <div class="column is-12">
                          <VField>
                            <label>Resume</label>
                            <VField grouped>
                              <VControl>
                                <div class="file">
                                  <label class="file-label">
                                    <input
                                      class="file-input"
                                      type="file"
                                      name="resume"
                                      @change="filesChange"
                                    />
                                    <span
                                      class="file-cta"
                                      style="min-width: 280px"
                                    >
                                      <span class="file-icon">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                      </span>
                                      <span class="file-label">
                                        <VField>
                                          <label
                                            >Upload your resume (PDF)</label
                                          >
                                        </VField>
                                      </span>
                                    </span>
                                  </label>
                                </div>
                              </VControl>
                            </VField>
                            <p
                              style="text-align: center"
                              class="help p-t-15 p-b-15"
                            >
                              By continuing you agree to our
                              <a
                                target="_blank"
                                href="../../term-and-conditions"
                              >
                                Terms & Conditions</a
                              >
                            </p>
                          </VField>
                        </div>

                        <!--Button-->
                        <div class="column is-12">
                          <!-- Submit -->
                          <VControl>
                            <VButton
                              color="primary"
                              type="submit"
                              raised
                              fullwidth
                            >
                              Apply Now
                            </VButton>
                          </VControl>
                          <VMessage v-if="warning" class="is-danger m-t-10">{{
                            app_message
                          }}</VMessage>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="side-card">
                <h4>Apply later</h4>
                <p v-if="jobOpening.reminderEmail.showForm">
                  We’ll send a link to this job to your email.
                </p>
                <p v-else>We have sent the job link to your email</p>

                <Form
                  v-if="jobOpening.reminderEmail.showForm"
                  id="reminderForm"
                  :validation-schema="schemaMail"
                  @submit="handleMailForm"
                >
                  <!--Field-->
                  <div class="column is-12">
                    <Field
                      v-slot="{ field, errorMessage }"
                      name="reminder_email"
                    >
                      <VField>
                        <VControl
                          icon="feather:bookmark"
                          :has-error="Boolean(errorMessage)"
                        >
                          <input
                            id="reminder_email_id"
                            v-model="jobOpening.reminderEmail.email"
                            v-bind="field"
                            type="email"
                            class="input"
                            placeholder="Email"
                          />
                          <p v-if="errorMessage" class="help is-danger">
                            {{ errorMessage }}
                          </p>
                        </VControl>
                      </VField>
                    </Field>
                  </div>
                  <!--Button-->
                  <div class="column is-12">
                    <!-- Submit -->
                    <VControl>
                      <VButton color="" type="submit" raised fullwidth>
                        {{
                          !jobOpening.reminderEmail.loading
                            ? 'Send Email'
                            : 'Loading ..'
                        }}
                      </VButton>
                    </VControl>
                  </div>
                </Form>
              </div>

              <div class="side-card">
                <h4>Share this job:</h4>

                <div class="profile-wrapper">
                  <div class="profile-header has-text-centered">
                    <div class="profile-stats">
                      <div class="socials">
                        <a
                          @click="
                            copylink(
                              jobOpening.origin +
                                '/job/' +
                                route.fullPath.split('/job_opening?job=')[1]
                            )
                          "
                          ><i aria-hidden="true" class="fas fa-link"></i
                        ></a>
                        <a
                          :href="`https://api.whatsapp.com/send?text=%0a${
                            jobOpening.origin
                          }/job/${
                            route.fullPath.split('/job_opening?job=')[1]
                          }`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-whatsapp"></i
                        ></a>
                        <a
                          :href="`https://www.facebook.com/sharer/sharer.php?u=${
                            jobOpening.origin
                          }/job/${
                            route.fullPath.split('/job_opening?job=')[1]
                          }`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-facebook-f"></i
                        ></a>
                        <a
                          :href="`https://twitter.com/intent/tweet?url=${
                            jobOpening.origin
                          }/job/${
                            route.fullPath.split('/job_opening?job=')[1]
                          }`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-twitter"></i
                        ></a>
                        <a
                          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${
                            jobOpening.origin
                          }/job/${
                            route.fullPath.split('/job_opening?job=')[1]
                          }`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-linkedin-in"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!--Project Team-->
      </div>
    </div>
  </Form>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/profile/_user-profile.scss';
</style>
<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';

/* ==========================================================================
1. Project Details
========================================================================== */
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
    font-size: 1.5rem;
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
    max-width: 540px;
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

      // padding: 40px;

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
</style>
