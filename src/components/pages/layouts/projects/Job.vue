<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import { useCountryMobile } from '/@src/assets/countrymobile.json'
const allcountries = useCountryMobile

const route = useRoute()
const router = useRouter()
const dark = useRoute()

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
let errorMessageForCoverLetter = ref(false)

// Define a validation schema
const schema = yup.object({
  email: yup
    .string()
    .required(t('Email is required!'))
    .email('Must be a valid email')
    .max(255),
  name: yup.string().required(t('Name is required!')),
  phone: yup
    .number()
    .positive()
    .typeError('you must specify a valid phone number')
    .required(t('Phone is required!')),
})
let warning = ref(false)
const coverLetterChecker = () => {
  if (jobApplication.data.cover_letter == '') {
    errorMessageForCoverLetter.value = true
  } else {
    errorMessageForCoverLetter.value = false
  }
}
const handleForm = async (values: typeof schema) => {
  if (
    jobOpening.data.cover_letter_option == 'Required' &&
    jobApplication.data.cover_letter == ''
  ) {
    errorMessageForCoverLetter.value = true
    return
  }
  jobApplication.pc.process_complete = 'loading'
  if (jobApplication.data.cv == '') {
    jobApplication.pc.process_complete = 'no'
    return notyf.error('You must upload the cv!')
  }
  jobApplication.data.company_id = jobOpening.data.company_id
  jobApplication.data.job_opening_id = jobOpening.data.id
  await jobApplication.save().then((data: any) => {
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
        jobApplication.sendEmailAppliedSuccess({
          type: 'applied',
          title: jobOpening.data.job_title,
          company: jobOpening.data.company.name,
        })

        return
      }
      router.push('/job/question_answer')
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

const form_preview_messages: any = {
  file_name_preview: '',
  file_uploaded: '',
}

// For form file preview
let app_file_name = ref('CV/Resume')
let app_file_status = ref('.pdf')

let old_data: string = ''
const filesChange = async (e: any) => {
  if (e.target.files[0].type != 'application/pdf') {
    return notyf.error('Resume file format must be pdf')
  }
  app_file_status.value = 'Loading'

  app_file_name.value = e.target.files[0].name.slice(0, 15) + '...'
  let formData = new FormData()
  if (old_data != '') {
    formData.append('old_file', old_data)
  }
  formData.append('file', e.target.files[0])
  formData.append('job_opening_id', jobOpening.data.id)
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
    form_preview_messages.file_uploaded = true
    app_file_status.value = 'Saved'

    notyf.success(res.data.msg)
  }
}

onMounted(() => {
  jobOpening.getCurrentData(route.fullPath.split('/job/')[1]).then(() => {
    if (jobOpening.data.status == 'Closed') {
      window.location.href = `/404${route.fullPath}`
    }
  })
})

// Remove Dark Mode
const body = document.documentElement
body.classList.remove('is-dark')

// Check if the apply form is showing then
// hide floating "Apply now" button
let button_breaking_point = 0
const isInViewport = (apply_form: any, apply_button: any) => {
  let form = apply_form.getBoundingClientRect()
  let button = apply_button.getBoundingClientRect()
  if (button.top > 200) {
    if (form.top < button.top) {
      button_breaking_point = button.top
      apply_button.style.display = 'none'
    }
  } else {
    if (form.top > button_breaking_point) {
      apply_button.style.display = 'unset'
    }
  }
  if (form.top < button.top) {
    apply_button.style.display = 'none'
  }
}
document.addEventListener('scroll', function () {
  let apply_form = document.getElementById('apply_form')
  let apply_button = document.getElementById('apply_button')
  if (apply_form != null && apply_button != null) {
    isInViewport(apply_form, apply_button)
  }
})
</script>

<template>
  <div v-if="jobApplication.pc.process_complete == 'yes'" class="success-apply">
    <i class="fas fa-check-circle" aria-hidden="true"></i>
    <h1>Well Done!</h1>
    <p>Your application has been submitted successfully</p>
    <VButton
      @click="jobApplication.pc.process_complete = ''"
      color="primary"
      type="submit"
      class="m-t-20"
    >
      Go back to job page
    </VButton>
  </div>
  <div class="project-details">
    <!-- successfully applied -->

    <div class="apply_button">
      <a href="#apply_form" id="apply_button">
        Apply now
        <i
          class="iconify m-t-5"
          data-icon="feather:arrow-down"
          aria-hidden="true"
        ></i>
      </a>
    </div>
    <div class="tabs-wrapper is-triple-slider">
      <div class="tab-content is-active">
        <VProgress
          v-if="jobApplication.pc.process_complete == 'loading'"
          size="tiny"
          color="success"
        />

        <div class="columns">
          <div v-if="jobOpening.data.company.logo" class="column is-1">
            <VAvatar size="xl" :picture="host + jobOpening.data.company.logo" />
          </div>
          <span
            v-else
            class="skeleton-box avatar"
            style="border-radius: 100%; width: 100px; height: 100px"
          ></span>
          <div class="column is-9">
            <div class="profile-header">
              <h3
                v-if="jobOpening.data.company.name"
                class="m-l-25 title is-4 is-narrow is-thin"
              >
                {{ jobOpening.data.company.name }}
              </h3>
              <span
                v-else
                class="skeleton-box m-l-25"
                style="width: 100px; height: 25px"
              ></span>
              <p v-if="jobOpening.data.company.description" class="m-l-25">
                {{ jobOpening.data.company.description }}
              </p>
              <div v-else class="m-b-15">
                <p class="m-l-25">
                  <span
                    class="skeleton-box"
                    style="width: 320px; height: 15px"
                  ></span>
                </p>
                <p class="m-l-25">
                  <span
                    class="skeleton-box"
                    style="width: 300px; height: 15px"
                  ></span>
                </p>
              </div>
              <div
                v-if="jobOpening.data.company.country"
                class="m-l-25 profile-stats"
              >
                <div class="profile-stat">
                  <i aria-hidden="true" class="lnil lnil-map-marker"></i>
                  <span
                    >{{ jobOpening.data.city ? jobOpening.data.city + ', ' : ''
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
              <div v-else>
                <span
                  class="skeleton-box m-l-25"
                  style="width: 200px; height: 15px"
                ></span>
              </div>
            </div>
          </div>
        </div>
        <div class="columns project-details-inner">
          <div class="column is-8">
            <div class="side-card job-details">
              <div class="columns">
                <div class="column is-12">
                  <div class="job-title">
                    <h1 v-if="jobOpening.data.job_title">
                      <i class="fas fa-briefcase m-r-10"></i
                      >{{ jobOpening.data.job_title }}
                    </h1>
                    <span
                      v-else
                      class="skeleton-box"
                      style="width: 70%; height: 25px"
                    ></span>
                  </div>
                  <div v-if="jobOpening.data.intro">
                    <b>Overview</b>
                    <p>
                      {{ jobOpening.data.intro }}
                    </p>
                  </div>

                  <br />

                  <div v-if="jobOpening.data.task">
                    <b>Tasks</b>
                    <span
                      v-if="
                        jobOpening.data.task && jobOpening.data.task[0] == '<'
                      "
                    >
                      <p v-html="jobOpening.data.task"></p>
                    </span>
                  </div>
                  <div v-else>
                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 60px; height: 18px"
                      ></span>
                    </p>
                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 90%; height: 18px"
                      ></span>
                    </p>

                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 55%; height: 18px"
                      ></span>
                    </p>
                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 90%; height: 18px"
                      ></span>
                    </p>

                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 55%; height: 18px"
                      ></span>
                    </p>
                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 90%; height: 18px"
                      ></span>
                    </p>

                    <p>
                      <span
                        class="skeleton-box"
                        style="width: 55%; height: 18px"
                      ></span>
                    </p>
                  </div>

                  <!-- <p v-else>
                    {{ jobOpening.data.task }}
                  </p> -->
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
                  <VField grouped multiline class="m-t-40">
                    <VControl v-if="jobOpening.data.salary_start">
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
                        <VTag v-else :label="jobOpening.data.salary_start" />
                      </VTags>
                    </VControl>
                    <VControl v-if="jobOpening.data.rangeOfExperience == 1">
                      <VTags addons>
                        <VTag label="Experience" color="solid" outlined />
                        <VTag
                          :label="
                            jobOpening.data.years_of_experience_start +
                            (jobOpening.data.years_of_experience_end !== null
                              ? ' - ' +
                                jobOpening.data.years_of_experience_end +
                                ' Years'
                              : ' Years')
                          "
                        />
                      </VTags>
                    </VControl>
                    <VControl v-else-if="jobOpening.data.year_of_experience">
                      <VTags addons>
                        <VTag label="Experience" color="solid" outlined />
                        <VTag
                          :label="
                            jobOpening.data.year_of_experience.includes('Years')
                              ? jobOpening.data.year_of_experience
                              : jobOpening.data.year_of_experience + ' Years'
                          "
                        />
                      </VTags>
                    </VControl>
                    <VControl
                      v-else-if="jobOpening.data.year_of_experiences_start"
                    >
                      <VTags addons>
                        <VTag label="Experience" color="solid" outlined />
                        <VTag
                          :label="
                            jobOpening.data.year_of_experiences_start + ' Years'
                          "
                        />
                      </VTags>
                    </VControl>
                    <VControl v-if="jobOpening.data.is_remote == 1">
                      <VTags addons>
                        <VTag label="Position type" color="solid" outlined />
                        <VTag label="Remote" />
                      </VTags>
                    </VControl>
                    <VControl v-if="jobOpening.data.minimum_education">
                      <VTags addons>
                        <VTag label="Min Education" color="solid" outlined />
                        <VTag :label="jobOpening.data.minimum_education" />
                      </VTags>
                    </VControl>
                  </VField>
                </div>
              </div>
              <div class="footer-info">
                <div class="info">
                  {{
                    'Job ID: ' + (jobOpening.data.id ? jobOpening.data.id : '0')
                  }}
                </div>
                <div
                  class="circle-divider"
                  v-if="jobOpening.data.applicationdeadline"
                ></div>
                <div class="info" v-if="jobOpening.data.applicationdeadline">
                  {{
                    'Deadline: ' +
                    jobOpening.data.applicationdeadline.split('-')[2] +
                    '/' +
                    jobOpening.data.applicationdeadline.split('-')[1] +
                    '/' +
                    jobOpening.data.applicationdeadline.split('-')[0]
                  }}
                </div>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <!-- Deadline Expired -->

            <VCard class="expired-card" v-if="jobOpening.deadlineExpired">
              <img
                src="/@src/assets/illustrations/expired.png"
                alt="Expired Job"
              />
              <h2>This Job Is Expired</h2>

              <p>
                This job opening has expired

                <u
                  v-tooltip="
                    'EXpiration day was ' +
                    moment(jobOpening.data.applicationdeadline).format(
                      'DD/MM/YYYY'
                    )
                  "
                >
                  <b>
                    {{
                      moment(jobOpening.data.applicationdeadline).fromNow(false)
                    }}
                  </b>
                </u>

                and you can no long apply for this position.
              </p>

              <a
                class="link"
                :href="
                  '/company/' +
                  (jobOpening.data.company.slug != null
                    ? jobOpening.data.company.slug
                    : jobOpening.data.company.id)
                "
              >
                Other jobs from this company</a
              >
              <VButton
                href="/"
                color="primary"
                class="m-t-25"
                bold
                rounded
                fullwidth
              >
                Go to tenrol.com</VButton
              >
            </VCard>

            <VCard
              v-else-if="jobOpening.data.status == 'On-hold'"
              id="apply_form"
              class="expired-card m-b-20"
            >
              <img
                src="/@src/assets/illustrations/onhold.png"
                alt="Expired Job"
              />
              <h2>This Job Is On Hold</h2>

              <p>
                This job is currently on hold, you cannot apply at the moment
                please try another time
              </p>
              <a
                class="link"
                :href="
                  '/company/' +
                  (jobOpening.data.company.slug != null
                    ? jobOpening.data.company.slug
                    : jobOpening.data.company.id)
                "
              >
                Other jobs from this company</a
              >
              <VButton
                href="/"
                color="primary"
                class="m-t-25"
                bold
                rounded
                fullwidth
              >
                Go to tenrol.com</VButton
              >
            </VCard>

            <div v-else id="apply_form" class="side-card apply">
              <div class="account-box is-form is-footerless">
                <div class="form-body">
                  <!--Fieldset-->
                  <div class="fieldset">
                    <div class="fieldset-heading">
                      <h3>Interested?</h3>
                    </div>
                    <div class="columns is-multiline">
                      <!--Field-->
                      <Form :validation-schema="schema" @submit="handleForm">
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
                          <label>Phone</label>

                          <Field v-slot="{ field, errorMessage }" name="phone">
                            <VField addons class="addons-custom">
                              <VControl>
                                <VControl>
                                  <div class="select">
                                    <select
                                      class="dial"
                                      v-model="jobApplication.data.country"
                                    >
                                      <option value="" selected>🇶🇦 +974</option>

                                      <option
                                        v-for="(item, index) in allcountries"
                                        :key="index"
                                        :value="item.name"
                                      >
                                        {{ item.flag }}
                                        {{ item.dial_code }}
                                        <!-- {{ item.name }} -->
                                      </option>
                                    </select>
                                  </div>
                                </VControl>
                              </VControl>
                              <VControl
                                style="z-index: 222"
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
                                  pattern="[0-9]*"
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
                            <label>Document</label>

                            <label style="float: right"></label>
                            <VField grouped>
                              <VControl>
                                <div class="file">
                                  <label class="file-label">
                                    <input
                                      accept="application/pdf"
                                      class="file-input"
                                      type="file"
                                      name="resume"
                                      @change="filesChange"
                                    />
                                    <span
                                      class="file-cta"
                                      style="min-width: 280px"
                                    >
                                      <div class="file-label-txt">
                                        <i
                                          v-if="app_file_status == 'Saved'"
                                          class="fas fa-check-circle m-r-5"
                                        ></i>
                                        <i
                                          v-else-if="
                                            app_file_status == 'Loading'
                                          "
                                          class="fas fa-spinner m-r-5"
                                        ></i>
                                        <i
                                          v-else
                                          class="fas fa-paperclip m-r-5"
                                          aria-hidden="true"
                                        ></i>

                                        <span> {{ app_file_name }}</span>
                                        <small class="pdf"> .pdf</small>
                                      </div>
                                    </span>
                                  </label>
                                </div>
                              </VControl>
                            </VField>
                          </VField>
                        </div>
                        <div
                          v-if="
                            jobOpening.data.cover_letter_option == 'Required'
                          "
                          class="column is-12"
                        >
                          <VField>
                            <label>Cover Letter * </label>
                            <VControl>
                              <textarea
                                @keypress="coverLetterChecker"
                                v-model="jobApplication.data.cover_letter"
                                v-bind="field"
                                :class="
                                  errorMessageForCoverLetter
                                    ? 'textarea warning_over_editor'
                                    : 'textarea'
                                "
                                rows="4"
                                placeholder="Include a brief introduction about your company and the role."
                                autocomplete="off"
                                autocapitalize="off"
                                spellcheck="true"
                              >
                              </textarea>
                              <p
                                v-if="errorMessageForCoverLetter"
                                class="help is-danger"
                              >
                                Cover letter is required
                              </p>
                            </VControl>
                          </VField>
                        </div>

                        <!--Button-->
                        <div class="column is-12">
                          <!-- Submit -->
                          <VControl>
                            <VButton
                              v-if="jobApplication.pc.process_complete == 'no'"
                              color="primary"
                              type="submit"
                              fullwidth
                            >
                              Apply Now
                            </VButton>
                            <VButton
                              v-if="
                                jobApplication.pc.process_complete == 'loading'
                              "
                              fullwidth
                            >
                              Loading...
                            </VButton>
                          </VControl>
                          <VMessage v-if="warning" class="is-danger m-t-10">{{
                            app_message
                          }}</VMessage>
                        </div>
                        <p style="text-align: center" class="help">
                          By continuing you agree to our
                          <br />
                          <a target="_blank" href="../../term-and-conditions">
                            Terms & Conditions</a
                          >
                        </p>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Apply Later -->
            <details
              v-if="!jobOpening.deadlineExpired"
              class="has-chevron collapse"
              open=""
            >
              <summary class="collapse-header" tabindex="0">
                <h3>Apply later</h3>
                <div class="collapse-icon">
                  <i class="fas fa-caret-down" aria-hidden="true"></i>
                </div>
              </summary>
              <div class="collapse-content">
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
                  <Field v-slot="{ field, errorMessage }" name="reminder_email">
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
                  <!-- Submit -->
                  <VControl>
                    <VButton color="" type="submit" fullwidth>
                      {{
                        !jobOpening.reminderEmail.loading
                          ? 'Send Email'
                          : 'Loading ..'
                      }}
                    </VButton>
                  </VControl>
                </Form>
              </div>
            </details>

            <!-- Apply Later -->
            <details
              v-if="!jobOpening.deadlineExpired"
              class="has-chevron collapse"
              open=""
            >
              <summary class="collapse-header" tabindex="0">
                <h3>Share this job</h3>
                <div class="collapse-icon">
                  <i class="fas fa-caret-down" aria-hidden="true"></i>
                </div>
              </summary>
              <div class="collapse-content">
                <div class="profile-wrapper">
                  <div class="profile-header has-text-centered">
                    <div class="profile-stats">
                      <div class="socials">
                        <a
                          @click="
                            copylink(
                              jobOpening.origin +
                                '/job/' +
                                route.fullPath.split('/job/')[1]
                            )
                          "
                          ><i aria-hidden="true" class="fas fa-link"></i
                        ></a>
                        <a
                          :href="`https://api.whatsapp.com/send?text=%0a${
                            jobOpening.origin
                          }/job/${route.fullPath.split('/job/')[1]}`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-whatsapp"></i
                        ></a>
                        <a
                          :href="`https://www.facebook.com/sharer/sharer.php?u=${
                            jobOpening.origin
                          }/job/${route.fullPath.split('/job/')[1]}`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-facebook-f"></i
                        ></a>
                        <a
                          :href="`https://twitter.com/intent/tweet?url=${
                            jobOpening.origin
                          }/job/${route.fullPath.split('/job/')[1]}`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-twitter"></i
                        ></a>
                        <a
                          :href="`https://www.linkedin.com/shareArticle?mini=true&url=${
                            jobOpening.origin
                          }/job/${route.fullPath.split('/job/')[1]}`"
                          target="_blank"
                          ><i aria-hidden="true" class="fab fa-linkedin-in"></i
                        ></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>

      <!--Project Team-->
    </div>
    <a href="/" target="_blank">
      <div class="poweredby m-t-60 p-b-40">
        <img src="/@src/assets/Tenrol-Logo-04.svg" alt="" />
      </div>
    </a>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/profile/_user-profile.scss';
.addons-custom .form-icon {
  z-index: 111 !important;
}
.warning_over_editor {
  border: 1px solid #e62864 !important;
  border-radius: 7px;
}
.r-card-advanced .card-foot,
.s-card-advanced .card-foot,
.l-card-advanced .card-foot {
  border-top: 0px solid var(--fade-grey-dark-3) !important;
}
html {
  scroll-behavior: smooth;
}
.success-apply {
  position: absolute;
  top: 0;
  left: -100%;
  right: -100%;
  bottom: 0;
  background: var(--background-grey);
  z-index: 9999999;
  text-align: center;
  padding-top: 250px;
  h1 {
    font-size: 3rem;
    font-weight: bold;
  }
  .fa-check-circle {
    font-size: 6rem;
    margin-bottom: 30px;
  }
}

/* ==========================================================================
1. Project Details
========================================================================== */

.expired-card {
  flex: 1;
  padding: 5rem 3rem;
  background-color: #607d8b;
  border-radius: 6px;
  min-height: 30rem;
  .link {
    text-decoration: revert;
    color: white;
    font-weight: 500;
    text-align: center;

    display: block;
  }
  img {
    margin: 0 auto;
    display: block;
    margin-bottom: 1rem;
  }
  .v-icon {
    opacity: 0.25;
    opacity: 0.25;
    size: 7rem;
    height: 10rem !important;
    width: 10rem !important;
    margin: 0 auto;
    margin-bottom: 2rem;
    background: none;
    .lnir {
      font-size: 7rem;
    }
  }
  h2 {
    font-size: 1.6rem !important;

    color: white;
    font-weight: 600;
    text-align: center;
  }
  p {
    color: white;
    opacity: 0.8;
    font-size: 0.9rem;
    text-align: center;
    margin-bottom: 2rem;
  }
}
.collapse {
  border: 0 !important;
}
.collapse-icon {
  box-shadow: 0;
}
.fieldset-heading {
  h3 {
    font-family: var(--font-alt);
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--dark-text);
    margin-bottom: 15px;
  }
}

.collapse[open] .collapse-icon {
  box-shadow: none !important;
  border: none !important;
}
.collapse .collapse-content {
  padding: 20px 40px 40px 40px;
}

.file-label-txt {
  width: 100%;
  text-align: center;
}
.pdf {
  color: var(--light-text);
}
.fa-briefcase {
  padding: 12px;
  background: #f1f1f1;
  border-radius: 0.5rem;
}
.footer-info {
  display: flex;
  margin-top: 1.25rem;
  -webkit-box-align: center;
  align-items: center;
  .info {
    color: var(--light-text);
    font-size: 0.875rem;
    line-height: 1.42857;
    font-weight: 400;
  }
  .circle-divider {
    margin-left: 0.75rem;
    margin-right: 0.75rem;
    width: 4px;
    height: 4px;
    background-color: rgb(208, 212, 218);
    border-radius: 50%;
  }
}
.side-card {
  border: 0 !important;
}
.job-details {
  min-height: 500px;
  padding: 40px !important;
  p {
    font-weight: 400;
    color: #555454;
    font-size: 0.98rem;
  }
}
.file-label {
  margin: 0 auto !important;
}
.file-cta {
  min-height: 50px;
  border: 2px dashed var(--border);
  background: white !important;
  transition: all 0.3s;
  &:hover {
    border: 1.5px solid var(--border);
    transition: all 0.3s;
  }
}
.field {
  label {
    color: var(--dark-text) !important;
  }
}
.view-wrapper {
  margin: 0 auto !important;
}
@media only screen and (min-width: 767px) {
  .poweredby {
    width: 20%;
    align-items: center;
    margin-left: 400px;
  }
  .card-body {
    padding: 40px !important;
  }
}
.apply_button {
  display: none;
}
.dial {
  min-width: 110px;
}
// On mobile

@media only screen and (max-width: 766px) {
  .dial {
    height: 48px !important;
  }
  .collapse {
    margin-bottom: 0;
    border-bottom: 1px solid var(--fade-grey-dark-3) !important;
    border-radius: 0 !important;
  }
  .control.has-icon .input,
  .control.has-icon .form-icon,
  .file-cta,
  .button.v-button,
  .validation-icon {
    height: 48px;
    font-size: 16px;
  }
  .help {
    font-size: 0.85rem;
    margin-top: 0.35rem;
  }
  .apply {
    button {
      font-weight: 600 !important;
      margin-top: 20px;
    }
  }

  .apply_button {
    display: unset;
  }
  .avatar {
    margin-left: 20px !important;
  }
  .view-wrapper {
    padding: 0 !important;
    background: var(--body-color);
  }
  .file-label {
    width: 100%;
    .field {
      margin: 0 auto;
    }
  }
  .control {
    margin-bottom: 15px;
    width: 100%;
  }
  .file-cta {
    width: 100%;
  }
  .poweredby {
    // margin: 0px 20px 0px 20px;
    max-width: 175px;
    margin: 0 auto;
  }
  .project-details-inner {
    .column {
      padding: 0 !important;
    }

    .side-card {
      border: none !important;
      padding-bottom: 50px;
      margin-bottom: 0px !important ;
      padding: 30px !important;
      border-radius: 0 !important;
    }
    .apply {
      // background: whitesmoke !important;
      // border-top: 3px solid var(--primary) !important;
      // border-bottom: 3px solid var(--primary) !important;
      border-bottom: 1px solid var(--fade-grey-dark-3) !important;
      border-radius: 0 !important;
      padding: 40px 30px !important;
    }
    .later {
      padding-top: 100px !important;
    }
    .job-details {
      padding: 50px 30px !important;
    }
  }
  .profile-header {
    margin-bottom: 25px;
  }
  .page-title {
    height: 0;
  }
}

ul {
  list-style: disc !important;
  margin-left: 30px;
}

.job-title {
  margin: 0 0 30px 0;
  h1 {
    font-size: 1.7rem;
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
        box-shadow: none !important;
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
            // box-shadow: var(--light-box-shadow);
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

      padding: 20px;
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
    .is-multiline {
      padding: 20px;
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
          // box-shadow: var(--light-box-shadow);
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

// CKEDITOR
// Make first letter of paragraph & list capital

ul,
ol {
  li:first-letter {
    text-transform: capitalize;
  }
}
p:first-letter {
  text-transform: capitalize;
}

// Skelaton loader
.skeleton-box {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #dddbdd;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 2s infinite;
    content: '';
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}

.apply_button {
  text-align: center;
  position: fixed;
  bottom: 30px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  a {
    box-shadow: var(--primary-box-shadow) !important;
    box-shadow: none;
    cursor: pointer;
    appearance: none;
    width: auto;
    padding-left: 2.75rem;
    padding-right: 2.75rem;
    text-align: center;
    user-select: none;
    color: rgb(255, 255, 255);
    font-family: Inter, sans-serif;
    font-weight: 500;
    letter-spacing: -0.01em;
    font-size: 1rem;
    line-height: 1.5rem;
    padding-top: 12px;
    padding-bottom: 12px;
    text-decoration: none;
    border-width: initial;
    border-style: none;
    border-color: initial;
    border-image: initial;
    background: none var(--primary);
    margin: 0px;
    transition: color 0.2s ease-in-out 0s, border, background, box-shadow;
    border-radius: 4px;
    line-height: 1.1;
    font-size: 0.95rem;
    font-family: var(--font);
    transition: all 0.3s;
  }
}

.fa-spinner {
  animation: rotate-s-loader 1s linear infinite;
  color: var(--primary);
}
.fa-check-circle {
  color: var(--primary);
}
@keyframes rotate-s-loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

details > summary {
  list-style: none;
}

details > summary::marker, /* Latest Chrome, Edge, Firefox */ 
details > summary::-webkit-details-marker /* Safari */ {
  display: none;
}
</style>
