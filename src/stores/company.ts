import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { CompanyData } from '../models/company'
import type { CompanyExtraData } from '../models/company'
import type { ContactData } from '../models/contact_form'
import type { PasswordChange } from '../models/password_change_model'
import { Notyf } from 'notyf'
import common from '/@src/stores/action/common'


export const useCompany = defineStore('company', () => {
  async function getCurrentData(id: any) {  
    const res: any = await common.getApi(
      `api/company/${id}`,
      {}
    )
  }
  const pchek: String = ""
  const step = ref(1)
  const loading = ref(false)
  const router = useRouter()
  const notyf = new Notyf()
  let countryDialCode = ref("+974")
  let editPhone = ref(false)
  let editPhoneText = ref('Edit')
  let changeEditPhoneAfterEdit = ref(false)
  const editPhoneChange = (keychange?:string) => {
    if(keychange && keychange == 'yes'){
      changeEditPhoneAfterEdit.value = true
    }
    if(changeEditPhoneAfterEdit.value == true){
      editPhone.value = !editPhone.value
      editPhoneText.value = editPhone.value ? 'Cancel' : 'Edit'
      changeEditPhoneAfterEdit.value = false
    }
  }
  
  const password_data = reactive<PasswordChange>({
    email:'',
    old_password: '',
    new_password: ''
  })
  const contact_form = reactive<ContactData>({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  })
  const extra_data = reactive<CompanyExtraData>({
    id: 0,
    user_id: 0,
    name: '',
    logo: '',
    industry: '',
    country: 'Qatar',
    number_of_employee: '50-100',
    description: '',
    address: '',
    phone: '',
    email: '',
    package: '',
    slug: '',
    slot: 6,
    video_question_slot: 3,
    screening_question_slot: 3,
    profile_visibility: true,
    timezone: 'Asia/Qatar',
    website: null,
    linkedin: null,
    twitter: null,
    facebook: null,
    instagram: null,
    email_accept: false,
    email_reject: false,
    email_sortlisted: false,
    email_interview: false,
  })
  let data_view = {} as any

  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'Personal Info'
      case 2:
        return 'Company Info'
      case 3:
        return 'Company Details'
      case 4:
        return 'Preview'
      case 5:
        return 'Finish'
      default:
        return 'Personal Info'
    }
  })
  function setLoading(value: boolean) {
    loading.value = value
  }
  function setStep(value: number) {
    step.value = value
  }
  let data_stats = {} as any
 
  function resetContactForm(){
    contact_form.name = ''
    contact_form.phone = ''
    contact_form.email = ''
    contact_form.subject = ''
    contact_form.message = ''
  }
  function resetPasswordData(){
    password_data.old_password = ''
    password_data.new_password = ''
    password_data.email = ''
  }

  return {
    changeEditPhoneAfterEdit,
    editPhone,
    editPhoneText,
    password_data,
    countryDialCode,
    contact_form,
    step,
    pchek,
    loading,
    stepTitle,
    data_view,
    extra_data,
    data_stats,
    getCurrentData,
    editPhoneChange,
    resetPasswordData,
    setLoading,
    setStep,
    resetContactForm
  } as const
})
