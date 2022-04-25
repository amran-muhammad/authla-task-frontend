<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useJobOpening } from '/@src/stores/jobOpening'
import { useCountries } from '/@src/assets/countries.json'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'
import moment from 'moment'

import * as yup from 'yup'
import { useRouter } from 'vue-router'
import useNotyf from '/@src/composable/useNotyf'
import { useCompany } from '/@src/stores/company'
import { defaultTheme } from '/@src/state/defaultLayoutState'
import CKE from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { isDark } from '/@src/state/darkModeState'

const CKEditor = CKE.component
const editorData = ref(`<h1>Your HTML Content</h1>`)
const config = {
  toolbar: ['bold', 'italic', 'link', 'bulletedList', 'numberedList'],
}

const { t } = useI18n()
const jobOpening: any = useJobOpening()
// let content = ref(jobOpening.data.task)
const router = useRouter()
const allcountries = useCountries
const company = useCompany()

let floatingText = ref('')
let floatingTitle = ref('')
let floatingShow = ref(false)
// TODO :
// (1) Add all the inputs details
// (2) Add dismiss x button on floating card that sets the show status to false
const tips = ref([
  {
    title: 'Job Title',
    text: 'Include the title of the position, we recommend to keep it short and informative ',
  },
  {
    title: 'Job Introduction',
    text: 'General statement describing Job position, the concept and specific duties of the position and/ or why candidate should be interested',
  },
  { title: '', text: '' },
])

const changeFloatingInfo = async (index: number) => {
  floatingText.value = tips.value[index].text
  floatingTitle.value = tips.value[index].title
  floatingShow.value = true
}

const companySize = ref('')
const businessType = ref('')
const productToDemo = ref('')
const date = ref(new Date())
const notyf = useNotyf()

const { y } = useWindowScroll()
const options = ref(['Option 2'])
const input = ref('Per month')
const value = ref(true)
const isStuck = computed(() => {
  return y.value > 30
})
let editorTaskError = ref(false)
let salaryError = ref(false)
let salaryErrorMessage = ref('')
let editorRequirementsError = ref(false)
let editorBenefitsError = ref(false)
let errorEditorMessage = ref('')
// Define a validation schema

const schema = yup.object({
  job_title: yup
    .string()
    .required(t('jobopening.common.required'))
    .max(255, t('jobopening.common.maxLength', { number: 255 }))
    .min(8, t('jobopening.common.minLength', { number: 8 })),
  intro: yup
    .string()
    .required(t('jobopening.common.required'))
    .max(255, t('jobopening.common.maxLength', { number: 255 })),
  city: yup
    .string()
    .required(t('jobopening.common.required'))
    .max(255, t('jobopening.common.maxLength', { number: 255 })),
})

function errorMessageRemover() {
  if (jobOpening.editorTask != '') {
    editorTaskError.value = false
    if (jobOpening.editorTask.length > 1200) {
      editorTaskError.value = true
      errorEditorMessage.value = 'Task can have 1200 characters maximum!'
    }
  } else {
    editorTaskError.value = true

    if (jobOpening.editorTask == '') {
      errorEditorMessage.value = 'Task is required!'
    }
  }
  if (jobOpening.editorRequirements != '') {
    editorRequirementsError.value = false
    if (jobOpening.editorRequirements.length > 1200) {
      errorEditorMessage.value = 'Task can have 1200 characters maximum!'
      editorRequirementsError.value = true
    }
  } else {
    editorRequirementsError.value = true
    if (jobOpening.editorRequirements == '') {
      errorEditorMessage.value = 'Requirements is required!'
    }
  }
}

const handleForm = async (values: typeof schema) => {
  if (jobOpening.data.salary_range) {
    if (jobOpening.data.salary_end - jobOpening.data.salary_start <= 0) {
      salaryErrorMessage.value = 'Salary end must be less than start'
      return (salaryError.value = true)
    }
  }
  if (jobOpening.editorTask == '') {
    errorEditorMessage.value = 'Task is required!'
    return (editorTaskError.value = true)
  } else if (jobOpening.editorTask.length > 1200) {
    errorEditorMessage.value = 'Task can have 1200 characters maximum!'
    return (editorTaskError.value = true)
  } else if (jobOpening.editorRequirements == '') {
    errorEditorMessage.value = 'Requirements is required!'
    return (editorRequirementsError.value = true)
  } else if (jobOpening.editorRequirements.length > 1200) {
    errorEditorMessage.value = 'Task can have 1200 characters maximum!'
    return (editorTaskError.value = true)
  } else {
    jobOpening.data.task = jobOpening.editorTask
    jobOpening.data.requirements = jobOpening.editorRequirements
    jobOpening.data.benefits = jobOpening.editorBenefits
  }
  // jobOpening.data.task = content.value
  jobOpening.save().then((data: any) => {
    if (data.data.status === true) {
      router.push('/job_opening')
    } else if (data.data.data === false) {
      return notyf.error(data.data.msg)
    } else if (data.data.data === 'sqs') {
      return notyf.error(data.data.msg)
    } else if (data.data.data === 'vqs') {
      return notyf.error(data.data.msg)
    }
  })
}
</script>





<template>
  <!-- delete job opening modal start -->
  <!-- deleteTheJob -->
  <VModal
    :open="jobOpening.jobOpeningDeleteModal"
    size="small"
    actions="center"
    noclose
    @close="jobOpening.jobOpeningDeleteModal = false"
  >
    <template #content>
      <VPlaceholderSection
        title="Are you sure you want to delete the opening?"
      />
    </template>
    <template #action>
      <VButton
        :loading="jobOpening.loading"
        color="primary"
        @click="jobOpening.deleteTheJob(jobOpening.data.id)"
        raised
        >Confirm</VButton
      >
    </template>
  </VModal>
  <!-- delete job loading modal end -->

  <!-- Content Wrapper -->
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="dashboard"
  >
    <div class="columns">
      <div class="column is-8">
        <Form
          :validation-schema="schema"
          class="form-layout"
          :initial-values="jobOpening.isEdit ? jobOpening.data : {}"
          @submit="handleForm"
        >
          <div class="form-outer">
            <div
              :class="[isStuck && 'is-stuck']"
              class="form-header stuck-header"
            >
              <div class="form-header-inner">
                <div class="left">
                  <h3 v-if="jobOpening.isEdit">Edit Job Opening</h3>
                  <h3 v-else>New Job Opening</h3>
                </div>
                <div class="right">
                  <div class="buttons">
                    <VButton
                      icon="lnir lnir-arrow-left rem-100"
                      :to="{ name: 'job_opening' }"
                      light
                      dark-outlined
                    >
                      Cancel
                    </VButton>
                    <VButton color="primary" type="submit" raised>
                      {{ jobOpening.isEdit ? 'Update' : 'Publish' }}
                    </VButton>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-body">
              <VCard class="card-details">
                <!--Fieldset-->
                <div class="form-fieldset">
                  <div class="fieldset-heading">
                    <div class="columns">
                      <div class="column is-2">
                        <VIconWrap
                          icon="feather:file-text"
                          color="primary"
                          size="large"
                        />
                      </div>
                      <div class="column is-10">
                        <h4>Job Opening Details</h4>
                        <p>
                          This will help you to add new jobs and publish the
                          share link
                          <span v-if="jobOpening.isEdit"
                            >|
                            <a
                              target="_blank"
                              :href="'/job/' + jobOpening.data.slug"
                              >Preview Job</a
                            ></span
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <Field v-slot="{ field, errorMessage }" name="job_title">
                      <VField>
                        <label>Job Title *</label>
                        <VControl
                          icon="feather:briefcase"
                          :has-error="Boolean(errorMessage)"
                        >
                          <input
                            v-model="jobOpening.data.job_title"
                            v-bind="field"
                            type="text"
                            class="input"
                            placeholder=""
                            autocomplete="job-title"
                            @blur="floatingShow = false"
                            @focus="changeFloatingInfo(0)"
                          />
                          <p
                            v-if="
                              floatingShow &&
                              jobOpening.isEdit &&
                              floatingTitle == 'Job Title'
                            "
                            class="help is-info"
                          >
                            If you edit the title, your previous job link will
                            no longer work. It will be updated acording to the
                            title
                          </p>
                          <p v-if="errorMessage" class="help is-danger">
                            {{ errorMessage }}
                          </p>
                        </VControl>
                      </VField>
                    </Field>
                  </div>
                  <div class="column is-12">
                    <Field v-slot="{ field, errorMessage }" name="intro">
                      <VField>
                        <label>Introduction * </label>
                        <VControl :has-error="Boolean(errorMessage)">
                          <textarea
                            @blur="floatingShow = false"
                            @focus="changeFloatingInfo(1)"
                            v-model="jobOpening.data.intro"
                            v-bind="field"
                            :class="
                              errorMessage
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
                          <p v-if="errorMessage" class="help is-danger">
                            {{ errorMessage }}
                          </p>
                        </VControl>
                      </VField>
                    </Field>
                  </div>
                  <div class="column is-12">
                    <VField>
                      <label>Tasks *</label>

                      <div
                        @keyup="errorMessageRemover"
                        class="content"
                        :class="editorTaskError ? 'warning_over_editor' : ''"
                      >
                        <CKEditor
                          v-model="jobOpening.editorTask"
                          :editor="ClassicEditor"
                          :config="config"
                        ></CKEditor>
                      </div>
                      <p
                        v-if="editorTaskError"
                        class="help is-danger mar-top-neg-18"
                      >
                        {{ errorEditorMessage }}
                      </p>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField>
                      <label>Requirements *</label>
                      <div
                        @keyup="errorMessageRemover"
                        class="content"
                        :class="
                          editorRequirementsError ? 'warning_over_editor' : ''
                        "
                      >
                        <CKEditor
                          v-model="jobOpening.editorRequirements"
                          :editor="ClassicEditor"
                          :config="config"
                        ></CKEditor>
                      </div>
                      <p
                        v-if="editorRequirementsError"
                        class="help is-danger mar-top-neg-18"
                      >
                        {{ errorEditorMessage }}
                      </p>
                    </VField>
                  </div>
                  <div class="column is-12">
                    <VField>
                      <label>Benefits </label><VTag label="optional" tiny />
                      <div class="content">
                        <CKEditor
                          v-model="jobOpening.editorBenefits"
                          :editor="ClassicEditor"
                          :config="config"
                        ></CKEditor>
                      </div>
                    </VField>
                  </div>
                </div>
              </VCard>

              <!--Fieldset Options-->
              <VCard class="m-t-50">
                <div class="form-fieldset">
                  <div class="fieldset-heading m-t-20 m-b-30">
                    <div class="columns">
                      <div class="column is-2">
                        <VIconWrap
                          icon="feather:list"
                          color="primary"
                          size="large"
                        />
                      </div>
                      <div class="column is-10">
                        <h4>Job options</h4>
                        <p>
                          Here you can discuss options such as salary,
                          employment type and more ..
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="column is-12">
                    <div class="columns is-multiline">
                      <div class="column is-4">
                        <Field
                          v-slot="{ field, salaryError }"
                          name="salary_start"
                        >
                          <VField>
                            <label>{{
                              jobOpening.data.salary_range
                                ? 'Starting From'
                                : 'Salary Amount'
                            }}</label
                            ><VTag label="optional" tiny />
                            <VControl :has-error="Boolean(salaryError)">
                              <input
                                v-model="jobOpening.data.salary_start"
                                v-bind="field"
                                :max="jobOpening.data.salary_end - 1"
                                type="number"
                                class="input"
                                placeholder="4,000"
                                autocomplete="number"
                              />
                            </VControl>
                          </VField>
                        </Field>
                      </div>

                      <div
                        v-if="jobOpening.data.salary_range"
                        class="column is-4"
                      >
                        <Field v-slot="{ field }" name="salary_end">
                          <VField>
                            <label>To</label>
                            <VControl :has-error="salaryError">
                              <input
                                v-model="jobOpening.data.salary_end"
                                v-bind="field"
                                :min="jobOpening.data.salary_start + 1"
                                type="number"
                                class="input"
                                placeholder="7,000"
                                autocomplete="number"
                              />
                            </VControl>
                          </VField>
                          <p v-if="salaryError" class="help is-danger">
                            {{ salaryErrorMessage }}
                          </p>
                        </Field>
                      </div>
                      <div class="column is-4">
                        <VField>
                          <label>Type</label>
                          <div class="select">
                            <select v-model="jobOpening.data.salary_type">
                              <option value="Per month">Per month</option>
                              <option value="Per week">Per week</option>
                              <option value="Per year">Per year</option>
                            </select>
                          </div>
                        </VField>
                      </div>
                    </div>
                    <div class="columns is-multiline">
                      <div class="column is-6">
                        <VSwitchBlock
                          v-model="jobOpening.data.salary_range"
                          label="Range of Salary"
                          color="primary"
                        />
                      </div>
                      <div class="column is-6">
                        <VSwitchBlock
                          v-model="jobOpening.data.salary_show_on_job"
                          label="Publish Salary"
                          color="primary"
                        />
                      </div>
                      <div class="column is-12">
                        <div class="is-divider"></div>
                      </div>
                      <div class="column is-12">
                        <VField>
                          <label>Experience/Career Level</label
                          ><VTag label="optional" tiny />
                          <div class="select">
                            <select v-model="jobOpening.data.career_label">
                              <option value="Beginner Label">
                                Entry-level
                              </option>
                              <option value="Mid Label">Mid-level</option>
                              <option value="Senior Label">Senior-level</option>
                              <option value="Senior Label">
                                Executive-level
                              </option>
                            </select>
                          </div>
                        </VField>
                      </div>
                      <div class="column is-6">
                        <VField>
                          <label>{{
                            jobOpening.data.rangeOfExperience
                              ? 'Years of Experience Start'
                              : 'Years of Experience'
                          }}</label
                          ><VTag label="optional" tiny />
                          <div class="select">
                            <select
                              v-model="
                                jobOpening.data.years_of_experience_start
                              "
                            >
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>
                              <option value="6">6</option>
                              <option value="7">7</option>
                              <option value="8">8</option>
                              <option value="9">9</option>
                              <option value="10">10</option>
                            </select>
                          </div>
                        </VField>
                      </div>
                      <div class="column is-6">
                        <VField v-if="jobOpening.data.rangeOfExperience">
                          <label>End</label><VTag label="optional" tiny />
                          <div class="select">
                            <select
                              v-model="jobOpening.data.years_of_experience_end"
                            >
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 1
                                "
                                value="1"
                              >
                                1
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 2
                                "
                                value="2"
                              >
                                2
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 3
                                "
                                value="3"
                              >
                                3
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 4
                                "
                                value="4"
                              >
                                4
                              </option>
                              <option
                                selected
                                v-if="
                                  jobOpening.data.years_of_experience_start < 5
                                "
                                value="5"
                              >
                                5
                              </option>

                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 6
                                "
                                value="6"
                              >
                                6
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 7
                                "
                                value="7"
                              >
                                7
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 8
                                "
                                value="8"
                              >
                                8
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 9
                                "
                                value="9"
                              >
                                9
                              </option>
                              <option
                                v-if="
                                  jobOpening.data.years_of_experience_start < 10
                                "
                                value="10"
                              >
                                10
                              </option>
                            </select>
                          </div>
                        </VField>
                      </div>
                      <div class="column is-6">
                        <VSwitchBlock
                          v-model="jobOpening.data.rangeOfExperience"
                          label="Range of Experience"
                          color="primary"
                        />
                      </div>
                      <div class="column is-12">
                        <div class="is-divider"></div>
                      </div>
                      <div class="column is-6">
                        <VField>
                          <label>Minimum Education</label
                          ><VTag label="optional" tiny />
                          <div class="select">
                            <select v-model="jobOpening.data.minimum_education">
                              <option value="No Education">No Education</option>
                              <option value="Primary School">
                                Primary School
                              </option>
                              <option value="High School">High School</option>
                              <option value="Bachelor Degree">
                                Bachelor Degree
                              </option>
                              <option value="Masters Degree">
                                Masters Degree
                              </option>
                              <option value="Ph.D">Ph.D</option>
                            </select>
                          </div>
                        </VField>
                      </div>
                      <div class="column is-6">
                        <VField>
                          <label>Employement Type</label>
                          <div class="select">
                            <select v-model="jobOpening.data.contract">
                              <option value="Freelance">Freelance</option>
                              <option value="Full time">Full time</option>
                              <option value="Part time">Part time</option>
                              <option value="Contract/Temporary">
                                Contract/Temporary
                              </option>
                            </select>
                          </div>
                        </VField>
                      </div>

                      <div class="column is-6">
                        <VField>
                          <label>Country</label>
                          <div class="select">
                            <select v-model="jobOpening.data.country">
                              <option
                                v-for="(item, index) in allcountries"
                                :key="index"
                                :value="item.value"
                              >
                                {{ item.value }}
                              </option>
                            </select>
                          </div>
                        </VField>
                      </div>
                      <div class="column is-6">
                        <Field v-slot="{ field, errorMessage }" name="city">
                          <VField>
                            <label>City</label>
                            <VControl
                              icon="feather:map-pin"
                              :has-error="Boolean(errorMessage)"
                            >
                              <input
                                v-model="jobOpening.data.city"
                                type="text"
                                class="input"
                                placeholder=""
                                v-bind="field"
                              />
                              <p v-if="errorMessage" class="help is-danger">
                                {{ errorMessage }}
                              </p>
                            </VControl>
                          </VField>
                        </Field>
                      </div>

                      <div class="column is-6">
                        <VField>
                          <label>Cover Letter Option</label>
                          <VControl>
                            <div class="select">
                              <select
                                v-model="jobOpening.data.cover_letter_option"
                              >
                                <option value="Optional">Optional</option>
                                <option value="Required">Required</option>
                              </select>
                            </div>
                          </VControl>
                        </VField>
                      </div>
                      <div class="column is-6">
                        <VField>
                          <label>Remote Job</label
                          ><VTag label="optional" tiny />
                          <VControl>
                            <VSwitchBlock
                              v-model="jobOpening.data.is_remote"
                              label=""
                              color="primary"
                            />
                          </VControl>
                        </VField>
                      </div>
                    </div>
                  </div>
                </div>
              </VCard>

              <!--Question Fieldset-->
              <VCard class="m-t-50">
                <div class="form-fieldset">
                  <div class="fieldset-heading m-t-20">
                    <div class="columns">
                      <div class="column is-2">
                        <VIconWrap
                          icon="feather:edit-2"
                          color="primary"
                          size="large"
                        />
                      </div>
                      <div class="column is-10">
                        <h4>
                          Ask Candidates Question<VTag label="optional" tiny />
                        </h4>
                        <p>
                          Add screening questions to find the best candidates
                          more easily
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="columns is-multiline">
                    <div class="column is-12">
                      <div class="stepper-form">
                        <div class="form-sections">
                          <div class="form-section is-active">
                            <div
                              v-for="(item, index) in jobOpening.data.question"
                              :key="index"
                              class="form-section-output"
                            >
                              <div class="output">
                                <div class="columns is-multiline">
                                  <div class="column is-12">
                                    <VField>
                                      <label>Question Title</label>
                                      <VControl icon="feather:help-circle">
                                        <input
                                          v-model="item.question"
                                          type="text"
                                          class="input"
                                          placeholder="Start Date, Expected Salary, Tools, Language, Work Experience"
                                          autocomplete="job-title"
                                        />
                                      </VControl>
                                    </VField>
                                  </div>

                                  <div class="column is-12">
                                    <VField>
                                      <label>Answer Type</label>
                                      <VControl>
                                        <div class="select">
                                          <select v-model="item.type">
                                            <option value="Text">Text</option>
                                            <option value="Number">
                                              Number
                                            </option>
                                            <option value="Date">Date</option>
                                            <option value="Yes/No">
                                              Yes/No
                                            </option>
                                          </select>
                                        </div>
                                      </VControl>
                                    </VField>
                                  </div>
                                </div>
                                <div class="action">
                                  <VIconButton
                                    icon="feather:trash-2"
                                    @click.prevent="
                                      jobOpening.removeScreeningQuestion(index)
                                    "
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="form-section-output">
                              <VField>
                                <VControl>
                                  <button
                                    class="input-button"
                                    @click.prevent="
                                      jobOpening.addNewScreeningQuestion
                                    "
                                  >
                                    <i
                                      aria-hidden="true"
                                      class="iconify"
                                      data-icon="feather:plus"
                                    ></i>
                                    <span>Add Question</span>
                                  </button>
                                </VControl>
                              </VField>
                              <VMessage
                                @click="jobOpening.questionError = false"
                                closable
                                v-if="jobOpening.questionError"
                                class="is-danger"
                                >Maximum
                                {{ company.extra_data.screening_question_slot }}
                                questions can be added! To add more try
                                premium.</VMessage
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VCard>

              <!--Video Question Fieldset-->
              <VCard id="video-hash" class="m-t-50">
                <div class="form-fieldset">
                  <div class="fieldset-heading m-t-20">
                    <div class="columns">
                      <div class="column is-2">
                        <VIconWrap
                          icon="feather:video"
                          color="primary"
                          size="large"
                        />
                      </div>
                      <div class="column is-10">
                        <h4>Video Assesment<VTag label="optional" tiny /></h4>

                        <p>
                          Add screening questions so simulate a virtual
                          interview
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="columns is-multiline">
                    <div class="column is-12">
                      <div class="stepper-form">
                        <div class="form-sections">
                          <div class="form-section is-active">
                            <div
                              v-for="(item, index) in jobOpening.data
                                .video_question"
                              :key="index"
                              class="form-section-output"
                            >
                              <div class="output">
                                <div class="columns is-multiline">
                                  <div class="column is-12">
                                    <VField>
                                      <label>Question Title</label>
                                      <VControl icon="feather:help-circle">
                                        <input
                                          v-model="item.question"
                                          type="text"
                                          class="input"
                                          placeholder="Expected Salary"
                                          autocomplete="job-title"
                                        />
                                      </VControl>
                                    </VField>
                                  </div>
                                  <div class="column is-12">
                                    <VField>
                                      <label>Question descripotion</label
                                      ><VTag label="optional" tiny />
                                      <VControl>
                                        <textarea
                                          v-model="item.description"
                                          class="textarea"
                                          rows="4"
                                          placeholder="Include a brief introduction about your company and the role."
                                          autocomplete="off"
                                          autocapitalize="off"
                                          spellcheck="true"
                                        ></textarea>
                                      </VControl>
                                    </VField>
                                  </div>
                                  <div class="column is-12">
                                    <VField>
                                      <label>Video Length</label>
                                      <VControl>
                                        <div class="select">
                                          <select v-model="item.length">
                                            <option value="30">30 sec</option>
                                            <option value="60">1 min</option>
                                            <option value="120">2 min</option>
                                            <option value="180">3 min</option>
                                          </select>
                                        </div>
                                      </VControl>
                                    </VField>
                                  </div>
                                </div>
                                <div class="action">
                                  <VIconButton
                                    icon="feather:trash-2"
                                    @click.prevent="
                                      jobOpening.removeVideoQuestion(index)
                                    "
                                  />
                                </div>
                              </div>
                            </div>
                            <div class="form-section-output">
                              <VField>
                                <VControl>
                                  <button
                                    class="input-button"
                                    @click.prevent="
                                      jobOpening.addNewVideoQuestion
                                    "
                                  >
                                    <i
                                      aria-hidden="true"
                                      class="iconify"
                                      data-icon="feather:plus"
                                    ></i>
                                    <span>Add Question</span>
                                  </button>
                                </VControl>
                              </VField>
                              <VMessage
                                @click="jobOpening.videoQuestionError = false"
                                closable
                                v-if="jobOpening.videoQuestionError"
                                class="is-danger"
                                >Maximum
                                {{ company.extra_data.video_question_slot }}
                                video questions can be added! To add more try
                                premium.</VMessage
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </VCard>

              <!--Settings Fieldset-->
              <VCard id="video-hash" class="m-t-50">
                <div class="form-fieldset">
                  <div class="fieldset-heading m-t-20">
                    <div class="columns">
                      <div class="column is-2">
                        <VIconWrap
                          icon="feather:settings"
                          color="primary"
                          size="large"
                        />
                      </div>
                      <div class="column is-10">
                        <h4>
                          Jop opening settings<VTag label="optional" tiny />
                        </h4>

                        <p>
                          Update the job opening sharing options, status and
                          more
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="columns is-multiline">
                    <div id="change-status" class="column is-12 m-b-20">
                      <VField>
                        <label>Job Opening Status</label>
                        <div class="select">
                          <select v-model="jobOpening.data.status">
                            <option value="Open">Open</option>
                            <option value="On-hold">On-hold</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </VField>
                      <VField>
                        <label>Prefered Date</label
                        ><VTag label="optional" tiny />
                        <VControl>
                          <input
                            v-model="jobOpening.data.applicationdeadline"
                            class="input"
                            type="date"
                            placeholder="Select a date"
                          />
                        </VControl>
                      </VField>
                    </div>

                    <div class="column is-12 m-b-20">
                      <VCard class="small-card">
                        <div class="column is-6">
                          <VSwitchBlock
                            :checked="jobOpening.data.is_public"
                            v-model="jobOpening.data.is_public"
                            label="Share job applications"
                            color="primary"
                          />
                        </div>
                        <table class="table is-fullwidth">
                          <thead>
                            <tr>
                              <th scope="col">Shared Section</th>
                              <th scope="col" class="is-end">
                                <div
                                  class="
                                    dark-inverted
                                    is-flex is-justify-content-flex-end
                                  "
                                >
                                  On/Off
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Profile</td>
                              <td class="is-end">
                                <div
                                  class="is-flex is-justify-content-flex-end"
                                >
                                  <VControl>
                                    <VSwitchSegment
                                      label-true="Show"
                                      color="primary"
                                      :checked="jobOpening.data.is_profile"
                                      v-model="jobOpening.data.is_profile"
                                    />
                                  </VControl>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Videos</td>
                              <td class="is-end">
                                <div
                                  class="is-flex is-justify-content-flex-end"
                                >
                                  <VControl>
                                    <VSwitchSegment
                                      label-true="Show"
                                      color="primary"
                                      :checked="jobOpening.data.is_interview"
                                      v-model="jobOpening.data.is_interview"
                                    />
                                  </VControl>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>Questions</td>
                              <td class="is-end">
                                <div
                                  class="is-flex is-justify-content-flex-end"
                                >
                                  <VControl>
                                    <VSwitchSegment
                                      label-true="Show"
                                      color="primary"
                                      :checked="
                                        jobOpening.data.is_questionnaire
                                      "
                                      v-model="jobOpening.data.is_questionnaire"
                                    />
                                  </VControl>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </VCard>
                    </div>
                    <div class="column is-12">
                      <VButton
                        icon="feather:trash-2"
                        fullwidth
                        strong
                        color="danger"
                        @click="jobOpening.jobOpeningDeleteModal = true"
                      >
                        Delete Job Opening</VButton
                      >
                    </div>
                  </div>
                </div>
              </VCard>
            </div>
          </div>
        </Form>
      </div>
      <div class="column is-4 right-side">
        <VCard
          v-if="
            jobOpening.isEdit &&
            jobOpening.data.status == 'Open' &&
            moment(jobOpening.data.applicationdeadline).isAfter()
          "
          class="small-card m-b-20"
          color="primary"
        >
          <h3 class="title is-6 mb-2">
            <i class="lnir lnir-checkmark-circle" aria-hidden="true"></i>
            Published
          </h3>
          <p class="m-b-20">
            The job opening is currently public and visible. Candidates can view
            or and apply any time
          </p>
          <a href="#change-status"
            ><VButton outlined color="light" bold>Change status</VButton>
          </a>
        </VCard>
        <VCard
          v-else-if="
            jobOpening.isEdit &&
            jobOpening.data.status == 'Open' &&
            moment(jobOpening.data.applicationdeadline).isBefore()
          "
          class="small-card m-b-20"
          color="warning"
        >
          <h3 class="title is-6 mb-2">
            <i class="lnir lnir-checkmark-circle" aria-hidden="true"></i>
            Expired
          </h3>
          <p class="m-b-20">
            The job opening is currently expired, if you wish to make it public
            then expand the application due date.
          </p>
          <a href="#change-status"
            ><VButton outlined color="light" bold>Change date</VButton>
          </a>
        </VCard>

        <!-- Floating info card-->
        <VCard v-if="floatingShow" class="floating-info small-card">
          <h3 class="title is-6 mb-2">
            <i class="lnir lnir-question-circle" aria-hidden="true"></i>
            {{ floatingTitle }}
          </h3>
          <p>
            <small>{{ floatingText }}</small>
          </p>
        </VCard>
      </div>
    </div>
  </DefaultLayout>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/generic/_forms.scss';
@import '../../../../scss/pages/generic/_forms-stepper.scss';

.is-dark .form-layout .form-outer .form-header {
  background: hsl(240 4% 13% / 1) !important;
}
.is-dark .form-layout .form-outer .is-stuck {
  border-bottom: hsl(240 4% 13% / 1) !important;
}
.fieldset-heading {
  margin-bottom: 20px !important;

  .icon-wrap {
    margin: 0 auto;
  }
  h4 {
    font-size: 1.6rem !important;
  }
}
.form-fieldset {
  max-width: 600px !important;
  // padding: 20px;
}
.form-outer {
  background: transparent !important;
  border: none !important;
  .form-body {
    padding: 0 !important;
    .card-details {
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      border-top: none !important;
    }
  }
  .form-header {
    background: white !important;
    border: 1px solid var(--fade-grey-dark-3);
    border-top-left-radius: 0.5rem !important;
    border-top-right-radius: 0.5rem !important;
  }
  .is-stuck {
    border: none !important;
    border-bottom: 1px solid var(--fade-grey-dark-3) !important;
  }
}
.video-icon {
  position: fixed;
  right: 44px;
  bottom: 44px;
  z-index: 999;
  font-size: 2rem;
  height: 3rem;
  width: 3rem;
  cursor: pointer;
}
.warning_over_editor {
  border: 1px solid #e62864 !important;
  border-radius: 7px;
}
.mar-top-neg-18 {
  margin-top: -18px;
}
.devider {
  padding-bottom: 20px;
  background: #f0f0f0;
}

.stepper-form {
  padding-top: 1rem !important;

  margin-bottom: 0px !important;
  .form-sections {
    padding-right: 0px !important;
  }
  .output {
    height: auto !important;
    padding-top: 16px !important;
  }
}

.ck.ck-toolbar {
  border: none !important;
}
.ck.ck-icon {
  font-size: 0.75em;
}
.ck.ck-button,
a.ck.ck-button {
  padding: 3px;
  cursor: pointer;
  min-width: 0px;
  min-height: 0px;
}
.floating-info {
  width: 100%;

  -webkit-animation: 1s ease 0s normal forwards 1 fadein;
  animation: 1s ease 0s normal forwards 1 fadein;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadein {
  0% {
    opacity: 0;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

// On Mobile
@media only screen and (max-width: 766px) {
  .floating-info {
    display: none;
  }
}

.small-card {
  border-radius: 0.25rem;
}
html {
  scroll-behavior: smooth;
}
.right-side {
  position: absolute;
  right: 0;
}
// CKEDITOR
// Make first letter of paragraph & list capital
.ck-content {
  ul,
  ol {
    li:first-letter {
      text-transform: capitalize;
    }
  }
  p:first-letter {
    text-transform: capitalize;
  }
}
</style>