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

// Get initials from name
// const filter = (status: string) => {
//   job_application.filters.status = status
//   job_application.get()
// }

let itemOfCard: any = ref({})
// const assignDetailsOfPositionCard = (job_title: any) => {
//   let index: number = job_application.job_categories.findIndex(
//     (x: any) => x.job_title == job_title
//   )
//   job_application.get_job_status_statistics_according_to_job(
//     job_application.job_categories[index].id
//   )

//   itemOfCard.value = job_application.job_categories[index]
//   if (itemOfCard.value.created_at) {
//     itemOfCard.value.created_at = itemOfCard.value.created_at
//       .substring(0, 10)
//       .split('-')
//     itemOfCard.value.created_at =
//       itemOfCard.value.created_at[2] +
//       '/' +
//       itemOfCard.value.created_at[1] +
//       '/' +
//       itemOfCard.value.created_at[0]
//   }
//   job_application.get()
// }

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
          title="Are you sure you want to Delete the  the application?"
        />
      </template>
      <template #action>
        <VButton @click="scheduleStore.deleteOfBooking()" raised
          >Confirm</VButton
        >
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
          title="Are you sure you want to Accept the  the application?"
        />
      </template>
      <template #action>
        <VButton @click="scheduleStore.statusUpdateOfBooking()" raised
          >Confirm</VButton
        >
      </template>
    </VModal>
    <!-- delete job application modal end -->
    <!--Dashboard content -->
    <div class="main-container">
      <!--Left Alert -->
      <div class="search-type">
        <VCard class="m-b-30 p-b-30 p-t-30">
          <div class="title is-6 m-b-5">Filter job applications</div>
          <p class="m-b-20">
            <small>
              Filter by status, job position, candidate's email or name
            </small>
          </p>
          <VField>
            <VControl class="has-icons-left">
              <div class="select">
                <!-- <select
                  v-model="job_application.filters.status"
                  @change="
                    assignDetailsOfPositionCard(
                      job_application.filters.job_position
                    )
                  "
                >
                  <option value="">Select a status</option>
                  <option value="Pending">Pending</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Hired">Hired</option>
                  <option value="Offered">Offered</option>
                  <option value="Rejected">Rejected</option>
                </select> -->
              </div>
              <div class="icon is-small is-left">
                <i class="iconify" data-icon="feather:sliders"></i>
              </div>
            </VControl>
          </VField>

          <VField>
            <VControl class="has-icons-left">
              <div class="select">
                <!-- <select
                  v-model="job_application.filters.job_position"
                  @change="
                    assignDetailsOfPositionCard(
                      job_application.filters.job_position
                    )
                  "
                >
                  <option value="">Select a position</option>

                  <option
                    v-for="(item, index) in job_application.job_categories"
                    :key="index"
                    :value="item.job_title"
                  >
                    {{ item.job_title }}
                  </option>
                </select> -->
              </div>
              <div class="icon is-small is-left">
                <i class="iconify" data-icon="feather:briefcase"></i>
              </div>
            </VControl>
          </VField>

          <VField>
            <VControl class="has-icons-left">
              <div class="select">
                <!-- <select
                  v-model="job_application.filters.country"
                  @change="job_application.get()"
                >
                  <option value="" selected>Select a country</option>

                  <option
                    v-for="(item, index) in allcountries"
                    :key="index"
                    :value="item.name"
                  >
                    {{ item.name }}
                  </option>
                </select> -->
              </div>
              <div class="icon is-small is-left">
                <i class="iconify" data-icon="feather:globe"></i>
              </div>
            </VControl>
          </VField>

          <VField class="m-t-25 m-b-5">
            <VControl icon="feather:search">
              <!-- <input
                v-model="job_application.filters.searchkey"
                type="text"
                class="input"
                placeholder="Candidate's name or email"
                @keyup.enter="job_application.get()"
              /> -->
            </VControl>
          </VField>
          <small class="search-info"><p>Press enter to search</p></small>
        </VCard>
        <!-- {{ job_application.filters }} -->

        <!-- <VCard
          v-if="job_application.filters.job_position"
          class="m-b-30 p-b-30 p-t-20 job-card"
        >
          <div class="">
            <img
              src="/@src/assets/illustrations/expired.png"
              alt="Expired Job"
            />

            <h3 class="title title-job m-b-10 title is-5">
              {{ job_application.filters.job_position }}
            </h3>
            <p class="title title-job m-b-30 title is-6">
              Applications
              {{ job_application.stats ? job_application.stats.All : 0 }}
            </p>
            <VButton
              class="m-t-20"
              color="primary"
              bold
              icon="feather:edit"
              fullwidth
              @click="
                open(
                  job_application.job_categories[
                    job_application.job_categories.findIndex(
                      (x) => x.job_title == job_application.filters.job_position
                    )
                  ]
                )
              "
              >Edit Opening</VButton
            >
            <VButton
              fullwidth
              bold
              class="m-t-10"
              icon="feather:copy"
              >Copy Sharing Link</VButton
            >
            <small
              ><p class="m-t-30">
                Click <b>Edit Opening</b> to edit application sharing options
              </p></small
            >
          </div>
        </VCard> -->
      </div>

      <!--Results-->
      <div class="searched-jobs">
        <!--Results toolbar-->

        <!--Results content-->
        <div class="page-content-inner">
          <div class="flex-list-wrapper flex-list-v1">
            <VCard class="p-b-60">
              <div class="illustration-header"></div>
              <div class="flex-table">
                <div
                  class="flex-table-header"
                  :class="[scheduleStore.bookings.length === 0 && 'is-hidden']"
                >
                  <span class="">Teacher</span>
                  <span>Student</span>
                  <span>From</span>

                  <span>To</span>

                  <span>Applied</span>

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
                            >{{
                              userStore.userData.type == 'student'
                                ? userStore.userData.name
                                : item.studentDetails[0].name
                            }}
                          </span>
                        </div>
                      </div>
                      <div class="flex-table-cell is-media">
                        <div>
                          <span class="item-name dark-inverted dots-name">
                            {{
                              item.scheduleDetails[0].start_time < 12
                                ? item.scheduleDetails[0].start_time + ' AM'
                                : (item.scheduleDetails[0].start_time - 12 == 0
                                    ? 12
                                    : item.scheduleDetails[0].start_time - 12) +
                                  ' PM'
                            }}
                          </span>
                        </div>
                      </div>
                      <div class="flex-table-cell is-media">
                        <div>
                          <span class="item-name dark-inverted dots-name">
                            {{
                              item.scheduleDetails[0].end_time < 12
                                ? item.scheduleDetails[0].end_time + ' AM'
                                : (item.scheduleDetails[0].end_time - 12 == 0
                                    ? 12
                                    : item.scheduleDetails[0].end_time - 12) +
                                  ' PM'
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

                      <div class="flex-table-cell" data-th="Status">
                        <span v-if="item.status === 'Pending'" class="tag">{{
                          item.status
                        }}</span>

                        <span
                          v-else-if="item.status === 'Approved'"
                          class="tag is-primary"
                          >{{ item.status }}</span
                        >
                      </div>

                      <div
                        @click="scheduleStore.setBookinData(item, index)"
                        class="flex-table-cell cell-end"
                        data-th="Actions"
                      >
                        <FlexTableDropdown />
                      </div>
                    </div>
                  </transition-group>
                </div>
              </div>

              <!-- <div
                v-if="
                  job_application.dataList.length > 0 &&
                  job_application.total > 10
                "
              >
                <VFlexPagination
                  :item-per-page="job_application.perPage"
                  :total-items="job_application.total"
                  :current-page="job_application.currentPage"
                  :max-links-displayed="job_application.maxPage"
                />
              </div>
              <VPlaceholderPage
                v-if="
                  job_application.placeloader &&
                  job_application.dataList.length == 0
                "
                title="No job applications is been applied yet"
                subtitle="Too bad. Looks like we couldn't find any matching results for the
                  search terms you've entered. Please try different search terms or
                  criteria."
                larger
              >
                <template #image>
                  <img
                    class="light-image"
                    src="/@src/assets/illustrations/placeholders/search-4.svg"
                    alt=""
                  />
                  <img
                    class="dark-image"
                    src="/@src/assets/illustrations/placeholders/search-4-dark.svg"
                    alt=""
                  />
                </template>
              </VPlaceholderPage> -->
            </VCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../../scss/abstracts/_mixins.scss';
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
