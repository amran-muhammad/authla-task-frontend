import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'

/**
 * Using typescript types allow better developer experience
 * with autocompletion and compiler error prechecking
 */
import type { WizardData } from '/@src/models/wizard'
import type { ErrData } from '/@src/models/wizard'
import sleep from '/@src/utils/sleep'

export const useWizard = defineStore('wizard', () => {
  const step = ref(1)
  const loading = ref(false)
  const data = reactive<WizardData>({
    personal_fullname: '',
    personal_phone: '',
    personal_email: '',
    personal_password: '',
    company_name: '',
    country: '',
    email: '',
    timezone: '',
    number_of_employee: '',
    company_location: '',
    description: '',
    industry: 'UI/UX Design',
    logo: null,
  })
  const err = reactive<ErrData>({
    personal_fullname: false,
    personal_phone: false,
    personal_email: false,
    personal_password: false,
    company_name: false,
    country: false,
    email: false,
    number_of_employee: false,
    company_location: false,
    description: false,
  })

  const stepTitle = computed(() => {
    switch (step.value) {
      case 2:
        return 'Personal Info'
      case 3:
        return 'Company Info'
      case 4:
        return 'Company Details'
      case 5:
        return 'Preview'
      case 6:
        return 'Finish'
      case 1:
      default:
        return 'Project Type'
    }
  })

  function setLoading(value: boolean) {
    loading.value = value
  }
  function setStep(value: number) {
    step.value = value
  }

  async function save() {
    loading.value = true

    // simulate saving data
    await sleep(2000)

    loading.value = false
  }

  function reset() {
    data.personal_fullname = ''
    data.personal_phone = ''
    data.personal_email = ''
    data.personal_password = ''
    data.company_name = ''
    data.country = ''
    data.email = ''
    data.company_location = ''
    data.timezone = ''
    data.number_of_employee = ''
    data.description = ''
    data.industry = 'UI/UX Design'
    data.logo = null
  }

  function resetErr() {
    err.personal_fullname = false
    err.personal_phone = false
    err.personal_email = false
    err.personal_password = false
    err.company_name = false
    err.country = false
    err.email = false
    err.number_of_employee = false
    err.company_location = false
    err.description = false
  }

  return {
    step,
    loading,
    stepTitle,
    data,
    err,
    setLoading,
    setStep,
    save,
    reset,
  } as const
})
