export interface CompanyData {
    id: 0
    name: string
    email: string
    phone: string
    email_verified_at: string | null
    password: string
    status: string
    department: string
    course: string
    studentID: string
    type: 0
  }
export interface CompanyExtraData {
  id: 0
  user_id: 0
  name: string
  logo: string
  industry: string
  country: string
  number_of_employee: string
  description: string
  address: string
  phone: string
  email: string
  package: string
  slug: string
  slot: number
  video_question_slot: number
  screening_question_slot: number
  profile_visibility: boolean
  timezone: string | null
  website: string | null
  linkedin: string | null
  twitter: string | null
  facebook: string | null
  instagram: string | null
  email_accept: boolean | false
  email_reject: boolean | false
  email_sortlisted: boolean | false
  email_interview: boolean| false
}
