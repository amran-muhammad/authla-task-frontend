import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Notyf } from 'notyf'
import common from '/@src/stores/action/common'
import useNotyf from '../composable/useNotyf'

export const useUserStore = defineStore('userStore', () => {
  const router = useRouter()
  const step = ref(1)
  const notyf = useNotyf()
  const pchek: String = ''
  const teacher = ref([])
  const student = ref([])
  const stepTitle = computed(() => {
    switch (step.value) {
      case 1:
        return 'User Type'
      case 2:
        return 'Personal Info'
      case 3:
        return 'Personal Details'
      case 4:
        return 'Preview'
      case 5:
        return 'Finish'
      default:
        return 'Personal Info'
    }
  })
  const userData = ref({
    id: '',
    name: '',
    email: '',
    password: '',
    type: '',
    department: '',
    course: '',
    studentID: '',
    status: 'Pending',
  })
  const form_data = ref({
    name: '',
    email: '',
    type: '',
    password: '',
    department: '',
    course: '',
    studentID: '',
    status: 'Pending',
  })

  const edit_data = ref({
    _id: '',
    name: '',
    email: '',
    type: '',
    department: '',
    course: '',
    studentID: '',
    status: '',
  })
  function setStep(value: number) {
    step.value = value
    router.push({
      query: {
        step: step.value,
      },
    })
  }
  async function register() {
    try {
      const res: any = await common.postApi('users/add', userData.value)
      if (res.status == 200) {
        notyf.success('Registration successful!')
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }
  async function addUser() {
    try {
      const res: any = await common.postApi('users/add', form_data.value)
      if (res.status == 200) {
        notyf.success('Registration successful!')
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }

  async function updateUser() {
    try {
      const res: any = await common.putApi(
        `users/requests/update/${edit_data.value._id}`,
        edit_data.value
      )
      if (res.status == 200) {
        notyf.success('Updated!')
      } else {
        notyf.error('Already added')
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }
  async function getAllTeacher() {
    try {
      const res: any = await common.getApi('users/admin/get-all-teacher', {})
      if (res.status == 200) {
        teacher.value = res.data.data
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }
  async function getAllStudent() {
    try {
      const res: any = await common.getApi('users/admin/get-all-student', {})
      if (res.status == 200) {
        student.value = res.data.data
      }
    } catch (error) {
      notyf.error('Server Error! Try again')
    }
  }

  function selectUserType(name: any) {
    userData.value.type = name
    setStep(2)
    router.push({
      query: {
        step: step.value,
      },
    })
  }

  async function statusUpdateOfUserActiveTeacher(id: String, i: number) {
    const res: any = await common.putApi(
      `users/requests/update/teacher/${id}`,
      {
        status: 'Approved',
      }
    )

    if (res.data == 200) {
      notyf.success('Status Changed')
    }
  }
  async function statusUpdateOfUserDeactiveTeacher(id: String, i: number) {
    const res: any = await common.putApi(
      `users/requests/update/teacher/${id}`,
      {
        status: 'Pending',
      }
    )

    if (res.data == 200) {
      notyf.success('Status Changed')
    }
  }
  async function statusUpdateOfUserActiveStudent(id: String, i: number) {
    const res: any = await common.putApi(
      `users/requests/update/student/${id}`,
      {
        status: 'Approved',
      }
    )

    if (res.data == 200) {
      notyf.success('Status Changed')
    }
  }
  async function statusUpdateOfUserDeactiveStudent(id: String, i: number) {
    const res: any = await common.putApi(
      `users/requests/update/student/${id}`,
      {
        status: 'Pending',
      }
    )

    if (res.data == 200) {
      notyf.success('Status Changed')
    }
  }

  return {
    userData,
    pchek,
    step,
    stepTitle,
    teacher,
    student,
    form_data,
    edit_data,
    addUser,
    statusUpdateOfUserDeactiveTeacher,
    statusUpdateOfUserDeactiveStudent,
    statusUpdateOfUserActiveTeacher,
    statusUpdateOfUserActiveStudent,
    getAllTeacher,
    getAllStudent,
    register,
    setStep,
    selectUserType,
    updateUser,
  } as const
})
