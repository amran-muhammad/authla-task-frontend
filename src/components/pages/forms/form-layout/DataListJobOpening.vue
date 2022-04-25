<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useUserStore } from '/@src/stores/userStore'
import { useScheduleStore } from '/@src/stores/scheduleStore'

const userStore = useUserStore()
import { useRouter } from 'vue-router'
import useNotyf from '/@src/composable/useNotyf'

const router = useRouter()
const notyf = useNotyf()
const scheduleStore = useScheduleStore()

const addNewScheduleModal = ref(false)

const addNewSchedule = () => {
  addNewScheduleModal.value = true
  if (userStore.userData.type == 'admin') {
    userStore.getAllTeacher()
  }
}

const limit = ref(0)

function changeEndTime() {
  limit.value = 24 - scheduleStore.form_data.start_time
}
function addNewScheduleItem() {
  scheduleStore.createNew()
  addNewScheduleModal.value = false
}
onMounted(() => {
  scheduleStore.getAllSchedules()
})
</script>

<template>
  <div class="all-projects">
    <VModal
      :open="addNewScheduleModal"
      size="medium"
      actions="center"
      noclose
      @close="addNewScheduleModal = false"
    >
      <template #content>
        <VField v-if="userStore.userData.type == 'admin'">
          <label>Teacher Name</label>
          <VControl class="has-icons-left">
            <div class="select">
              <select v-model="scheduleStore.form_data.teacher_id">
                <option
                  v-for="(item, index) in userStore.teacher"
                  :key="index"
                  :value="item._id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-archway"></i>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>Day Name</label>
          <VControl class="has-icons-left">
            <div class="select">
              <select v-model="scheduleStore.form_data.day">
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
                <option value="Monday">Monday</option>
                <option value="Wednessday">Wednessday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-archway"></i>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>Start Time</label>
          <VControl class="has-icons-left">
            <div class="select">
              <select
                @click="changeEndTime"
                v-model="scheduleStore.form_data.start_time"
              >
                <option v-for="n in 24" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-clock"></i>
            </div>
          </VControl>
        </VField>
        <VField>
          <label>End Time</label>
          <VControl class="has-icons-left">
            <div class="select">
              <select v-model="scheduleStore.form_data.end_time">
                <option
                  v-for="n in limit"
                  :value="n + scheduleStore.form_data.start_time"
                  :key="n"
                >
                  {{ n + scheduleStore.form_data.start_time }}
                </option>
              </select>
            </div>
            <div class="icon is-small is-left">
              <i class="fas fa-clock"></i>
            </div>
          </VControl>
        </VField>
      </template>
      <template #action>
        <VButton color="primary" @click="addNewScheduleItem" raised
          >Add</VButton
        >
      </template>
    </VModal>
    <div class="illustration-header m-b-20">
      <div class="header-stats"></div>
    </div>

    <div class="project-minimal-grid">
      <div class="grid-header">
        <div class="filter">Weekly Schedules</div>
        <h3>
          <VButton
            bold
            raised
            color="primary"
            icon="feather:plus"
            @click="addNewSchedule"
            >Add new schedule</VButton
          >
        </h3>
      </div>

      <div class="columns is-multiline grid-body">
        <!--Project-->
        <div
          v-for="(item, index) in scheduleStore.schedules"
          :key="index"
          class="column is-4"
        >
          <VCardAdvanced>
            <template #header-left>
              <VBlock :title="item.day" center>
                <template #icon>
                  <VIconBox size="small" rounded>
                    <i
                      class="iconify"
                      data-icon="feather:briefcase"
                      aria-hidden="true"
                    ></i>
                  </VIconBox>
                </template>
              </VBlock>
            </template>
            <template #header-right>
              <VDropdown
                icon="feather:more-vertical"
                title="Dropdown with icon"
                spaced
              >
                <template #content>
                  <a class="dropdown-item is-media" @click="open(item)">
                    <div class="icon">
                      <i
                        class="iconify"
                        data-icon="feather:edit"
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div class="meta">
                      <span>Edit</span>
                      <span>Update the job opening</span>
                    </div>
                  </a>
                </template>
              </VDropdown>
            </template>
            <template #content>
              <div class="c-full-content">
                <p class="c-title">
                  <i
                    class="lnir lnir-text-align-justify m-r-5"
                    aria-hidden="true"
                  ></i>
                  From
                  {{
                    item.start_time < 12
                      ? item.start_time + ' AM'
                      : (item.start_time - 12 == 0
                          ? 12
                          : item.start_time - 12) + ' PM'
                  }}
                  to
                  {{
                    item.end_time < 12
                      ? item.end_time + ' AM'
                      : (item.end_time - 12 == 0 ? 12 : item.end_time - 12) +
                        ' PM'
                  }}
                </p>

                <div v-if="item.userDetails && item.userDetails.length > 0">
                  <p>Teacher Name: {{ item.userDetails[0].name }}</p>
                  <p>Department Name: {{ item.userDetails[0].department }}</p>
                  <p>Course Name: {{ item.userDetails[0].course }}</p>
                </div>
              </div>
            </template>
          </VCardAdvanced>
        </div>

        <!--Project-->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/projects/_projects.scss';
.is-dark .is-dark-bg-3 {
  background: white !important;
}
.filter {
  border: 1px solid var(--fade-grey-dark-3) !important;
  border-radius: var(--radius-large) !important;
}
.indicator-label {
  font-family: var(--font-alt);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--dark-text);
}
.collapse {
  border: none;
}
.icon-indicator {
  padding: 3px 8px;
  margin-left: 5px;
  border-radius: 4px;
  height: 20px;
  font-family: var(--font-alt);
  font-size: 0.85rem;
  font-weight: 600;
  background: var(--fade-grey);
  display: flex;
  justify-content: center;
  align-items: center;
}

.c-full-content {
  min-height: 220px !important;

  .c-title {
    color: var(--dark-text) !important;
    font-weight: 500;
    margin-bottom: 5px;
  }
  .c-content {
    margin-bottom: 15px;
  }
}

.icon-inactive {
  color: rgb(230 40 100) !important;
  background: rgba(230, 40, 100, 0.2) !important;
}
.icon-active {
  color: rgb(65, 185, 131) !important;
  background: rgba(65, 185, 131, 0.2) !important;
}
.icon-vid {
  color: rgb(255, 155, 0) !important;
  background: rgba(255, 155, 0, 0.2);
}
.icon-ques {
  color: rgb(33, 150, 243) !important;
  background: rgba(33, 150, 243, 0.2);
}
.indicator {
  content: '';
  top: 0;
  margin-left: 3px;
  height: 6px;
  width: 6px;
  border-radius: var(--radius-rounded);
}
.indicator-active {
  background: var(--primary);
}
.indicator-inactive {
  background: var(--danger);
}
.card-body {
  min-height: 103px !important;
}
.social-share {
  .v-flex {
    margin: 0 auto;
  }
  .icon-wrap {
    box-shadow: none;
    cursor: pointer;
    &:hover {
      color: var(--primary) !important;
      background-color: var(--fade-grey-light-3);
    }
  }
  &:hover {
    background: transparent !important;
  }
}
</style>

function usescheduleStore() {
  throw new Error('Function not implemented.')
}

function usescheduleStore() {
  throw new Error('Function not implemented.')
}
