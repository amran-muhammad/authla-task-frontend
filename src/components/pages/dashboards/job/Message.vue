<script setup lang="ts">
import { onMounted } from 'vue-demi'
import { useRouter } from 'vue-router'
import { useCompany } from '/@src/stores/company'
import { useUserSession } from '/@src/stores/userSession'

const user = useUserSession()
const router = useRouter()
const company: any = useCompany()

onMounted(() => {
  if (company.data.id == 1) {
    user.get()
  } else {
    router.push('/dashboard')
  }
})
</script>

<template>
  <div>
    <div class="list-view-toolbar is-reversed">
      <VControl icon="feather:search">
        <input
          v-model="user.searchkey"
          @keyup="user.get"
          class="input custom-text-filter"
          placeholder="Search..."
          data-filter-target=".list-view-item"
        />
        <div class="form-icon">
          <i aria-hidden="true" class="iconify" data-icon="feather:search"></i>
        </div>
      </VControl>

      <div class="tabs-inner">
        <div class="tabs">
          <ul>
            <li class="is-active">
              <a><span>Messages</span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="page-content-inner">
      <div class="list-view list-view-v3">
        <div
          v-for="item in user.dataList"
          :key="item.id"
          class="list-view-item"
        >
          <div class="list-view-item-inner">
            <div class="meta-left">
              <h3>Subject: {{ item.subject }}</h3>
              <span>
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:user"
                ></i>
                <span>{{ item.name }}</span>
                <i aria-hidden="true" class="fas fa-circle icon-separator"></i>
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:mail"
                ></i>
                <span>{{ item.email }}</span>
                <i aria-hidden="true" class="fas fa-circle icon-separator"></i>
                <i
                  aria-hidden="true"
                  class="iconify"
                  data-icon="feather:phone"
                ></i>
                <span>{{ item.phone }}</span>
              </span>
            </div>
            <div class="meta-right">
              {{ item.message }}
            </div>
          </div>
        </div>
        <PlaceloadV1 v-if="user.placeloader_contact" />

        <div
          class="pagnation"
          v-if="!user.placeloader_contact && user.dataList.length > 0"
        >
          <div
            v-if="user.but_page > 1"
            @click="user.pageChange(user.but_page - 1)"
            class="button"
          >
            &laquo;
          </div>
          <div v-for="(mtem, index) in user.pages" :key="index">
            <button
              :class="user.but_page == mtem ? 'button-active' : 'btn'"
              @click="user.pageChange(mtem)"
            >
              {{ mtem }}
            </button>
          </div>
          <div
            v-if="user.but_endpage != user.but_page"
            @click="user.pageChange(user.but_page + 1)"
            class="button"
          >
            &raquo;
          </div>
        </div>
        <VPlaceholderPage v-else title="No messages" larger>
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
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
.pagnation {
  display: flex;
  width: 288px;
  padding: 5px 0 5px 0;
  margin: auto;
}
.button {
  display: inline-block;
  width: 32px;
  height: 32px;
  padding: 5px 10px;
  background: #fff;
  border: 0;
  border-radius: 4px;
  color: #000;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}
.button-active {
  background: #63c16b;
  padding-left: 5px;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 4px;
  color: #000;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}
.btn {
  padding-left: 5px;
  width: 32px;
  height: 32px;
  background: #fff;
  border: 0;
  border-radius: 4px;
  color: #000;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
}

.list-view-v3 {
  .list-view-item {
    @include vuero-r-card();

    margin-bottom: 16px;
    padding: 16px;

    .list-view-item-inner {
      display: flex;
      align-items: center;

      > img {
        width: 100%;
        max-width: 60px;
        min-width: 60px;
        max-height: 60px;
        min-height: 60px;
        border-radius: var(--radius-rounded);
        border: 1px solid var(--fade-grey);
      }

      .meta-left {
        margin-left: 16px;

        h3 {
          font-family: var(--font-alt);
          color: var(--dark-text);
          font-weight: 500;
          font-size: 1.1rem;
          line-height: 1;
        }

        > span:not(.tag) {
          font-size: 0.9rem;
          color: var(--light-text);

          svg {
            position: relative;
            top: 1px;
            height: 12px;
            width: 12px;
          }

          .icon-separator {
            position: relative;
            top: -3px;
            font-size: 5px;
            color: var(--light-text);
            padding: 0 8px;
          }

          .iconify {
            margin-right: 0.25rem;
          }
        }
      }

      .meta-right {
        margin-left: auto;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .buttons {
          margin-bottom: 0;
          margin-right: 10px;
        }
      }
    }
  }
}

.is-dark {
  .list-view-v3 {
    .list-view-item {
      @include vuero-card--dark();

      .list-view-item-inner {
        > img {
          border-color: var(--dark-sidebar-light-12);
        }

        .meta-left {
          h3 {
            color: var(--dark-dark-text) !important;
          }
        }

        .meta-right {
          .buttons {
            .button {
              &:nth-child(2) {
                background: var(--dark-sidebar-light-2);
                border-color: var(--dark-sidebar-light-8);
                color: var(--dark-dark-text);
                transition: all 0.3s;

                &:hover {
                  border-color: var(--primary);
                  color: var(--primary);
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
  .list-view-v3 {
    .list-view-item {
      position: relative;
      padding: 20px;

      .list-view-item-inner {
        flex-direction: column;

        > img {
          margin-bottom: 1rem;
        }

        .meta-left {
          margin-left: 0;

          h3 {
            text-align: center;
            margin-bottom: 6px;
          }

          > span {
            margin-bottom: 16px;
          }

          .icon-list {
            flex-wrap: wrap;

            > span {
              flex-direction: column;
              text-align: center;
              margin: 10px;
              width: calc(33.3% - 20px);

              i {
                margin: 0;
              }
            }
          }
        }

        .meta-right {
          margin: 16px 0 0 0;
          width: 100%;

          .buttons {
            margin: 0;
            width: 100%;
            display: flex;
            justify-content: space-between;

            .button {
              width: 100%;
              margin: 10px 0;

              &:first-child {
                width: 100%;
                max-width: 240px;
                margin: 10px auto;
              }

              &:nth-child(2) {
                position: absolute;
                top: 10px;
                right: 10px;
                max-width: 35px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
