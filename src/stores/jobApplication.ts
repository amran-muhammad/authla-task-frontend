import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import common from './action/common'
import { useLocalStorage } from '@vueuse/core'
import { useJobOpening } from './jobOpening'
import { useCountryMobile } from '/@src/assets/countrymobile.json'
const allcountries = useCountryMobile

/*
 * Using typescript types allow better developer experience
 * with autocompletion and compiler error prechecking
 */

export interface AppHolder {
  id: 0
  company_id: 0
  name: string
  country: string
  selected_by_shared_view: boolean,
  commented_by_shared_view: string,
  phone: string
  filesize: string   
  email: string
  title: string
  status: string
  applied_on: string
  created_at: string
  cv: string
  cover_letter: string
  answer: any[]
  video_answer: any[]
  total_question: string
  total_video: string
  average_score: number
  review_progress: number
  is_shared:boolean
  job_opening: any
  deadlineRange: string
}

export interface ProcessComplete {
  process_complete: string
}
export const useJobApplication = defineStore('jobApplication', () => {
  const route = useRoute()
  const router = useRouter()
  const loading = ref(false)
  const loaderStatus = ref(false)
  const placeloader = ref(false)
  const jobApplicationDeleteModal = ref(false)
  const jobApplicationStatusModal = ref(false)
  const statusOfJobApplication = ref('')
  const filters = {
    show: 10,
    sort: 'DESC',
 
    video: false,
    text: false,
    country: '',
    page: 1,
    pageCount: 0,
    status: '',
    searchkey: '',
    job_position: ''
  }
  const deleteIndex = ref(-1)
  const total = ref(0)
  const stats = ref({}) as any
  const perPage = ref(0)
  const maxPage = ref(0)
  const dataList = ref([])
  const job_categories = ref([])
  const total_job_opening = ref(0)
  const total_job_application = ref(0)
  const total_job_application_pending = ref(0)
  const total_job_application_accepted = ref(0)
  const total_job_application_rejected = ref(0)
  const basic_info = useLocalStorage('basic_info', {}) as any
  const is_basic_info = useLocalStorage('is_basic_info', false)
  const formAnswers = useLocalStorage('formAnswers', []) 
  const progress = useLocalStorage('progress', 0) 
  const videoLinks: string[] = []
  const jobOpening:any = useJobOpening()
  const pc = reactive<ProcessComplete>({
    process_complete: 'no',
  })

  const app_holder = reactive<AppHolder>({
    id: 0,
    company_id: 0,
    name: '',
    selected_by_shared_view: false,
    commented_by_shared_view: '',
    phone: '',
    filesize: '',
    email: '',
    country: '',
    title: '',
    status: '',
    applied_on: '',
    created_at:'',
    cv: '',
    cover_letter: '',
    answer: [],
    video_answer: [],
    total_question: '',
    total_video: '',
    average_score: 0,
    is_shared: false,
    review_progress: 0,
    job_opening: {},
    deadlineRange: '',
  })

  const data = ref({
    email: '',
    country: '',
    user_id: 1,
    job_opening_id: 0,
    company_id: 0,
    status: 'Pending',
    name: '',
    answers: [],
    video_answers: [],
    cv: '',
    phone: '',
    filesize: '',
    cover_letter:''
  }) as any

  const view_settings = ref({
    is_public: true,
    is_profile: true,
    is_interview: true,
    is_questionnaire: true,
    selected_application: 0,
    autoplay: false
  }) as any

  function setLoading(value: boolean) {
    loading.value = value
  }

  function resetData() {
    data.country = ''
    data.email = ''
    data.user_id = 0
    data.company_id = 0
    data.job_opening_id = ''
    data.status = 'Pending'
    data.name = ''
    data.answers = []
    data.video_answers = []
    data.cv = ''
    data.phone = ''
    data.filesize = ''
    data.cover_letter = ''
    basic_info.value = {}
    is_basic_info.value = false
  }
  
  async function get_job_catagories(){
    const res:any = await common.getApi('api/job-application/job-titles/get' ,{})
    job_categories.value = res.data.data
     if(filters.job_position==''){
      total_job_application.value = res.data.total_job_application
      total_job_application_pending.value = res.data.total_job_application_pending
      total_job_application_accepted.value = res.data.total_job_application_accepted
      total_job_application_rejected.value = res.data.total_job_application_rejected
    }
    total_job_opening.value = res.data.total_job_opening
  }


  async function get_job_status_statistics_according_to_job(id:any){
  const res:any = await common.getApi(`api/job_application/status/${id}` ,{})
  if(res.data.status){
    console.log('get_job_status_statistics_according_to_job',res.data)
  }
  stats.value = res.data.data

  }

  async function share_applications(id:number,status:boolean){
    const res: any = await common.putApi(
      `api/job_application/${id}`,
      {"is_shared":status}
    )


    if (res.data.status) {
      app_holder.answer[res.data.index].is_shared = res.data.data.is_shared
       console.log("OK lets go")
      check_rp()
      return res.data.status
    }



  }

  async function review_shared_applications(id:number,input:string,thumb:boolean,comment:string){
 
    const res: any = await common.putApi(
      `api/job_application/shared_view/${id}`,
      {   "input":input,	
          "selected_by_shared_view":thumb,
          "commented_by_shared_view":comment
      }
    )
 
 
  }

  async function deleteTheApplication(id:any){
    loading.value = false
    const res: any = await common.deleteApi(
      `api/job_application/${id}`,{}
    )
    if(res.status == 200 && res.data.data){
      loading.value = true
      jobApplicationDeleteModal.value = false
      get();
      get_job_catagories();
    }
  }

  async function save() {
    let edit = 0
    if(is_basic_info.value == true){
      edit = 1
      is_basic_info.value = false
      basic_info.value = {}
      formAnswers.value = []
      progress.value = 0
    }else{
      data.value.company_id = jobOpening.data.company_id
    }
    if(data.value.country==''){
      data.value.phone = '+974'+data.value.phone
      data.value.country = 'Qatar'
    }else{
      data.value.phone = allcountries.find((obj: any) => obj.name === data.value.country).dial_code+''+data.value.phone
    }
    const res: any = await common.postApi(
      'api/job_application',
      data.value
    )
    if(edit==0 ){
      is_basic_info.value = true
      basic_info.value = res.data.data
    }
    return res
  }

  const sendEmailAppliedSuccess = async(form_input:any)=>{
    await common.postApi('api/email',form_input)
  }

  const currentPage = computed(() => {
    try {
      filters.page = Number.parseInt(route.query.page as string) || 1
      get()
      return Number.parseInt(route.query.page as string) || 1
    } catch {}
    return 1
  })
  
  async function get_single_job(id:any){
    filters.page = 1
    const url = 'api/job_application/'+id
    const res: any = await common.getApi(
      url,
      filters
    )
    let dateFormation = ""
    if(res.data.data.created_at){
      dateFormation = res.data.data.created_at.substring(0, 10).split('-')
      dateFormation = dateFormation[2]+'/'+dateFormation[1]+'/'+dateFormation[0]
    }
    let dedlineDateFormation = ''
    if(res.data.data.job_opening.applicationdeadline){
      dedlineDateFormation =  res.data.data.job_opening.applicationdeadline.substring(0, 10).split('-')
      dedlineDateFormation = dedlineDateFormation[2]+'/'+dedlineDateFormation[1]+'/'+dedlineDateFormation[0]
    }
    app_holder.deadlineRange = dateFormation+' to '+dedlineDateFormation
    
    app_holder.id = res.data.data.id
      app_holder.applied_on = dateFormation
      app_holder.created_at = res.data.data.created_at
      app_holder.name = res.data.data.name
      app_holder.country = res.data.data.country

      app_holder.phone = res.data.data.phone
      app_holder.filesize = res.data.data.filesize
      app_holder.email = res.data.data.email
      app_holder.cv = res.data.data.cv
      app_holder.cover_letter = res.data.data.cover_letter
      app_holder.is_shared = res.data.data.is_shared
      app_holder.status = res.data.data.status
      statusOfJobApplication.value = res.data.data.status
      app_holder.title = res.data.data.job_opening.job_title
      app_holder.company_id = res.data.data.job_opening.company_id
      app_holder.answer = res.data.data.answer
      app_holder.video_answer = res.data.data.video_answer
      app_holder.job_opening = res.data.data.job_opening
      app_holder.total_question = res.data.data.answer.length.toString()
      app_holder.total_video = res.data.data.video_answer.length.toString()
      app_holder.average_score = res.data.data.score
      check_rp()

  }
  async function get(page?: any) {
    placeloader.value = false
    if(page){
      filters.page = Number(page)
    }
    const url = 'api/job_application'
    
    const res: any = await common.getApi(
      url,
      filters
    )
    if(res.status == 200){
      placeloader.value = true
    }
    
    dataList.value = res.data.data.data
    loading.value = true
    total.value = res.data.data.total
    perPage.value = res.data.data.per_page
    maxPage.value = Math.round(res.data.data.total / res.data.data.per_page)
    if(filters.job_position || jobOpening.job_opening_name){
      total_job_application.value = res.data.statistics.total_job_application
      total_job_application_pending.value = res.data.statistics.total_job_application_pending
      total_job_application_accepted.value = res.data.statistics.total_job_application_accepted
      total_job_application_rejected.value = res.data.statistics.total_job_application_rejected
      jobOpening.removeJobOpeningName()
    }
  }

  async function  get_shared_applications(id:any) {
    data.value.loading = true
    data.value.success = true
    data.value.public = true
    data.value.autoplay = false

    const res: any = await common.getApi(
      `api/job_application/share/${id}`,
      {}             

    )
  
    if (res.data.success) {
       if(res.data.public){
        data.value.loading = false
        data.value = res.data
        data.value.selected_job = res.data.Job
        data.value.video_index = 0
        data.value.selected_index = 0
        data.value.selected_application = data.value.data[0]


       }else{
      //  Not Shared
      data.value.loading = false

      data.value.public = false
      }

    }else{
      data.value.loading = false
      data.value.success = false

    }
 

 
 
  }

  function setJobApps(item: any,index:any, isStop: boolean) {
    deleteIndex.value = index
    const dateFormation = item.created_at.substring(0, 10).replaceAll('-', '/')
    let dedlineDateFormation = ''
    if(item.job_opening.applicationdeadline){
      dedlineDateFormation = item.job_opening.applicationdeadline.substring(0, 10).replaceAll('-', '/')
    }
    app_holder.deadlineRange = dateFormation+' to '+dedlineDateFormation
    app_holder.id = item.id
    app_holder.applied_on = dateFormation
    app_holder.created_at = item.created_at
    app_holder.name = item.name
    app_holder.phone = item.phone
    app_holder.email = item.email
    app_holder.cv = item.cv
    app_holder.cover_letter = item.cover_letter
    app_holder.status = item.status
    statusOfJobApplication.value = item.status
    app_holder.title = item.job_opening.job_title
    app_holder.answer = item.answer
    app_holder.video_answer = item.video_answer
    app_holder.total_question = item.answer.length.toString()
    app_holder.total_video = item.video_answer.length.toString()
    app_holder.filesize = item.filesize
     if(isStop) gotoCompanyDetails()
  }

  async function check_rp(score?:number) {
    let rp = 0
    let rps = 0
    let count_rp = 0
    if (app_holder.answer.length > 0) {
      rps += app_holder.answer.length
      app_holder.answer.map((data: any) => {
        rp += data.rating
        if (data.rating != null) {
          count_rp = count_rp + 1
        }
      })
    }
    if (app_holder.video_answer.length > 0) {
      rps += app_holder.video_answer.length
      app_holder.video_answer.map((data: any) => {
        rp += data.rating
        if (data.rating != null) {
          count_rp = count_rp + 1
        }
      })
    }
    if (rp > 0) {
      app_holder.average_score = Math.round(rp / rps)
      if(!score){
        await changeScoreOfJobApplication()
      }else{
        app_holder.average_score = score
      }
    }
    app_holder.review_progress = 0
    if (count_rp > 0){
      app_holder.review_progress = Math.round((count_rp * 100) / rps)
    }
    if(app_holder.answer.length == 0 && app_holder.video_answer.length == 0 && app_holder.status != 'Pending'){
      app_holder.review_progress = 100
    }
  }

  async function updateRatingAndNote(form: any) {
    app_holder.answer[form.index].note = form.note
    const res: any = await common.postApi(
      'job-application-question/v1/update',
      form
    )
    if (res.data.status) {
      
      app_holder.answer[res.data.index].rating = res.data.data.rating
      app_holder.answer[res.data.index].note = res.data.data.note
       check_rp()
      return res.data.status
    }
  }

  // Save note or rate function
  async function save_change(form: any) {
    console.log("The form sent",form);
    const res: any = await common.postApi(
      'job-application-question/v1/review',
      form
    )


    if (res.data.status) {
      if(res.data.type=="video"){
        if("note" in res.data.data){
          app_holder.video_answer[res.data.index].note = res.data.data.note
        }
        if("rating" in res.data.data){
          app_holder.video_answer[res.data.index].rating = res.data.data.rating
        }
      }
      if(res.data.type=="text"){
        if("note" in res.data.data){
          app_holder.answer[res.data.index].note = res.data.data.note
        }
        if("rating" in res.data.data){
          app_holder.answer[res.data.index].rating = res.data.data.rating
        }
      }

      check_rp()
      return res.data.status
    }
  }

  async function updateVideoRatingAndNote(form: any) {
    const res: any = await common.postApi(
      'job-application-video-question/v1/update',
      form
    )
    if (res.data.status) {
      app_holder.video_answer[res.data.index].rating = res.data.data.rating
      app_holder.video_answer[res.data.index].note = res.data.data.note
      check_rp()
      return res.data.status
    }
  }

  function gotoCompanyDetails() {
    router.push(
      '/job_application/list/details?' + 'job=' + app_holder.id
    )
  }

   async function changeStatusOfJobApplication(){
     loaderStatus.value=true
     const res:any = await common.putApi('api/job_application/'+app_holder.id, {
       status: app_holder.status
     })
     if(res.status==200) {
      loaderStatus.value = false
      statusOfJobApplication.value = app_holder.status
      jobApplicationStatusModal.value = false
     }
     check_rp()
     
   }
   async function changeScoreOfJobApplication(){
     await common.putApi('api/job_application/'+app_holder.id, {
       score: app_holder.average_score
     })
   }
   
   const calculateProgress = () => {
    let fa = 0
    jobOpening.data.question.forEach((element: any, index: number) => {
      if (
        formAnswers.value[index] &&
        formAnswers.value[index] != null &&
        formAnswers.value[index] != ''
      ) {
        fa = fa + 1
      }
    })
  
    progress.value = Math.round(
      (100 * (fa + videoLinks.length)) /
        (jobOpening.data.question.length + jobOpening.data.video_question.length)
    )
  }

  return {
    statusOfJobApplication,
    videoLinks,
    progress,
    formAnswers,
    jobApplicationStatusModal,
    jobApplicationDeleteModal,
    is_basic_info,
    basic_info,
    placeloader,
    deleteIndex,
    pc,
    app_holder,
    total,
    currentPage,
    perPage,
    maxPage,
    filters,
    loading,
    loaderStatus,
    dataList,
    data,
    job_categories,
    total_job_application,
    total_job_application_accepted,
    total_job_application_pending,
    total_job_application_rejected,
    stats,
    total_job_opening,
    view_settings,
    get_shared_applications,
    share_applications,
    review_shared_applications,
    save_change,
    resetData,
    get,
    setJobApps,
    updateRatingAndNote,
    updateVideoRatingAndNote,
    save,
    check_rp,get_job_status_statistics_according_to_job,
    get_job_catagories,
    deleteTheApplication,
    gotoCompanyDetails,
    get_single_job,
    changeStatusOfJobApplication,
    calculateProgress,
    sendEmailAppliedSuccess,
    changeScoreOfJobApplication
  } as const
})