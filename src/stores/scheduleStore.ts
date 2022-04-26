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
  let bookingViewRejectedModal = ref(false)
  let dayMust = ref('')
  const appointmentDate = ref('')
  const agenda = ref('')
  const form_data = ref({
    day: '',
    start_time: 0,
    end_time: 0,
    teacher_id: '',
    department: '',
    status: 'Open',
  })
  const edit_data = ref({
    _id: '',
    day: '',
    start_time: 0,
    end_time: 0,
    teacher_id: '',
    department: '',
    status: 'Open',
  })
  function resetForm() {
    form_data.value.day = ''
    form_data.value.start_time = 0
    form_data.value.end_time = 0
    form_data.value.teacher_id = ''
    form_data.value.department = ''
  }
  async function createNew() {
    try {
      const res: any = await common.postApi('schedules/add', form_data.value)
      if (res.status == 200) {
        resetForm()
        notyf.success('Schedule Added!')
      } else {
        notyf.error('Already added')
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }
  async function updateSchedule() {
    try {
      const res: any = await common.putApi(
        `schedules/requests/update/${edit_data.value._id}`,
        edit_data.value
      )
      if (res.status == 200) {
        notyf.success('Schedule Updated!')
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
        appointment: '',
        agenda: agenda.value,
        status: 'Pending',
      }
      const res: any = await common.postApi('bookings/add', form_data)
      if (res.status == 200) {
        schedules.value[index].status = 'Pending'
        notyf.success('Bookin Request Sent')
        agenda.value = ''
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
  async function getAllCommonSchedulesByTeacher(teacher: string) {
    const res: any = await common.postApi(
      'schedules/api/common/all/search/teacher',
      { teacher }
    )
    if (res.status == 200) {
      schedules.value = res.data.data
    }
  }
  async function getAllCommonSchedulesByDepartment(department: string) {
    const res: any = await common.postApi(
      'schedules/api/common/all/search/department',
      { department }
    )
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
  function setBookinData(item: any) {
    if (item.scheduleDetails.length > 0) {
      dayMust.value = item.scheduleDetails[0].day
    }
    bookingItemForView.value = item
  }

  async function statusUpdateOfBooking() {
    const res: any = await common.putApi(
      `bookings/requests/update/${bookingItemForView.value._id}`,
      {
        status: 'Approved',
        appointment: appointmentDate.value,
      }
    )

    if (res.data == 200) {
      return notyf.success('Status Changed')
    }
  }
  async function statusUpdateOfBookingRejected() {
    const res: any = await common.putApi(
      `bookings/requests/update/${bookingItemForView.value._id}`,
      {
        status: 'Rejected',
      }
    )

    if (res.data == 200) {
      return notyf.success('Status Changed')
    }
  }
  function makeFalseViewModal() {
    bookingViewModal.value = false
  }
  function makeFalseBookingDeleteModal() {
    bookingDeleteModal.value = false
  }
  function makeTrueViewModal() {
    bookingViewModal.value = true
  }
  function makeFalseRejectedModal() {
    bookingViewRejectedModal.value = false
  }
  function makeTrueRejectedModal() {
    bookingViewRejectedModal.value = true
  }
  async function deleteOfBooking() {
    const res: any = await common.deleteApi(
      `bookings/requests/${bookingItemForView.value._id}`,
      {}
    )

    if (res.data == 200) {
      return notyf.success('Deleted')
    }
  }
  async function deleteSchedule() {
    const res: any = await common.deleteApi(
      `schedules/requests/${edit_data.value._id}`,
      {}
    )

    if (res.data == 200) {
      return notyf.success('Deleted')
    }
  }

  return {
    agenda,
    appointmentDate,
    dayMust,
    bookingItemForView,
    bookingDeleteModal,
    bookingViewModal,
    bookings,
    form_data,
    edit_data,
    schedules,
    bookingViewRejectedModal,
    makeFalseBookingDeleteModal,
    deleteSchedule,
    statusUpdateOfBookingRejected,
    updateSchedule,
    makeFalseViewModal,
    makeTrueViewModal,
    makeFalseRejectedModal,
    makeTrueRejectedModal,
    setBookinData,
    getAllCommonBookings,
    createNew,
    getAllSchedules,
    getAllCommonSchedules,
    bookSchedule,
    statusUpdateOfBooking,
    deleteOfBooking,
    getAllCommonSchedulesByTeacher,
    getAllCommonSchedulesByDepartment,
  } as const
})
