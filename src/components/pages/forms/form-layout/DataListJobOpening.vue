<script setup lang="ts">
import { computed, onMounted, ref, watchEffect, watchPostEffect } from 'vue'
import { useJobOpening } from '/@src/stores/jobOpening'
import { useJobApplication } from '/@src/stores/jobApplication'
import moment from 'moment'

const jobOpening = useJobOpening()
const jobApplication = useJobApplication()
import { useRouter } from 'vue-router'
import useNotyf from '/@src/composable/useNotyf'
import { useCompany } from '/@src/stores/company'
import { toDate } from '/@src/utils/apex-formatters'
const router = useRouter()
const notyf = useNotyf()
const company = useCompany()
function showJobApplication(item: any) {
  jobOpening.changeJobOpeningName(item.job_title)
  router.push('/job_application')
}
onMounted(() => {
  jobOpening.get()
  jobOpening.getVisitCount()
})

const addJobOpening = () => {
  jobOpening.newData()
  router.push('/job_opening/new')
}
const open = async (value: object) => {
  jobOpening.editData(value)
  router.push('/job_opening/edit')
}
function copylink(text: string) {
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

const text = ref('test')
const counterValues = jobOpening.counterValues
// const filterJobOpenings = computed((filter) => {
//   var JobOpenings = jobOpening.dataList.filter(
//     (el) => el.status == filter
//   )
//   return JobOpenings
// })

const getApplicants = (applications: any) => {
  // Make innitials from name

  const getInitials = (name: any) => {
    let initials = name.split(' ')

    if (initials.length > 1) {
      initials = initials.shift().charAt(0) + initials.pop().charAt(0)
    } else {
      initials = name.substring(0, 2)
    }

    return initials.toUpperCase()
  }

  // Colors list
  var colors = [
    'primary',
    'info',
    'success',
    'warning',
    'danger',
    'purple',
    'yellow',
    'orange',
    'green',
    'red',
    'blue',
  ]

  let people: any[] = []

  applications.forEach((applicant: any) => {
    people.push({
      color: colors[Math.floor(Math.random() * 9)],
      initials: getInitials(applicant.name),
    })
  })
  return people
}
</script>

<template>
  <div class="all-projects">
    <div class="illustration-header m-b-20">
      <div class="header-stats">
        <div class="stats-inner">
          <div class="stat-item">
            <span class="is-primary">
              {{ counterValues.activeJobs }}
            </span>
            <p>Active Jobs</p>
          </div>
          <div class="stat-item">
            <span class="is-warning">{{ counterValues.expiredJobs }}</span>
            <p>Expired Job</p>
          </div>
          <div class="stat-item">
            <span class="is-danger">{{ counterValues.hasVideoQuestion }}</span>
            <p>Has Video Questions</p>
          </div>
        </div>
      </div>
    </div>

    <div class="project-minimal-grid">
      <div class="grid-header">
        <div class="filter">
          <span>Filter by</span>

          <VControl>
            <VField>
              <div class="select" @change="jobOpening.get()">
                <select v-model="jobOpening.filters.status">
                  <option value="">All</option>
                  <option value="Open">Open</option>
                  <option value="On-hold">On-hold</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>
            </VField>
          </VControl>
        </div>
        <h3>
          <VButton
            v-if="jobOpening.dataList.length == company.extra_data.slot"
            bold
            raised
            to="pricing"
            v-tooltip="
              'Upgrade your plan now to post more job openings at simultaneously'
            "
            color="danger"
            icon="feather:alert-circle"
            >Upgrade plan to post new jobs</VButton
          >
          <VButton
            v-else
            bold
            raised
            color="primary"
            icon="feather:plus"
            @click="addJobOpening"
            >Create a job opening</VButton
          >
        </h3>
      </div>

      <div class="columns is-multiline grid-body">
        <!--Project-->
        <div
          v-for="(item, index) in jobOpening.dataList"
          :key="index"
          class="column is-4"
        >
          <VCardAdvanced v-if="!jobOpening.placeloader">
            <template #header-left>
              <VBlock
                :title="item.job_title"
                :subtitle="
                  'Created at: ' + moment(item.created_at).format('DD/MM/YYYY')
                "
                center
              >
                <template #icon>
                  <VIconBox size="small" rounded>
                    <i
                      class="iconify"
                      data-icon="feather:briefcase"
                      aria-hidden="true"
                    ></i>
                  </VIconBox>
                </template>
              </VBlock>
            </template>
            <template #header-right>
              <VDropdown
                icon="feather:more-vertical"
                title="Dropdown with icon"
                spaced
              >
                <template #content>
                  <a class="dropdown-item is-media" @click="open(item)">
                    <div class="icon">
                      <i
                        class="iconify"
                        data-icon="feather:edit"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Update the job opening</span>
                    </div>
                  </a>
                  <hr class="dropdown-divider" />

                  <a
                    :href="`${jobOpening.origin}/job/${item.slug}`"
                    target="_blank"
                    class="dropdown-item is-media"
                  >
                    <div class="icon">
                      <i
                        class="iconify"
                        data-icon="feather:globe"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div class="meta">
                      <span>Preview</span>
                      <span>View the job opening</span>
                    </div>
                  </a>
                  <hr class="dropdown-divider" />

                  <a
                    href="/job_application"
                    class="dropdown-item is-media"
                    @click="showJobApplication(item)"
                  >
                    <div class="icon">
                      <i
                        class="iconify"
                        data-icon="feather:users"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div class="meta">
                      <span>Applications</span>
                      <span>View the job applications</span>
                    </div>
                  </a>
                  <hr class="dropdown-divider" />

                  <div class="dropdown-item is-media social-share">
                    <VFlex
                      flex-wrap="wrap"
                      align-items="flex-end"
                      row-gap=".5rem"
                      column-gap=".25rem"
                    >
                      <a
                        target="_blank"
                        :href="`https://www.facebook.com/sharer/sharer.php?u=${jobOpening.origin}/job/${item.slug}`"
                      >
                        <VIconWrap icon="fab fa-facebook" color="dark" />
                      </a>
                      <a
                        target="_blank"
                        :href="`https://twitter.com/intent/tweet?url=${jobOpening.origin}/job/${item.slug}`"
                      >
                        <VIconWrap icon="fab fa-twitter" color="dark" />
                      </a>
                      <a
                        target="_blank"
                        :href="`https://www.linkedin.com/shareArticle?mini=true&url=${jobOpening.origin}/job/${item.slug}`"
                      >
                        <VIconWrap icon="fab fa-linkedin" color="dark" />
                      </a>
                      <a
                        target="_blank"
                        :href="`https://api.whatsapp.com/send?text=%0a${jobOpening.origin}/job/${item.slug}`"
                      >
                        <VIconWrap icon="fab fa-whatsapp" color="dark" />
                      </a>
                      <a
                        @click="
                          copylink(jobOpening.origin + '/job/' + item.slug)
                        "
                      >
                        <VIconWrap icon="far fa-copy" color="dark" />
                      </a>
                    </VFlex>
                  </div>
                </template>
              </VDropdown>
            </template>
            <template #content>
              <div class="c-full-content">
                <p class="c-title">
                  <i
                    class="lnir lnir-text-align-justify m-r-5"
                    aria-hidden="true"
                  ></i>
                  Job Overview
                </p>
                <p class="c-content dots">{{ item.intro }}</p>

                <p class="c-title">
                  <i
                    class="lnir lnir-calender-alt-1 m-r-5"
                    aria-hidden="true"
                  ></i>
                  Expiry date
                </p>
                <p
                  class="c-content"
                  :title="moment(item.applicationdeadline).format('DD/MM/YYYY')"
                >
                  {{ moment(item.applicationdeadline).fromNow(true) }} left
                </p>

                <p
                  class="c-title"
                  v-if="
                    item.is_remote ||
                    item.salary_start ||
                    item.year_of_experience
                  "
                >
                  <i class="lnir lnir-package m-r-5" aria-hidden="true"></i>
                  Other details
                </p>
                <p class="c-content">
                  <VTags>
                    <VTag
                      v-if="item.is_remote"
                      color="solid"
                      label="Remote Job"
                    />
                    <VTag
                      v-if="item.salary_start"
                      color="solid"
                      :label="'Salary ' + item.salary_start"
                    />
                    <VTag
                      v-if="item.year_of_experience"
                      color="solid"
                      :label="'Experience  ' + item.year_of_experience"
                    />
                  </VTags>
                </p>
              </div>
            </template>
            <template #footer-left>
              <span
                v-if="jobOpening.data.visits"
                :class="
                  item.status == 'Open'
                    ? 'icon-indicator icon-active'
                    : 'icon-indicator icon-inactive'
                "
                ><i
                  class="iconify m-r-5"
                  data-icon="feather:eye"
                  aria-hidden="true"
                ></i>
                {{
                  jobOpening.data.visits.find(
                    (obj) => obj.job_opening_id === item.id
                  )
                    ? jobOpening.data.visits.find(
                        (obj) => obj.job_opening_id === item.id
                      ).visits
                    : 0
                }}
              </span>
              <span
                :class="
                  item.status == 'Open'
                    ? 'icon-indicator icon-active'
                    : 'icon-indicator icon-inactive'
                "
                ><i
                  class="iconify m-r-5"
                  data-icon="feather:users"
                  aria-hidden="true"
                ></i
                >{{
                  item.job_application.length ? item.job_application.length : 0
                }}
              </span>
              <span
                v-if="item.video_question.length"
                class="icon-indicator icon-vid"
                ><i
                  class="iconify"
                  data-icon="feather:video"
                  aria-hidden="true"
                ></i>
              </span>
              <span v-if="item.question.length" class="icon-indicator icon-ques"
                ><i
                  class="iconify"
                  data-icon="feather:type"
                  aria-hidden="true"
                ></i>
              </span>
            </template>

            <template #footer-right>
              <span v-if="item.status == 'Open'" class="indicator-label">
                Active</span
              >
              <span v-else class="indicator-label"> {{ item.status }}</span>
              <span
                v-if="item.status == 'Open'"
                class="indicator-active indicator"
              ></span>
              <span v-else class="indicator-inactive indicator"></span>

              <!-- <VTag
                v-if="item.status == 'Open'"
                :label="'Active'"
                rounded
                outline
                color="primary"
              ></VTag> -->
            </template>
          </VCardAdvanced>
        </div>
        <PlaceloadV3 v-if="jobOpening.placeloader" style="width: 100%" />
        <VPlaceholderPage
          v-if="!jobOpening.placeloader && jobOpening.dataList.length == 0"
          title="No job opening is created yet"
          subtitle="Here you will see the list of job openings of your company"
          larger
        >
        </VPlaceholderPage>
        <!--Project-->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/projects/_projects.scss';
.is-dark .is-dark-bg-3 {
  background: white !important;
}
.filter {
  border: 1px solid var(--fade-grey-dark-3) !important;
  border-radius: var(--radius-large) !important;
}
.indicator-label {
  font-family: var(--font-alt);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--dark-text);
}
.collapse {
  border: none;
}
.icon-indicator {
  padding: 3px 8px;
  margin-left: 5px;
  border-radius: 4px;
  height: 20px;
  font-family: var(--font-alt);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--fade-grey);
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-full-content {
  min-height: 220px !important;

  .dots {
    // min-height: 63px !important;
    // border-left: 1px solid var(--fade-grey-dark-3);
    // padding-left: 10px;
  }
  .c-title {
    color: var(--dark-text) !important;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .c-content {
    margin-bottom: 15px;
  }
}

.icon-inactive {
  color: rgb(230 40 100) !important;
  background: rgba(230, 40, 100, 0.2) !important;
}
.icon-active {
  color: rgb(65, 185, 131) !important;
  background: rgba(65, 185, 131, 0.2) !important;
}
.icon-vid {
  color: rgb(255, 155, 0) !important;
  background: rgba(255, 155, 0, 0.2);
}
.icon-ques {
  color: rgb(33, 150, 243) !important;
  background: rgba(33, 150, 243, 0.2);
}
.indicator {
  content: '';
  top: 0;
  margin-left: 3px;
  height: 6px;
  width: 6px;
  border-radius: var(--radius-rounded);
}
.indicator-active {
  background: var(--primary);
}
.indicator-inactive {
  background: var(--danger);
}
.card-body {
  min-height: 103px !important;
}
.social-share {
  .v-flex {
    margin: 0 auto;
  }
  .icon-wrap {
    box-shadow: none;
    cursor: pointer;
    &:hover {
      color: var(--primary) !important;
      background-color: var(--fade-grey-light-3);
    }
  }
  &:hover {
    background: transparent !important;
  }
}
</style>
