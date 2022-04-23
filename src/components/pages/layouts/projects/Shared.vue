<script setup lang="ts">
import { useHead } from '@vueuse/head'
import { pageTitle } from '/@src/state/sidebarLayoutState'
import { ref, onMounted } from 'vue'
import { useJobApplication } from '/@src/stores/jobApplication'
import { useRoute, useRouter } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
let job_application = useJobApplication()
const viewResume = ref(false)
const editComment = ref(false)

// Get initials from name
const getInitials = (name: any) => {
  let initials = name.split(' ')
  if (initials.length > 1) {
    initials = initials.shift().charAt(0) + initials.pop().charAt(0)
  } else {
    initials = name.substring(0, 2)
  }
  return initials.toUpperCase()
}

// Triggers when key is depressed [arrow right and left]

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') {
    change_video('right')
  }
  if (event.key === 'ArrowLeft') {
    change_video('left')
  }
})

// View settings, if certain options are hidden etc.
let view_settings = {
  is_public: true,
  is_profile: true,
  is_interview: true,
  is_questionnaire: true,
}

let select_application = (id: number) => {
  selectedProfile.value = id
  job_application.data.video_index = 0
  job_application.data.selected_index = id
  job_application.data.selected_application = job_application.data.data[id]
  // editComment.value = false

  if (job_application.data.selected_application.commented_by_shared_view) {
    editComment.value = false
  } else {
    editComment.value = true
  }
  // if (
  //   job_application.data.selected_application.commented_by_shared_view == null
  // ) {
  //   editComment.value = true
  //   editComment.value = false
  // }
}

let comment = (id: number, input: string, thumb: boolean, comment: string) => {
  job_application.review_shared_applications(
    job_application.data.selected_application.id,
    'comment',
    false,
    job_application.data.selected_application.commented_by_shared_view
  )
  editComment.value = false
}

let video_player_index: number = 0
job_application.data.video_player_index = 0

let change_video = (side: string) => {
  if (side == 'right') {
    if (
      job_application.data.video_index <
      job_application.data.selected_application.video_answer.length - 1
    ) {
      job_application.data.video_index++
    } else {
      return
    }
  }
  if (side == 'left') {
    if (job_application.data.video_index > 0) {
      job_application.data.video_index--
    } else {
      return
    }
  }
}
const selectedProfile = useLocalStorage('selectedProfile', 1)

onMounted(() => {
  job_application.get_shared_applications(
    route.fullPath.split('/shared_applications/')[1]
  )
})

pageTitle.value = 'Shared View'
useHead({
  title: 'Shared View',
})
</script>

<template>
  <!-- START MODAL RESUME-->
  <VModal
    v-if="job_application.data.selected_application"
    :open="viewResume"
    title="Resume Preview"
    size="medium"
    actions="right"
    cancelLabel="Close"
    @close="viewResume = false"
  >
    <template #content>
      <iframe
        :src="
          'https://api.tenrol.com' +
          job_application.data.selected_application.cv
        "
        width="100%"
        height="600px"
      ></iframe>
    </template>
    <template #action>
      <!-- <VButton color="primary" @click="downloadCv">Download</VButton> -->
    </template>
  </VModal>
  <!-- END MODAL RESUME-->

  <!-- Loading page -->
  <div v-if="job_application.data.loading" class="section">
    <div class="container">
      <div class="columns m-b-20">
        <div class="column is-3">
          <VCard class="m-b-20">
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload />
          </VCard>
          <VCard class="m-b-20">
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload />
          </VCard>
        </div>
        <div class="column is-9 column-video">
          <!-- Profile -->
          <VCard class="m-b-20">
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />

            <VPlaceload />
          </VCard>
          <VCard class="m-b-20">
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />

            <VPlaceload />
          </VCard>

          <VCard class="m-b-20">
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" /> <VPlaceload class="m-b-10" />

            <VPlaceload />
          </VCard>
          <VCard>
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />
            <VPlaceload class="m-b-10" />

            <VPlaceload class="m-b-10" />

            <VPlaceload />
          </VCard>
        </div>
      </div>
    </div>
    <a href="/" target="_blank">
      <div class="poweredby m-t-60 p-b-40">
        <img src="/@src/assets/Tenrol-Logo-04.svg" alt="" />
      </div>
    </a>
  </div>

  <div v-if="job_application.data.success" class="section">
    <div v-if="job_application.data.public" class="container">
      <div class="columns m-b-20">
        <div class="column is-3">
          <VCard v-if="job_application.data.data" class="m-b-20 candidate-card">
            <div class="job m-b-20">
              <i class="lnir lnir-users" aria-hidden="true"></i>
              <h3 v-if="job_application.data.data">
                {{ job_application.data.data.length }} Candidates for
              </h3>

              <h2 class="title-count" v-if="job_application.data.selected_job">
                {{ job_application.data.selected_job.job_title }}
              </h2>
            </div>

            <div
              class="candidates"
              v-for="(item, key) in job_application.data.data"
              :key="key"
            >
              <VBlock
                @click="select_application(key)"
                :class="
                  key == job_application.data.selected_index ? 'c-selected' : ''
                "
                :title="item.name"
                :subtitle="item.email"
              >
                <template #icon>
                  <VAvatar
                    :initials="getInitials(item.name)"
                    :color="'h-danger'"
                    size="small"
                  />
                </template>
              </VBlock>
            </div>
          </VCard>
          <VCard class="m-b-20 shared" v-if="job_application.data.selected_job">
            <VBlock
              title="Shared By"
              :subtitle="job_application.data.selected_job.user.name"
              m-responsive
            >
              <template #icon>
                <VAvatar
                  size="small"
                  :picture="
                    'https://api.tenrol.com/' +
                    job_application.data.selected_job.user.avatar
                  "
                />
              </template>
              <template #action>
                <a
                  :href="
                    'mailto:' + job_application.data.selected_job.user.email
                  "
                >
                  <VIconButton icon="far fa-envelope" circle light />
                </a>
              </template> </VBlock
          ></VCard>
        </div>
        <div
          class="column is-9"
          v-if="
            job_application.data.selected_job &&
            job_application.data.data.length == 0
          "
        >
          <!-- Profile -->
          <VCard>
            <VPlaceholderPage
              title="No applications selected"
              :subtitle="
                'It seems that there are no selected applications to show, try another time or contact ' +
                job_application.data.selected_job.user.name +
                ' for help'
              "
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
          </VCard>
        </div>
        <div
          v-if="job_application.data.selected_application"
          class="column is-9 column-video"
        >
          <VCard
            v-if="job_application.data.selected_job.is_profile"
            class="m-b-20"
          >
            <div class="profile">
              <VBlock
                center
                :title="
                  job_application.data
                    ? job_application.data.selected_application.name
                    : 'Name Unavailable'
                "
                :subtitle="job_application.data.selected_job.job_title"
              >
                <template #icon>
                  <VAvatar
                    :initials="
                      getInitials(
                        job_application.data.selected_application.name
                      )
                    "
                    :color="'h-danger'"
                    size="medium"
                  />
                </template>
                <template #action>
                  <VButton @click="viewResume = true" color="primary"
                    >Resume <small>.pdf</small></VButton
                  >
                </template>
              </VBlock>
            </div>
          </VCard>

          <VCard
            v-if="
              job_application.data.selected_job.is_interview &&
              job_application.data.selected_application.video_answer.length > 0
            "
            class="m-b-20"
          >
            <div class="s-title video-info autoplay">
              <VCheckbox
                v-model="job_application.data.autoplay"
                label="Auto"
                :checked="job_application.data.autoplay"
                solid
              />
            </div>
            <div class="s-title video-info">
              <i
                class="iconify"
                data-icon="feather:video"
                aria-hidden="true"
              ></i>
              Video Interview
            </div>
            <div class="application-preview">
              <div class="application-vid">
                <video
                  @ended="change_video('right')"
                  :autoplay="
                    job_application.data.video_index > 0 &&
                    job_application.data.autoplay
                  "
                  id="video_player"
                  controls
                  :src="
                    'http://api.tenrol.com' +
                    job_application.data.selected_application.video_answer[
                      job_application.data.video_index
                    ].video
                  "
                ></video>
                <!-- <VProgress
                  class="m-t-5"
                  :value="
                    ((job_application.data.video_index + 1) * 100) /
                    job_application.data.selected_application.video_answer
                      .length
                  "
                  size="tiny"
                  color="primary"
                /> -->
              </div>
            </div>

            <div class="question m-t-10">
              <span class="question-count"
                >Question {{ job_application.data.video_index + 1 }}/{{
                  job_application.data.selected_application.video_answer.length
                }}</span
              >
              <h2 class="title-count">
                {{
                  job_application.data.selected_application.video_answer[
                    job_application.data.video_index
                  ].question
                }}
              </h2>
            </div>
            <div class="controls">
              <VButtons>
                <VIconButton
                  :disabled="job_application.data.video_index == 0"
                  @click="change_video('left')"
                  circle
                  color="primary"
                  icon="feather:arrow-left"
                />
                <VIconButton
                  :disabled="
                    job_application.data.video_index ==
                    job_application.data.selected_application.video_answer
                      .length -
                      1
                  "
                  @click="change_video('right')"
                  circle
                  color="primary"
                  icon="feather:arrow-right"
                />
              </VButtons>
            </div>
          </VCard>
          <VCard
            class="m-b-20"
            v-if="
              job_application.data.selected_job.is_questionnaire &&
              job_application.data.selected_application.answer.length > 0
            "
          >
            <div class="s-title">
              <i
                class="iconify"
                data-icon="feather:help-circle"
                aria-hidden="true"
              ></i>
              Candidate Questionnaire
            </div>
            <div class="questions-answers m-t-50">
              <div
                v-for="(item, key) in job_application.data.selected_application
                  .answer"
                :key="key"
              >
                <div class="question m-b-20">
                  <h3 class="title-count">Q: {{ item.question }}</h3>
                  <p>A: {{ item.answer }}</p>
                </div>
                <hr
                  v-if="
                    key <
                    job_application.data.selected_application.answer.length - 1
                  "
                />
              </div>
            </div>
          </VCard>
          <VCard>
            <div class="columns">
              <div class="is-4 column">
                <div class="s-title" style="float: left">
                  <i
                    class="iconify"
                    data-icon="feather:star"
                    aria-hidden="true"
                  ></i>
                  Select or Decline
                </div>

                <div class="thumb m-t-50">
                  <VFlex
                    class="flex"
                    flex-wrap="wrap"
                    row-gap=".5rem"
                    column-gap=".25rem"
                  >
                    <VIconWrap
                      icon="feather:thumbs-up"
                      size="medium"
                      :has-background="
                        job_application.data.selected_application
                          .selected_by_shared_view
                      "
                      :color="
                        job_application.data.selected_application
                          .selected_by_shared_view
                          ? 'primary'
                          : 'dark'
                      "
                      @click="
                        job_application.review_shared_applications(
                          job_application.data.selected_application.id,
                          'thumb',
                          true,
                          null
                        ),
                          (job_application.data.data[
                            job_application.data.selected_index
                          ].selected_by_shared_view = 1)
                      "
                    />
                    <VIconWrap
                      icon="feather:thumbs-down"
                      size="medium"
                      :has-background="
                        job_application.data.selected_application
                          .selected_by_shared_view == 0
                      "
                      :color="
                        job_application.data.selected_application
                          .selected_by_shared_view == 0
                          ? 'danger'
                          : 'dark'
                      "
                      @click="
                        job_application.review_shared_applications(
                          job_application.data.selected_application.id,
                          'thumb',
                          false,
                          null
                        ),
                          (job_application.data.data[
                            job_application.data.selected_index
                          ].selected_by_shared_view = 0)
                      "
                    />
                  </VFlex>
                </div>
              </div>

              <div class="is-8 column">
                <div class="s-title">
                  <i
                    class="iconify"
                    data-icon="feather:message-square"
                    aria-hidden="true"
                  ></i>
                  Leave a comment
                </div>

                <VField>
                  <VControl>
                    <textarea
                      v-model="
                        job_application.data.selected_application
                          .commented_by_shared_view
                      "
                      class="textarea"
                      rows="4"
                      placeholder="Leave a note about the candidate ..."
                      :disabled="!editComment"
                    ></textarea>
                  </VControl>
                </VField>

                <VButton
                  v-if="editComment"
                  class="cmnt-btn"
                  @click="
                    comment(
                      job_application.data.selected_application.id,
                      'comment',
                      null,
                      job_application.data.selected_application
                        .commented_by_shared_view
                    )
                  "
                >
                  Save comment
                </VButton>
                <VButton v-else class="cmnt-btn" @click="editComment = true">
                  Edit comment
                </VButton>
              </div>
            </div>
          </VCard>
        </div>
      </div>
    </div>
    <div v-else class="container section-private">
      <VCard>
        <i
          class="iconify"
          data-icon="feather:shield-off"
          aria-hidden="true"
        ></i>
        <h1>Shared view is private</h1>
        <h2>
          You cannot view the shared view because it's set as private, please
          contact the recruiter for more details
        </h2>
        <VButton href="/" outlined color="primary" class="m-t-25" bold rounded>
          Go to tenrol.com</VButton
        >
      </VCard>
    </div>
  </div>
  <div v-else class="section">
    <div class="container section-private">
      <VCard>
        <i
          class="iconify"
          data-icon="feather:alert-triangle"
          aria-hidden="true"
        ></i>
        <h1>404</h1>
        <h2>
          The page you are looking for does't exist, <br />
          please make sure the link is correct
        </h2>
        <VButton href="/" outlined color="primary" class="m-t-25" bold rounded>
          Go to tenrol.com</VButton
        >
      </VCard>
    </div>
  </div>

  <a href="/" target="_blank">
    <div class="poweredby m-t-60 p-b-40">
      <img src="/@src/assets/Tenrol-Logo-04.svg" alt="" />
    </div>
  </a>
</template>

<style lang="scss"  >
.thumb {
  font-size: 3rem;
  padding: 1.8rem;
  min-height: 50px;
  display: block;
  margin: 0 auto;
  width: max-content;
  .icon-wrap {
    cursor: pointer;
  }
}

.questions-answers {
  .question {
    font-family: var(--font);
    font-size: 0.9rem;
    h3 {
      font-weight: 500 !important;
    }
    p {
      color: var(--light-text);
    }
  }
}
.modal-card-body {
  padding: 0;
}
.section-private {
  .r-card {
    padding: 25px;
    min-height: 380px;
    max-width: 420px;
    display: block;
    margin: 50px auto;
    text-align: center;

    h1 {
      font-weight: 600;
      font-size: 2rem;
    }
    h2 {
      color: rgba(0, 0, 0, 0.7);
    }
    .iconify {
      padding: 10px;
      color: var(--primary);
      font-size: 10rem;
    }
  }
}
.section {
  margin-top: 0 !important;
  min-height: 600px;
}
.cmnt-btn {
  float: right;
}
.r-card {
  position: relative;
}
.s-title {
  font-weight: 500;

  margin-bottom: 15px;
  float: right;
  padding: 5px 10px;
  background-color: whitesmoke;
  border-color: transparent;
  color: rgba(0, 0, 0, 0.7);
  width: fit-content;
  border-radius: 4px;
  font-size: 10px;
  .iconify {
    margin-right: 5px;
    font-size: 14px !important;
    vertical-align: top;
  }
}
.video-info {
  position: absolute;
  top: 25px;
  right: 26px;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.8);
}
.autoplay {
  position: absolute;

  right: 140px !important;
  .checkbox {
    padding: 0 !important;
  }
  .checkbox.is-solid input + span {
    background: transparent !important;
  }
}
.single-accordion {
  box-shadow: none !important;
  margin-bottom: 20px;
}

.candidates {
  position: relative;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  max-height: 300px;
  overflow-y: auto;
  .flex-meta {
    span {
      width: 140px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    // display: none;
    background: var(--fade-grey-dark-3);
    width: 3px;
    border: 5px solid transparent;
    background-clip: content-box;
  }
  /* width */
  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #dbdbdb;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: var(--muted-grey);
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: var(--primary);
    cursor: pointer;
  }
}

.questions-answers {
  h2 {
    font-weight: 600;
    // font-size: large;
    margin-bottom: 25px;
    text-align: center;
  }
}
.candidate-card {
  .candidates {
    // background-color: whitesmoke;
    border-radius: 0.25rem;

    padding: 5px;
  }
  .media-flex {
    border-radius: 0.25rem;

    padding: 7px !important;
    cursor: pointer;
    &:hover {
      background: #f6f7f9;
    }
  }
  .c-selected {
    span {
      color: white !important;
    }
    .is-fake {
      background-color: #2cae73 !important;
      &:hover {
        background-color: #2cae73 !important;
      }
    }
    background-color: var(--primary) !important;
    color: white !important;
  }
}

.profile {
  // padding: 1.2rem;
  // border-radius: 6px;
  // max-width: 420px;
  // margin: 0 auto;x
  // display: block;
}
.question {
  // padding: 1.2rem 0;
  border-radius: 6px;

  h2 {
    font-weight: 600;
    font-size: large;
    // margin-bottom: 10px;
  }
  p {
    // max-width: 420px;
  }
  span {
    font-weight: bold;
    color: var(--primary);
    font-size: smaller;
  }
}
.job {
  border-radius: 6px;
  .lnir {
    color: var(--primary);

    font-size: 2.5rem;
    text-align: center;
    width: 100%;
  }
  h3 {
    text-align: center;
    width: 100%;
  }
  h2 {
    font-weight: 600;
    font-size: large;
    text-align: center;
    i {
      margin-right: 3px;
    }
  }

  span {
    font-weight: bold;

    color: var(--light-text);
    font-size: smaller;
  }
}
.controls {
  .buttons {
    display: block;
    margin: 15px auto 10px auto;
    width: fit-content;
    .button {
      // min-width: 150px;
    }
  }
}
.application-preview {
  display: block;

  margin: 0 auto;
  width: 100%;
  border-radius: 6px;
  position: relative;

  video {
    margin: 0 auto;
    display: block;
    background: #333333;
    width: 100%;
    max-height: 27rem;
    border-radius: 4px;
    min-height: 400px;
  }
}
.app-wrapper {
  background: white !important;
}
.poweredby {
  display: block;
  margin: 0 auto;
  width: 15rem;
}

// On Mobile
@media only screen and (max-width: 766px) {
}

// Loader
.loader {
  border: 10px solid #f3f3f3;
  margin: 10px auto 0 auto;
  border-radius: 50%;
  border-top: 10px solid var(--primary);
  width: 300px;
  height: 300px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.view-wrapper {
  margin: 0 !important;
  width: 100% !important;
  padding: 0 !important;
}
</style>