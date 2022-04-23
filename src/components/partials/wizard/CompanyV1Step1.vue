<script setup lang="ts">
import useNotyf from '/@src/composable/useNotyf'
import { useCompany } from '/@src/stores/company'
import { useI18n } from 'vue-i18n'
import { Form, Field } from 'vee-validate'
import { useCountryMobile } from '/@src/assets/countrymobile.json'

import * as yup from 'yup'
const allcountries = useCountryMobile
const { t } = useI18n()
// Define a validation schema
const schema = yup.object({
  name: yup
    .string()
    .required(t('auth.errors.name.required'))
    .min(5, t('auth.errors.password.length')),
  email: yup
    .string()
    .required(t('auth.errors.email.required'))
    .email(t('auth.errors.email.format')),
  password: yup
    .string()
    .required(t('auth.errors.password.required'))
    .min(8, t('auth.errors.password.length')),
  passwordCheck: yup
    .string()
    .required(t('auth.errors.passwordCheck.required'))
    .oneOf([yup.ref('password')], t('auth.errors.passwordCheck.match')),
})
const notyf = useNotyf()
const company = useCompany()
function showPassword() {
  let x: any = document.getElementById('_id_show_password')
  let icon_eye: any = document.getElementById('icon_eye')

  if (x.type === 'password') {
    x.type = 'text'
    icon_eye.className = 'eye far fa-eye-slash'
  } else {
    x.type = 'password'
    icon_eye.className = 'eye far fa-eye'
  }
}
</script>

<template>
  <div class="step-content">
    <div class="step-title">
      <h2>Personal Information</h2>
      <p>We're glad you're here. Tell us a bit about yourself.</p>
      <p>Let's set up your personal account</p>
    </div>

    <div class="project-info form-layout">
      <div class="project-info-head">
        <div class="project-budget p-b-20">
          <div class="p-t-15">
            <Field v-slot="{ field, errorMessage }" name="name">
              <VField>
                <label>Full Name</label>
                <VControl
                  icon="feather:user"
                  :has-error="Boolean(errorMessage)"
                >
                  <input
                    v-model="company.data.name"
                    v-bind="field"
                    class="input"
                    type="text"
                    required="true"
                    is-valid
                  />
                  <p v-if="errorMessage" class="help is-danger">
                    {{ errorMessage }}
                  </p>
                </VControl>
              </VField>
            </Field>
          </div>

          <div class="p-t-15">
            <Field v-slot="{ field, errorMessage }" name="email">
              <VField>
                <label>Email</label>
                <VControl
                  icon="feather:mail"
                  :has-error="Boolean(errorMessage)"
                >
                  <input
                    v-model="company.data.email"
                    v-bind="field"
                    class="input"
                    type="text"
                    autocomplete="email"
                  />
                  <p v-if="errorMessage" class="help is-danger">
                    {{ errorMessage }}
                  </p>
                </VControl>
              </VField>
            </Field>
          </div>
          <div class="p-t-15">
            <!-- Input -->
            <Field v-slot="{ field, errorMessage }" name="password">
              <VField>
                <label>Password</label>
                <VControl
                  icon="feather:lock"
                  :has-error="Boolean(errorMessage)"
                >
                  <input
                    v-model="company.data.password"
                    v-bind="field"
                    class="input"
                    type="password"
                    id="_id_show_password"
                    :placeholder="t('auth.placeholder.password')"
                    autocomplete="new-password"
                  />
                  <p v-if="errorMessage" class="help is-danger">
                    {{ errorMessage }}
                  </p>
                  <i
                    id="icon_eye"
                    @click="showPassword"
                    class="eye far fa-eye"
                  ></i>
                </VControl>
              </VField>
            </Field>
          </div>
          <div class="p-t-15">
            <!-- Input -->
            <Field v-slot="{ field, errorMessage }" name="passwordCheck">
              <VField>
                <label>Retype Password</label>
                <VControl
                  icon="feather:lock"
                  :has-error="Boolean(errorMessage)"
                >
                  <input
                    v-model="company.pchek"
                    v-bind="field"
                    class="input"
                    type="password"
                    :placeholder="t('auth.placeholder.passwordCheck')"
                  />
                  <p v-if="errorMessage" class="help is-danger">
                    {{ errorMessage }}
                  </p>
                </VControl>
              </VField>
            </Field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.eye {
  position: absolute;
  right: 25px;
  top: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  color: #d0d0d0;
  padding: 3px;
  &:hover {
    opacity: 0.7;
  }
}
</style>
