/**
 * Theses types are used by the Wizard form
 *
 * @see /src/pages/wizard-v1.vue
 * @see /src/components/partials/wizard
 */
 import type { Ref } from 'vue'

 export interface JobOpeningData {
   company_id: number | null
   job_title: string
   intro: string
   task: string
   requirements: string
   benefits: string
   closing: string
   salary_range: boolean
   rangeOfExperience: boolean
   salary_start: string
   salary_end: string
   salary_type: string
   salary_show_on_job: boolean
   minimum_education: string
   years_of_experience_start: string
   years_of_experience_end: string
   career_label: string
   contract: string
   seniority: string
   category: string
   employment_type: string
   applicationdeadline: string
   country: string
   city: string
   is_remote: boolean
   cv_option: string | null
   cover_letter_option: string | null
   screening_question: Array<object>
   video_question: Array<object>
 }
 