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
    data.comp_view = res.data
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
  const data = reactive<CompanyData>({
    id:0,
    name: '',
    email: '',
    phone: '',
    email_verified_at: '',
    password: '',
    status: '',
    department: '',
    course: '',
    studentID: '',
    type: 0
  }) as any
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
  async function save() {
    loading.value = true
    try {

      const saved_company:any = await common.postApi('company/v1/create',{data})
    if(saved_company.status== 200 && saved_company.data.success==true){
      loading.value = false
      notyf.success("Company registration successful!")
      data.id = saved_company.data.company.id
      data.name = saved_company.data.company.name
      data.email = saved_company.data.company.email
      data.avatar = saved_company.data.company.avatar

      return true
    }
    else if(saved_company.data.success==false){
      notyf.error(saved_company.data.msg) 
      return false
    }
    } catch (error) {
      notyf.error("Server Error! Try again")
      return false
    }
   
  }
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
  function reset() {
    data.name = ''
    data.email = ''
    data.phone = ''
    data.email_verified_at = ''
    data.password = ''
    data.avatar = null
    data.status = ''
    data.course = ''
    data.department = ''
    data.studentID = ''
    data.type = 0
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
    data,
    data_view,
    data_stats,
    getCurrentData,
    editPhoneChange,
    resetPasswordData,
    setLoading,
    setStep,
    save,
    reset,
    resetContactForm
  } as const
})
