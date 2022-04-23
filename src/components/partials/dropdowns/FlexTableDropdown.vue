<script setup lang="ts">
import { useJobApplication } from '/@src/stores/jobApplication'
import { useRouter } from 'vue-router'
const router = useRouter()

let job_application = useJobApplication()
</script>
<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content>
      <a
        role="menuitem"
        class="dropdown-item is-media"
        @click="job_application.gotoCompanyDetails"
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-eye"></i>
        </div>
        <div class="meta">
          <span>View</span>
          <span>View user details</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a
        class="dropdown-item is-media"
        @click="job_application.jobApplicationDeleteModal = true"
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-trash-can-alt"></i>
        </div>
        <div class="meta">
          <span>Remove</span>
          <span>Remove from list</span>
        </div>
      </a>
    </template>
  </VDropdown>
</template>
