<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useCompany } from '/@src/stores/company'

import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'
import { useViaPlaceholderError } from '/@src/composable/useViaPlaceholderError'
import { useUserSession } from '/@src/stores/userSession'
import axios from 'axios'
import { useCountryMobile } from '/@src/assets/countrymobile.json'
const host = import.meta.env.VITE_API_BASE_URL

const allcountries = useCountryMobile

const company = useCompany()
const isUploading = ref(false)
const isLoading = ref(false)

const notyf = useNotyf()
const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 30
})
const userSession = useUserSession()

let old_data: string = ''

function ValidateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}

const onSave = async () => {
  isLoading.value = true
  if (!ValidateEmail(company.data.email)) {
    isLoading.value = false
    return notyf.error('Incorrect personal email format!')
  }
  let result = await userSession.updateProfile(company.editPhone)
  if (result == true) {
    notyf.success('Your changes have been successfully saved!')
    isLoading.value = false
  } else {
    notyf.error('Sorry, update process is failed!')
    isLoading.value = false
  }
}
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>Personal Info</h3>
          <p>Edit your account's personal information</p>
        </div>
        <div class="right">
          <div class="buttons">
            <VButton
              :to="{ name: 'dashboard' }"
              icon="lnir lnir-arrow-left rem-100"
              light
              dark-outlined
            >
              Go Back
            </VButton>
            <VButton
              color="primary"
              raised
              :loading="isLoading"
              @click="onSave"
            >
              Save Changes
            </VButton>
          </div>
        </div>
      </div>
    </div>
    <div class="form-body">
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Personal Info</h4>
          <p>Others diserve to know you more</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Full Name</label>
              <VControl icon="feather:user">
                <input
                  v-model="company.data.name"
                  type="text"
                  class="input"
                  placeholder="Full Name"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Email</label>
              <VControl icon="feather:mail">
                <input
                  v-model="company.data.email"
                  type="text"
                  class="input"
                  placeholder="Email"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.addons-custom .form-icon {
  z-index: 111 !important;
}
</style>
