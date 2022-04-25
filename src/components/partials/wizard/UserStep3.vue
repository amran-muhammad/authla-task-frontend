<script setup lang="ts">
import { computed, ref } from 'vue'

import { useCompany } from '/@src/stores/company'
import { useUserStore } from '/@src/stores/userStore'
import { useCountries } from '/@src/assets/countries.json'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'

const search = ref('')
const company = useCompany()
const userStore = useUserStore()

const { t } = useI18n()
// Define a validation schema
const schema = yup.object({
  address: yup.string().required(t('Company Location is required')),
})
const allcountries = useCountries
const setTimezone = (value: any) => {
  if (value) {
    let f = allcountries.findIndex((element) => element.value === value)
  }
}

let checkbox = (event: any) => {
  if (event.target.checked) {
    console.log(checked)
  }
}

let checked = false
</script>

<template>
  <div class="step-content">
    <div class="step-title">
      <h2 class="dark-inverted">Add more details</h2>
      <p>Tell us about your company more you'd like us to know</p>
    </div>

    <div class="project-info">
      <div class="project-budget p-b-20 p-t-20">
        <div class="form-body">
          <!--Fieldset-->
          <div class="fieldset">
            <div class="columns is-multiline">
              <div class="column is-12">
                <VField>
                  <label>Department</label>
                  <VControl class="has-icons-left">
                    <div class="select">
                      <select v-model="userStore.userData.department">
                        <option value="">
                          {{ userStore.userData.department }}
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
                        <option value="Food and beverage">
                          Food and beverage
                        </option>
                        <option value="Health care">Health care</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Media and news">Media and news</option>
                        <option value="Mining">Mining</option>
                        <option value="Pharmaceutical">Pharmaceutical</option>
                        <option value="Telecommunication">
                          Telecommunication
                        </option>
                        <option value="Transportation">Transportation</option>
                        <option value="Other industries">
                          Other industries
                        </option>
                      </select>
                    </div>
                    <div class="icon is-small is-left">
                      <i class="fas fa-archway"></i>
                    </div>
                  </VControl>
                </VField>
              </div>
              <div
                v-if="userStore.userData.type == 'teacher'"
                class="column is-12"
              >
                <VField>
                  <label>Course Name</label>
                  <VControl class="has-icons-left">
                    <div class="select">
                      <select v-model="userStore.userData.course">
                        <option value="">
                          {{ userStore.userData.course }}
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
                        <option value="Food and beverage">
                          Food and beverage
                        </option>
                        <option value="Health care">Health care</option>
                        <option value="Hospitality">Hospitality</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Media and news">Media and news</option>
                        <option value="Mining">Mining</option>
                        <option value="Pharmaceutical">Pharmaceutical</option>
                        <option value="Telecommunication">
                          Telecommunication
                        </option>
                        <option value="Transportation">Transportation</option>
                        <option value="Other industries">
                          Other industries
                        </option>
                      </select>
                    </div>
                    <div class="icon is-small is-left">
                      <i class="fas fa-archway"></i>
                    </div>
                  </VControl>
                </VField>
              </div>
              <div
                v-if="userStore.userData.type == 'student'"
                class="column is-12"
              >
                <VField>
                  <label>Student ID</label>
                  <VControl icon="feather:user">
                    <input
                      v-model="userStore.userData.studentID"
                      type="text"
                      class="input"
                      placeholder="Student ID"
                      autocomplete="given-name"
                      @blur="floatingShow = false"
                      @focus="floatingShow = true"
                    />
                  </VControl>
                </VField>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
</style>