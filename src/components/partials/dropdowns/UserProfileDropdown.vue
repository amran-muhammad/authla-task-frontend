<script setup lang="ts">
import { useCompany } from '/@src/stores/company'
import { useUserSession } from '/@src/stores/userSession'
import { useUserStore } from '/@src/stores/userStore'
const host = import.meta.env.VITE_API_BASE_URL
const user = useUserSession()
const userStore = useUserStore()
</script>
<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #content>
      <div class="dropdown-head">
        <div class="meta">
          <span>{{ userStore.userData.name }}</span>
          <span>{{ userStore.userData.name }}</span>
        </div>
      </div>

      <router-link
        :to="{ name: 'profile-edit' }"
        role="menuitem"
        class="dropdown-item is-media"
      >
        <div class="icon"></div>
        <div class="meta">
          <span>Profile</span>
          <span>View your profile</span>
        </div>
      </router-link>

      <hr class="dropdown-divider" />

      <div class="dropdown-item is-button">
        <VButton
          class="logout-button"
          icon="feather:log-out"
          color="primary"
          role="menuitem"
          raised
          fullwidth
          @click="user.logoutUser"
        >
          Logout
        </VButton>
      </div>
    </template>
  </VDropdown>
</template>
