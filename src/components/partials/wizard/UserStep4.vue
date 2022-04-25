<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import dayjs from 'dayjs'

import { useUserStore } from '/@src/stores/userStore'
const host = import.meta.env.VITE_API_BASE_URL

const userStore = useUserStore()
</script>

<template>
  <div class="step-content">
    <div class="step-title">
      <h2 class="dark-inverted">Make sure everything is good</h2>
      <p>You can go back to previous steps if you need to edit anything.</p>
    </div>

    <VLoader size="xl" class="project-preview-wrapper" :active="0" grey>
      <div class="project-preview-header"></div>

      <div class="project-preview-body">
        <div class="columns is-multiline">
          <div class="column is-12 is-tablet-100">
            <div class="edit-box">
              <h4>Description</h4>
              <VBlock>User Type: {{ userStore.userData.type }}</VBlock>
              <VBlock v-if="userStore.userData.type == 'student'"
                >Student ID: {{ userStore.userData.studentID }}</VBlock
              >
              <VBlock>Full Name: {{ userStore.userData.name }}</VBlock>
              <VBlock>Email: {{ userStore.userData.email }}</VBlock>
              <VBlock>Department: {{ userStore.userData.department }}</VBlock>
              <VBlock v-if="userStore.userData.type == 'teacher'"
                >Course: {{ userStore.userData.course }}</VBlock
              >
            </div>
          </div>
        </div>
      </div>
    </VLoader>
  </div>
</template>
