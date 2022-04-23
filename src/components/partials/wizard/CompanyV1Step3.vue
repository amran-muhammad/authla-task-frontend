<script setup lang="ts">
import { computed, ref } from 'vue'

import { useCompany } from '/@src/stores/company'
import { useCountries } from '/@src/assets/countries.json'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'
import * as yup from 'yup'

const search = ref('')
const company = useCompany()

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
      <div class="project-budget p-b-20 p-t-20"></div>
    </div>
  </div>
</template>
<style>
</style>