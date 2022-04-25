<script setup lang="ts">
import { useScheduleStore } from '/@src/stores/scheduleStore'

import { useRouter } from 'vue-router'
const router = useRouter()
const scheduleStore = useScheduleStore()
</script>
<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content>
      <a
        role="menuitem"
        class="dropdown-item is-media"
        @click="scheduleStore.bookingViewModal = true"
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-eye"></i>
        </div>
        <div class="meta">
          <span>Accept</span>
          <span>Accept the application</span>
        </div>
      </a>

      <hr class="dropdown-divider" />

      <a
        class="dropdown-item is-media"
        @click="scheduleStore.bookingDeleteModal = true"
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
