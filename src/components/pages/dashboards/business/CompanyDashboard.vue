<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  barData,
  barData2,
  usersBarOptions,
} from '/@src/data/dashboards/company/usersBarChart'
import { useJobApplication } from '/@src/stores/jobApplication'
import { Notyf } from 'notyf'
import { useRoute, useRouter } from 'vue-router'
const notyf = new Notyf()
const job_application: any = useJobApplication()
const route = useRoute()
const router = useRouter()
const host = import.meta.env.VITE_API_BASE_URL

export interface QuestionData {
  index: number
  id: number
  rating: number
  note: string
}

const question_form = reactive<QuestionData>({
  index: -1,
  id: 0,
  rating: 0,
  note: '',
})
const video_question_form = reactive<QuestionData>({
  index: -1,
  id: 0,
  rating: 0,
  note: '',
})
const update = ref(0)

function addNote(id: number, qindex: number) {
  if (question_form.note.trim() == '') {
    return notyf.error('Note is reqiured!')
  } else if (question_form.rating == 0) {
    return notyf.error('Rating is reqiured!')
  }
  question_form.id = id
  question_form.index = qindex
  job_application.updateRatingAndNote(question_form)
  editQitemReset()
}
function editQitem(qitem: any, qindex: number) {
  question_form.index = qindex
  if (job_application.app_holder.answer[qindex].rating > 0)
    question_form.rating = job_application.app_holder.answer[qindex].rating
  question_form.id = job_application.app_holder.answer[qindex].id
  question_form.note = job_application.app_holder.answer[qindex].note
}
function editVitem(vitem: any, vindex: number) {
  video_question_form.index = vindex
  if (job_application.app_holder.video_answer[vindex].rating > 0)
    video_question_form.rating =
      job_application.app_holder.video_answer[vindex].rating
  video_question_form.id = job_application.app_holder.video_answer[vindex].id
  video_question_form.note =
    job_application.app_holder.video_answer[vindex].note
}
function editQitemReset() {
  update.value = 0
  question_form.index = -1
  question_form.id = 0
  question_form.rating = 0
  question_form.note = ''
}
function editVitemReset() {
  update.value = 0
  video_question_form.index = -1
  video_question_form.id = 0
  video_question_form.rating = 0
  video_question_form.note = ''
}
function modifyItem(rating: number, qindex: number) {
  question_form.rating = rating
  question_form.index = qindex
}
function addVideoNote(id: number, vindex: number) {
  if (video_question_form.note.trim() == '') {
    return notyf.error('Note is reqiured!')
  } else if (video_question_form.rating == 0) {
    return notyf.error('Rating is reqiured!')
  }
  video_question_form.id = id
  video_question_form.index = vindex
  job_application.updateVideoRatingAndNote(video_question_form)
  editVitemReset()
}
function modifyVideoItem(rating: number, vindex: number) {
  video_question_form.rating = rating
  video_question_form.index = vindex
}
function viewJob() {
  router.push(
    '/sidebar/layouts/projects-details?' +
      'job=' +
      job_application.app_holder.job_opening.id
  )
}

function downloadCv() {
  const url = import.meta.env.VITE_API_BASE_URL + job_application.app_holder.cv
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  // the filename you want
  a.download = job_application.app_holder.cv.split('cv/')[1]
  document.body.appendChild(a)
  a.click()
}

function makeACall() {
  window.open('tell:' + job_application.app_holder.phone)
}
function makeAMail() {
  window.open('mailto:' + job_application.app_holder.email)
}

onMounted(async () => {
  job_application.get_single_job(Number(route.query.job))

  setTimeout(() => {
    usersBarOptions.series = [
      {
        name: 'Orders',
        data: barData,
      },
    ]
  }, 1000)

  setTimeout(() => {
    usersBarOptions.series = [
      ...usersBarOptions.series,
      {
        name: 'Abandonned',
        data: barData2,
      },
    ]
  }, 2500)
})
</script>

<template>
  <div class="business-dashboard company-dashboard application-details">
    <!-- status job application modal start -->
    <VModal
      :open="job_application.jobApplicationStatusModal"
      size="small"
      actions="center"
      noclose
      @close="job_application.jobApplicationStatusModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to change the status of the application?"
          subtitle="the candidate will be notified through email"
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
    <div class="columns is-multiline">
      <div class="column is-4">
        <div class="dashboard-card is-company application-details">
          <VBlock
            :title="job_application.app_holder.name"
            :subtitle="job_application.app_holder.title"
            center
          >
            <template #icon>
              <VIconBox color="info">
                <i class="iconify" data-icon="feather:user"></i>
              </VIconBox>
            </template>
          </VBlock>
          <hr />
          <VBlock
            :title="job_application.app_holder.average_score"
            subtitle="Average Score"
            center
          >
            <template #action class="m-t-10">
              <i
                class="fas fa-star"
                :class="
                  job_application.app_holder.average_score > 0
                    ? 'warning-text'
                    : 'colorGray'
                "
              ></i>
              <i
                class="fas fa-star"
                :class="
                  job_application.app_holder.average_score > 1
                    ? 'warning-text'
                    : 'colorGray'
                "
              ></i>
              <i
                class="fas fa-star"
                :class="
                  job_application.app_holder.average_score > 2
                    ? 'warning-text'
                    : 'colorGray'
                "
              ></i>
              <i
                class="fas fa-star"
                :class="
                  job_application.app_holder.average_score > 3
                    ? 'warning-text'
                    : 'colorGray'
                "
              ></i>
              <i
                class="fas fa-star"
                :class="
                  job_application.app_holder.average_score > 4
                    ? 'warning-text'
                    : 'colorGray'
                "
              ></i>
            </template>
          </VBlock>
          <hr />
          <VBlock title="Info" subtitle="Contact details">
            <template #action>
              <VButtons>
                <VIconButton icon="feather:mail" @click="makeAMail" />
                <VIconButton icon="feather:phone" @click="makeACall" />
              </VButtons>
            </template>
          </VBlock>
          <hr />

          <VBlock title="Resume" subtitle="PDF - 2.5MB">
            <template #action>
              <VButton color="primary" icon="feather:file" @click="downloadCv">
                Download
              </VButton>
            </template>
          </VBlock>
        </div>
      </div>
      <div class="column is-4">
        <div class="dashboard-card is-company application-details">
          <VBlock
            :title="'ID ' + job_application.app_holder.id"
            :subtitle="'Applied On ' + job_application.app_holder.applied_on"
          >
            <template #icon>
              <VIconBox color="danger">
                <i class="iconify" data-icon="feather:edit-3"></i>
              </VIconBox>
            </template>
          </VBlock>
          <hr />

          <VBlock title="Status" subtitle="Application Status" center>
            <template #action>
              <VField>
                <VControl>
                  <div class="select">
                    <select
                      @click="job_application.jobApplicationStatusModal = true"
                      v-model="job_application.app_holder.status"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </VControl>
              </VField>
            </template>
          </VBlock>
          <hr />
          <VRating grade="5"></VRating>
          <div class="review-progress">
            <div class="progress-stats">
              <span class="dark-inverted">Review Progress</span>
              <span>{{ job_application.app_holder.review_progress }}%</span>
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
      <div class="column is-4">
        <div class="dashboard-card is-company application-details">
          <VBlock
            :title="job_application.app_holder.job_opening.job_title"
            :subtitle="'Job ID: ' + job_application.app_holder.job_opening.id"
          >
            <template #icon>
              <VIconBox color="warning">
                <i class="iconify" data-icon="feather:briefcase"></i>
              </VIconBox>
            </template>
            <template #action>
              <VButton @click="viewJob">View Job</VButton>
            </template>
          </VBlock>
          <hr />
          <VBlock
            title="Job Status"
            :subtitle="job_application.app_holder.job_opening.status"
          >
          </VBlock>
          <hr />
          <VBlock
            title="Application Period"
            :subtitle="job_application.app_holder.deadlineRange"
          >
          </VBlock>
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
                    v-for="(qitem, qindex) in job_application.app_holder.answer"
                    :key="qindex"
                    class="columns item-row"
                  >
                    <div class="column is-6">
                      <h2 class="question">
                        <b>Question:</b>
                        {{ qitem.question }}
                      </h2>
                      <div class="answer">
                        <b>Answer:</b>
                        {{ qitem.answer }}
                      </div>
                    </div>
                    <div
                      v-if="qitem.rating == null && qitem.note == null"
                      class="column is-6 p-t-20"
                    >
                      <div class="grade m-b-20">
                        Give it a grade:

                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            question_form.index == qindex &&
                            question_form.rating > 0
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyItem(1, qindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            question_form.index == qindex &&
                            question_form.rating > 1
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyItem(2, qindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            question_form.index == qindex &&
                            question_form.rating > 2
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyItem(3, qindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            question_form.index == qindex &&
                            question_form.rating > 3
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyItem(4, qindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            question_form.index == qindex &&
                            question_form.rating > 4
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyItem(5, qindex)"
                        ></i>
                        <span v-if="question_form.index == qindex"
                          >{{ question_form.rating }}/5</span
                        >
                        <span v-else>0/5</span>
                      </div>

                      <VField>
                        <VControl>
                          <textarea
                            v-if="question_form.index == qindex"
                            v-model="question_form.note"
                            class="textarea"
                            rows="2"
                            placeholder="Your review goes here..."
                          ></textarea>
                          <textarea
                            v-else
                            class="textarea"
                            rows="2"
                            placeholder="Your review goes here..."
                          ></textarea>
                        </VControl>
                      </VField>
                      <VButton
                        icon="fas fa-plus"
                        outlined
                        @click="addNote(qitem.id, qindex)"
                        >Add a note</VButton
                      >
                    </div>
                    <div v-else class="column is-6 p-t-20">
                      <div v-if="question_form.index == qindex">
                        <div class="grade m-b-20">
                          Give it a grade:

                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              question_form.index == qindex &&
                              question_form.rating > 0
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyItem(1, qindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              question_form.index == qindex &&
                              question_form.rating > 1
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyItem(2, qindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              question_form.index == qindex &&
                              question_form.rating > 2
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyItem(3, qindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              question_form.index == qindex &&
                              question_form.rating > 3
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyItem(4, qindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              question_form.index == qindex &&
                              question_form.rating > 4
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyItem(5, qindex)"
                          ></i>
                          <span v-if="question_form.index == qindex"
                            >{{ question_form.rating }}/5</span
                          >
                          <span v-else>0/5</span>
                        </div>
                        <textarea
                          v-model="question_form.note"
                          class="textarea"
                          rows="2"
                          placeholder="Your review goes here..."
                        ></textarea>
                        <div class="p-t-10">
                          <VButtons>
                            <VButton
                              v-if="update.value == 0"
                              icon="feather:edit-2"
                              outlined
                              @click="editQitem(qitem, qindex)"
                              >Edit note</VButton
                            >
                            <VButton
                              v-else
                              icon="fas fa-check"
                              bold
                              @click="addNote(qitem, qindex)"
                              >Update note</VButton
                            >
                            <VButton
                              icon="fas fa-window-close"
                              bold
                              @click="editQitemReset"
                              >Cancel</VButton
                            >
                          </VButtons>
                        </div>
                      </div>
                      <div v-else>
                        <div class="grade m-b-20">
                          Grade:

                          <i
                            class="fas fa-lg fa-star"
                            :class="qitem.rating > 0 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="qitem.rating > 1 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="qitem.rating > 2 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="qitem.rating > 3 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="qitem.rating > 4 ? 'warning-text' : ''"
                          ></i>
                          {{ qitem.rating }}/5
                        </div>
                        <div class="answer">
                          {{ qitem.note }}
                        </div>
                        <div class="p-t-10">
                          <VButton
                            icon="feather:edit-2"
                            bold
                            @click="editQitem(qitem, qindex)"
                            >Edit note</VButton
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="
                    activeValue === 'videos' &&
                    Number(job_application.app_holder.total_video) > 0
                  "
                >
                  <div
                    v-for="(vitem, vindex) in job_application.app_holder
                      .video_answer"
                    :key="vindex"
                    class="columns item-row"
                  >
                    <div class="column is-6">
                      <!-- <video width="400" controls>
                        <source
                          width="100%"
                          src="https://i.imgur.com/UqdNMTZ.mp4"
                          type="video/mp4"
                        />
                        Your browser does not support HTML video.
                      </video> -->
                      <!-- <VPlyr
                        ratio="4by3"
                        :source="host + vitem.video"
                      /> -->
                      <video
                        width="400"
                        :src="host + vitem.video"
                        controls
                      ></video>

                      <h2 class="question">
                        <b>Question:</b>
                        {{ vitem.question }}
                      </h2>
                    </div>
                    <div
                      v-if="vitem.rating == null && vitem.note == null"
                      class="column is-6 p-t-20"
                    >
                      <div class="grade m-b-20">
                        Give it a grade:

                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            video_question_form.index == vindex &&
                            video_question_form.rating > 0
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyVideoItem(1, vindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            video_question_form.index == vindex &&
                            video_question_form.rating > 1
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyVideoItem(2, vindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            video_question_form.index == vindex &&
                            video_question_form.rating > 2
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyVideoItem(3, vindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            video_question_form.index == vindex &&
                            video_question_form.rating > 3
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyVideoItem(4, vindex)"
                        ></i>
                        <i
                          class="fas fa-lg fa-star"
                          :class="
                            video_question_form.index == vindex &&
                            video_question_form.rating > 4
                              ? 'warning-text'
                              : ''
                          "
                          @click="modifyVideoItem(5, vindex)"
                        ></i>
                        <span v-if="video_question_form.index == vindex"
                          >{{ video_question_form.rating }}/5</span
                        >
                        <span v-else>0/5</span>
                      </div>

                      <VField>
                        <VControl>
                          <textarea
                            v-if="video_question_form.index == vindex"
                            v-model="video_question_form.note"
                            class="textarea"
                            rows="2"
                            placeholder="Your review goes here..."
                          ></textarea>
                          <textarea
                            v-else
                            class="textarea"
                            rows="2"
                            placeholder="Your review goes here..."
                          ></textarea>
                        </VControl>
                      </VField>
                      <VButton
                        icon="fas fa-plus"
                        outlined
                        @click="addVideoNote(vitem.id, vindex)"
                        >Add a note</VButton
                      >
                    </div>
                    <div v-else class="column is-6 p-t-20">
                      <div v-if="video_question_form.index == vindex">
                        <div class="grade m-b-20">
                          Give it a grade:

                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              video_question_form.index == vindex &&
                              video_question_form.rating > 0
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyVideoItem(1, vindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              video_question_form.index == vindex &&
                              video_question_form.rating > 1
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyVideoItem(2, vindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              video_question_form.index == vindex &&
                              video_question_form.rating > 2
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyVideoItem(3, vindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              video_question_form.index == vindex &&
                              video_question_form.rating > 3
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyVideoItem(4, vindex)"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="
                              video_question_form.index == vindex &&
                              video_question_form.rating > 4
                                ? 'warning-text'
                                : ''
                            "
                            @click="modifyVideoItem(5, vindex)"
                          ></i>
                          <span v-if="video_question_form.index == vindex"
                            >{{ video_question_form.rating }}/5</span
                          >
                          <span v-else>0/5</span>
                        </div>
                        <textarea
                          v-model="video_question_form.note"
                          class="textarea"
                          rows="2"
                          placeholder="Your review goes here..."
                        ></textarea>
                        <div class="p-t-10">
                          <VButtons>
                            <VButton
                              v-if="update.value == 0"
                              icon="feather:edit-2"
                              bold
                              @click="editVitem(vitem, vindex)"
                              >Edit note</VButton
                            >
                            <VButton
                              v-else
                              icon="fas fa-check"
                              bold
                              @click="addVideoNote(vitem, vindex)"
                              >Update note</VButton
                            >
                            <VButton
                              icon="fas fa-window-close"
                              bold
                              @click="editVitemReset"
                              >Cancel</VButton
                            >
                          </VButtons>
                        </div>
                      </div>
                      <div v-else>
                        <div class="grade m-b-20">
                          Grade:

                          <i
                            class="fas fa-lg fa-star"
                            :class="vitem.rating > 0 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="vitem.rating > 1 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="vitem.rating > 2 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="vitem.rating > 3 ? 'warning-text' : ''"
                          ></i>
                          <i
                            class="fas fa-lg fa-star"
                            :class="vitem.rating > 4 ? 'warning-text' : ''"
                          ></i>
                          {{ vitem.rating }}/5
                        </div>
                        <div class="answer">
                          {{ vitem.note }}
                        </div>
                        <div class="p-t-10">
                          <VButton
                            icon="feather:edit-2"
                            bold
                            @click="editVitem(vitem, vindex)"
                            >Edit note</VButton
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </VTabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
.colorGray {
  color: #e2e2e2;
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
.item-row {
  background: whitesmoke;
  padding: 5px;
  margin: 0 0 50px 0 !important;
  border-radius: 0.25rem;
  border: 1px solid #dbdbdb;

  .question {
    margin-bottom: 20px;
    padding: 15px;
    border-radius: 0.25rem;
    background: #e7e7e7;
    padding: 15px;
  }
  .answer {
    padding: 25px;
    border-radius: 0.25rem;
    background: white;
    border: 1px solid #dbdbdb;
  }
}
.application-details {
  text-align: left !important;
}

.company-dashboard {
  video {
    width: 100%;
    border-radius: 0.25rem;
    -webkit-transform: scaleX(1);
    transform: scaleX(1);
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

  .dashboard-card {
    @include vuero-s-card();

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

    .question {
      background: var(--dark-sidebar-light-4);
    }
    .answer {
      background: dimgray;
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
</style>
