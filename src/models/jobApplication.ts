/**
 * Theses types are used by the Wizard form
 *
 * @see /src/pages/wizard-v1.vue
 * @see /src/components/partials/wizard
 */
 import type { Ref } from 'vue'

 export interface JobApplicationData {

    user_id	: number| null	
    job_opening_id: number | null	
    status: boolean
    name: string
    email: string
    cv: string
    cover_letter: string	

 }


