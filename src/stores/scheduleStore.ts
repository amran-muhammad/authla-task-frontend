import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import { Notyf } from 'notyf'
import common from '/@src/stores/action/common'
import useNotyf from '../composable/useNotyf'

export const useScheduleStore = defineStore('scheduleStore', () => {
  const notyf = useNotyf()
  const schedules: any = ref([])
  const bookings: any = ref([])
  let bookingViewModal = ref(false)
  let bookingDeleteModal = ref(false)
  const form_data = ref({
    day: '',
    start_time: 0,
    end_time: 0,
    teacher_id: '',
    status: 'Open',
  })
  function resetForm() {
    form_data.value.day = ''
    form_data.value.start_time = 0
    form_data.value.end_time = 0
    form_data.value.teacher_id = ''
  }
  async function createNew() {
    try {
      const res: any = await common.postApi('schedules/add', form_data.value)
      if (res.status == 200) {
        schedules.value.push(res.data.data)
        resetForm()
        notyf.success('Schedule Added!')
      } else {
        notyf.error('Already added')
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }
  async function bookSchedule(item: any, index: number, studentID: any) {
    try {
      let form_data = {
        schedule_id: item._id,
        studentID: studentID,
        teacher_id: item.userDetails[0]._id,
        status: 'Pending',
      }
      const res: any = await common.postApi('bookings/add', form_data)
      if (res.status == 200) {
        // schedules.value.push(res.data.data)
        // resetForm()
        schedules.value[index].status = 'Pending'
        notyf.success('Bookin Request Sent')
      } else {
        notyf.error('Already added')
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }

  async function getAllSchedules() {
    const res: any = await common.getApi('schedules/api/all', {})
    if (res.status == 200) {
      schedules.value = res.data.data
    }
  }
  async function getAllCommonSchedules() {
    const res: any = await common.getApi('schedules/api/common/all', {})
    if (res.status == 200) {
      schedules.value = res.data.data
    }
  }
  async function getAllCommonBookings() {
    const res: any = await common.getApi('bookings/api/common/all', {})
    if (res.status == 200) {
      bookings.value = res.data.data
    }
  }
  let bookingItemForView: any = ref({})
  function setBookinData(item: any, index: number) {
    bookingItemForView.value = item
    bookingItemForView.value.index = index
  }

  async function statusUpdateOfBooking() {
    const res: any = await common.putApi(
      `bookings/requests/update/${bookingItemForView.value._id}`,
      {
        status: 'Approved',
      }
    )

    if (res.data == 200) {
      bookings.value[bookingItemForView.value.index].status = 'Approved'
      bookingViewModal.value = false
      return notyf.success('Status Changed')
    }
  }
  async function deleteOfBooking() {
    const res: any = await common.deleteApi(
      `bookings/requests/${bookingItemForView.value._id}`,
      {}
    )

    if (res.data == 200) {
      bookings.value.splice(bookingItemForView.value.index, 1)
      bookingDeleteModal.value = false
      return notyf.success('Deleted')
    }
  }

  return {
    bookingItemForView,
    bookingDeleteModal,
    bookingViewModal,
    bookings,
    form_data,
    schedules,
    setBookinData,
    getAllCommonBookings,
    createNew,
    getAllSchedules,
    getAllCommonSchedules,
    bookSchedule,
    statusUpdateOfBooking,
    deleteOfBooking,
  } as const
})
