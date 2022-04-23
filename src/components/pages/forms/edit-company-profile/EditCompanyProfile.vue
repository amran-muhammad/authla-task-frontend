<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'

import useNotyf from '/@src/composable/useNotyf'
import { useCompany } from '/@src/stores/company'
import { useCountries } from '/@src/assets/countries.json'
import { useUserSession } from '/@src/stores/userSession'
import axios from 'axios'
const host = import.meta.env.VITE_API_BASE_URL

const company: any = useCompany()
const userSession = useUserSession()
const allcountries = useCountries
const setTimezone = (value: any) => {
  if (value) {
    let f = allcountries.findIndex((element) => element.value === value)
    company.extra_data.timezone = allcountries[f].timezones[0]
  }
}
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
const onAddFile = async (error: any, fileInfo: any) => {
  if (error) {
    notyf.error(`${error.main}: ${error.sub}`)
    console.error(error)
    return
  }

  const _file = fileInfo.file as File
  if (_file) {
    let formData = new FormData()
    if (old_data != '') {
      formData.append('old_file', old_data)
    }
    formData.append('file', _file)
    let res: any = await axios.post(
      import.meta.env.VITE_API_BASE_URL +
        '/job-application-question/v1/company-profile-upload',
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
      }
    )
    if (res.status == 200) {
      company.extra_data.logo = res.data.data
      old_data = res.data.data

      notyf.success(res.data.msg)
    }
  }
}
const onRemoveFile = (error: any, file: any) => {
  if (error) {
    console.error(error)
    return
  }

  company.extra_data.logo = null
}
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
  if (!ValidateEmail(company.extra_data.email)) {
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
          <h3>Company Inforation</h3>
          <p>Edit your company information</p>
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
          <h4>Company Logo</h4>
          <p>This is how others will recognize your company</p>
        </div>

        <VAvatar size="xl" class="profile-v-avatar">
          <template #avatar>
            <img
              v-if="!isUploading"
              class="avatar"
              :src="host + company.extra_data.logo"
              alt=""
            />
            <!-- @error.once="(event) => useViaPlaceholderError(event, '150x150')" -->
            <VFilePond
              v-else
              class="profile-filepond"
              name="profile_filepond"
              :chunk-retry-delays="[500, 1000, 3000]"
              label-idle="<i class='lnil lnil-cloud-upload'></i>"
              :accepted-file-types="['image/png', 'image/jpeg', 'image/gif']"
              :image-preview-height="140"
              :image-resize-target-width="140"
              :image-resize-target-height="140"
              image-crop-aspect-ratio="1:1"
              style-panel-layout="compact circle"
              style-load-indicator-position="center bottom"
              style-progress-indicator-position="right bottom"
              style-button-remove-item-position="left bottom"
              style-button-process-item-position="right bottom"
              @addfile="onAddFile"
              @removefile="onRemoveFile"
            />
            <VIconButton
              v-if="!isUploading"
              icon="feather:edit-2"
              class="edit-button is-edit"
              circle
              @click="isUploading = true"
            />
            <VIconButton
              v-else
              icon="feather:arrow-left"
              class="edit-button is-back"
              circle
              @click="isUploading = false"
            />
          </template>
        </VAvatar>
      </div>
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Company Info</h4>
          <p>This can help you to win some opportunities</p>
        </div>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Company Name</label>
              <VControl icon="feather:user">
                <input
                  v-model="company.extra_data.name"
                  type="text"
                  class="input"
                  placeholder="Company Name"
                  autocomplete="given-name"
                  @blur="floatingShow = false"
                  @focus="floatingShow = true"
                />
                <p v-if="floatingShow" class="help is-info">
                  If you edit the company name, your previous company public
                  link will no longer work. It will be updated acording to the
                  company name
                </p>
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Company Email</label>
              <VControl icon="feather:mail">
                <input
                  v-model="company.extra_data.email"
                  type="text"
                  class="input"
                  placeholder="Company Email"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Company Location</label>
              <VControl icon="feather:map-pin">
                <input
                  v-model="company.extra_data.address"
                  type="text"
                  placeholder="Company Location"
                  class="input"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Country</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select
                    v-model="company.extra_data.country"
                    @click="setTimezone(company.extra_data.country)"
                  >
                    <option
                      v-for="(item, index) in allcountries"
                      :key="index"
                      :value="item.value"
                    >
                      {{ item.value }}
                    </option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-globe"></i>
                </div>
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Timezone</label>
              <VControl>
                <VMessage class="input">{{
                  company.extra_data.timezone
                }}</VMessage>
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Industry Type</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select v-model="company.extra_data.industry">
                    <option value="">
                      {{ company.extra_data.industry }}
                    </option>
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
      <!--Fieldset-->
      <div class="fieldset">
        <div class="columns is-multiline">
          <div class="column is-6">
            <VField>
              <label>Company Website</label>
              <VControl icon="feather:map-pin">
                <input
                  v-model="company.extra_data.website"
                  type="text"
                  placeholder="Company Website"
                  class="input"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Company Description</label>
              <VControl>
                <textarea
                  v-model="company.extra_data.description"
                  class="textarea"
                  rows="4"
                ></textarea>
                <p
                  v-if="company.extra_data.description.length === 0"
                  class="help"
                >
                  Minimum of 50 characters
                </p>
                <p
                  v-else-if="company.extra_data.description.length === 49"
                  class="help"
                >
                  {{ 50 - company.extra_data.description.length }} character
                  remaining
                </p>
                <p
                  v-else-if="company.extra_data.description.length < 50"
                  class="help"
                >
                  {{ 50 - company.extra_data.description.length }} characters
                  remaining
                </p>
              </VControl>
            </VField>
          </div>
        </div>
      </div>
      <!--Fieldset-->
      <div class="fieldset">
        <div class="fieldset-heading">
          <h4>Social Profiles</h4>
          <p>This can help others finding you on social media</p>
        </div>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Linked In</label>
              <VControl icon="fab fa-linkedin">
                <input
                  v-model="company.extra_data.linkedin"
                  type="text"
                  class="input"
                  placeholder="LinkedIn URL"
                  inputmode="url"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Facebook</label>
              <VControl icon="fab fa-facebook-f">
                <input
                  v-model="company.extra_data.facebook"
                  type="text"
                  class="input"
                  placeholder="Facebook URL"
                  inputmode="url"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Twitter</label>
              <VControl icon="fab fa-twitter">
                <input
                  v-model="company.extra_data.twitter"
                  type="text"
                  class="input"
                  placeholder="Twitter URL"
                  inputmode="url"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Instagram</label>
              <VControl icon="fab fa-instagram">
                <input
                  v-model="company.extra_data.instagram"
                  type="text"
                  class="input"
                  placeholder="Instagram URL"
                  inputmode="url"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
