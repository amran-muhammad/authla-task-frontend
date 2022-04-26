
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import hrQuote from '/@src/data/landing/hr-quote.json'
import { useScheduleStore } from '/@src/stores/scheduleStore'

import { useUserStore } from '/@src/stores/userStore'

const random = Math.floor(Math.random() * 101)
const quotes = hrQuote
const scheduleStore = useScheduleStore()
const userStore: any = useUserStore()
let id = ref('')
let userDeactivateModal = ref(false)
let userActivateModal = ref(false)
let userEditModal = ref(false)
let userAddModal = ref(false)

function copyUserData(item: any) {
  userEditModal.value = true
  userStore.edit_data._id = item._id
  userStore.edit_data.name = item.name
  userStore.edit_data.email = item.email
  userStore.edit_data.type = item.type
  userStore.edit_data.department = item.department
  userStore.edit_data.course = item.course
  userStore.edit_data.studentID = item.studentID
  userStore.edit_data.status = item.status
}
function userEdit() {
  userStore.updateUser().then(() => {
    userStore.getAllStudent()
  })
  userEditModal.value = false
}
function userAdd() {
  userStore.form_data.type = 'student'
  userStore.addUser().then(() => {
    userStore.getAllStudent()
  })
  userAddModal.value = false
}

function makeReadyForUpdateStatusActive(obj: any) {
  id.value = obj._id
  userActivateModal.value = true
}
function makeReadyForUpdateStatusDeactive(obj: any) {
  id.value = obj._id
  userDeactivateModal.value = true
}
function deactivateUser() {
  userStore.statusUpdateOfUserDeactiveStudent(id.value).then(() => {
    userStore.getAllStudent()
  })
  userDeactivateModal.value = false
}
function activateUser() {
  userStore.statusUpdateOfUserActiveStudent(id.value).then(() => {
    userStore.getAllStudent()
  })
  userActivateModal.value = false
}
onMounted(() => {
  userStore.getAllStudent()
})
</script>

<template>
  <div class="lifestyle-dashboard lifestyle-dashboard-v4">
    <VModal
      :open="userAddModal"
      size="medium"
      actions="center"
      noclose
      @close="userAddModal = false"
    >
      <template #content>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Full Name</label>
              <VControl icon="feather:user">
                <input
                  v-model="userStore.form_data.name"
                  type="text"
                  class="input"
                  placeholder="Full Name"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Student ID</label>
              <VControl icon="feather:user">
                <input
                  v-model="userStore.form_data.studentID"
                  type="text"
                  class="input"
                  placeholder="Student ID"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Email</label>
              <VControl icon="feather:mail">
                <input
                  v-model="userStore.form_data.email"
                  type="text"
                  class="input"
                  placeholder="Email"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Password</label>
              <VControl icon="feather:mail">
                <input
                  v-model="userStore.form_data.password"
                  type="password"
                  class="input"
                  placeholder="Password"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Department</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select v-model="userStore.form_data.department">
                    <option value="Advertising and marketing">
                      Advertising and marketing
                    </option>
                    <option value="Aerospace">Aerospace</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Business Consultation">
                      Business Consultation
                    </option>
                    <option value="Computer and technology">
                      Computer and technology
                    </option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Energy">Energy</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Finance and economic">
                      Finance and economic
                    </option>
                    <option value="Food and beverage">Food and beverage</option>
                    <option value="Health care">Health care</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media and news">Media and news</option>
                    <option value="Mining">Mining</option>
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other industries">Other industries</option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-archway"></i>
                </div>
              </VControl>
            </VField>
          </div>

          <div class="column is-6">
            <VField>
              <label>Status</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select v-model="userStore.form_data.status">
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-archway"></i>
                </div>
              </VControl>
            </VField>
          </div>
        </div>
      </template>
      <template #action>
        <VButton @click="userAdd()" raised>Confirm</VButton>
      </template>
    </VModal>
    <VModal
      :open="userEditModal"
      size="medium"
      actions="center"
      noclose
      @close="userEditModal = false"
    >
      <template #content>
        <div class="columns is-multiline">
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Full Name</label>
              <VControl icon="feather:user">
                <input
                  v-model="userStore.edit_data.name"
                  type="text"
                  class="input"
                  placeholder="Full Name"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Student ID</label>
              <VControl icon="feather:user">
                <input
                  v-model="userStore.edit_data.studentID"
                  type="text"
                  class="input"
                  placeholder="Student ID"
                  autocomplete="given-name"
                />
              </VControl>
            </VField>
          </div>
          <!--Field-->
          <div class="column is-6">
            <VField>
              <label>Email</label>
              <VControl icon="feather:mail">
                <input
                  v-model="userStore.edit_data.email"
                  type="text"
                  class="input"
                  placeholder="Email"
                  autocomplete="family-name"
                />
              </VControl>
            </VField>
          </div>
          <div class="column is-6">
            <VField>
              <label>Department</label>
              <VControl class="has-icons-left">
                <div class="select">
                  <select v-model="userStore.edit_data.department">
                    <option value="Advertising and marketing">
                      Advertising and marketing
                    </option>
                    <option value="Aerospace">Aerospace</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Business Consultation">
                      Business Consultation
                    </option>
                    <option value="Computer and technology">
                      Computer and technology
                    </option>
                    <option value="Construction">Construction</option>
                    <option value="Education">Education</option>
                    <option value="Energy">Energy</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Finance and economic">
                      Finance and economic
                    </option>
                    <option value="Food and beverage">Food and beverage</option>
                    <option value="Health care">Health care</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Media and news">Media and news</option>
                    <option value="Mining">Mining</option>
                    <option value="Pharmaceutical">Pharmaceutical</option>
                    <option value="Telecommunication">Telecommunication</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Other industries">Other industries</option>
                  </select>
                </div>
                <div class="icon is-small is-left">
                  <i class="fas fa-archway"></i>
                </div>
              </VControl>
            </VField>
          </div>
        </div>
      </template>
      <template #action>
        <VButton @click="userEdit" raised>Confirm</VButton>
      </template>
    </VModal>
    <VModal
      :open="userDeactivateModal"
      size="small"
      actions="center"
      noclose
      @close="userDeactivateModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to Deactivate the student?"
        />
      </template>
      <template #action>
        <VButton @click="deactivateUser()" raised>Confirm</VButton>
      </template>
    </VModal>
    <VModal
      :open="userActivateModal"
      size="small"
      actions="center"
      noclose
      @close="userActivateModal = false"
    >
      <template #content>
        <VPlaceholderSection
          title="Are you sure you want to Approve the student?"
        />
      </template>
      <template #action>
        <VButton @click="activateUser()" raised>Confirm</VButton>
      </template>
    </VModal>
    <div class="columns">
      <div class="column is-8">
        <div class="columns is-multiline">
          <!--Header-->
          <div class="column is-12">
            <div class="illustration-header-2">
              <div class="header-meta">
                <h3>Hello, {{ userStore.userData.name }}</h3>
              </div>
              <div class="header-image">
                <img
                  src="/@src/assets/illustrations/dashboards/personal/desk.png"
                  alt=""
                />
              </div>
            </div>
            <VButtons class="m-t-20">
              <VButton @click="userAddModal = true"> Add Student </VButton>
            </VButtons>
          </div>
        </div>
      </div>
      <div class="column is-4">
        <div class="dashboard-card is-upgrade">
          <div class="cta-content">
            <!-- <i class="lnir lnir-quotation" aria-hidden="true"></i> -->
            <p class="dark-inverted">
              {{ quotes[random].quote }}
            </p>
            <p class="dark-inverted">
              <b>- {{ quotes[random].writer }}</b>
            </p>
          </div>
        </div>
      </div>
    </div>

    <VCard
      v-for="(item, index) in userStore.student"
      :key="index"
      class="m-b-10"
    >
      <div>
        <p>Student Name: {{ item.name }}</p>
        <p>Student ID: {{ item.studentID }}</p>
        <p>Email: {{ item.email }}</p>
        <p>Department Name: {{ item.department }}</p>
      </div>
      <VButtons>
        <VButton
          @click="makeReadyForUpdateStatusActive(item)"
          color="info"
          v-if="item.status == 'Pending'"
        >
          Approve
        </VButton>
        <VButton
          @click="makeReadyForUpdateStatusDeactive(item)"
          color="danger"
          v-if="item.status == 'Approved'"
        >
          Deactivate
        </VButton>
        <VButton @click="copyUserData(item)" color="primary"> Edit </VButton>
      </VButtons>
    </VCard>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
.dash_links:hover {
  opacity: 0.7;
}
.lifestyle-dashboard-v4 {
  padding-bottom: 20px;
  padding-top: 50px;
}

.stats {
  min-height: 350px;
}

.dashboard-tile {
  margin: 8px;
  @include vuero-s-card();

  font-family: var(--font);

  .tile-head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      font-family: var(--font-alt);
      color: var(--dark-text);
      font-weight: 600;
    }
  }

  .tile-body {
    font-size: 2rem;
    padding: 4px 0 8px 0;

    span {
      color: var(--dark-text);
      font-weight: 600;
    }
  }

  .tile-foot {
    span {
      &:first-child {
        font-weight: 500;

        svg {
          height: 16px;
          width: 16px;
          margin-right: 6px;
          stroke-width: 3px;
        }
      }

      &:nth-child(2) {
        color: var(--light-text);
        font-size: 0.9rem;
      }
    }
  }
}
.is-dark {
  .dashboard-tile,
  .dashboard-card {
    @include vuero-card--dark();
  }
}
.is-navbar {
  .personal-dashboard {
    margin-top: 30px;
  }
}

.personal-dashboard-v1 {
  .dashboard-header {
    display: flex;
    align-items: center;
    font-family: var(--font);
    margin-bottom: 30px;

    .start {
      margin-left: 12px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.3rem;
        color: var(--dark-text);
      }
    }

    .end {
      margin-left: auto;
      display: flex;
      justify-content: flex-end;

      .button {
        margin-left: 10px;
      }
    }
  }

  .dashboard-body {
    .dashboard-card {
      @include vuero-s-card();
      border-radius: var(--radius-large) !important;
      border: 1px solid var(--fade-grey-dark-3);
      font-family: var(--font);

      > h4,
      .ApexCharts-title-text {
        font-family: var(--font-alt);
        font-size: 1rem;
        font-weight: 600;
        color: var(--dark-text);
        margin-bottom: 12px;
      }

      .quick-stats {
        .quick-stats-inner {
          display: flex;
          flex-wrap: wrap;
          // margin-left: -8px;
          margin-right: -8px;

          .quick-stat {
            width: calc(50% - 16px);
            padding: 40px 20px;
            background: var(--widget-grey);
            margin: 8px;
            // border-radius: var(--radius-large);
            transition: all 0.3s;

            ::v-deep(.media-flex-center) {
              .flex-meta {
                span {
                  &:first-child {
                    font-size: 1.4rem;
                    font-weight: 600;
                    color: var(--dark-text);
                  }
                }
              }
            }
          }
        }
      }
    }

    .dashboard-card {
      &.is-upgrade {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: var(--primary-light-8);

        padding: 20px 40px;
        min-height: 320px;
        border-radius: var(--radius-large) !important;
        border: 1px solid var(--fade-grey-dark-3) !important;
        .lnil,
        .lnir {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          font-size: 4rem;
          opacity: 0.3;
        }

        .cta-content {
          text-align: center;

          h4 {
            font-family: var(--font-alt);
            font-weight: 600;
            font-size: 1.2rem;
            color: var(--smoke-white);
            margin-bottom: 8px;
          }
        }

        .link {
          display: block;
          font-family: var(--font-alt);
          font-weight: 500;
          margin-top: 0.5rem;

          &:hover {
            color: var(--smoke-white);
            opacity: 0.6;
          }
        }
      }
      &.is-gauge {
        position: relative;

        .people {
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          z-index: 5;

          .v-avatar {
            margin: 0 4px;
          }
        }
      }
    }
  }
}
.lifestyle-dashboard-v4 {
  .dashboard-card {
    &.is-upgrade {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background: var(--smoke-white);
      font-family: var(--font);
      padding: 20px 40px;
      min-height: 250px;
      border-radius: var(--radius-large);
      border: 1px solid var(--fade-grey-dark-3);
      .lnil,
      .lnir {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        font-size: 4rem;
        opacity: 0.3;
      }

      .cta-content {
        text-align: center;

        h4 {
          font-family: var(--font-alt);
          font-weight: 600;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
      }

      .link {
        display: block;
        font-family: var(--font-alt);
        font-weight: 500;
        margin-top: 0.5rem;

        &:hover {
          opacity: 0.6;
        }
      }
    }
  }
  .illustration-header-2 {
    display: flex;
    align-items: center;
    padding: 10px;
    height: 250px;
    border-radius: var(--radius-large);
    background: var(--primary);
    font-family: var(--font);
    .header-image {
      width: 240px;
      padding: 10px 0px 20px 0px;

      // img {
      //   position: absolute;
      //   top: 0;
      //   left: -50px;
      //   display: block;
      //   pointer-events: none;
      // }
    }
    @media screen and (max-width: 1024px) {
      .header-image {
        display: none !important;
      }
      .header-meta {
        padding: 40px !important;
      }
    }

    .header-meta {
      margin-left: 30px;
      padding-right: 40px;

      h3 {
        color: var(--smoke-white);
        font-family: var(--font-alt);
        font-weight: 700;
        font-size: 1.4rem;
        max-width: 290px;
      }

      p {
        font-weight: 400;
        color: var(--smoke-white-dark-2);
        margin-bottom: 16px;
        max-width: 320px;
      }

      .action-link {
        span {
          font-size: 0.8rem;
          text-transform: uppercase;
          margin-right: 6px;
        }

        i {
          font-size: 12px;
        }
      }
    }
  }

  .writing-stats {
    display: flex;
    margin-bottom: 1rem;
    margin-left: -8px;
    margin-right: -8px;

    .writing-stat {
      @include vuero-l-card();

      margin: 8px;
      width: calc(33.3% - 16px);
      padding: 12px;

      span {
        display: block;

        &:first-child {
          font-family: var(--font-alt);
          font-size: 0.8rem;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 5px;
          color: var(--light-text);
        }

        &:nth-child(2) {
          font-family: var(--font);
          font-weight: 700;
          font-size: 1.8rem;
          color: var(--dark-text);
        }
      }
    }
  }

  .featured-authors {
    @include vuero-l-card();

    padding: 20px;

    .featured-authors-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .featured-authors-list {
      .featured-authors-item {
        &:not(:last-child) {
          margin-bottom: 20px;
        }

        .media-flex-center {
          .flex-end {
            span {
              font-family: var(--font-alt);
              font-weight: 600;
              color: var(--dark-text);
            }
          }
        }
      }
    }
  }

  .updates {
    @include vuero-l-card();

    padding: 20px;
    margin-top: 8px;

    .updates-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .updates-list {
      .update-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        padding-bottom: 16px;

        &:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        p {
          font-size: 0.9rem;
        }

        span {
          display: block;
          min-width: 60px;
          text-align: right;
          font-family: var(--font);
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--dark-text);
        }
      }
    }
  }

  .articles-feed {
    background: var(--widget-grey);
    padding: 30px;
    border-radius: 12px;

    .articles-feed-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;

      h3 {
        font-family: var(--font-alt);
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--dark-text);
      }

      .action-link {
        font-size: 0.9rem;
      }
    }

    .articles-feed-subheader {
      margin-bottom: 20px;

      .selector {
        .button {
          font-size: 0.8rem;
          border-radius: 50px;
          margin-right: 4px;

          &.is-selected {
            background: var(--primary);
            color: var(--white);
            border-color: var(--primary);
            box-shadow: var(--primary-box-shadow);
          }
        }
      }
    }

    .articles-feed-list {
      .articles-feed-list-inner {
        .articles-feed-item {
          display: block;

          &:not(:last-child) {
            margin-bottom: 20px;
          }

          .featured-image {
            height: 180px;
            overflow: hidden;
            border-top-left-radius: 18px;
            border-top-right-radius: 18px;

            img {
              display: block;
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .featured-content {
            position: relative;
            padding: 25px;
            border-radius: 18px;
            background: var(--white);
            margin-top: -40px;
            z-index: 1;

            h4,
            p {
              margin-bottom: 10px;
            }

            h4 {
              font-family: var(--font-alt);
              font-size: 1rem;
              font-weight: 600;
              color: var(--dark-text);
            }

            .media-flex-center {
              .flex-meta {
                span {
                  font-size: 0.8rem;
                }
              }
            }
          }
        }
      }
    }
  }
}

.is-dark {
  .lifestyle-dashboard-v4 {
    .dashboard-card {
      &.is-upgrade {
        background: var(--dark-sidebar-light-2);
        border-color: var(--dark-sidebar-light-12);
      }
    }

    .illustration-header-2 {
      background: var(--dark-sidebar);
      box-shadow: none;
    }

    .writing-stats {
      .writing-stat {
        @include vuero-card--dark();
      }
    }

    .updates,
    .featured-authors {
      @include vuero-card--dark();
    }

    .articles-feed {
      background: var(--dark-sidebar-light-8);

      .articles-feed-subheader {
        .selector {
          .button {
            &.is-selected {
              background: var(--primary) !important;
              border-color: var(--primary) !important;
              box-shadow: var(--primary-box-shadow) !important;
              color: var(--white) !important;
            }
          }
        }
      }

      .articles-feed-list {
        .articles-feed-list-inner {
          .articles-feed-item {
            .featured-content {
              background: var(--dark-sidebar);
            }
          }
        }
      }
    }
  }
  .personal-dashboard-v1 {
    .dashboard-header {
      .start {
        h3 {
          color: var(--dark-dark-text);
        }
      }
    }

    .dashboard-body {
      .dashboard-card {
        @include vuero-card--dark();

        &.is-upgrade {
          background: var(--primary);
          border-color: var(--primary);
          box-shadow: var(--primary-box-shadow);
        }

        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              background: var(--dark-sidebar-light-2);
              border: 1px solid var(--dark-sidebar-light-12);

              .media-flex-center {
                .flex-meta {
                  span {
                    &:first-child {
                      color: var(--dark-dark-text);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .personal-dashboard-v1 {
    .dashboard-header {
      text-align: center;
      flex-direction: column;

      .start {
        margin: 10px auto;
      }

      .end {
        margin: 0;
        justify-content: space-between;
      }
    }

    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 10px 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .personal-dashboard-v1 {
    .dashboard-body {
      .dashboard-card {
        .quick-stats {
          .quick-stats-inner {
            .quick-stat {
              padding: 20px 20px;

              .media-flex-center {
                flex-direction: column;

                .flex-meta {
                  margin: 2px 0 0 0;
                  text-align: center;
                }
              }
            }
          }
        }
      }
    }
  }
}
.people {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  .left {
    span {
      display: block;
      font-family: var(--font);
      &:first-child {
        font-family: var(--font-alt);
        font-weight: 600;
        color: var(--dark-text);
      }
      &:nth-child(2) {
        font-size: 0.9rem;
        color: var(--light-text);
        a {
          font-weight: 500;
          color: var(--primary);
        }
      }
    }
  }
}
</style>