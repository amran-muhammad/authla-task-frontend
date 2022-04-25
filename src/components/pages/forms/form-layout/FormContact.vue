<script setup lang="ts">
import { Notyf } from 'notyf'
import { ref } from 'vue'
import { useCompany } from '/@src/stores/company'
import { useCountryMobile } from '/@src/assets/countrymobile.json'
import common from '/@src/stores/action/common'
const host = import.meta.env.VITE_API_BASE_URL
const company = useCompany()
const notyf = new Notyf()
const isLoading = ref(false)
const allcountries = useCountryMobile
function ValidateEmail(mail: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true
  }
  return false
}
let countryDialCode = ref('+974')

async function send() {
  if (company.contact_form.name == '') {
    return notyf.error('Name is required')
  } else if (company.contact_form.email == '') {
    return notyf.error('Email is required')
  } else if (!ValidateEmail(company.contact_form.email)) {
    return notyf.error('You have entered an invalid email address!')
  } else if (company.contact_form.phone == '') {
    return notyf.error('Phone is required')
  } else if (company.contact_form.subject == '') {
    return notyf.error('Subject is required')
  } else if (company.contact_form.message == '') {
    return notyf.error('Message is required')
  }
  isLoading.value = true
  try {
    company.contact_form.phone =
      countryDialCode.value + company.contact_form.phone
    let res: any = await common.postApi(
      'send/contact-message',
      company.contact_form
    )
    if (res.status == 200) {
      isLoading.value = false
      company.resetContactForm()
      return notyf.success({
        message: res.data.msg,
        duration: 7000,
      })
    }
  } catch (error) {
    isLoading.value = false
    return notyf.error('Fill up all the info properly!')
  }
}
</script>

<template>
  <form class="form-layout is-separate" @submit.prevent="send">
    <div class="form-outer">
      <div class="form-body">
        <div class="form-section">
          <div class="form-section-inner left-card"></div>
        </div>
        <div class="form-section">
          <div class="form-section-inner has-padding-bottom">
            <h3 class="has-text-centered">Let’s Connect</h3>
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField>
                  <label>Name</label>
                  <VControl icon="feather:user">
                    <input
                      v-model="company.contact_form.name"
                      type="text"
                      class="input"
                      placeholder=""
                      autocomplete="given-name"
                    />
                  </VControl>
                </VField>
              </div>

              <div class="column is-12">
                <VField>
                  <label>Email Address</label>
                  <VControl icon="feather:mail">
                    <input
                      v-model="company.contact_form.email"
                      type="email"
                      class="input"
                      placeholder=""
                      autocomplete="email"
                      inputmode="email"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField>
                  <label>Phone</label>
                </VField>
                <VField addons>
                  <VControl expanded>
                    <VField addons>
                      <VControl>
                        <VControl>
                          <div class="select" style="max-width: 100px">
                            <select v-model="countryDialCode">
                              <option
                                v-for="(item, index) in allcountries"
                                :key="index"
                                :value="item.dial_code"
                              >
                                {{ item.flag }}
                                {{ item.dial_code }}
                                <!-- {{ item.name }} -->
                              </option>
                            </select>
                          </div>
                        </VControl>
                      </VControl>
                      <VControl :has-error="Boolean(errorMessage)" expanded>
                        <input
                          v-model="company.contact_form.phone"
                          class="input"
                          type="number"
                        />
                      </VControl>
                    </VField>
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField>
                  <label>Subject</label>
                  <VControl>
                    <input
                      v-model="company.contact_form.subject"
                      type="tel"
                      class="input"
                      placeholder=""
                      autocomplete="tel"
                      inputmode="tel"
                    />
                  </VControl>
                </VField>
              </div>
              <div class="column is-12">
                <VField>
                  <label>How can we help?</label>
                  <VControl>
                    <textarea
                      v-model="company.contact_form.message"
                      class="textarea"
                      rows="4"
                    ></textarea>
                  </VControl>
                </VField>
              </div>
            </div>
            <div class="button-wrap">
              <VButton
                :loading="isLoading"
                @click="send()"
                color="primary"
                bold
                raised
                fullwidth
              >
                Send your message
              </VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/generic/_forms.scss';
.second_sction_img {
  position: absolute;
  bottom: 26px;
  max-width: 470px;
  left: 91px;
}
.form-section-inner {
  min-height: 620px;
  background-color: #fffaf5 !important;
  border: 0 !important;
}

// On Mobile
@media only screen and (max-width: 767px) {
  .left-card {
    display: none !important;
  }
}
</style>
