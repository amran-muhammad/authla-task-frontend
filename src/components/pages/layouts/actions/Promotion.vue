<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
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
import getBlobDuration from 'get-blob-duration'
import sleep from '/@src/utils/sleep'
const host = import.meta.env.VITE_API_BASE_URL

const companySize = ref('')
const businessType = ref('')
const productToDemo = ref('')
const date = ref(new Date())
const { y } = useWindowScroll()

const notyf = new Notyf()
const { t } = useI18n()
const jobApplication: any = useJobApplication()
const jobOpening: any = useJobOpening()
let upbutton = ref(-1)
let AudioDevice = ref(false)
let AudioDevicePermission = ref(false)
let VideoDevice = ref(false)
let VideoDevicePermission = ref(false)
const centeredActionsOpen = ref(false)
const uploading = ref(false)
const messageForScreeningQuestion = ref('')
const micName = ref('')
const cameraName = ref('')
let sBrowser: string = ''

const isStuck = computed(() => {
  return y.value > 30
})
// Define a validation schema
const schema = yup.object({
  email: yup.string().required(t('jobapplication.common.required')),
  name: yup.string().required(t('jobapplication.common.required')),
})

let old_file: any[] = []

let recordedBlob = {} as any
let config = {
  headers: { 'content-type': 'multipart/form-data' },
}

const calculateTextQuestionProgress = () => {
  let fa = 0
  jobOpening.data.question.forEach((element: any, index: number) => {
    if (
      jobApplication.formAnswers[index] &&
      jobApplication.formAnswers[index] != null &&
      jobApplication.formAnswers[index] != ''
    ) {
      fa = fa + 1
    }
  })
  return fa
}

// Text to speech
let speak = (questionText: string) => {
  var selected_voice = window.speechSynthesis.getVoices()
  let speakButton: any = document.getElementById('speak-icon')
  speakButton.classList.add('is-danger')
  var spokenQuestion = new SpeechSynthesisUtterance(questionText)
  spokenQuestion.voice = selected_voice[50]
  window.speechSynthesis.speak(spokenQuestion)
  spokenQuestion.addEventListener('end', function (event) {
    speakButton.classList.remove('is-danger')
  })
}

const updateInterview = async (values: typeof schema) => {
  if (
    jobApplication.formAnswers.length == 0 &&
    jobOpening.data.question.length > 0
  ) {
    return notyf.error('You must answer the questions!')
  } else if (
    jobApplication.data.video_answers.length == 0 &&
    jobOpening.data.video_question.length > 0
  ) {
    return notyf.error('You must attempt the video interview!')
  }
  jobApplication.data.answers = []
  jobOpening.data.question.forEach((element: any, index: number) => {
    jobApplication.data.answers.push({
      job_opening_id: element.job_opening_id,
      job_application_id: Number(route.query.job),
      job_opening_question_id: element.id,
      question: element.question,
      answer: jobApplication.formAnswers[index],
    })
  })

  jobApplication.data.user_id = 1
  jobApplication.data.job_opening_id = jobOpening.data.id

  jobApplication.save().then((data: any) => {
    if (data.data.status == true) {
      jobApplication.pc.process_complete = 'yes'
      notyf.success('Job Application submitted successfully!')
      router.push('/job/' + jobOpening.data.id)
    } else {
      notyf.error('Something Went Wrong!')
    }
  })
}

const filesChange = async (e: any, item: any, index: any) => {
  uploading.value = true
  let formData = new FormData()
  if (old_file.length > 0) {
    let findex = -1
    for (let i = 0; i < old_file.length; i++) {
      if (old_file[i] == index) {
        findex = index
        break
      }
    }
    if (findex > -1) {
      formData.append(
        'old_file',
        jobApplication.data.video_answers[findex].video
      )
    }
  }

  let duration = await getBlobDuration(e.target.files[0])
  if (Number(duration) > Number(item.length)) {
    uploading.value = false
    return notyf.error({
      message: `The video shouldn't be longer than ${
        Number(item.length) > 59
          ? ' ' +
            Math.floor(Number(item.length) / 60) +
            ' Min' +
            ' ' +
            (Math.round(Number(item.length) % 60) > 0
              ? Math.round(Number(item.length) % 60) + ' Sec'
              : '')
          : ' ' + item.length + ' Sec'
      }`,
      duration: 5000,
    })
  }

  formData.append('file', e.target.files[0])
  formData.append('extension', 'mp4')
  try {
    let res: any = await axios.post(
      host + '/job-application-question/v1/video-upload',
      formData,
      config
    )
    if (res.status == 200) {
      uploading.value = false
      jobApplication.videoLinks[index] = URL.createObjectURL(e.target.files[0])
      jobApplication.data.video_answers[index] = {
        job_opening_id: item.job_opening_id,
        job_application_id: Number(route.query.job),
        job_opening_video_question_id: item.id,
        question: item.question,
        length: item.length,
        video: res.data.data,
      }
      jobApplication.calculateProgress()
      old_file.push(index)
      notyf.success(res.data.msg)
    } else {
      uploading.value = false
      return notyf.error('Failed to upload the video')
    }
  } catch (error) {
    uploading.value = false
    return notyf.error({
      message: 'Video size has exceeded the limit, please record again',
      duration: 5000,
    })
  }
}
const uploadTheVideo = async (item: any, index: any) => {
  let formData = new FormData()
  if (old_file.length > 0) {
    let findex = -1
    for (let i = 0; i < old_file.length; i++) {
      if (old_file[i] == index) {
        findex = index
        break
      }
    }
    if (findex > -1) {
      formData.append(
        'old_file',
        jobApplication.data.video_answers[findex].video
      )
    }
  }

  formData.append('file', recordedBlob)
  formData.append('extension', 'mp4')
  try {
    let res: any = await axios.post(
      host + '/job-application-question/v1/video-upload',
      formData,
      config
    )
    if (res.status == 200) {
      upbutton.value = -1
      jobApplication.calculateProgress()
      jobApplication.data.video_answers[index] = {
        job_opening_id: item.job_opening_id,
        job_application_id: Number(route.query.job),
        job_opening_video_question_id: item.id,
        question: item.question,
        length: item.length,
        video: res.data.data,
      }
      old_file.push(index)
      notyf.success(res.data.msg)
    }
  } catch (error: any) {
    upbutton.value = -1
    jobApplication.videoLinks[index] = ''
    return notyf.error({
      message: 'Video size has exceeded the limit, please record again',
      duration: 5000,
    })
  }
}
let seconds: any = ref([])

function Record(length: string, idx: number, item: any) {
  let secondRun = 1
  if (AudioDevice.value == false) {
    centeredActionsOpen.value = true
    messageForScreeningQuestion.value = 'Could not find Microphone on device.'
    return
  }
  if (AudioDevicePermission.value == false) {
    centeredActionsOpen.value = true
    messageForScreeningQuestion.value = 'Please allow permission to Microphone'
    secondRun = 2
    // return
  }
  if (VideoDevice.value == false) {
    centeredActionsOpen.value = true
    messageForScreeningQuestion.value = 'Could not find Camera on device.'
    return
  }
  if (VideoDevicePermission.value == false) {
    centeredActionsOpen.value = true
    messageForScreeningQuestion.value = 'Please allow permission to Camera'
    secondRun = 2
    // return
  }
  seconds.value[idx] = 0
  var flag = false
  var flag2 = false

  function incrementSeconds() {
    if (secondRun == 1) {
      jobOpening.start_text[idx] = 'Stop'
      seconds.value[idx] += 1
    }

    if (
      seconds.value[idx] == Number(length) ||
      seconds.value[idx] > Number(length)
    ) {
      flag = true
      if (!flag2) {
        stopButton.click()
      }
    }
  }

  let cancel = setInterval(incrementSeconds, 1000)

  let iddx = idx + 1
  let preview: any = document.getElementById('preview' + iddx)
  let stopButton: any = document.getElementById('stopButton' + iddx)

  let recordingTimeMS = Number(length) * 1000
  let rec = {} as any
  let recorded = {} as any

  function startRecording(stream: any, lengthInMS: any) {
    let recorder = new MediaRecorder(stream)
    let data: any = []
    recorder.ondataavailable = (event) => data.push(event.data)
    recorder.start()
    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve
      recorder.onerror = (event: any) => reject(event.name)
    })
    rec = recorder
    return Promise.all([stopped, recorded]).then(() => data)
  }
  function stop_recorder() {
    recorded = () => rec.state == 'recording' && rec.stop()
    clearInterval(cancel)
  }
  function stop(stream: any) {
    stream.getTracks().forEach((track: any) => track.stop())
    clearInterval(cancel)
  }

  //Start Record----------
  navigator.mediaDevices
    .getUserMedia({
      video: {
        width: {
          min: 1280,
          ideal: 1920,
          max: 2560,
        },
        height: {
          min: 720,
          ideal: 1080,
          max: 1440,
        },
        facingMode: 'user',
      },
      audio: true,
    })
    .then((stream: any) => {
      if (stream.active) {
        clearInterval(cancel)
        secondRun = 1
        cancel = setInterval(incrementSeconds, 1000)
      }
      preview.srcObject = stream
      preview.captureStream = preview.captureStream || preview.mozCaptureStream
      return new Promise((resolve) => (preview.onplaying = resolve))
    })
    .then(() => startRecording(preview.captureStream(), recordingTimeMS))
    .then((recordedChunks) => {
      recordedBlob = new Blob(recordedChunks, {
        type: 'video/webm',
      })
      console.log('file', recordedChunks)
      if (!flag) {
        flag2 = true
        stop(preview.srcObject)
        stop_recorder()
      }
      uploadTheVideo(item, idx)
      jobOpening.start_text[idx] = 'Retake'
      jobApplication.videoLinks[idx] = URL.createObjectURL(recordedBlob)
    })
    .catch(log)
  function log(msg: any) {
    alert(msg)
    return
  }
  stopButton.addEventListener(
    'click',
    function () {
      upbutton.value = idx
      stop(preview.srcObject)
      stop_recorder()
    },
    false
  )
}

function _stop(stream: any) {
  if (stream.active) {
    stream.getTracks().forEach((track: any) => track.stop())
  }
}
const testSuccess = (index: number) => {
  _stop(videoForTest[index].srcObject)
  jobOpening.start_text[index] = 'Start'
}

let videoForTest: any[] = []
let zeroStream: any = {}
let videoTestingIndex = ref(-1)

const nextStepVideo = async () => {
  jobOpening.changeIndexes()
  await sleep(1000)
  videoTestingIndex.value = jobOpening.showVideoIndex
  if (
    !jobApplication.videoLinks[jobOpening.showVideoIndex] ||
    jobApplication.videoLinks[jobOpening.showVideoIndex] == ''
  ) {
    test()
  }
}
const nextStepVideoIndex = async () => {
  jobOpening.increase()
  await sleep(1000)
  videoTestingIndex.value = jobOpening.showVideoIndex
  if (
    !jobApplication.videoLinks[jobOpening.showVideoIndex] ||
    jobApplication.videoLinks[jobOpening.showVideoIndex] == ''
  ) {
    test()
  }
}
const prevStepFromFirstVideo = async () => {
  _stop(zeroStream)
  await sleep(1000)
  jobOpening.prevStep()
  videoTestingIndex.value = jobOpening.showVideoIndex
}
const prevStepFromVideo = async () => {
  _stop(videoForTest[jobOpening.showVideoIndex].srcObject)
  await sleep(1000)
  jobOpening.decrease()
  videoTestingIndex.value = jobOpening.showVideoIndex
}

const test = () => {
  // Get access to the camera!

  videoForTest[jobOpening.showVideoIndex] = document.getElementById(
    'videotest' + jobOpening.showVideoIndex
  )
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: {
            min: 1280,
            ideal: 1920,
            max: 2560,
          },
          height: {
            min: 720,
            ideal: 1080,
            max: 1440,
          },
          facingMode: 'user',
        },
        audio: true,
      })
      .then(function (stream) {
        //video.src = window.URL.createObjectURL(stream);
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
          devices.forEach((element: any) => {
            if (element.kind === 'audioinput') {
              AudioDevice.value = true
            }
            if (element.kind === 'audioinput' && element.label != '') {
              AudioDevicePermission.value = true
              micName.value = element.label
            }
            if (element.kind === 'videoinput') {
              VideoDevice.value = true
            }
            if (element.kind === 'videoinput' && element.label != '') {
              VideoDevicePermission.value = true
              cameraName.value = element.label
            }
          })
        })

        videoForTest[jobOpening.showVideoIndex].srcObject = stream

        if (jobOpening.showVideoIndex == 0 || jobOpening.showVideoIndex == -1) {
          zeroStream = stream
        }
        videoForTest[jobOpening.showVideoIndex].play()
      })
  }
}
onMounted(() => {
  seconds.value[0] = 0

  let sUsrAg = navigator.userAgent

  // The order matters here, and this may report false positives for unlisted browsers.

  if (sUsrAg.indexOf('Firefox') > -1) {
    sBrowser = 'Mozilla Firefox'
  } else if (sUsrAg.indexOf('SamsungBrowser') > -1) {
    sBrowser = 'Samsung Internet'
  } else if (sUsrAg.indexOf('Opera') > -1 || sUsrAg.indexOf('OPR') > -1) {
    sBrowser = 'Opera'
  } else if (sUsrAg.indexOf('Trident') > -1) {
    sBrowser = 'Microsoft Internet Explorer'
  } else if (sUsrAg.indexOf('Edge') > -1) {
    sBrowser = 'Microsoft Edge (Legacy)'
  } else if (sUsrAg.indexOf('Edg') > -1) {
    sBrowser = 'Microsoft Edge (Chromium)'
  } else if (sUsrAg.indexOf('Chrome') > -1) {
    sBrowser = 'Google Chrome or Chromium'
  } else if (sUsrAg.indexOf('Safari') > -1) {
    sBrowser = 'Apple Safari'
  } else {
    sBrowser = 'unknown'
  }

  // List cameras and microphones.

  navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach((element: any) => {
      if (element.kind === 'audioinput') {
        AudioDevice.value = true
      }
      if (element.kind === 'audioinput' && element.label != '') {
        AudioDevicePermission.value = true
        micName.value = element.label
      }
      if (element.kind === 'videoinput') {
        VideoDevice.value = true
      }
      if (element.kind === 'videoinput' && element.label != '') {
        VideoDevicePermission.value = true
        cameraName.value = element.label
      }
    })
  })
  jobOpening
    .getCurrentData(jobApplication.basic_info.job_opening_id)
    .then(() => {
      jobApplication.calculateProgress()
    })
  if (jobApplication.is_basic_info == true) {
    jobApplication.data.user_id = jobApplication.basic_info.user_id
    jobApplication.data.email = jobApplication.basic_info.email
    jobApplication.data.job_opening_id =
      jobApplication.basic_info.job_opening_id
    jobApplication.data.status = jobApplication.basic_info.status
    jobApplication.data.name = jobApplication.basic_info.name
    jobApplication.data.phone = jobApplication.basic_info.phone
    jobApplication.data.cv = jobApplication.basic_info.cv
  } else if (jobApplication.data.email === '') {
    notyf.error('Fill the basic info first!')
    router.push(
      '/job_application/list/job_opening?job=' +
        jobApplication.basic_info.job_opening_id
    )
  } else if (jobApplication.data == undefined) {
    notyf.error('Fill the basic info first!')
    router.push(
      '/job_application/list/job_opening?job=' +
        jobApplication.basic_info.job_opening_id
    )
  }
})
</script>
<template>
  <Form
    :validation-schema="schema"
    class="form-layout"
    :initial-values="jobOpening.isEdit ? jobOpening.data : {}"
    @submit="prevent"
  >
    <VModal
      :open="centeredActionsOpen"
      title="Notice"
      size="small"
      actions="center"
      cancelLabel="Close"
      @close="centeredActionsOpen = false"
    >
      <template #content>
        <VPlaceholderSection :title="messageForScreeningQuestion" />
      </template>
    </VModal>
    <div class="form-outer">
      <!-- <div class="progress-bar progress-bar-mobile">
        <VProgress size="tiny" :value="jobApplication.progress" />
      </div> -->
      <div :class="[isStuck && 'is-stuck']" class="form-header stuck-header">
        <div class="form-header-inner">
          <div class="left">
            <h3 class="progress-percentage">
              Progress {{ jobApplication.progress }}%
            </h3>
          </div>
          <div class="right">
            <VButtons v-if="jobOpening.showQIndex > -1">
              <VButton bold disabled> Previous </VButton>
              <VButton
                bold
                :disabled="
                  calculateTextQuestionProgress() <
                  jobOpening.data.question.length
                "
                color="primary"
                @click="nextStepVideo"
              >
                Next Step
              </VButton>
            </VButtons>

            <VButtons v-if="jobOpening.showVideoIndex > -1">
              <VButton
                bold
                v-if="
                  jobOpening.showVideoIndex == 0 &&
                  jobOpening.data.question.length > 0
                "
                @click="prevStepFromFirstVideo"
              >
                Previous
              </VButton>
              <VButton
                bold
                v-if="jobOpening.showVideoIndex > 0"
                @click="prevStepFromVideo"
              >
                Previous
              </VButton>
              <VButton
                bold
                color="primary"
                v-if="
                  jobOpening.showVideoIndex <
                  jobOpening.data.video_question.length - 1
                "
                @click="nextStepVideoIndex"
                :disabled="
                  !jobApplication.videoLinks[jobOpening.showVideoIndex]
                "
              >
                Next Step
              </VButton>

              <VButton
                bold
                v-if="
                  jobApplication.progress == 100 &&
                  ((jobOpening.data.question.length == 0 &&
                    jobOpening.showVideoIndex ==
                      jobOpening.data.video_question.length - 1) ||
                    (jobOpening.data.video_question.length == 0 &&
                      jobOpening.showQIndex ==
                        jobOpening.data.question.length - 1) ||
                    (jobOpening.data.question.length != 0 &&
                      jobOpening.data.video_question.length - 1 ==
                        jobOpening.showVideoIndex))
                "
                color="primary"
                @click="updateInterview"
              >
                Complete Interview
              </VButton>

              <VButton
                bold
                v-if="
                  jobApplication.progress < 100 &&
                  jobOpening.showVideoIndex ==
                    jobOpening.data.video_question.length - 1
                "
                color="primary"
                @click="updateInterview"
                disabled
              >
                Complete Interview
              </VButton>
            </VButtons>
          </div>
        </div>
      </div>
      <div class="progress-bar">
        <VProgress size="tiny" :value="jobApplication.progress" />
      </div>

      <div class="form-body">
        <!-- Question text -->
        <div
          v-if="jobOpening.showQIndex > -1"
          class="columns wrapper-outer m-h-420 form-fieldset"
        >
          <div class="column is-12 wrapper-inner">
            <div class="action-box">
              <div>
                <div
                  v-for="(item, index) in jobOpening.data.question"
                  :key="index"
                >
                  <div class="box-content">
                    <VField v-if="item.type == 'Data'">
                      <div class="fieldset-heading">
                        <h4>
                          <VTag
                            color="black"
                            :label="'Question ' + (index + 1)"
                            tiny
                          />
                        </h4>
                        <h4>
                          {{ item.question }}
                        </h4>
                        <p>
                          Please answer the question by entering the text in the
                          field below
                        </p>
                      </div>
                      <VControl>
                        <textarea
                          v-model="jobApplication.formAnswers[index]"
                          class="textarea"
                          rows="4"
                          @keyup="jobApplication.calculateProgress"
                        ></textarea>
                      </VControl>
                    </VField>
                    <VField v-if="item.type == 'Text'">
                      <div class="fieldset-heading">
                        <h4>
                          <VTag
                            color="black"
                            :label="'Question ' + (index + 1)"
                            tiny
                          />
                        </h4>
                        <h4>
                          {{ item.question }}
                        </h4>
                        <p>
                          Please answer the question by entering the text in the
                          field below
                        </p>
                      </div>
                      <VControl>
                        <textarea
                          v-model="jobApplication.formAnswers[index]"
                          class="textarea"
                          rows="4"
                          @keyup="jobApplication.calculateProgress"
                        ></textarea>
                      </VControl>
                    </VField>
                    <VField v-if="item.type == 'Number'">
                      <div class="fieldset-heading">
                        <h4>
                          <VTag
                            color="black"
                            :label="'Question ' + (index + 1)"
                            tiny
                          />
                        </h4>
                        <h4>
                          {{ item.question }}
                        </h4>
                        <p>Enter number</p>
                      </div>
                      <VControl>
                        <input
                          v-model="jobApplication.formAnswers[index]"
                          class="input"
                          type="number"
                          @keyup="jobApplication.calculateProgress"
                        />
                      </VControl>
                    </VField>
                    <VField v-if="item.type == 'Date'">
                      <div class="fieldset-heading">
                        <h4>
                          <VTag
                            color="black"
                            :label="'Question ' + (index + 1)"
                            tiny
                          />
                          <h4>
                            {{ item.question }}
                          </h4>
                        </h4>
                        <p>Select the date below to answer</p>
                      </div>
                      <VControl>
                        <input
                          v-model="jobApplication.formAnswers[index]"
                          class="input"
                          type="date"
                          @change="jobApplication.calculateProgress"
                        />
                      </VControl>
                    </VField>
                    <VField v-if="item.type == 'Yes/No'">
                      <div class="fieldset-heading">
                        <h4>
                          <VTag
                            color="black"
                            :label="'Question ' + (index + 1)"
                            tiny
                          />
                          <h4>
                            {{ item.question }}
                          </h4>
                        </h4>
                        <p>Please select the correct answer (Yes or No)</p>
                      </div>
                      <VControl>
                        <VRadio
                          v-model="jobApplication.formAnswers[index]"
                          value="Yes"
                          label="Yes"
                          :name="index + 'outlined_radio'"
                          color="primary"
                          @change="jobApplication.calculateProgress"
                        />
                        <VRadio
                          v-model="jobApplication.formAnswers[index]"
                          value="No"
                          label="No"
                          :name="index + 'outlined_radio'"
                          color="primary"
                          @change="jobApplication.calculateProgress"
                        />
                      </VControl>
                    </VField>
                    <VField v-if="item.type == 'Bool'">
                      <div class="fieldset-heading">
                        <h4>
                          <VTag
                            color="black"
                            :label="'Question ' + (index + 1)"
                            tiny
                          />
                          <h4>
                            {{ item.question }}
                          </h4>
                        </h4>
                        <p>Please select the correct answer (Yes or No)</p>
                      </div>
                      <VControl>
                        <VRadio
                          v-model="jobApplication.formAnswers[index]"
                          value="Yes"
                          label="Yes"
                          name="outlined_radio"
                          color="primary"
                          @change="jobApplication.calculateProgress"
                        />
                        <VRadio
                          v-model="jobApplication.formAnswers[index]"
                          value="No"
                          label="No"
                          name="outlined_radio"
                          color="primary"
                          @change="jobApplication.calculateProgress"
                        />
                      </VControl>
                    </VField>
                  </div>
                  <hr
                    v-if="index != jobOpening.data.question.length - 1"
                    class="m-t-35 m-b-35"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Question Video -->

        <div
          v-if="jobOpening.data.video_question.length > 0"
          class="promotion-page-wrapper form-fieldset video-section"
        >
          <div
            v-for="(item, index) in jobOpening.data.video_question"
            :key="item.id"
          >
            <div
              v-if="jobOpening.showVideoIndex == index"
              class="columns video-parent"
            >
              <div class="column is-5 wrapper-inner">
                <div class="fieldset-heading video-question">
                  <h4>
                    <VTag
                      color="black"
                      :label="
                        'Question ' +
                        (index + 1) +
                        '/' +
                        jobOpening.data.video_question.length
                      "
                      tiny
                    />
                    <VIconButton
                      id="speak-icon"
                      class="speak-icon"
                      @click="speak(item.question)"
                      circle
                      icon="feather:volume-2"
                    />
                  </h4>
                  <span
                    class="m-b-10 m-t-5 type title"
                    :style="'--n:' + item.question.length"
                  >
                    {{ item.question }}
                  </span>
                  <p class="m-b-20 animate__fadeIn">
                    {{ item.description }}
                  </p>
                </div>
              </div>
              <div class="column is-7 side-wrapper">
                <div class="side-inner">
                  <div>
                    <div id="footage" class="box-video">
                      <div
                        class="container-video"
                        v-if="sBrowser != 'Apple Safari'"
                      >
                        <span class="device-input-icon-mic">
                          <i
                            v-if="
                              AudioDevice == false &&
                              AudioDevicePermission == false
                            "
                            style="color: #e62864"
                            class="iconify"
                            data-icon="feather:mic-off"
                            aria-hidden="true"
                          ></i>

                          <i
                            v-else
                            style="color: #ffffff"
                            class="iconify"
                            data-icon="feather:mic"
                            aria-hidden="true"
                          ></i>
                        </span>

                        <span
                          v-if="jobOpening.start_text[index] == 'Retake'"
                          class="mins"
                        >
                          {{
                            Number(seconds[index]) > 59
                              ? ' ' +
                                Math.floor(Number(seconds[index]) / 60) +
                                ' Min' +
                                ' ' +
                                (Math.round(Number(seconds[index]) % 60) > 0
                                  ? Math.round(Number(seconds[index]) % 60) +
                                    ' Sec'
                                  : '')
                              : ' ' + seconds[index] + ' Sec'
                          }}
                        </span>
                        <span v-else-if="seconds[index] > 0" class="mins">
                          <i class="fas fa-circle" aria-hidden="true"></i>
                          {{
                            Number(item.length - seconds[index]) > 59
                              ? ' ' +
                                Math.floor(
                                  Number(item.length - seconds[index]) / 60
                                ) +
                                ' Min' +
                                ' ' +
                                (Math.round(
                                  Number(item.length - seconds[index]) % 60
                                ) > 0
                                  ? Math.round(
                                      Number(item.length - seconds[index]) % 60
                                    ) + ' Sec'
                                  : '')
                              : ' ' + item.length - seconds[index] + ' Sec'
                          }}
                        </span>
                        <span v-else class="mins">
                          {{
                            Number(item.length) > 59
                              ? ' ' +
                                Math.floor(Number(item.length) / 60) +
                                ' Min' +
                                ' ' +
                                (Math.round(Number(item.length) % 60) > 0
                                  ? Math.round(Number(item.length) % 60) +
                                    ' Sec'
                                  : '')
                              : ' ' + item.length + ' Sec'
                          }}
                        </span>

                        <span class="device-input-icon-camera">
                          <i
                            v-if="
                              AudioDevice == false &&
                              AudioDevicePermission == false
                            "
                            style="color: #e62864"
                            class="iconify"
                            data-icon="feather:video-off"
                            aria-hidden="true"
                          ></i>

                          <i
                            v-else
                            style="color: #ffffff"
                            class="iconify"
                            data-icon="feather:video"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <div
                          v-if="
                            index == jobOpening.showVideoIndex &&
                            jobOpening.start_text[index] == 'Test'
                          "
                        >
                          <video
                            v-if="index == jobOpening.showVideoIndex"
                            :id="'videotest' + index"
                            width="640"
                            height="480"
                            muted=""
                            autoplay
                          ></video>
                          <VButton
                            v-if="
                              videoTestingIndex == jobOpening.showVideoIndex
                            "
                            color="info"
                            class="fw-btn"
                            style="margin-right: 0"
                            icon="fas fa-video"
                            outlined
                            bold
                            @click="testSuccess(index)"
                          >
                            Click whenever you're ready
                          </VButton>
                          <VButton
                            v-else
                            color="info"
                            class="fw-btn"
                            style="margin-right: 0"
                            icon="fas fa-video"
                            outlined
                            bold
                          >
                            Loading...
                          </VButton>
                        </div>

                        <!-- <div
                          v-else-if="upbutton == jobOpening.showVideoIndex"
                          class="videoheight"
                        ></div> -->

                        <video
                          v-else
                          :id="'preview' + (index + 1)"
                          width="100%"
                          height="300px"
                          autoplay=""
                          muted=""
                        >
                          <source :src="jobApplication.videoLinks[index]" />
                        </video>

                        <div class="m-b-20">
                          <VButtons>
                            <VButton
                              v-if="jobOpening.start_text[index] == 'Start'"
                              color="danger"
                              class="fw-btn"
                              style="margin-right: 0"
                              icon="fas fa-video"
                              outlined
                              bold
                              @click="Record(item.length, index, item)"
                            >
                              Start recording
                            </VButton>
                            <VButton
                              v-if="jobOpening.start_text[index] == 'Retake'"
                              color="black"
                              class="fw-btn"
                              style="margin-right: 0"
                              icon="fas fa-retweet"
                              bold
                              outlined
                              @click="Record(item.length, index, item)"
                            >
                              Retake Video
                            </VButton>

                            <span
                              :id="'stopButton' + (index + 1)"
                              style="display: contents"
                            >
                              <VButton
                                v-if="jobOpening.start_text[index] == 'Stop'"
                                color="danger"
                                class="fw-btn"
                                icon="fas fa-stop"
                                bold
                                >Stop recording
                              </VButton>
                            </span>
                            <button
                              class="fw-btn"
                              :id="'stopButton' + (index + 1)"
                              style="display: none"
                            >
                              Stop
                            </button>

                            <button
                              class="fw-btn"
                              :id="'stopButton' + (index + 1)"
                              style="display: none"
                            >
                              Stop
                            </button>
                          </VButtons>
                        </div>
                      </div>
                      <div class="columns container-video" v-else>
                        <div class="fieldset-heading safari fs-inf">
                          <div class="column is-12">
                            <VField>
                              <VField grouped>
                                <VControl>
                                  <div class="file">
                                    <label class="file-label">
                                      <input
                                        accept="video/*"
                                        capture="user"
                                        class="file-input"
                                        type="file"
                                        name="resume"
                                        @change="
                                          filesChange($event, item, index)
                                        "
                                      />
                                      <span
                                        class="file-cta"
                                        style="min-width: 280px"
                                        ><div
                                          v-if="uploading"
                                          class="file-label-txt"
                                        >
                                          <VProgress
                                            size="tiny"
                                            color="primary"
                                          />
                                        </div>
                                        <div
                                          v-else-if="
                                            !jobApplication.videoLinks[index]
                                          "
                                          class="file-label-txt"
                                        >
                                          <i class="fas fa-video m-r-5"></i>
                                          Record Video
                                        </div>
                                        <div v-else class="file-label-txt">
                                          <i
                                            style="color: #41b983"
                                            class="fas fa-retweet m-r-5"
                                          ></i>
                                          Retake Video
                                        </div>
                                      </span>
                                    </label>
                                  </div>
                                </VControl>
                              </VField>
                              <p style="text-align: center">
                                Upload a recorded video <br />
                                Maximum video length is :
                                <b>
                                  {{
                                    Number(item.length) > 59
                                      ? ' ' +
                                        Math.floor(Number(item.length) / 60) +
                                        ' Min' +
                                        ' ' +
                                        Math.round(Number(item.length) % 60) +
                                        ' Sec'
                                      : ' ' + item.length + ' Sec'
                                  }}</b
                                >
                              </p>
                            </VField>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Form>
  <!-- <a href="/" target="_blank">
    <div class="poweredby">
      <img src="/@src/assets/Tenrol-Logo-04.svg" alt="" />
    </div>
  </a> -->
</template>
<style lang="scss" >
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/generic/_forms.scss';
@import '../../../../scss/pages/generic/_forms-stepper.scss';
.speak-icon {
  font-size: 0.66rem;
}
.form-layout {
  max-width: 820px !important;
}
.view-wrapper {
  margin-top: 0px !important;
}
.file-label {
  margin: 0 auto !important;
}
.file-cta {
  min-height: 72px;
  border: 2px dashed var(--border);
  background: white !important;
  transition: all 0.3s;
  font-weight: 600;
}
.field {
  label {
    color: var(--dark-text) !important;
  }
}
.device-input-icon-camera,
.device-input-icon-mic,
.mins {
  padding: 0.25rem 0.5rem;
  position: absolute;
  border-radius: 4px;
  font-size: 1.25rem;
  background: rgba(0, 0, 0, 0.5);
  line-height: 10px;
  z-index: 999999999;
}
.container-video {
  .click-start {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 86px;
    font-weight: 500;
  }
}
.device-input-icon-camera {
  right: 4px;
  top: 3px;
}
.device-input-icon-mic {
  right: 38px;
  top: 3px;
}
.mins {
  left: 4px;
  top: 3px;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  height: 24px;
  line-height: 16px;
  i {
    color: tomato;
    margin-right: 3px;
    animation: blink-animation 2s steps(5, start) infinite;
    -webkit-animation: blink-animation 2s steps(5, start) infinite;
  }

  @keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
  @-webkit-keyframes blink-animation {
    to {
      visibility: hidden;
    }
  }
}
.form-body {
  min-height: 720px;
  padding-top: 60px !important;
}
.columns {
  margin: 0px !important;
}
.is-* {
  padding-top: 0;
}

.fs-inf {
  position: absolute;
  padding-left: 3px;
  z-index: 999;
}

video {
  width: 100%;
  border-radius: 0.25rem;
  object-fit: cover;
  // background-color: #000000;
  // background-image: linear-gradient(360deg, #000000 0%, #434343 74%);
}
.fieldset-heading {
  margin-bottom: 0px !important;
  p {
    margin-bottom: 10px;
  }
}
.form-fieldset .columns .column {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}
.wrapper-inner {
  padding-top: 0rem !important;
  padding-bottom: 0rem !important;
}
.buttons:not(:last-child) {
  margin-bottom: 0rem !important;
}

.tag {
  // background: #41b983 !important;
  padding: 4px 6px !important;
  line-height: 9px !important;
  height: 17px !important;
  margin: 0 4px 0px 0px !important;
  border-radius: 3px !important;
  // color: white !important;
}

.view-wrapper .is-stuck {
  position: fixed;
  top: 0;
  left: 0;
  margin-left: 0px;
  width: 100% !important;
  z-index: 14;
}

.devider {
  padding-bottom: 20px;
  background: #f0f0f0;
}
.stepper-form {
  margin-bottom: 0px !important;
  .form-sections {
    padding-right: 0px !important;
  }
  .output {
    height: auto !important;
    padding-top: 16px !important;
  }
}
// Custom override
@media only screen and (min-width: 767px) {
  .poweredby {
    margin-top: 20px;
    width: 20%;
    align-items: center;
    margin-left: 400px;
  }
}
@media only screen and (max-width: 766px) {
  .poweredby {
    margin: 20px 20px 20px 20px;
  }
}
@media only screen and (min-width: 600px) {
  .m-h-420 {
    min-height: 420px;
  }
}

.grid-radio {
  display: grid;
}
@media only screen and (min-width: 600px) {
  .left {
    flex-grow: 2;
    max-width: 50%;

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
}
.left {
  flex-grow: 2;
  width: 100%;

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
        align-content: center;

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
          align-content: center;
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

/* ==========================================================================
1. Confirm Account
========================================================================== */
.fw-btn {
  width: 100%;
}
.videoheight {
  height: 187px;
  width: 100%;
  border-radius: 0.25rem;

  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: placeHolderShimmer;
  animation-timing-function: linear;
  background: #222;
  background: linear-gradient(to right, #434343 0%, #222 25%, #434343 100%);
  // width: 100%;
  padding-top: 50px;
  margin-bottom: 6px;
  border-radius: 0.35rem;
}

@keyframes placeHolderShimmer {
  0% {
    background-position: 0px 0;
  }
  100% {
    background-position: 100em 0;
  }
}

.submitcomplete {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 60px;
  margin: 0 auto;
}
video {
  height: 187px;
  width: 100%;
  background-color: #222;
  border-radius: 0.35rem;
}

.custom-card {
  border: 0;
  backdrop-filter: whitesmoke;
}
@media only screen and (min-width: 600px) {
  .promotion-page-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    max-width: 840px;

    .wrapper-outer {
      // @include vuero-s-card();

      display: flex;
      padding: 0;
      width: 100%;

      .wrapper-inner {
        .action-box {
          border: none;
          background: none;
          border-radius: 0;
          border-right: 1px solid var(--fade-grey-dark-3);
          // min-height: 420px;

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
          text-align: left;
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
            // max-width: 320px;
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

            .button {
              margin: 0 4px;
              min-width: 180px;
            }
          }
        }
      }
    }
  }
}
.promotion-page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;

  .wrapper-outer {
    // @include vuero-s-card();

    display: flex;
    padding: 0;

    .wrapper-inner {
      .action-box {
        border: none;
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
        text-align: left;
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
          // max-width: 320px;
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

          .button {
            margin: 0 4px;
            min-width: 180px;
          }
        }
      }
    }
  }
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

.progress-bar-mobile {
  display: none;
}

.progress {
  border-radius: 0 !important;
}

progress::-webkit-progress-value {
  border-radius: 0 !important;
}
.box-video {
  position: relative;
}
.safari {
  width: 100% !important;
  .file-label-txt {
    text-align: center;
    margin: 0 auto;
    width: 100%;
  }
  .is-grouped {
    display: block !important;
  }
  background: #f8f8f8;
  padding: 50px 0px;
  border-radius: 6px;
  border: 1px solid var(--fade-grey-dark-3);
}

// On mobile

@media only screen and (max-width: 767px) {
  .progress-percentage {
    display: none;
  }
  .click-start {
    top: 138px !important;
  }
  video {
    min-height: 300px;
  }
  .view-wrapper {
    margin-bottom: 107px;
  }
  .videoheight {
    height: 300px !important;
    border-radius: 0 !important;
  }
  .safari {
    min-height: 300px;
    border-bottom: 1px solid var(--fade-grey-dark-3);
    padding: 100px 20px 40px 20px;
  }
  .video-question {
    padding: 370px 10px 10px 10px;
    .title {
      font-size: 20px !important;
    }
  }

  video {
    border-radius: 0 !important;
    height: 300px;
  }
  .box-video {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    .button {
      margin: 10px 20px 0 20px !important;
      height: 45px !important;
      font-size: 16px !important;
    }
  }

  .view-wrapper {
    background: white;
  }
  body {
    background: white;
  }
  .page-title {
    display: none !important  ;
  }
  input,
  textarea {
    min-height: 48px;
    font-size: 16px;
  }

  .form-body {
    padding: 0px !important;
    background: white;
  }
  .form-outer {
    border: none !important;
    margin-top: 3rem;
  }
  .progress-bar {
    display: none;
  }
  .progress-bar-mobile {
    display: unset;
    position: fixed;
    bottom: 104px;
    right: 0;
    left: 0;
    z-index: 999999;
  }
  h4 {
    font-size: 16px !important;
  }
  .stuck-header {
    background-color: var(--white);
    box-shadow: var(--light-box-shadow);
    border: 1px solid var(--fade-grey);
    padding: 12px 20px;
    border-bottom: 1px solid var(--fade-grey-dark-3);
    transition: all 0.3s;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    background: white;
    z-index: 99999;
    button {
      height: 48px !important;
      font-size: 14px !important;
    }
  }
  .radio {
    span {
      min-width: 1.8rem;
      min-height: 1.8rem;
      &::after {
        font-size: 0.8rem !important;
      }
    }
  }
  .is-stuck {
    top: unset !important;
  }

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
        padding: 40px 35px;
      }
    }
  }
}

.form-fieldset {
  max-width: 100% !important;
  padding: 0 !important;
}

.type {
  font-size: 2rem;
  color: #0000;
  background: linear-gradient(-90deg, #1b1b1b 5px, #0000 0) 10px 0,
    linear-gradient(#1b1b1b 0 0) 0 0;
  background-size: calc(var(--n) * 2ch) 200%;
  -webkit-background-clip: padding-box, text;
  background-clip: padding-box, text;
  background-repeat: no-repeat;
  animation: b 0.2s infinite steps(1),
    t calc(var(--n) * 0.1s) steps(var(--n)) forwards;
}

@keyframes t {
  from {
    background-size: 0 200%;
  }
}
@keyframes b {
  50% {
    background-position: 0 -100%, 0 0;
  }
}
</style>