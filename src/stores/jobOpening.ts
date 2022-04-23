import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import common from '/@src/stores/action/common'
import { useCompany } from '/@src/stores/company';
import { Notyf } from 'notyf'
import { useRoute,useRouter } from 'vue-router'




const company = useCompany()

const notyf = new Notyf()
const placeloader = ref(false)

/**
 * Using typescript types allow better developer experience
 * with autocompletion and compiler error prechecking
 */

export const useJobOpening = defineStore('jobOpening', () => {
  const origin = computed(
    () => window.origin
  )
  const router = useRouter()
const route = useRoute()
  const start_text: string[] = []
  const restrictCameraIndex:String[] = []
  const loading = ref(false)
  const jobOpeningDeleteModal = ref(false)

  const questionError = ref(false)
  const videoQuestionError = ref(false)
  const deadlineExpired = ref(false)
  const counterValues = ref({
    expiredJobs: 0,
    activeJobs: 0,
    hasVideoQuestion: 0,
  })
  const filters = ref({
    show: 100,
    sort: 'DESC',
    page: 1,
    pageCount: 0,
    status: '',
  })
  const dataList = ref([])
  const editValue = useLocalStorage('jobOpening', {})
  const isEdit = useLocalStorage('isEdit', false)
  const job_opening_name = useLocalStorage('job_opening_name', '')
  const showVideoIndex = ref(-1)
  const showQIndex = ref(0)
  const editorTask = useLocalStorage('editorTask', '')
  const editorRequirements = useLocalStorage('editorRequirements', '')
  const editorBenefits = useLocalStorage('editorBenefits', '')

  const reminderEmail = ref({
    type: "reminder",
    loading: false,
    showForm: true,
    email: "",
    job_id: 0,
    deadline:"",
    company:"",
    title:"",
    overview:"",
  })

  const data = ref({
    company_id: 0,
    user_id: 0,
    job_title: '',
    intro: '',
    task: '',
    requirements: '',
    benefits: '',
    closing: '',
    salary_range: false,
    rangeOfExperience: false,
    salary_start: '',
    salary_end: '',
    salary_type: 'Per month',
    salary_show_on_job: false,
    minimum_education: '',
    career_label : '',
    years_of_experience_start : '',
    years_of_experience_end : '',
    contract: '',
    seniority: '',
    category: '',
    employment_type: '',
    applicationdeadline: '',
    encrypt_id_url:'',
    country: 'Qatar',
    city: '',
    is_remote: false,
    cv_option: null,
    cover_letter_option: 'Optional',
    question: [],
    video_question: [],
    status: 'Open',
    is_public:false,
    is_profile:false,
    is_interview:false,
    is_questionnair:false,
    company: {},
    user: {},
  }) as any

  function setLoading(value: boolean) {
    loading.value = value
  }
  function addNewScreeningQuestion() {
    questionError.value = false
    if(data.value.question.length < company.extra_data.screening_question_slot){
      data.value.question.push({
        question: '',
        type: 'Text',
      })
    }else{
      questionError.value = true
      // setTimeout(()=>{
      //   questionError.value = false
      // },6000)
      notyf.error("Maximum "+company.extra_data.screening_question_slot+"  questions can be added! To add more try Tenrol premium.")
    }
  }
  function removeScreeningQuestion(index: number) {
    data.value.question.splice(index, 1)
  }
  function addNewVideoQuestion() {
    videoQuestionError.value = false
    if(data.value.video_question.length < company.extra_data.video_question_slot){
      data.value.video_question.push({
        question: '',
        description: '',
        length: '30'
      })
    }else{
      videoQuestionError.value = true
      // setTimeout(()=>{
      //   videoQuestionError.value = false
      // },6000)
      notyf.error("Maximum "+company.extra_data.video_question_slot+" video questions can be added! To add more try Tenrol premium.")
    }
  }
  function removeVideoQuestion(index: number) {
    data.value.video_question.splice(index, 1)
  }


  async function sendReminder() {
      reminderEmail.value.loading = true
      await common.postApi('api/email',reminderEmail.value);
      reminderEmail.value.email = ''
      reminderEmail.value.showForm = false

  }


  async function deleteTheJob(id:any){
    loading.value = true
     const res: any = await common.deleteApi(
      `api/job_opening/${id}`,{}
    )
    if(res.data.status == true){
      jobOpeningDeleteModal.value = false
      loading.value = false
      router.push(
        '/job_opening'
      )
      }
 
  }

 
  async function getVisitCount() {
  const res: any = await common.getApi(
      'api/get_visitor_count_multiple',
      filters.value
    ) 


    if(res.data !=null){
      data.value.visits = res.data
    }
}

  async function save() {
    loading.value = true
    let res: any
    data.value.employment_type =data.value.contract
    data.value.company_id = company.extra_data.id
    data.value.user_id = company.extra_data.user_id
    if(isEdit.value==true)
    {
      res = await common.putApi(`api/job_opening/${data.value.id}`,data.value);
      console.log("EDITINF",data.value)
    }
    else
    {
      res = await common.postApi('api/job_opening',data.value);
      notyf.error(res.data.message)
    }
    loading.value = false
    return res
  }

  function editData(value: any) {
    isEdit.value = true
    editValue.value = value
    editorTask.value = value.task
    editorBenefits.value = value.benefits
    editorRequirements.value = value.requirements
  }

  function newData() {
    isEdit.value = false
    editValue.value = {}
    reset()
  }

  async function get() {
    placeloader.value = true
    loading.value = true
     const res: any = await common.getApi(
      'api/job_opening',
      filters.value
    )
    if(res.status == 200) placeloader.value = false
    dataList.value = res.data.data
     if (!filters.value.status) {
      setCounters(dataList.value)
    }
    loading.value = false
  }

  async function getCurrentData(id: any) {
    loading.value = true
    const res: any = await common.getApi(
      `api/job_opening/${id}`,
      {}
    )
    data.value = res.data
    job_opening_name.value = res.data.job_title
    if(res.data.question.length < 1){
      showVideoIndex.value=0
    }
    loading.value = false
    for (let i = 0; i < res.data.video_question.length; i++) {
      start_text.push('Test')
    }
    let d1 = new Date()
    let d2 = new Date(res.data.applicationdeadline)
    deadlineExpired.value = d1.getTime() > d2.getTime()
  }

  function changeJobOpeningName(name:string){
    job_opening_name.value = name
  }
  function removeJobOpeningName(){
    job_opening_name.value = ''
  }
  function setEditData() {
    data.value = editValue.value
  }

  function setCounters(dataList: any) {
    counterValues.value.activeJobs = dataList.filter(
      (el: any) => el.status == 'Open'
    ).length
    counterValues.value.expiredJobs = dataList.filter(
      (el: any) => el.status != 'Open'
    ).length
    counterValues.value.hasVideoQuestion = dataList.filter(
      (el: any) => el.video_question.length
    ).length
  }
  function reset() {
    data.value.company_id = ''
    data.value.salary_end = ''
    data.value.salary_type = 'Per month'
    data.value.salary_show_on_job = false
    data.value.rangeOfExperience = false
    data.value.minimum_education = ''
    data.value.career_label = ''
    data.value.years_of_experience_start = ''
    data.value.years_of_experience_end = ''
    data.value.contract = ''
    data.value.seniority = ''
    data.value.category = ''
    data.value.employment_type = ''
    data.value.country = 'Qatar'
    data.value.city = ''
    data.is_public=false,
    data.is_profile=false,
    data.is_interview=false,
    data.is_questionnair=false,
    data.value.is_remote = false
    data.value.cv_option = null
    data.value.cover_letter_option = 'Optional'
    data.value.question = []
    data.value.video_question = []
    data.value.status = 'Open'
    editorTask.value = ''
    editorBenefits.value = ''
    editorRequirements.value = ''
    let date:any = new Date();
    date.setDate(date.getDate()+30)
    let monthFormat = Number(date.getMonth()) + 1
    let dateFormat = Number(date.getDate())
    data.value.applicationdeadline = date.getFullYear() + '-'+(monthFormat>9?monthFormat:'0'+monthFormat)+'-'+(dateFormat>9?dateFormat:'0'+dateFormat)
  }




  // Text to speech
// const speak = (questionText: string) => {
//   if(questionText!= ''){
//     var spokenQuestion = new SpeechSynthesisUtterance(questionText)
//   }else{
//     return
//   }
//   const selected_voice = window.speechSynthesis.getVoices()
//   spokenQuestion.voice = selected_voice[50]
//   window.speechSynthesis.speak(spokenQuestion)
// }



  function increase (){
    showVideoIndex.value++
    // Speaking the question
    // speak(data.value.video_question[showVideoIndex.value].question)
  }





  function changeIndexes (){
    showQIndex.value = -1
    showVideoIndex.value = 0
    // Speaking the question
    // speak(data.value.video_question[showVideoIndex.value].question)
  }
  
  function prevStep (){
    showQIndex.value = data.value.question.length - 1
    showVideoIndex.value = -1
    // Speaking the question
    // speak(data.value.video_question[showVideoIndex.value].question)
  }
  function decrease (){
    showVideoIndex.value--
    // Speaking the question
    // speak(data.value.video_question[showVideoIndex.value].question)
  }
  function increaseQ (){
    showQIndex.value++
  }
  function decreaseQ (){
    showQIndex.value--
  }

  return {
    deadlineExpired,
    restrictCameraIndex,
    editorTask,
    editorRequirements,
    editorBenefits,
    job_opening_name,
    placeloader,
    questionError,
    videoQuestionError,
    origin,
    showVideoIndex,
    showQIndex,
    loading,
    jobOpeningDeleteModal,
    data,
    start_text,
    dataList,
    isEdit,
    getVisitCount,
    setLoading,
    get,
    getCurrentData,
    save,
    sendReminder,
    reset,
    editData,
    setEditData,
    deleteTheJob,
    editValue,
    filters,
    counterValues,
    reminderEmail,
    newData,
    addNewScreeningQuestion,
    removeScreeningQuestion,
    addNewVideoQuestion,
    removeVideoQuestion,
    increase,
    decrease,
    increaseQ,
    decreaseQ,
    changeIndexes,
    prevStep,
    changeJobOpeningName,
    removeJobOpeningName
  } as const
})
