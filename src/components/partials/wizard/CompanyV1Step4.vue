<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import dayjs from 'dayjs'

import { useCompany } from '/@src/stores/company'
const host = import.meta.env.VITE_API_BASE_URL

const company = useCompany()

const capitalize = (string: string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1)
}

const projectPicture = ref('')

watchEffect(async () => {
  try {
    projectPicture.value = await new Promise((resolve, reject) => {
      if (company.data.avatar) {
        const reader = new FileReader()
        reader.readAsDataURL(company.data.avatar)
        reader.onload = () => resolve(reader.result?.toString() || '')
        reader.onerror = (error) => reject(error)
      } else {
        // testing
        projectPicture.value = ''
      }
    })
  } catch (error) {
    projectPicture.value = ''
  }
})
</script>

<template>
  <div class="step-content">
    <div class="step-title">
      <h2 class="dark-inverted">Make sure everything is good</h2>
      <p>You can go back to previous steps if you need to edit anything.</p>
    </div>

    <VLoader
      size="xl"
      class="project-preview-wrapper"
      :active="company.loading"
      grey
    >
      <div class="project-preview-header"></div>

      <div class="project-preview-body">
        <div class="columns is-multiline">
          <div class="column is-12 is-tablet-100">
            <div class="edit-box">
              <h4>Description</h4>

              <a class="edit-icon" @click="company.setStep(2)">
                <i aria-hidden="true" class="lnil lnil-pencil"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </VLoader>
  </div>
</template>
