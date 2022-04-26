<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useUserStore } from '/@src/stores/userStore'

import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'
import { useViaPlaceholderError } from '/@src/composable/useViaPlaceholderError'
import { useUserSession } from '/@src/stores/userSession'
import axios from 'axios'
import { useCountryMobile } from '/@src/assets/countrymobile.json'
const host = import.meta.env.VITE_API_BASE_URL

const allcountries = useCountryMobile

const userStore = useUserStore()
const isUploading = ref(false)
const isLoading = ref(false)

const notyf = useNotyf()
const { y } = useWindowScroll()

const isScrolling = computed(() => {
  return y.value > 30
})

function ValidateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}

const onSave = () => {
  isLoading.value = true
  userStore.edit_data._id = userStore.userData.id
  userStore.edit_data.name = userStore.userData.name
  userStore.edit_data.email = userStore.userData.email
  userStore.edit_data.department = userStore.userData.department
  userStore.edit_data.course = userStore.userData.course
  userStore.edit_data.studentID = userStore.userData.studentID
  userStore.edit_data.status = userStore.userData.status
  userStore.edit_data.type = userStore.userData.type
  userStore.updateUser().then(() => {
    isLoading.value = false
  })
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
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Full Name</label>
              <VControl icon="feather:user">
                <input
                  v-model="userStore.userData.name"
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
                  v-model="userStore.userData.email"
                  type="text"
                  class="input"
                  placeholder="Email"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Department</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select v-model="userStore.userData.department">
                    <option value="Advertising and marketing">
                      Advertising and marketing
                    </option>
                    <option value="Aerospace">Aerospace</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Business Consultation">
                      Business Consultation
                    </option>
                    <option value="Computer and technology">
                      Computer and technology
                    </option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Energy">Energy</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Finance and economic">
                      Finance and economic
                    </option>
                    <option value="Food and beverage">Food and beverage</option>
                    <option value="Health care">Health care</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media and news">Media and news</option>
                    <option value="Mining">Mining</option>
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other industries">Other industries</option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-archway"></i>
                </div>
              </VControl>
            </VField>
          </div>
          <div v-if="userStore.userData.type == 'teacher'" class="column is-6">
            <VField>
              <label>Course</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select v-model="userStore.userData.course">
                    <option value="Advertising and marketing">
                      Advertising and marketing
                    </option>
                    <option value="Aerospace">Aerospace</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Business Consultation">
                      Business Consultation
                    </option>
                    <option value="Computer and technology">
                      Computer and technology
                    </option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Energy">Energy</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Finance and economic">
                      Finance and economic
                    </option>
                    <option value="Food and beverage">Food and beverage</option>
                    <option value="Health care">Health care</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media and news">Media and news</option>
                    <option value="Mining">Mining</option>
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other industries">Other industries</option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-archway"></i>
                </div>
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
