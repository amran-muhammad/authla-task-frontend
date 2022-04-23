/**
 * Theses types are used by the Wizard form
 *
 * @see /src/pages/wizard-v1.vue
 * @see /src/components/partials/wizard
 */
// import type { Ref } from 'vue'

export type WizardRelatedTo = 'UI/UX Design' | 'Web Development' | 'Marketing' | 'Consultancy'

export interface WizardData {
  personal_fullname: string
  personal_phone: string
  personal_email: string
  personal_password: string
  company_name: string
  country: string
  email: string
  timezone: string
  number_of_employee: string
  company_location: string
  description: string
  logo: File | null
  industry: WizardRelatedTo
}
export interface ErrData {
  personal_fullname: boolean
  personal_phone: boolean
  personal_email: boolean
  personal_password: boolean
  company_name: boolean
  country: boolean
  email: boolean
  number_of_employee: boolean
  company_location: boolean
  description: boolean
}
