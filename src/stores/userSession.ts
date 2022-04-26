import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import common from './action/common'
import { isDark } from '../state/darkModeState'
import { Notyf } from 'notyf'
import axios from 'axios'
import { useUserStore } from './userStore'

export type UserData = Record<string, any> | null

export const useUserSession = defineStore('userSession', () => {
  const token = useStorage('token', '')
  const user = ref<Partial<UserData>>()
  const loading = ref(true)
  const placeloader_contact = ref(false)
  const notyf = new Notyf()

  const host = import.meta.env.VITE_API_BASE_URL
  const userStore = useUserStore()

  const isLoggedIn = computed(
    () => token.value !== undefined && token.value !== ''
  )

  async function setToken(newToken: string) {
    const data = await setDataFromAuth(newToken)
    if (data == true) {
      token.value = newToken
      return true
    } else {
      return false
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

  async function logoutUser() {
    token.value = undefined
    user.value = undefined
    isDark.value = false
    location.reload()
  }

  return {
    user,
    token,
    isLoggedIn,
    loading,
    logoutUser,
    setToken,
    setDataFromAuth,
  } as const
})
