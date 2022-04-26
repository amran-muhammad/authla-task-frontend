<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { computed, ref } from 'vue'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'

const notyf = useNotyf()
const { y } = useWindowScroll()

const isLoading = ref(false)

const isScrolling = computed(() => {
  return y.value > 30
})
let retype_new_password = ref('')
function changeTypeOfPassword() {
  let x: any = document.getElementById('_old_password')
  if (x.type === 'password') {
    x.type = 'text'
  } else {
    x.type = 'password'
  }
}
function changeTypeOfNewPassword() {
  let newPasswordHTML: any = document.getElementById('_new_password')
  if (newPasswordHTML.type === 'password') {
    newPasswordHTML.type = 'text'
  } else {
    newPasswordHTML.type = 'password'
  }
}

const onSave = async () => {
  isLoading.value = true
  isLoading.value = false
}
</script>

<template>
  <div class="account-box is-form is-footerless">
    <div class="form-head stuck-header" :class="[isScrolling && 'is-stuck']">
      <div class="form-head-inner">
        <div class="left">
          <h3>Settings</h3>
          <p>Edit your account prefs and settingss</p>
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
    <form class="form-body" @submit.prevent="onSave">
      <!--Fieldset-->
      <div class="fieldset m-b-100">
        <table class="table is-fullwidth">
          <thead>
            <tr>
              <th scope="col">Email Section</th>
              <th scope="col" class="is-end">
                <div class="dark-inverted is-flex is-justify-content-flex-end">
                  On/Off
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <i
                  aria-hidden="true"
                  class="iconify m-r-5"
                  data-icon="feather:check"
                ></i>
                Accept
              </td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VControl>
                    <VSwitchSegment
                      label-true="Show"
                      color="primary"
                      v-model="company.extra_data.email_accept"
                    />
                  </VControl>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <i
                  aria-hidden="true"
                  class="iconify m-r-5"
                  data-icon="feather:x"
                ></i
                >Reject
              </td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VControl>
                    <VSwitchSegment
                      label-true="Show"
                      color="primary"
                      v-model="company.extra_data.email_reject"
                    />
                  </VControl>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <i
                  aria-hidden="true"
                  class="iconify m-r-5"
                  data-icon="feather:file-text"
                ></i>
                Sortlisted
              </td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VControl>
                    <VSwitchSegment
                      label-true="Show"
                      color="primary"
                      v-model="company.extra_data.email_sortlisted"
                    />
                  </VControl>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <i
                  aria-hidden="true"
                  class="iconify m-r-5"
                  data-icon="feather:calendar"
                ></i>
                Interview
              </td>
              <td class="is-end">
                <div class="is-flex is-justify-content-flex-end">
                  <VControl>
                    <VSwitchSegment
                      label-true="Show"
                      color="primary"
                      v-model="company.extra_data.email_interview"
                    />
                  </VControl>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="fieldset-heading">
          <h4>Change Password</h4>
          <p>For an improved account security</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->

          <div class="column is-12">
            <VField>
              <VControl icon="feather:unlock">
                <input
                  @keyup="error_old_password = false"
                  v-model="company.password_data.old_password"
                  type="password"
                  class="input"
                  id="_old_password"
                  placeholder="Old Password"
                  autocomplete="current-password"
                />
                <VCheckbox
                  @click="changeTypeOfPassword"
                  class="help p-t-5"
                  label="Show Password"
                />
                <VMessage
                  @click="error_old_password = false"
                  closable
                  v-if="error_old_password"
                  class="is-danger m-t-10"
                  >{{ errorMessage }}</VMessage
                >
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input
                  @keyup="error_new_password = false"
                  v-model="company.password_data.new_password"
                  type="password"
                  class="input"
                  id="_new_password"
                  placeholder="New Password"
                  autocomplete="new-password"
                />
                <VCheckbox
                  @click="changeTypeOfNewPassword"
                  class="help p-t-5"
                  label="Show Password"
                />
                <VMessage
                  @click="error_new_password = false"
                  closable
                  v-if="error_new_password"
                  class="is-danger m-t-10"
                  >{{ errorMessage }}</VMessage
                >
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl icon="feather:lock">
                <input
                  @keyup="
                    ;(error_retype_new_password = false),
                      (error_retype_new_password_unmatch = false)
                  "
                  v-model="retype_new_password"
                  type="password"
                  class="input"
                  placeholder="Repeat New Password"
                  autocomplete="new-password"
                />
                <VMessage
                  @click="error_retype_new_password = false"
                  closable
                  v-if="error_retype_new_password"
                  class="is-danger m-t-10"
                  >{{ errorMessage }}</VMessage
                >
                <VMessage
                  @click="error_retype_new_password_unmatch = false"
                  closable
                  v-if="error_retype_new_password_unmatch"
                  class="is-danger m-t-10"
                  >{{ errorMessage }}</VMessage
                >
              </VControl>
            </VField>
          </div>
        </div>
      </div>

      <!--Fieldset-->
      <div v-if="false" class="fieldset">
        <div class="fieldset-heading">
          <h4>2 Factor Auth</h4>
          <p>Enable or disable 2 factor auth</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl>
                <VSwitchBlock
                  v-model="twoFactor"
                  label="Enable / disable 2 factor"
                  color="primary"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div v-if="twoFactor" class="column is-12">
            <VField>
              <VControl icon="feather:smartphone">
                <input
                  type="text"
                  class="input"
                  placeholder="Phone Number"
                  autocomplete="tel"
                  inputmode="tel"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>

      <!--Fieldset-->
      <div v-if="false" class="fieldset">
        <div class="fieldset-heading">
          <h4>Notifications</h4>
          <p>Configure how you receive notifications</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl>
                <VSwitchBlock
                  v-model="notifications"
                  label="Disable all notifications"
                  color="primary"
                />
              </VControl>
            </VField>

            <VField>
              <VControl>
                <VSwitchBlock
                  v-model="notificationsLow"
                  label="Disable low priority notifications"
                  color="primary"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>

      <!--Fieldset-->
      <div v-if="false" class="fieldset">
        <div class="fieldset-heading">
          <h4>Marketing</h4>
          <p>Configure how you receive promotions</p>
        </div>

        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-12">
            <VField>
              <VControl>
                <VSwitchBlock
                  v-model="marketing"
                  label="Enable marketing emails"
                  color="primary"
                />
              </VControl>
            </VField>
            <VField>
              <VControl>
                <VSwitchBlock
                  v-model="partners"
                  label="Enable partners emails"
                  color="primary"
                />
              </VControl>
            </VField>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
