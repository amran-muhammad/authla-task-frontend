<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'

import useNotyf from '/@src/composable/useNotyf'
import { useCountries } from '/@src/assets/countries.json'
import { useUserSession } from '/@src/stores/userSession'
import axios from 'axios'
import { useUserStore } from '/@src/stores/userStore'
const host = import.meta.env.VITE_API_BASE_URL

const userSession = useUserSession()
const userStore = useUserStore()
const allcountries = useCountries

const isUploading = ref(false)
const isLoading = ref(false)
let floatingShow = ref(false)
const range = ref()

const notyf = useNotyf()
const { y } = useWindowScroll()

const date = ref({
  start: new Date(),
  end: new Date(),
})

const isScrolling = computed(() => {
  return y.value > 30
})

let old_data: string = ''

const addExperience = async () => {
  isUploading.value = false
  onSave()
}
function ValidateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}
const onSave = async () => {
  isLoading.value = true
  if (!ValidateEmail(userStore.userData.email)) {
    isLoading.value = false
    return notyf.error('Incorrect company email format!')
  }
  let result = await userSession.updateProfile()
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
          <h3>Inforation</h3>
          <p>Edit your information</p>
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
          <h4>Add a schedule</h4>
        </div>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Company Name</label>
              <VControl icon="feather:user">
                <input
                  v-model="userStore.userData.name"
                  type="text"
                  class="input"
                  placeholder="Company Name"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Company Email</label>
              <VControl icon="feather:mail">
                <input
                  v-model="userStore.userData.email"
                  type="text"
                  class="input"
                  placeholder="Company Email"
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
