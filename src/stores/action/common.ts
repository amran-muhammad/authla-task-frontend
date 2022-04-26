import Axios from 'axios'
import { Notyf } from 'notyf'
import { useStorage } from '@vueuse/core'

const notyf = new Notyf()
export default {
  async getApi(url: string, data: object) {
    try {
      const res = await Axios.get(
        import.meta.env.VITE_API_BASE_URL + '/' + url,
        {
          headers: { Authorization: 'Bearer ' + useStorage('token', '').value },
          params: data,
        }
      )
      console.log(res)
      // notyf.success('Accepted')
      return res
    } catch (e) {
      console.log(e)
      return e
    }
  },
  async postApi(url: string, data: object) {
    try {
      const res = await Axios.post(
        import.meta.env.VITE_API_BASE_URL + '/' + url,
        data,
        {
          headers: { Authorization: 'Bearer ' + useStorage('token', '').value },
        }
      )

      return res
    } catch (e) {
      return e
    }
  },
  async deleteApi(url: string, data: object) {
    try {
      const res = await Axios.delete(
        import.meta.env.VITE_API_BASE_URL + '/' + url,
        {
          headers: { Authorization: 'Bearer ' + useStorage('token', '').value },
          data,
        }
      )
      return res
    } catch (e) {
      return e
    }
  },
  async putApi(url: string, data: object) {
    try {
      const res = await Axios.put(
        import.meta.env.VITE_API_BASE_URL + '/' + url,
        data,
        {
          headers: { Authorization: 'Bearer ' + useStorage('token', '').value },
        }
      )

      return res
    } catch (e) {
      return e
    }
  },
}
