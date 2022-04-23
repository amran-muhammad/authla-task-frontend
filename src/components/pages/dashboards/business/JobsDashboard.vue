<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useJobApplication } from '/@src/stores/jobApplication'
import { useJobOpening } from '/@src/stores/jobOpening'
import { useRouter } from 'vue-router'

import moment from 'moment'
import useNotyf from '/@src/composable/useNotyf'

import { useCountryMobile } from '/@src/assets/countrymobile.json'
const allcountries = useCountryMobile
const notyf = useNotyf()

function copylink(text: string) {
  var textArea = document.createElement('textarea')
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    notyf.success('Link is been copied to clipboard')
  } catch (err) {
    console.log('Oops, unable to copy')
  }
  document.body.removeChild(textArea)
}

moment.updateLocale('en', {
  relativeTime: {
    ss: '%d sec',
    mm: '%d min',
    hh: '%d h',
    MM: '%d mon',
  },
})
const jobOpening: any = useJobOpening()
const router = useRouter()
const open = async (value: object) => {
  jobOpening.editData(value)
  router.push('/job_opening/edit')
}

let job_application: any = useJobApplication()

// Get initials from name
const getInitials = (name: any) => {
  let initials = name.split(' ')
  if (initials.length > 1) {
    initials = initials.shift().charAt(0) + initials.pop().charAt(0)
  } else {
    initials = name.substring(0, 2)
  }
  return initials.toUpperCase()
}

// Get initials from name
const filter = (status: string) => {
  job_application.filters.status = status
  job_application.get()
}

let itemOfCard: any = ref({})
const assignDetailsOfPositionCard = (job_title: any) => {
  let index: number = job_application.job_categories.findIndex(
    (x: any) => x.job_title == job_title
  )
  job_application.get_job_status_statistics_according_to_job(
    job_application.job_categories[index].id
  )

  itemOfCard.value = job_application.job_categories[index]
  if (itemOfCard.value.created_at) {
    itemOfCard.value.created_at = itemOfCard.value.created_at
      .substring(0, 10)
      .split('-')
    itemOfCard.value.created_at =
      itemOfCard.value.created_at[2] +
      '/' +
      itemOfCard.value.created_at[1] +
      '/' +
      itemOfCard.value.created_at[0]
  }
  job_application.get()
}

onMounted(() => {
  job_application.get_job_catagories().then(() => {
    if (jobOpening.job_opening_name) {
      job_application.filters.job_position = jobOpening.job_opening_name
      assignDetailsOfPositionCard(jobOpening.job_opening_name)
    } else {
      job_application.get()
    }
  })
})
</script>

<template>
  <div class="jobs-dashboard">
    <!-- delete job application modal start -->
    <VModal
      :open="job_application.jobApplicationDeleteModal"
      size="small"
      actions="center"
      noclose
      @close="job_application.jobApplicationDeleteModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to delete the  the application?"
        />
      </template>
      <template #action>
        <VButton
          :loading="!job_application.loading"
          @click="
            job_application.deleteTheApplication(job_application.app_holder.id)
          "
          raised
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
                <select
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
                </select>
              </div>
              <div class="icon is-small is-left">
                <i class="iconify" data-icon="feather:sliders"></i>
              </div>
            </VControl>
          </VField>

          <VField>
            <VControl class="has-icons-left">
              <div class="select">
                <select
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
                </select>
              </div>
              <div class="icon is-small is-left">
                <i class="iconify" data-icon="feather:briefcase"></i>
              </div>
            </VControl>
          </VField>

          <VField>
            <VControl class="has-icons-left">
              <div class="select">
                <select
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
                </select>
              </div>
              <div class="icon is-small is-left">
                <i class="iconify" data-icon="feather:globe"></i>
              </div>
            </VControl>
          </VField>

          <VField class="m-t-25 m-b-5">
            <VControl icon="feather:search">
              <input
                v-model="job_application.filters.searchkey"
                type="text"
                class="input"
                placeholder="Candidate's name or email"
                @keyup.enter="job_application.get()"
              />
            </VControl>
          </VField>
          <small class="search-info"><p>Press enter to search</p></small>

          <table class="m-t-15">
            <tr>
              <td>
                <VSwitchBlock
                  class="m-r-40"
                  v-model="job_application.filters.text"
                  :checked="job_application.filters.text"
                  @change="job_application.get()"
                  label="Text"
                  color="primary"
                />
              </td>

              <td>
                <VSwitchBlock
                  v-model="job_application.filters.video"
                  :checked="job_application.filters.video"
                  @change="job_application.get()"
                  label="Video"
                  color="primary"
                />
              </td>
            </tr>
          </table>
        </VCard>
        <!-- {{ job_application.filters }} -->

        <VCard
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
              @click="
                copylink(
                  jobOpening.origin +
                    '/shared_applications/' +
                    job_application.job_categories[
                      job_application.job_categories.findIndex(
                        (x: any) =>
                          x.job_title == job_application.filters.job_position
                      )
                    ].encrypt_id_url
                )
              "
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
        </VCard>
      </div>

      <!--Results-->
      <div class="searched-jobs">
        <!--Results toolbar-->

        <!--Results content-->
        <div class="page-content-inner">
          <div class="flex-list-wrapper flex-list-v1">
            <VCard
              v-if="!job_application.filters.job_position"
              class="column p-50 m-b-25 is-12"
            >
              <div class="columns is-multiline is-flex-tablet-p">
                <div class="column is-one-fifth">
                  <div class="dashboard-card">
                    <VBlock
                      :title="job_application.total_job_opening"
                      subtitle="Jobs Posted"
                      center
                    >
                      <template #icon>
                        <VIconBox color="primary-grey" rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:briefcase"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-one-fifth">
                  <div class="dashboard-card">
                    <VBlock
                      :title="job_application.total_job_application"
                      subtitle="Applications"
                      center
                    >
                      <template #icon>
                        <VIconBox color="purple" rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:radio"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-one-fifth">
                  <div class="dashboard-card">
                    <VBlock
                      :title="job_application.total_job_application_pending"
                      subtitle="Pending"
                      center
                    >
                      <template #icon>
                        <VIconBox color="yellow" rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:box"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-one-fifth">
                  <div class="dashboard-card">
                    <VBlock
                      :title="job_application.total_job_application_accepted"
                      subtitle="Hired"
                      center
                    >
                      <template #icon>
                        <VIconBox color="green" rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:check"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
                <div class="column is-one-fifth">
                  <div class="dashboard-card">
                    <VBlock
                      :title="job_application.total_job_application_rejected"
                      subtitle="Rejected"
                      center
                    >
                      <template #icon>
                        <VIconBox color="orange" rounded>
                          <i
                            aria-hidden="true"
                            class="iconify"
                            data-icon="feather:frown"
                          ></i>
                        </VIconBox>
                      </template>
                    </VBlock>
                  </div>
                </div>
              </div>
            </VCard>

            <VCard
              class="m-b-20 card-buttons"
              v-if="job_application.filters.job_position"
            >
              <VButtons class="buttons-status">
                <VButton
                  :color="
                    job_application.filters.status == 'Pending' ? 'dark' : ''
                  "
                  bold
                  icon="feather:box"
                  @click="filter('Pending')"
                >
                  Pending:
                  {{
                    job_application.stats ? job_application.stats.Pending : 0
                  }}
                </VButton>
                <VButton
                  :color="
                    job_application.filters.status == 'Shortlisted'
                      ? 'dark'
                      : ''
                  "
                  bold
                  icon="feather:user-check"
                  @click="filter('Shortlisted')"
                >
                  Shortlisted:
                  {{
                    job_application.stats
                      ? job_application.stats.Shortlisted
                      : 0
                  }}
                </VButton>
                <VButton
                  :color="
                    job_application.filters.status == 'Interviewed'
                      ? 'dark'
                      : ''
                  "
                  bold
                  icon="feather:user-check"
                  @click="filter('Interviewed')"
                >
                  Interviewed:
                  {{
                    job_application.stats
                      ? job_application.stats.Interviewed
                      : 0
                  }}
                </VButton>
                <VButton
                  :color="
                    job_application.filters.status == 'Offered' ? 'dark' : ''
                  "
                  bold
                  icon="feather:help-circle"
                  @click="filter('Offered')"
                >
                  Offered:
                  {{
                    job_application.stats ? job_application.stats.Offered : 0
                  }}
                </VButton>
                <VButton
                  :color="
                    job_application.filters.status == 'Hired' ? 'primary' : ''
                  "
                  bold
                  icon="feather:check-circle"
                  @click="filter('Hired')"
                >
                  {{ job_application.stats ? job_application.stats.Hired : 0 }}
                </VButton>
                <VButton
                  :color="
                    job_application.filters.status == 'Rejected' ? 'danger' : ''
                  "
                  bold
                  icon="feather:x-circle"
                  @click="filter('Rejected')"
                >
                  {{
                    job_application.stats ? job_application.stats.Rejected : 0
                  }}
                </VButton>
              </VButtons>
            </VCard>
            <div class="columns">
              <div class="column is-3">
                <h3 class="title is-6 m-b-15 p-l-5 p-t-10">
                  Results:
                  {{ job_application.total }}
                </h3>
              </div>
              <div class="column is-7"></div>
              <div class="column is-2">
                <VField>
                  <VControl class="has-icons-left">
                    <div class="select is-rounded">
                      <select
                        v-model="job_application.filters.sort"
                        @change="job_application.get()"
                      >
                        <option value="DESC" selected>Sort</option>
                        <option value="DESC" selected>Newest</option>
                        <option value="ASC" selected>Oldest</option>
                      </select>
                    </div>
                    <div class="icon is-small is-left">
                      <i class="iconify" data-icon="feather:filter"></i>
                    </div>
                  </VControl>
                </VField>
              </div>
            </div>
            <VCard class="p-b-60">
              <div class="illustration-header"></div>
              <div class="flex-table" v-if="job_application.placeloader">
                <div
                  class="flex-table-header"
                  :class="[
                    job_application.dataList.length === 0 && 'is-hidden',
                  ]"
                >
                  <span class="is-grow">Candidate</span>
                  <span>Date</span>

                  <span>Position</span>

                  <span>Status</span>
                  <span>V/Q</span>

                  <span>Shared</span>

                  <span class="cell-end">Actions</span>
                </div>
                <div class="flex-list-inner">
                  <transition-group name="list" tag="div">
                    <div
                      v-for="item in job_application.dataList"
                      :key="item.id"
                      class="flex-table-item"
                    >
                      <div
                        @click="job_application.setJobApps(item, index, true)"
                        class="flex-table-cell is-media is-grow"
                      >
                        <VAvatar
                          :initials="getInitials(item.name)"
                          :color="'h-danger'"
                          size="medium"
                        />
                        <div>
                          <span class="item-name dark-inverted dots-name"
                            >{{
                              item.name.length > 15
                                ? item.name.slice(0, 12) + '…'
                                : item.name
                            }}
                          </span>
                          <span class="rating colorGray">
                            <i
                              class="fas fa-star"
                              aria-hidden="true"
                              :class="[item.score >= 1 && 'warning-text']"
                            ></i>
                            <i
                              class="fas fa-star"
                              aria-hidden="true"
                              :class="[item.score >= 2 && 'warning-text']"
                            ></i>
                            <i
                              class="fas fa-star"
                              aria-hidden="true"
                              :class="[item.score >= 3 && 'warning-text']"
                            ></i>
                            <i
                              class="fas fa-star"
                              aria-hidden="true"
                              :class="[item.score >= 4 && 'warning-text']"
                            ></i>
                            <i
                              class="fas fa-star"
                              aria-hidden="true"
                              :class="[item.score >= 5 && 'warning-text']"
                            ></i>
                          </span>
                        </div>
                      </div>
                      <div
                        @click="job_application.setJobApps(item, index, true)"
                        class="flex-table-cell"
                        data-th="Date"
                      >
                        <small
                          class="light-text text-center"
                          v-tooltip="
                            'Applied on ' +
                            moment(item.created_at).format('DD/MM/YYYY [at] LT')
                          "
                        >
                          {{ moment(item.created_at).fromNow(false) }}
                        </small>
                      </div>
                      <div
                        @click="job_application.setJobApps(item, index, true)"
                        class="flex-table-cell"
                        data-th="Position"
                      >
                        <span class="light-text dots"
                          >{{ item.job_opening.job_title }}
                        </span>
                      </div>

                      <div
                        @click="job_application.setJobApps(item, index, true)"
                        class="flex-table-cell"
                        data-th="Status"
                      >
                        <span v-if="item.status === 'Pending'" class="tag">{{
                          item.status
                        }}</span>
                        <span
                          v-if="item.status === 'Shortlisted'"
                          class="tag is-info"
                          >{{ item.status }}</span
                        >
                        <span
                          v-if="item.status === 'Offered'"
                          class="tag is-warning"
                          >{{ item.status }}</span
                        >
                        <span
                          v-if="item.status === 'Interviewed'"
                          class="tag is-info"
                          >{{ item.status }}</span
                        >
                        <span
                          v-else-if="item.status === 'Rejected'"
                          class="tag is-danger"
                          >{{ item.status }}</span
                        >
                        <span
                          v-else-if="item.status === 'Hired'"
                          class="tag is-primary"
                          >{{ item.status }}</span
                        >
                      </div>
                      <div class="flex-table-cell" data-th="Position">
                        <small class="light-text m-t-5">
                          <i
                            v-if="item.video_answer.length"
                            class="iconify m-r-5"
                            data-icon="feather:video"
                            aria-hidden="true"
                          ></i>

                          <i
                            v-if="item.answer.length"
                            class="iconify"
                            data-icon="feather:type"
                            aria-hidden="true"
                          ></i>
                        </small>
                      </div>
                      <span class="flex-table-cell">
                        <div class="control">
                          <div class="">
                            <label
                              :for="'block-switch-' + item.id"
                              class="form-switch"
                              ><input
                                :checked="item.is_shared"
                                color="primary"
                                :value="item.is_shared"
                                @change="
                                  job_application.share_applications(
                                    item.id,
                                    !item.is_shared ? 1 : 0
                                  )
                                "
                                :id="'block-switch-' + item.id"
                                type="checkbox"
                                class="is-switch" /><i aria-hidden="true"></i
                            ></label>
                          </div>
                        </div>
                      </span>
                      <div
                        class="flex-table-cell cell-end"
                        data-th="Actions"
                        @click="job_application.setJobApps(item, index, false)"
                      >
                        <FlexTableDropdown />
                      </div>
                    </div>
                  </transition-group>
                </div>
              </div>
              <div class="flex-table" v-else>
                <div class="flex-table-header">
                  <span class="is-grow">Candidate</span>
                  <span>Date</span>
                  <span>Position</span>

                  <span>Status</span>
                  <span>V/Q</span>

                  <span>Shared</span>

                  <span class="cell-end">Actions</span>
                </div>
                <PlaceloadV1 />
              </div>

              <div
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
              </VPlaceholderPage>
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
