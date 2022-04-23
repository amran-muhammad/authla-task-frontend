<script setup lang="ts">
import { useCompany } from '/@src/stores/company'
import { useUserSession } from '/@src/stores/userSession'
const host = import.meta.env.VITE_API_BASE_URL
const company = useCompany()
const user = useUserSession()
</script>
<template>
  <VDropdown right spaced class="user-dropdown profile-dropdown">
    <template #button="{ toggle }">
      <a
        class="is-trigger dropdown-trigger"
        aria-haspopup="true"
        @click="toggle"
      >
        <VAvatar :picture="host + company.data.avatar" />
      </a>
    </template>

    <template #content>
      <div class="dropdown-head">
        <VAvatar size="large" :picture="host + company.extra_data.logo" />

        <div class="meta">
          <span>{{ company.extra_data.name }}</span>
          <span>{{ company.data.name }}</span>
        </div>
      </div>

      <router-link
        :to="{ name: 'company-profile-edit' }"
        role="menuitem"
        class="dropdown-item is-media"
      >
        <div class="icon">
          <VAvatar size="small" :picture="host + company.data.avatar" />
        </div>
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
