<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import moment from 'moment'
import useNotyf from '/@src/composable/useNotyf'
import { useScheduleStore } from '/@src/stores/scheduleStore'
import { useUserStore } from '/@src/stores/userStore'

const notyf = useNotyf()
const scheduleStore = useScheduleStore()
const userStore = useUserStore()

moment.updateLocale('en', {
  relativeTime: {
    ss: '%d sec',
    mm: '%d min',
    hh: '%d h',
    MM: '%d mon',
  },
})

const router = useRouter()

function updateStatusForBooking() {
  if (scheduleStore.appointmentDate == '') {
    return notyf.error('Please provide an appointment date')
  }
  if (scheduleStore.appointmentDate) {
    let dayname = moment(scheduleStore.appointmentDate).format('dddd')
    if (scheduleStore.dayMust != '' && scheduleStore.dayMust != dayname) {
      return notyf.error(
        'Please provide an appointment date on ' + scheduleStore.dayMust
      )
    }
  }
  scheduleStore.statusUpdateOfBooking().then(() => {
    scheduleStore.getAllCommonBookings()
    scheduleStore.makeFalseViewModal()
  })
}
function updateStatusForBookingReject() {
  scheduleStore.statusUpdateOfBookingRejected().then(() => {
    scheduleStore.getAllCommonBookings()
    scheduleStore.makeFalseRejectedModal()
  })
}
function deleteBooking() {
  scheduleStore.deleteOfBooking().then(() => {
    scheduleStore.makeFalseBookingDeleteModal()
    scheduleStore.getAllCommonBookings()
  })
}
onMounted(() => {
  scheduleStore.getAllCommonBookings()
})
</script>

<template>
  <div class="jobs-dashboard">
    <!-- delete job application modal start -->
    <VModal
      :open="scheduleStore.bookingDeleteModal"
      size="small"
      actions="center"
      noclose
      @close="scheduleStore.bookingDeleteModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to Delete the booking?"
        />
      </template>
      <template #action>
        <VButton @click="deleteBooking()" raised>Confirm</VButton>
      </template>
    </VModal>
    <!-- delete job application modal start -->
    <VModal
      :open="scheduleStore.bookingViewModal"
      size="small"
      actions="center"
      noclose
      @close="scheduleStore.bookingViewModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to Accept the booking?"
        />
        <!--Field-->

        <VField>
          <label
            >Please provide the appointmet date on
            {{ scheduleStore.dayMust }}</label
          >
          <VControl>
            <input
              v-model="scheduleStore.appointmentDate"
              type="date"
              class="input"
              placeholder="Appointment Date"
              autocomplete="family-name"
            />
          </VControl>
        </VField>
      </template>
      <template #action>
        <VButton @click="updateStatusForBooking()" raised>Confirm</VButton>
      </template>
    </VModal>
    <VModal
      :open="scheduleStore.bookingViewRejectedModal"
      size="small"
      actions="center"
      noclose
      @close="scheduleStore.bookingViewRejectedModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to Reject the booking?"
        />
      </template>
      <template #action>
        <VButton @click="updateStatusForBookingReject()" raised
          >Confirm</VButton
        >
      </template>
    </VModal>
    <!-- delete job application modal end -->
    <!--Dashboard content -->
    <div class="main-container">
      <VCard class="m-h-1000">
        <div class="illustration-header"></div>
        <div class="flex-table">
          <div
            class="flex-table-header"
            :class="[scheduleStore.bookings.length === 0 && 'is-hidden']"
          >
            <span class="">Teacher</span>
            <span class="">Course</span>
            <span class="">Agenda</span>
            <span>Student</span>
            <span>Day</span>
            <span>From</span>

            <span>To</span>

            <span>Applied</span>
            <span>Appointment Date</span>

            <span>Status</span>

            <span class="cell-end">Actions</span>
          </div>
          <div class="flex-list-inner">
            <transition-group name="list" tag="div">
              <div
                v-for="(item, index) in scheduleStore.bookings"
                :key="index"
                class="flex-table-item"
              >
                <div class="flex-table-cell is-media">
                  <div>
                    <span class="item-name dark-inverted dots-name"
                      >{{ item.userDetails[0].name }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell is-media">
                  <div>
                    <span class="item-name dark-inverted dots-name"
                      >{{ item.userDetails[0].course }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell is-media">
                  <div>
                    <span class="item-name dark-inverted dots-name"
                      >{{ item.agenda }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell is-media">
                  <div>
                    <span class="item-name dark-inverted dots-name"
                      >{{
                        userStore.userData.type == 'student'
                          ? userStore.userData.name
                          : item.studentDetails[0].name
                      }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell is-media">
                  <div v-if="item.scheduleDetails.length > 0">
                    <span class="item-name dark-inverted dots-name">
                      {{ item.scheduleDetails[0].day }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell is-media">
                  <div v-if="item.scheduleDetails.length > 0">
                    <span class="item-name dark-inverted dots-name">
                      {{
                        item.scheduleDetails[0].start_time < 12
                          ? item.scheduleDetails[0].start_time + ' AM'
                          : (item.scheduleDetails[0].start_time - 12 == 0
                              ? 12
                              : item.scheduleDetails[0].start_time - 12) + ' PM'
                      }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell is-media">
                  <div v-if="item.scheduleDetails.length > 0">
                    <span class="item-name dark-inverted dots-name">
                      {{
                        item.scheduleDetails[0].end_time < 12
                          ? item.scheduleDetails[0].end_time + ' AM'
                          : (item.scheduleDetails[0].end_time - 12 == 0
                              ? 12
                              : item.scheduleDetails[0].end_time - 12) + ' PM'
                      }}
                    </span>
                  </div>
                </div>
                <div class="flex-table-cell" data-th="Date">
                  <small
                    class="light-text text-center"
                    v-tooltip="
                      'Applied on ' +
                      moment(item.time).format('DD/MM/YYYY [at] LT')
                    "
                  >
                    {{ moment(item.time).fromNow(false) }}
                  </small>
                </div>
                <div class="flex-table-cell" data-th="Date">
                  <small class="light-text text-center">
                    {{ item.appointment ? item.appointment : 'N/A' }}
                  </small>
                </div>

                <div class="flex-table-cell" data-th="Status">
                  <span v-if="item.status === 'Pending'" class="tag">{{
                    item.status
                  }}</span>

                  <span
                    v-else-if="item.status === 'Approved'"
                    class="tag is-primary"
                    >{{ item.status }}</span
                  >
                  <span
                    v-else-if="item.status === 'Rejected'"
                    class="tag is-danger"
                    >{{ item.status }}</span
                  >
                </div>

                <div
                  @click="scheduleStore.setBookinData(item)"
                  class="flex-table-cell cell-end"
                  data-th="Actions"
                >
                  <FlexTableDropdown />
                </div>
              </div>
            </transition-group>
          </div>
        </div>
        <span v-if="scheduleStore.bookings.length == 0"> No Data </span>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../scss/abstracts/_mixins.scss';
.m-h-1000 {
  min-height: 1000px;
}
.tag-wide {
  width: 100%;
  text-align: center;
}
.table {
  td {
    border: none !important;
  }
}
.job-card {
  text-align: center !important;
}

.buttons-status {
  margin: 0 auto;
  display: table;
  margin-top: 10px !important;
}
.list-view-item {
  margin-bottom: 6px !important;
  padding: 8px !important;
}
.text-center {
  text-align: center !important;
}
.flex-table-item {
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }
  .colorGray {
    color: #e2e2e2;
    font-size: 0.75rem !important;
  }
}

.alert {
  // background-color: var(--white) !important;
  border-radius: 10px;
  // border: 1px solid var(--fade-grey-dark-3) !important;
}
.warning-text {
  color: #f9c108 !important;
}

:root {
  --header-bg-color: #fff;
  --search-border-color: #efefef;
  --subtitle-color: #83838e;
  --button-color: var(--white);
  --input-color: var(--subtitle-color);
}

.is-dark {
  --header-bg-color: var(--dark-sidebar-light-2);
  --search-border-color: var(--dark-sidebar-light-8);
  --input-color: var(--white);
}

.dots-name {
  overflow: hidden !important;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.dots {
  font-size: 0.9rem;
  overflow: hidden;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.jobs-dashboard {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: hidden;

  .jobs-dashboard-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    scroll-behavior: smooth;
    overflow: auto;
  }
  .search-info {
    widows: 100%;
    text-align: center;
  }
  .search-menu {
    height: 56px;
    white-space: nowrap;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    background-color: var(--header-bg-color);
    border-radius: 8px;
    width: 100%;
    padding-left: 0.75rem;

    > div:not(:last-of-type) {
      border-right: 1px solid var(--search-border-color);
    }

    .search-bar {
      height: 55px;
      width: 100%;
      position: relative;
      display: flex;
      align-items: center;
      padding-right: 1.5rem;

      .field {
        width: 100%;
      }

      .multiselect-tags {
        padding-left: 2.5rem;
      }
    }

    .search-location,
    .search-job,
    .search-salary {
      display: flex;
      align-items: center;
      width: 50%;
      font-size: 14px;
      font-weight: 500;
      padding: 0 25px;
      height: 100%;
      font-family: var(--font);

      input {
        width: 100%;
        height: 100%;
        display: block;
        font-family: var(--font);
        color: var(--input-color);
        background-color: transparent;
        border: none;
        outline: none;
      }
      svg {
        margin-right: 0.5rem;
        width: 18px;
        color: var(--primary);
        flex-shrink: 0;
      }
    }

    .search-button {
      background-color: var(--primary);
      min-width: 120px;
      height: 55px;
      border: none;
      font-weight: 500;
      font-family: var(--font);
      padding: 0 1rem;
      border-radius: 0 0.75rem 0.75rem 0;
      color: var(--button-color);
      cursor: pointer;
      margin-left: auto;
    }
  }

  .main-container {
    display: flex;
    flex-grow: 1;
    padding-top: 2rem;

    .search-type {
      width: 270px;
      display: flex;
      flex-direction: column;
      height: 100%;
      flex-shrink: 0;
    }

    .alert {
      background-color: var(--widget-grey);
      padding: 1.75rem;
      border-radius: 8px;

      .alert-title {
        font-size: 1rem;
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 0.75rem;
      }

      .alert-subtitle {
        font-size: 13px;
        font-family: var(--font);
        color: var(--subtitle-color);
        margin-bottom: 1.5rem;
      }

      input {
        border-radius: 6px;
      }
    }

    .job-time {
      padding-top: 1.75rem;

      .job-wrapper {
        padding-top: 1.75rem;
      }

      .job-time-title {
        font-size: 0.95rem;
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
      }

      .type-container {
        display: flex;
        align-items: center;
        color: var(--subtitle-color);
        font-size: 13px;

        label {
          margin-left: 2px;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        + .type-container {
          margin-top: 10px;
        }

        .job-number {
          margin-left: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 25px;
          min-width: 25px;
          background-color: var(--white);
          color: var(--subtitle-color);
          font-size: 0.8rem;
          font-family: var(--font);
          font-weight: 500;
          padding: 0 0.25rem;
          border-radius: 50rem;
        }
      }
    }

    .searched-jobs {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding-left: 2.5rem;
    }

    .searched-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .searched-count {
        font-family: var(--font-alt);
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--dark-text);
      }
    }
  }
}

.is-dark {
  .jobs-dashboard {
    .job-card {
      @include vuero-card--dark();
    }

    .main-container {
      .alert {
        @include vuero-card--dark();
      }

      .job-time {
        .job-number {
          background: var(--dark-sidebar-light-2);
        }
      }
    }
  }
}

@media screen and (max-width: 620px) {
  .job-cards {
    grid-template-columns: repeat(1, 1fr);
  }
}

@media screen and (max-width: 730px) {
  .job-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 767px) {
  .jobs-dashboard {
    .search-menu {
      flex-direction: column;
      height: auto;
      padding: 1rem;

      > div:not(:last-of-type) {
        border-right: none;
      }

      .search-bar {
        padding: 0;
      }

      .search-location,
      .search-job,
      .search-salary {
        width: 100%;
        height: 44px;
        padding: 0;
      }

      .search-button {
        width: 100%;
        border-radius: 0.75rem;
      }
    }

    .main-container {
      .search-type {
        display: none;
      }

      .searched-jobs {
        padding-left: 0;
      }
    }
  }
}
</style>
