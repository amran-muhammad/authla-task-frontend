import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { useCompany } from './company'
import common from './action/common'
import { isDark } from '../state/darkModeState'
import { Notyf } from 'notyf'
import { customersOptions } from '/@src/data/dashboards/personal-v1/customersChart'
import axios from 'axios'
import { useUserStore } from './userStore'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  const token = useStorage('token', '')
  const user = ref<Partial<UserData>>()
  const loading = ref(true)
  const placeloader_contact = ref(false)
  const company: any = useCompany()
  const dataList = ref([])
  const pages: any = ref([])
  const but_page = ref(1)
  const but_endpage = ref(1)
  const searchkey = ref('')
  const notyf = new Notyf()
  const days = useStorage('days', [])
  const applications = useStorage('applications', [])
  const host = import.meta.env.VITE_API_BASE_URL
  const userStore = useUserStore()

  const isLoggedIn = computed(
    () => token.value !== undefined && token.value !== ''
  )

  function setUser(newUser: Partial<UserData>) {
    user.value = newUser
  }

  async function setToken(newToken: string) {
    const data = await setDataFromAuth(newToken)
    if (data == true) {
      token.value = newToken
      return true
    } else {
      return false
    }
  }

  async function get() {
    placeloader_contact.value = true
    try {
      const res: any = await common.getApi('read/contact-message', {
        page: 1,
        searchkey: searchkey.value,
      })
      if (res.status == 200) placeloader_contact.value = false
      dataList.value = res.data.data
      but_endpage.value = Math.ceil(res.data.total / 20)
      pages.value = []
      for (let i = 0; i < Math.ceil(res.data.total / 20); i++) {
        if (i == 10) break
        pages.value.push(i + 1)
      }
    } catch (error) {
      dataList.value = []
    }
  }
  async function pageChange(page: number) {
    but_page.value = page
    const res: any = await common.getApi('read/contact-message', {
      page,
    })
    dataList.value = res.data.data
    pages.value = []
    for (let i = page - 1; i < Math.ceil(res.data.total / 20); i++) {
      if (i == page + 9) break
      pages.value.push(i + 1)
    }
  }

  async function getChartData(token: any) {
    const headers: any = {
      Authorization: 'Bearer ' + token,
    }
    const dashboard: any = await axios.get(host + '/api/dashboard', {
      headers: headers,
    })
    if (dashboard.status == 200) {
      ;(days.value = dashboard.data.days),
        (applications.value = dashboard.data.applications)
    }
  }

  async function setDataFromAuth(token: string) {
    const headers: any = {
      Authorization: 'Bearer ' + token,
    }
    const res_user: any = await axios.get(host + '/users/get-user-by-token', {
      headers: headers,
    })
    if (res_user.status == 200) {
      userStore.userData.id = res_user.data.user._id
      userStore.userData.email = res_user.data.user.email
      userStore.userData.name = res_user.data.user.name
      userStore.userData.type = res_user.data.user.type
      userStore.userData.studentID = res_user.data.user.studentID
      userStore.userData.department = res_user.data.user.department
      userStore.userData.course = res_user.data.user.course
      return true
    } else {
      notyf.error(res_user.data.msg)
      return false
    }
  }

  async function updateProfile(switchforphone?: boolean) {
    const headers = {
      Authorization: 'Bearer ' + token.value,
    }
    try {
      const res_com: any = await common.postApi('api/company/v1/update', {
        data: company.data,
      })
      if (res_com.status == 200) {
        return true
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }
  async function updatePassword(data: any) {
    const headers = {
      Authorization: 'Bearer ' + token.value,
    }
    try {
      const res_com: any = await common.postApi('api/password-change-setting', {
        ...data,
        email: company.data.email,
      })
      if (res_com.status == 200) {
        return res_com
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  function setLoading(newLoading: boolean) {
    loading.value = newLoading
  }

  async function logoutUser() {
    token.value = undefined
    user.value = undefined
    isDark.value = false
    location.reload()
  }

  return {
    days,
    applications,
    placeloader_contact,
    but_page,
    but_endpage,
    pages,
    user,
    dataList,
    token,
    isLoggedIn,
    loading,
    searchkey,
    updatePassword,
    pageChange,
    get,
    logoutUser,
    setUser,
    setToken,
    setLoading,
    setDataFromAuth,
    updateProfile,
    getChartData,
  } as const
})
