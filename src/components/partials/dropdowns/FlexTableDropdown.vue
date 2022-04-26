<script setup lang="ts">
import { useScheduleStore } from '/@src/stores/scheduleStore'

import { useRouter } from 'vue-router'
import { useUserStore } from '/@src/stores/userStore'
const router = useRouter()
const scheduleStore = useScheduleStore()
const userStore = useUserStore()
</script>
<template>
  <VDropdown icon="feather:more-vertical" class="is-pushed-mobile" spaced right>
    <template #content>
      <a
        v-if="
          userStore.userData.type == 'admin' ||
          userStore.userData.type == 'teacher'
        "
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
        v-if="
          userStore.userData.type == 'admin' ||
          userStore.userData.type == 'teacher'
        "
        role="menuitem"
        class="dropdown-item is-media"
        @click="scheduleStore.bookingViewRejectedModal = true"
      >
        <div class="icon">
          <i aria-hidden="true" class="lnil lnil-eye"></i>
        </div>
        <div class="meta">
          <span>Reject</span>
          <span>Reject the application</span>
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
