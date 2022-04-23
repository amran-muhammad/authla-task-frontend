<script setup lang="ts">
import useNotyf from '/@src/composable/useNotyf'
import { useCompany } from '/@src/stores/company'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'

import * as yup from 'yup'
import axios from 'axios'
const host = import.meta.env.VITE_API_BASE_URL

const { t } = useI18n()
// Define a validation schema
const schema = yup.object({
  cname: yup.string().required(t('Company Name is required')),
  description: yup
    .string()
    .max(50, 'Company Description must be at least 50 characters.')
    .min(160, 'Company Description has a maximum limit of 160 characters.')
    .required(t('Company Description is required')),
  cemail: yup
    .string()
    .required(t('auth.errors.cemail.required'))
    .email(t('Company email is required')),
})

const notyf = useNotyf()
const company: any = useCompany()

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
      host + '/job-application-question/v1/company-profile-upload',
      formData,
      {
        headers: { 'content-type': 'multipart/form-data' },
      }
    )
    if (res.status == 200) {
      old_data = res.data.data

      notyf.success(res.data.msg)
    }
  }
}

const onRemoveFile = (error: any, fileInfo: any) => {
  if (error) {
    notyf.error(error)
    console.error(error)
    return
  }
}
</script>

<template>
  <div class="step-content">
    <div class="step-title">
      <h2>Company information</h2>
      <p>Tell us about your company</p>
    </div>

    <div class="project-info">
      <div class="project-info-head">
        <div class="project-avatar-upload"></div>
        <div class="project-budget p-b-20"></div>
      </div>
    </div>
  </div>
</template>
