<script setup lang="ts">
import { computed, onMounted, ref, watchEffect, watchPostEffect } from 'vue'
import { useJobOpening } from '/@src/stores/jobOpening'
const jobOpening = useJobOpening()
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  jobOpening.get()

  router.push({
    name: 'app',
  })
})
</script>

<template>
  <div class="all-projects">
    <div class="illustration-header">
      <img
        class="light-image"
        src="/@src/assets/illustrations/projects/manager.svg"
        alt=""
      />
      <img
        class="dark-image"
        src="/@src/assets/illustrations/projects/manager.svg"
        alt=""
      />
      <div class="header-stats">
        <div class="stats-inner">
          <div class="stat-item">
            <span class="is-success">12</span>
            <p>Active Jobs</p>
          </div>
          <div class="stat-item">
            <span class="is-warning">4</span>
            <p>Expired Job</p>
          </div>
          <div class="stat-item">
            <span class="is-info">89</span>
            <p>Total Application</p>
          </div>
          <div class="stat-item">
            <span class="is-primary">141</span>
            <p>Total Reach</p>
          </div>
        </div>
      </div>
    </div>

    <div class="project-minimal-grid">
      <div class="grid-header">
        <h3>
          Projects {{ jobOpening.dataList.length }}
          {{ jobOpening.data.video_question.length }}
        </h3>
        <div class="filter">
          <span>Filter by</span>

          <VControl>
            <Multiselect
              :options="['Shipping Soon', 'In Progress', 'Blocked', 'Archived']"
              placeholder="Shipping Soon"
            />
          </VControl>
        </div>
      </div>

      <div
        class="columns is-multiline grid-body"
        v-for="(item, index) in jobOpening.dataList"
        :key="index"
      >
        <!--Project-->
        <div class="column is-4" @click="jobOpening.open(index)">
          <a class="grid-item">
            <div class="item-head">
              <span class="type" v-if="item.year_of_experience"
                >{{ item.year_of_experience }} Years of experiences</span
              >
              <span class="status is-success">{{ item.contract }}</span>
            </div>
            <div class="item-title">
              <h3>{{ item.job_title }}</h3>
              <div class="tags">
                <VSnack
                  v-if="item.video_question.length"
                  title="Video"
                  color="danger"
                  white
                  size="small"
                  icon="feather:video"
                >
                </VSnack>
                <VSnack
                  v-if="item.question.length"
                  title="Question"
                  color="warning"
                  white
                  size="small"
                  icon="feather:help-circle"
                >
                </VSnack>
              </div>
            </div>
            <div class="item-description">
              <p>
                {{ item.task }}
              </p>

              <div class="item-people">
                <VAvatarStack
                  size="small"
                  :avatars="[
                    { picture: '/demo/avatars/13.jpg' },
                    { color: 'info', initials: 'MZ' },
                    { picture: '/demo/avatars/12.jpg' },
                    { picture: '/images/avatars/svg/vuero-1.svg' },
                    { picture: '/demo/avatars/11.jpg' },
                    { color: 'info', initials: 'ZH' },
                    { picture: '/demo/avatars/12.jpg' },
                    { picture: '/images/avatars/svg/vuero-1.svg' },
                  ]"
                />

                <span class="label">{{ item.applicationdeadline }}</span>
              </div>
            </div>
          </a>
        </div>
        <!--Project-->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/projects/_projects.scss';
</style>
