<route lang="yaml">
meta:
  requiresAuth: true
</route>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useJobApplication } from '/@src/stores/jobApplication'
import { Notyf } from 'notyf'
import { useRoute, useRouter } from 'vue-router'
import { boolean } from 'yup/lib/locale'
import moment from 'moment'
import { useJobOpening } from '/@src/stores/jobOpening'

const host = import.meta.env.VITE_API_BASE_URL
const notyf = new Notyf()
const job_application: any = useJobApplication()
const jobOpening = useJobOpening()
const route = useRoute()
const router = useRouter()
const viewResume = ref(false)
const viewCoverLetter = ref(false)

// The Question Data
export interface QuestionData {
  input_type: string
  question_type: string
  index: number
  id: number
  rating: number | null
  note: string
}

// Init of Question form.
const question_form = reactive<QuestionData>({
  input_type: '',
  question_type: '',
  index: -1,
  id: 0,
  rating: 0,
  note: '',
})

// Init of Video Question form.
const video_question_form = reactive<QuestionData>({
  input_type: '',
  question_type: '',
  index: -1,
  id: 0,
  rating: 0,
  note: '',
})

const openModalForChangeStatus = () => {
  job_application.jobApplicationStatusModal = true
}
const closeStatusModal = () => {
  job_application.jobApplicationStatusModal = false
  if (
    job_application.app_holder.status != job_application.statusOfJobApplication
  ) {
    job_application.app_holder.status = job_application.statusOfJobApplication
  }
}

// Rate: Add rating for any candidate answer
function save(
  input_type: string,
  question_type: string,
  index: number,
  id: number,
  value: any
) {
  if (question_type == 'text') {
    question_form.question_type = question_type
    question_form.id = id
    question_form.input_type = input_type
    if (input_type == 'rate') {
      question_form.index = index
      question_form.rating = value
      job_application.save_change(question_form)
      question_form.index = -1
      notyf.success('Rating is updated successfully!')
    } else if (input_type == 'note') {
      question_form.note = value
      job_application.save_change(question_form)
      notyf.success('Note is updated successfully!')
      reset()
    } else {
      console.log('Please add the input type')
      return
    }
  } else if (question_type == 'video') {
    video_question_form.question_type = question_type
    video_question_form.id = id
    video_question_form.input_type = input_type
    if (input_type == 'rate') {
      video_question_form.index = index
      video_question_form.rating = value
      job_application.save_change(video_question_form)
      video_question_form.index = -1
      notyf.success('Rating is updated successfully!')
    } else if (input_type == 'note') {
      video_question_form.note = value
      job_application.save_change(video_question_form)
      notyf.success('Note is updated successfully!')
      reset()
    } else {
      console.log('Plz add the input type')
      return
    }
  } else {
    notyf.success(
      'There was an error understanding the question type video or text!'
    )
  }
}

// Edit: Show/Focus edit textarea when click the edit button
function edit(question_type: string, item: any, index: number) {
  if (question_type == 'text') {
    question_form.index = index
    if (job_application.app_holder.answer[index].rating > 0)
      question_form.rating = job_application.app_holder.answer[index].rating
    question_form.id = job_application.app_holder.answer[index].id
    question_form.note = job_application.app_holder.answer[index].note
  }

  if (question_type == 'video') {
    video_question_form.index = index
    if (job_application.app_holder.video_answer[index].rating > 0)
      video_question_form.rating =
        job_application.app_holder.video_answer[index].rating
    video_question_form.id = job_application.app_holder.video_answer[index].id
    video_question_form.note =
      job_application.app_holder.video_answer[index].note
  }

  delayed_focus(item.id)
}

// Reset: Reset the active question
function reset() {
  question_form.index = -1
  question_form.id = 0
  question_form.rating = 0
  question_form.note = ''
  video_question_form.index = -1
  video_question_form.id = 0
  video_question_form.rating = 0
  video_question_form.note = ''
}

// Move to the job opening route
function viewJob() {
  const url =
    jobOpening.origin + '/job/' + job_application.app_holder.job_opening.slug
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
}

// Download resume file: TODO { Make it download file instead of moving to new tab}
function downloadCv() {
  const url = host + job_application.app_holder.cv
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.target = '_blank'

  // the filename you want
  a.download = job_application.app_holder.cv.split('cv/')[1]
  document.body.appendChild(a)
  a.click()
}

// Click the call button
function makeACall() {
  window.open('tell:' + job_application.app_holder.phone)
}

// Click the email button
function makeAMail() {
  window.open('mailto:' + job_application.app_holder.email)
}

// Focus on input after 0.25 second
function delayed_focus(id: string) {
  setTimeout(() => {
    let input: any = document.getElementById(id)
    input.focus()
  }, 250)
}

function setAveregeScore(rating: number) {
  job_application.app_holder.average_score = rating
  job_application.changeScoreOfJobApplication()
}

onMounted(async () => {
  job_application.get_single_job(Number(route.query.job))
})
</script>


<template>
  <DefaultLayout
    :theme="defaultTheme"
    open-on-mounted
    default-sidebar="dashboard"
  >
    <!-- START MODAL RESUME-->
    <VModal
      :open="viewResume"
      title="Resume Preview"
      size="big"
      actions="right"
      cancelLabel="Close"
      @close="viewResume = false"
    >
      <template #content>
        <iframe
          :src="host + job_application.app_holder.cv"
          width="100%"
          height="720px"
        ></iframe>
      </template>
      <template #action>
        <VButton color="primary" @click="downloadCv">Download</VButton>
      </template>
    </VModal>
    <VModal
      :open="viewCoverLetter"
      title="Cover Letter"
      size="medium"
      actions="right"
      cancelLabel="Close"
      @close="viewCoverLetter = false"
    >
      <template #content>
        <VCard>
          {{ job_application.app_holder.cover_letter }}
        </VCard>
      </template>
    </VModal>
    <!-- END MODAL RESUME-->

    <!-- Content Wrapper -->
    <div
      v-if="job_application.app_holder.name !== ''"
      class="page-content-inner"
    >
      <!-- status job application modal start -->
      <VModal
        :open="job_application.jobApplicationStatusModal"
        size="small"
        actions="center"
        noclose
        @close="closeStatusModal"
      >
        <template #content>
          <VPlaceholderSection
            title="Are you sure you want to change the status of the application?"
            subtitle=""
          />
        </template>
        <template #action>
          <VButton
            :loading="job_application.loaderStatus"
            color="primary"
            @click="job_application.changeStatusOfJobApplication"
            raised
            >Confirm</VButton
          >
        </template>
      </VModal>
      <!-- status job application modal end -->
      <div class="business-dashboard company-dashboard application-details">
        <div class="columns is-multiline">
          <div class="column is-4">
            <div class="dashboard-card is-company application-details">
              <VBlock
                class="candidate-name"
                :title="job_application.app_holder.name"
                :subtitle="job_application.app_holder.title"
              >
                <template #icon>
                  <VIconBox bordered color="primary" class="m-l-10">
                    <i class="lnir lnir-user" aria-hidden="true"></i>
                  </VIconBox>
                </template>
              </VBlock>

              <VBlock
                title="Email"
                :subtitle="job_application.app_holder.email"
              >
                <template #action>
                  <VButtons>
                    <VIconButton icon="feather:mail" @click="makeAMail" />
                  </VButtons>
                </template>
              </VBlock>
              <VBlock
                title="Phone"
                :subtitle="job_application.app_holder.phone"
              >
                <template #action>
                  <VButtons>
                    <VIconButton icon="feather:phone" @click="makeACall" />
                  </VButtons>
                </template>
              </VBlock>

              <VBlock
                title="Resume"
                :subtitle="'Pdf - ' + job_application.app_holder.filesize"
              >
                <template #action>
                  <VIconButton
                    icon="feather:file-text"
                    @click="viewResume = true"
                  />
                </template>
              </VBlock>
              <VBlock
                v-if="job_application.app_holder.cover_letter"
                title="Cover Letter"
              >
                <template #action>
                  <VIconButton
                    icon="feather:file"
                    @click="viewCoverLetter = true"
                  />
                </template>
              </VBlock>
            </div>
            <!-- @click="downloadCv" -->
          </div>
          <div class="column is-8">
            <div
              class="dashboard-card card-table is-company application-details"
            >
              <div class="columns">
                <div class="column is-12">
                  <table class="table is-fullwidth">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Country</th>
                        <th scope="col">Applied on</th>
                        <th scope="col" style="text-align: center">Status</th>
                        <th scope="col" style="text-align: center">Rating</th>

                        <th scope="col">
                          <div
                            class="
                              dark-inverted
                              is-flex is-justify-content-flex-end
                            "
                          >
                            Job
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{{ job_application.app_holder.id }}</td>
                        <td>
                          {{ job_application.app_holder.country }}
                        </td>

                        <td>
                          {{
                            moment(
                              job_application.app_holder.created_at
                            ).format('DD/MM/YYYY - LT')
                          }}
                        </td>
                        <td>
                          <VField>
                            <VControl>
                              <div class="select">
                                <select
                                  @change="openModalForChangeStatus"
                                  v-model="job_application.app_holder.status"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Shortlisted">
                                    Shortlisted
                                  </option>
                                  <option value="Interviewed">
                                    Interviewed
                                  </option>
                                  <option value="Offered">Offered</option>
                                  <option value="Hired">Hired</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                              </div>
                            </VControl>
                          </VField>
                        </td>
                        <td style="text-align: center">
                          <!-- {{ job_application.app_holder.average_score }}/5 -->
                          <div
                            v-if="
                              job_application.app_holder.total_video == 0 &&
                              job_application.app_holder.total_question
                            "
                            class="grade"
                          >
                            <i v-for="rating in 5" :key="rating">
                              <i
                                class="fas fa-lg fa-star"
                                :class="
                                  job_application.app_holder.average_score >=
                                  rating
                                    ? 'warning-text'
                                    : 'colorGray'
                                "
                                @click="setAveregeScore(rating)"
                              ></i>
                            </i>
                            <span class="rate"
                              >{{
                                job_application.app_holder.average_score
                              }}/5</span
                            >
                          </div>
                          <div v-else>
                            <span class="rate"
                              >{{
                                job_application.app_holder.average_score
                              }}/5</span
                            >
                          </div>
                        </td>
                        <td class="is-end">
                          <div class="is-flex is-justify-content-flex-end">
                            <VIconButton
                              icon="feather:briefcase"
                              light
                              circle
                              @click="viewJob"
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="pbar">
                <div class="review-progress">
                  <div class="progress-stats">
                    <span class="dark-inverted">Review Progress</span>
                    <span
                      >{{ job_application.app_holder.review_progress }}%</span
                    >
                  </div>
                </div>
                <div class="progress-bar">
                  <VProgress
                    size="tiny"
                    :value="job_application.app_holder.review_progress"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="column is-12">
            <div class="dashboard-card is-tickets">
              <div class="ticket-list">
                <VTabs
                  selected="videos"
                  :tabs="[
                    {
                      label: 'Videos',
                      value: 'videos',
                      tag: job_application.app_holder.total_video,
                    },
                    {
                      label: 'Questions',
                      value: 'questions',
                      tag: job_application.app_holder.total_question,
                    },
                  ]"
                >
                  <template #tab="{ activeValue }">
                    <div
                      v-if="
                        activeValue === 'questions' &&
                        Number(job_application.app_holder.total_question) > 0
                      "
                    >
                      <div
                        v-for="(item, index) in job_application.app_holder
                          .answer"
                        :key="index"
                      >
                        <div class="item-row columns">
                          <div class="column is-7">
                            <div class="tquestion">
                              Question {{ index + 1 }}/{{
                                job_application.app_holder.answer.length
                              }}:
                              <span>
                                {{ item.question }}
                              </span>
                            </div>
                            <div class="tquestion qanswer">
                              <b>Answer <br /></b>
                              <span>
                                {{ item.answer }}
                              </span>
                            </div>
                          </div>
                          <div class="column is-5">
                            <!-- Rating stars -->
                            <div class="grade m-b-20">
                              <span>Answer Grade</span>
                              <i v-for="rating in 5" :key="rating">
                                <i
                                  class="fas fa-lg fa-star"
                                  :class="
                                    item.rating >= rating
                                      ? 'warning-text'
                                      : 'colorGray'
                                  "
                                  @click="
                                    save('rate', 'text', index, item.id, rating)
                                  "
                                ></i>
                              </i>
                              <span class="rate"
                                >{{ item.rating ? item.rating : 0 }}/5</span
                              >
                            </div>

                            <!-- If => Empty note -->
                            <div v-if="item.note == null">
                              <div class="note">
                                <span> Note </span>
                              </div>
                              <div class="answer">
                                <VField @click="edit('text', item, index)">
                                  <VControl>
                                    <textarea
                                      :id="item.id"
                                      v-if="question_form.index == index"
                                      v-model="question_form.note"
                                      class="textarea"
                                      rows="3"
                                      v-on:keyup.enter="
                                        save(
                                          'note',
                                          'text',
                                          index,
                                          item.id,
                                          question_form.note
                                        )
                                      "
                                    ></textarea>
                                    <textarea
                                      v-else
                                      class="textarea"
                                      rows="3"
                                      placeholder="Your review goes here..."
                                    ></textarea>
                                  </VControl>
                                </VField>
                              </div>
                            </div>

                            <!-- Else if => Available note & active edit -->
                            <div v-else-if="question_form.index == index">
                              <!-- Note -->
                              <div class="note">
                                <span
                                  >Note
                                  <i class="inf"
                                    >Enter to save | Esc to cancel</i
                                  ></span
                                >
                              </div>
                              <div class="answer">
                                <textarea
                                  :id="item.id"
                                  v-if="question_form.index == index"
                                  v-model="question_form.note"
                                  class="textarea"
                                  rows="3"
                                  v-on:keyup.enter="
                                    save(
                                      'note',
                                      'text',
                                      index,
                                      item.id,
                                      question_form.note
                                    )
                                  "
                                  v-on:keyup.escape="reset"
                                  @blur="reset"
                                ></textarea>
                                <textarea
                                  v-else
                                  class="textarea"
                                  rows="3"
                                  placeholder="Your review goes here..."
                                ></textarea>
                              </div>
                            </div>

                            <!-- Else => Available note -->
                            <div v-else>
                              <div class="note">
                                <span> Note </span>
                              </div>
                              <div class="answer">
                                <div class="cmnt">
                                  {{ item.note }}
                                  <VDropdown
                                    class="drop-note"
                                    right
                                    icon="feather:more-vertical"
                                  >
                                    <template #content>
                                      <a
                                        @click="edit('text', item, index)"
                                        class="dropdown-item"
                                      >
                                        Edit
                                      </a>
                                      <a
                                        class="dropdown-item"
                                        @click="
                                          edit('text', item, index),
                                            save(
                                              'note',
                                              'text',
                                              index,
                                              item.id,
                                              ''
                                            ),
                                            (item.note = null)
                                        "
                                      >
                                        Delete
                                      </a>
                                    </template>
                                  </VDropdown>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="
                            job_application.app_holder.answer.length - 1 > index
                          "
                          class="column"
                        >
                          <div class="is-divider"></div>
                        </div>
                      </div>
                    </div>
                    <VPlaceholderPage
                      v-else-if="
                        activeValue === 'questions' &&
                        Number(job_application.app_holder.total_question) == 0
                      "
                      larger
                      title="
                        The applicant did not answered
                      "
                      subtitle="
                        No written answers
                      "
                    >
                      <template #image>
                        <img
                          class="light-image"
                          src="/@src/assets/illustrations/placeholders/search-4.svg"
                          alt=""
                        />
                        <img
                          class="dark-image"
                          src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                          alt=""
                        />
                      </template>
                    </VPlaceholderPage>
                    <div
                      v-else-if="
                        activeValue === 'videos' &&
                        Number(job_application.app_holder.total_video) > 0
                      "
                    >
                      <div
                        v-for="(item, index) in job_application.app_holder
                          .video_answer"
                        :key="index"
                      >
                        <div class="columns item-row">
                          <div class="column is-7 column-v">
                            <div class="question">
                              <div class="qnumber">
                                Question {{ index + 1 }}/{{
                                  job_application.app_holder.video_answer.length
                                }}
                              </div>

                              <span> {{ item.question }} </span>
                            </div>
                            <video
                              width="100% "
                              :src="host + item.video"
                              controls
                            ></video>
                          </div>
                          <div class="column is-5">
                            <!-- Rating stars -->
                            <div class="grade m-b-20">
                              <span>Answer Grade</span>
                              <i v-for="rating in 5" :key="rating">
                                <i
                                  class="fas fa-lg fa-star"
                                  :class="
                                    item.rating >= rating
                                      ? 'warning-text'
                                      : 'colorGray'
                                  "
                                  @click="
                                    save(
                                      'rate',
                                      'video',
                                      index,
                                      item.id,
                                      rating
                                    )
                                  "
                                ></i>
                              </i>
                              <span class="rate"
                                >{{ item.rating ? item.rating : 0 }}/5</span
                              >
                            </div>

                            <!-- If => Empty note -->
                            <div v-if="item.note == null">
                              <div class="note">
                                <span> Note </span>
                              </div>
                              <div class="answer">
                                <VField @click="edit('video', item, index)">
                                  <VControl>
                                    <textarea
                                      :id="item.id"
                                      v-if="video_question_form.index == index"
                                      v-model="video_question_form.note"
                                      class="textarea"
                                      rows="3"
                                      v-on:keyup.enter="
                                        save(
                                          'note',
                                          'video',
                                          index,
                                          item.id,
                                          video_question_form.note
                                        )
                                      "
                                    ></textarea>
                                    <textarea
                                      v-else
                                      class="textarea"
                                      rows="3"
                                      placeholder="Your review goes here..."
                                    ></textarea>
                                  </VControl>
                                </VField>
                              </div>
                            </div>

                            <!-- Else if => Available note & active edit -->
                            <div v-else-if="video_question_form.index == index">
                              <!-- Note -->
                              <div class="note">
                                <span
                                  >Note
                                  <i class="inf"
                                    >Enter to save | Esc to cancel</i
                                  ></span
                                >
                              </div>
                              <div class="answer">
                                <textarea
                                  :id="item.id"
                                  v-if="video_question_form.index == index"
                                  v-model="video_question_form.note"
                                  class="textarea"
                                  rows="3"
                                  v-on:keyup.enter="
                                    save(
                                      'note',
                                      'video',
                                      index,
                                      item.id,
                                      video_question_form.note
                                    )
                                  "
                                  v-on:keyup.escape="reset"
                                  @blur="reset"
                                ></textarea>
                                <textarea
                                  v-else
                                  class="textarea"
                                  rows="3"
                                  placeholder="Your review goes here..."
                                ></textarea>
                              </div>
                            </div>

                            <!-- Else => Available note -->
                            <div v-else>
                              <div class="note">
                                <span> Note </span>
                              </div>
                              <div class="answer">
                                <div class="cmnt">
                                  {{ item.note }}
                                  <VDropdown
                                    class="drop-note"
                                    right
                                    icon="feather:more-vertical"
                                  >
                                    <template #content>
                                      <a
                                        @click="edit('video', item, index)"
                                        class="dropdown-item"
                                      >
                                        Edit
                                      </a>
                                      <a
                                        @click="
                                          edit('video', item, index),
                                            save(
                                              'note',
                                              'video',
                                              index,
                                              item.id,
                                              ''
                                            ),
                                            (item.note = null)
                                        "
                                        class="dropdown-item"
                                      >
                                        Delete
                                      </a>
                                    </template>
                                  </VDropdown>
                                </div>

                                <br />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="
                            index < job_application.app_holder.total_video - 1
                          "
                          class="is-divider"
                        ></div>
                      </div>
                    </div>
                    <VPlaceholderPage
                      v-else-if="
                        activeValue === 'videos' &&
                        Number(job_application.app_holder.total_video) == 0
                      "
                      larger
                      title="
                        The applicant did not answered
                      "
                      subtitle="
                        No video answers
                      "
                    >
                      <template #image>
                        <img
                          class="light-image"
                          src="/@src/assets/illustrations/placeholders/search-4.svg"
                          alt=""
                        />
                        <img
                          class="dark-image"
                          src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                          alt=""
                        />
                      </template>
                    </VPlaceholderPage>
                  </template>
                </VTabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="project-details">
      <VPlaceholderPage
        title="No job applications is been applied yet"
        subtitle="Too bad. Looks like we couldn't find any matching results for the
                  search terms you've entered. Please try different search terms or
                  criteria."
        larger
      >
        <template #image>
          <img
            class="light-image"
            src="/@src/assets/illustrations/placeholders/search-4.svg"
            alt=""
          />
          <img
            class="dark-image"
            src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
            alt=""
          />
        </template>
      </VPlaceholderPage>
    </div>
  </DefaultLayout>
</template>


<style lang="scss">
@import '../../../scss/abstracts/_mixins.scss';
.is-dark .tabs ul {
  border-bottom-color: var(--dark-sidebar-light-16);
  background: hsl(240 4% 13% / 1);
}
// Custom
.card-table {
  padding: 0 !important;
}
.pbar {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  padding: 0px 20px 20px 20px;
  border-top: 1px solid var(--border);
}
.modal-card-body {
  padding: 0;
}
.drop-note {
  position: absolute;
  top: -5px;
  right: 0px;
}

.qnumber {
  color: #feedc4;
}

H2 .question span {
  padding-right: 0px;
  padding-left: 4px;
  font-size: 10px;
  color: white;
}
.inf {
  color: #9ea1a4;
  font-size: 0.7rem;
}
.note {
  font-family: var(--font-alt);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 0px !important;
  padding: 0 0 7px 30px;
}
.answer {
  min-height: 90px;
  padding: 0 30px !important;
  font-size: 0.9rem;
  border: 0 !important;
  position: relative;
  border-radius: 0 !important;
}
.answer .inf {
  position: absolute;
  top: 10px;
  right: 10px;
}
.answer .cmnt {
  padding: 12px; // border-left: 1px solid #e2e2e2;
  overflow-wrap: break-word;
  min-height: 76px;
  border-radius: 0.3rem;
  color: var(--light-text);
  background: var(--fade-grey-light-3);
  // box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
}

.answer span {
  font-family: var(--font-alt);
  font-size: 0.9rem;
  font-weight: 600;
}
.qanswer {
  padding-left: 10px !important;
  margin-left: 10px !important;
  border-left: 2px solid var(--light-text);
}
.q-bg {
  // background: #e6e6e6;
  background: #f6f6f6;
}
// .answer .cmnt:hover {
//   background: #ebebeb !important;
//   cursor: text;
// }
.answer textarea {
  // border: 0 !important;
  background: whitesmoke;
  font-size: 13px;
}
.grade {
  font-family: var(--font-alt);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 0px !important  ;

  padding: 10px 30px;

  // border-bottom: 1px solid #e2e2e2 !important;
}
.answer small {
  color: #999999;
  font-weight: 200;
  padding: 0 0 0 3px;
}

.fa-star {
  cursor: pointer !important;
}
.fa-star:hover {
  opacity: 0.5;
}

.grade span {
  padding-right: 4px;
}

.grade .rate {
  padding-right: 0px;
  padding-left: 4px;
  font-size: 10px;
  color: #9e9e9e;
}
.colorGray {
  color: #e2e2e2;
  font-size: 0.75rem !important;
}
.warning-text {
  color: #f9c108 !important;
  font-size: 0.75rem !important;
}

.review-progress {
  margin-top: 15px;

  .progress-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

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
      }
    }
  }

  .progress {
    margin-bottom: 0;
  }
}
hr {
  margin: 10px;
}
.tabs-wrapper {
  // background: ;
  padding: 0 0 2rem 0;
}
.tabs ul {
  background: white;
}
.item-row {
  // background: white;
  margin: 2rem !important;

  background-color: var(--white);

  background: white;
  // padding: 5px;
  transition: all 0.3s;
  padding: 0.25rem;
  .column {
    padding: 0px;
    // background: black;
  }

  .column-v {
    // background: #222;
    position: relative;
    // border: 2px solid var(--primary);
  }

  .column-v .question {
    background: var(--primary);
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0;
  }

  .question {
    border-top-left-radius: 0.25rem;
    padding: 10px;
    background: var(--primary);
    position: absolute;
    right: 0;
    left: 0;
    color: white;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0px !important;
  }
  .tquestion {
    // border-top-left-radius: 0.25rem;
    padding: 10px;
    // background: #454545;
    right: 0;
    left: 0;
    // color: white;
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0px !important;
    span {
      color: var(--light-text);
      font-weight: 400;
    }
  }
  .answer {
    padding: 25px;
    border-radius: 0.25rem;
    border: 1px solid #dbdbdb;
  }
}
.application-details {
  text-align: left !important;
  .candidate-name {
    .flex-meta {
      :first-child {
        font-size: 1rem !important;
      }
    }
  }
  .media-flex {
    .flex-meta {
      :first-child {
        font-size: 0.9rem;
      }
    }
  }
}

.company-dashboard {
  video {
    display: block;
    width: 100%;
    height: 300px;
    background-color: #333333;
  }
  .company-header {
    display: flex;
    padding: 20px;
    background: var(--white);
    border: 1px solid var(--fade-grey-dark-3);
    border-radius: var(--radius-large);
    margin-bottom: 1.5rem;

    .header-item {
      width: 25%;
      border-right: 1px solid var(--fade-grey-dark-3);

      &:last-child {
        border-right: none;
      }

      .item-inner {
        text-align: center;

        .lnil,
        .lnir {
          font-size: 1.8rem;
          margin-bottom: 6px;
          color: var(--primary);
        }

        span {
          display: block;
          font-family: var(--font);
          font-weight: 600;
          font-size: 1.6rem;
          color: var(--dark-text);
        }

        p {
          font-family: var(--font-alt);
          font-size: 0.95rem;
        }
      }
    }
  }

  .widget {
    height: 100%;
  }
  td {
    padding: 35px 0px 25px 5px !important;
  }
  th {
    padding: 5px 5px !important;
  }

  .dashboard-card {
    @include vuero-s-card();
    position: relative;
    height: 100%;

    &.is-company {
      text-align: center;
      padding: 30px;

      .v-avatar {
        display: block;
        margin: 0 auto 10px auto;

        .button {
          position: absolute;
          bottom: 0;
          right: 0;
          max-width: 35px;
        }
      }

      > h3 {
        color: var(--dark-text);
        font-family: var(--font-alt);
        font-size: 1.2rem;
        font-weight: 600;
      }

      > p {
        font-size: 0.9rem;
      }

      .description {
        padding: 10px 0 0 0;
      }

      .company-stats {
        display: flex;
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid var(--fade-grey-dark-3);

        .company-stat {
          width: 33.3%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;

          span {
            display: block;
            font-family: var(--font);

            &:first-child {
              text-transform: uppercase;
              font-family: var(--font-alt);
              font-size: 0.75rem;
              color: var(--light-text);
            }

            &:nth-child(2) {
              color: var(--dark-text);
              font-size: 1.4rem;
              font-weight: 600;
            }
          }
        }
      }
    }

    &.is-base-chart {
      padding: 0;
      display: flex;
      flex-direction: column;

      .content-box {
        padding: 30px;

        .revenue-stats {
          display: flex;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--fade-grey-dark-3);

          .revenue-stat {
            margin-right: 30px;
            font-family: var(--font);

            span {
              display: block;

              &:first-child {
                text-transform: uppercase;
                font-family: var(--font-alt);
                font-size: 0.75rem;
                color: var(--light-text);
              }

              &:nth-child(2) {
                color: var(--dark-text);
                font-size: 1.6rem;
                font-weight: 600;
              }

              &.current {
                color: var(--primary);
              }
            }
          }
        }
      }

      .chart-container {
        margin-top: auto;
      }
    }

    &.is-tickets {
      padding: 30px;

      .ticket-list {
        padding: 10px 0;

        .media-flex {
          + .media-flex {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid var(--fade-grey-dark-3);
          }

          .flex-meta {
            span {
              &:nth-child(2) {
                font-size: 1rem;
                margin: 4px 0;
                color: var(--light-text-dark-20);
                max-width: 430px;
              }

              &:nth-child(3) {
                font-size: 0.9rem;
                color: var(--light-text);
              }
            }
          }
        }
      }
    }

    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }
  }

  .table-wrapper {
    min-height: 0;
  }

  table {
    min-height: 180px;
    border-top-left-radius: var(--radius-large);
    border-top-right-radius: var(--radius-large);

    thead {
      tr {
        th {
          padding: 20px !important;
          border-bottom: 1px solid var(--border) !important;
          font-family: var(--font-alt);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--dark-text);
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 40px 20px !important;
          font-family: var(--font-alt);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--dark-text);
        }
      }
    }
  }

  .dataTable-wrapper {
    .dataTable-top {
      padding: 0 !important;
      margin: 0 !important;
    }
  }
}

.is-dark {
  .company-dashboard {
    .dashboard-card {
      @include vuero-card--dark();
    }
  }
  .review-progress {
    .progress-stats {
      span {
        &:first-child {
          color: var(--dark-dark-text);
        }

        &:nth-child(2) {
          color: var(--dark-dark-text);
        }
      }
    }
  }

  .item-row {
    background: var(--dark-sidebar-light-4);
    border: 1px solid #333;

    .answer {
      border: 1px solid #333;
    }
  }
}

@media only screen and (max-width: 767px) {
  .company-dashboard {
    .company-header {
      flex-wrap: wrap;

      .header-item {
        width: 50%;
        border-right: none;
        border: none;
        padding: 16px 0;
      }
    }

    .dashboard-card {
      &.is-tickets {
        padding: 30px;

        .ticket-list {
          .media-flex {
            .flex-meta {
              margin-bottom: 1rem;
            }
          }
        }
      }
    }
  }
}

.is-divider {
  margin: 1rem 0rem;
}
.company-dashboard .dashboard-card.is-tickets {
  padding: 0 !important;
}

// On Mobile
@media only screen and (max-width: 767px) {
  table {
    min-height: 240px;

    thead {
      tr {
        :last-child {
          display: none;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 0 !important;
        }
      }
      .is-end {
        display: none;
      }
    }
  }
}
</style>