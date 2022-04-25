<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'

import { isDark, toggleDarkModeHandler } from '/@src/state/darkModeState'
import { useUserSession } from '/@src/stores/userSession'
import useNotyf from '/@src/composable/useNotyf'
import sleep from '/@src/utils/sleep'
import axios from 'axios'
import { useCompany } from '/@src/stores/company'
import { useUserStore } from '../stores/userStore'
const host = import.meta.env.VITE_API_BASE_URL

type StepId = 'login' | 'forgot-password' | 'reset-password' | 'remember-token'
const step = ref<StepId>('login')
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const notif = useNotyf()
const userSession = useUserSession()
const redirect = route.query.redirect as string
const company: any = useCompany()
const userStore: any = useUserStore()
const form_data = {
  email: '',
  password: '',
}
const email_form = {
  email: '',
}
const password_form = {
  password: '',
  email: '',
}
const token_form = {
  remember_token: '',
  email: '',
}

function changeLoginPasswordType() {
  let loginPasswordHTML: any = document.getElementById('_login_password')
  let icon_eye: any = document.getElementById('icon_eye')

  if (loginPasswordHTML.type == 'password') {
    loginPasswordHTML.type = 'text'
    icon_eye.className = 'eye far fa-eye-slash'
  } else {
    loginPasswordHTML.type = 'password'
    icon_eye.className = 'eye far fa-eye'
  }
}
function changeResetPasswordType() {
  let resetPasswordHTML: any = document.getElementById('_reset_password')
  if (resetPasswordHTML.type == 'password') {
    resetPasswordHTML.type = 'text'
  } else {
    resetPasswordHTML.type = 'password'
  }
}
const sendOtpToEmail = async () => {
  isLoading.value = true
  try {
    if (email_form.email == '') {
      isLoading.value = false
      return notif.error('Enter Email First!')
    }
    token_form.email = email_form.email
    let remember_token: any = await axios.post(
      host + '/remember-token-update',
      email_form
    )
    if (remember_token.status == 200) {
      isLoading.value = false
      step.value = 'remember-token'
      return notif.success(remember_token.data.msg)
    } else if (remember_token.status == 401) {
      isLoading.value = false
      return notif.error(remember_token.data.msg)
    }
  } catch (error) {
    isLoading.value = false
    return notif.error('Network error')
  }
}
const resetPassword = async () => {
  isLoading.value = true
  try {
    if (password_form.password == '') {
      isLoading.value = false
      return notif.error('Enter Password First')
    }
    password_form.email = email_form.email
    let password_change: any = await axios.post(
      host + '/password-change',
      password_form
    )
    if (password_change.status == 200) {
      isLoading.value = false
      step.value = 'login'
      return notif.success(password_change.data.msg)
    } else if (password_change.status == 401) {
      isLoading.value = false
      return notif.error(password_change.data.msg)
    }
  } catch (error) {
    isLoading.value = false
  }
}
const tokenCheck = async () => {
  isLoading.value = true
  try {
    if (token_form.remember_token == '') {
      isLoading.value = false
      return notif.error('Enter Remember Token First')
    }
    let token: any = await axios.post(
      host + '/remember-token-check',
      token_form
    )
    if (token.status == 200) {
      isLoading.value = false
      step.value = 'reset-password'
      return notif.success(token.data.msg)
    } else if (token.status == 401) {
      isLoading.value = false
      return notif.error(token.data.msg)
    }
  } catch (error) {
    isLoading.value = false
  }
}
const handleLogin = async () => {
  isLoading.value = true
  try {
    if (form_data.email == '') {
      isLoading.value = false
      return notif.error('Enter Email First')
    } else if (form_data.password == '') {
      isLoading.value = false
      return notif.error('Enter Password First')
    }

    let res: any = await axios.post(host + '/users/get-token', form_data)
    if (res.status == 200) {
      let response: any = await userSession.setToken(res.data.token)
      if (response == true) {
        isLoading.value = false
        notif.success('Welcome back, ' + userStore.userData.name)
        if (redirect) {
          router.push(redirect)
        } else {
          isLoading.value = false
          router.push({
            name: 'dashboard',
          })
        }
      } else {
        isLoading.value = false
        return notif.error("Unfortunately this user can't log in at the moment")
      }
    }
  } catch (error) {
    isLoading.value = false
    notif.error('ID is not approved yet!')
  }
}
</script>

<template>
  <div class="modern-login">
    <div class="underlay h-hidden-mobile h-hidden-tablet-p"></div>

    <div class="columns is-gapless is-vcentered">
      <div class="column is-relative is-8 h-hidden-mobile h-hidden-tablet-p">
        <div class="hero is-fullheight is-image">
          <div class="hero-body hero-body-side">
            <div class="container">
              <div class="columns">
                <div class="column">
                  <img
                    class="hero-image"
                    src="/@src/assets/illustrations/login/station.svg"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-4 is-relative">
        <RouterLink :to="{ name: 'index' }" class="top-logo">
          <AnimatedLogo width="38px" height="30px" />
        </RouterLink>

        <!-- <label class="dark-mode ml-auto">
          <input
            type="checkbox"
            :checked="!isDark"
            @change="toggleDarkModeHandler"
          />
          <span></span>
        </label> -->
        <div class="is-form">
          <div class="hero-body">
            <div class="form-text" :class="[step !== 'login' && 'is-hidden']">
              <h2>Sign In</h2>
              <p>Welcome back to your account.</p>
            </div>
            <div class="form-text" :class="[step === 'login' && 'is-hidden']">
              <h2>Recover Account</h2>
              <p>Reset your account password.</p>
            </div>
            <form
              :class="[step !== 'login' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent="handleLogin"
            >
              <div class="control has-validation">
                <input
                  v-model="form_data.email"
                  type="text"
                  name="email"
                  class="input"
                  placeholder=""
                  autocomplete="email"
                />
                <small class="error-text">This is a required field</small>
                <div class="auth-label">Email Address</div>
                <div class="autv-icon">
                  <!-- <i aria-hidden="true" class="lnil lnil-envelope"></i> -->
                  <i
                    class="iconify"
                    data-icon="feather:mail"
                    aria-hidden="true"
                  ></i>
                </div>
                <div class="validation-icon is-success">
                  <VIconWrap icon="feather:check" />
                </div>
                <div class="validation-icon is-error">
                  <VIconWrap icon="feather:x" />
                </div>
              </div>
              <div class="control has-validation">
                <input
                  v-model="form_data.password"
                  name="password"
                  type="password"
                  id="_login_password"
                  class="input"
                  autocomplete="current-password"
                />
                <div class="auth-label">
                  Password
                  <!-- <VCheckbox
                    @click="changeLoginPasswordType"
                    class="help p-t-5"
                    label="Show Password"
                  /> -->
                </div>
                <div class="autv-icon">
                  <!-- <i aria-hidden="true" class="lnil lnil-lock-alt"></i> -->
                  <i
                    class="iconify"
                    data-icon="feather:lock"
                    aria-hidden="true"
                  ></i>
                </div>
                <i
                  id="icon_eye"
                  @click="changeLoginPasswordType"
                  class="eye far fa-eye"
                ></i>
              </div>

              <div class="control is-flex">
                <!-- <VCheckbox
                  @click="changeLoginPasswordType"
                  class="help p-t-5"
                  label="Show Password"
                /> -->
                <!-- <a @click="step = 'forgot-password'">Forgot Password?</a> -->
              </div>
              <div class="button-wrap has-help">
                <VButton
                  style="width: 100%"
                  id="login-button"
                  :loading="isLoading"
                  color="primary"
                  type="submit"
                  size="big"
                  bold
                >
                  Sign in
                </VButton>
              </div>
              <p class="register">
                Or you can
                <RouterLink :to="{ name: 'registration' }">
                  Signup now
                </RouterLink>
                for an account.
              </p>
            </form>
            <form
              :class="[step !== 'remember-token' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent="tokenCheck"
            >
              <div class="control has-validation">
                <input
                  v-model="token_form.remember_token"
                  type="text"
                  name="email"
                  class="input"
                  placeholder=""
                  autocomplete="email"
                />
                <div class="auth-label">Enter Remember Token</div>
              </div>

              <div class="button-wrap has-help">
                <VButton
                  id="login-button"
                  :loading="isLoading"
                  color="primary"
                  type="submit"
                  size="big"
                  bold
                >
                  Confirm
                </VButton>
              </div>
            </form>
            <form
              :class="[step !== 'reset-password' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent="resetPassword"
            >
              <div class="control has-validation">
                <input
                  v-model="password_form.password"
                  name="password"
                  type="password"
                  id="_reset_password"
                  class="input"
                  autocomplete="current-password"
                />
                <div class="auth-label">Password</div>
                <div class="autv-icon">
                  <i aria-hidden="true" class="lnil lnil-lock-alt"></i>
                </div>
                <VCheckbox
                  @click="changeResetPasswordType"
                  class="help p-t-5"
                  label="Show Password"
                />
              </div>
              <div class="button-wrap has-help">
                <VButton
                  id="login-button"
                  :loading="isLoading"
                  color="primary"
                  type="submit"
                  size="big"
                  rounded
                  raised
                  bold
                >
                  Reset
                </VButton>
              </div>
            </form>

            <form
              :class="[step !== 'forgot-password' && 'is-hidden']"
              class="login-wrapper"
              @submit.prevent="sendOtpToEmail"
            >
              <p class="recover-text">
                Enter your email and click on the confirm button to reset your
                password. We'll send you an email detailing the steps to
                complete the procedure.
              </p>
              <div class="control has-validation">
                <input
                  v-model="email_form.email"
                  type="text"
                  class="input"
                  autocomplete="email"
                />
                <small class="error-text">This is a required field</small>
                <div class="auth-label">Email Address</div>
                <div class="autv-icon">
                  <!-- <i aria-hidden="true" class="lnil lnil-envelope"></i> -->
                  <i
                    class="iconify"
                    data-icon="feather:mail"
                    aria-hidden="true"
                  ></i>
                </div>
                <div class="validation-icon is-success">
                  <VIconWrap icon="feather:check" />
                </div>
                <div class="validation-icon is-error">
                  <VIconWrap icon="feather:x" />
                </div>
              </div>
              <div class="button-wrap">
                <VButton
                  class="m-r-15"
                  size="big"
                  lower
                  solid
                  @click="step = 'login'"
                >
                  Cancel
                </VButton>
                <VButton
                  color="primary"
                  :loading="isLoading"
                  size="big"
                  type="submit"
                  lower
                  solid
                >
                  Confirm
                </VButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../scss/abstracts/_mixins.scss';

.hero-body-side {
  background-image: url(/@src/assets/parts/pattern.png) !important;
  background-size: cover !important;
  background-position: center !important;
  background-color: whitesmoke;
}

.eye {
  position: absolute;
  right: 16px;
  top: 19px;
  font-size: 1.2rem;
  cursor: pointer;
  color: #d0d0d0;
  padding: 3px;
  &:hover {
    opacity: 0.7;
  }
}
.iconify {
  font-size: 1.75rem;
  color: var(--primary);
}
.input {
  // border: 2px solid #e8e8e8;
  background: whitesmoke;
  border: none;
}

.register {
  text-align: center;
  width: 100%;
  font-weight: 500;
  font-size: 0.9rem;
  a {
    color: var(--primary);
  }
}

.modern-login {
  position: relative;
  background: var(--white);
  min-height: 100vh;

  .column {
    &.is-relative {
      position: relative;
    }
  }

  .hero {
    &.has-background-image {
      position: relative;

      .hero-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #5d4298 !important;
        opacity: 0.6;
      }
    }
  }

  .underlay {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 66.6%;
    height: 100%;
    background: #fdfdfd;
    z-index: 0;
  }

  .dark-mode {
    position: absolute;
    top: -64px;
    right: 38px;
    transform: scale(0.6);
    z-index: 2;
  }

  .top-logo {
    position: absolute;
    top: -50px;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    img {
      display: block;
      width: 100%;
      max-width: 200px;
      margin: 0 auto;
    }

    svg {
      height: 50px;
      width: 50px;
    }
  }

  .is-image {
    position: relative;
    border-right: 1px solid var(--fade-grey);

    .hero-image {
      position: relative;
      z-index: 2;
      display: block;
      margin: -80px auto 0 auto;
      max-width: 40%;
      width: 40%;
    }
  }

  .is-form {
    position: relative;
    max-width: 420px;
    margin: 0 auto;

    form {
      animation: fadeInLeft 0.5s;
    }

    .form-text {
      padding: 0 20px;
      animation: fadeInLeft 0.5s;

      h2 {
        font-family: var(--font-alt);
        font-weight: 400;
        font-size: 2rem;
        color: var(--primary);
      }

      p {
        color: var(--muted-grey);
        margin-top: 10px;
      }
    }

    .recover-text {
      font-size: 0.85rem;
      color: #9e9e9e;
      border-top: 1px solid #e8e8e8;
      padding-top: 25px;
    }

    .login-wrapper {
      padding: 30px 20px;

      .control {
        position: relative;
        width: 100%;
        margin-top: 16px;

        .input {
          padding-top: 14px;
          height: 60px;
          // border-radius: 10px;
          padding-left: 55px;
          transition: all 0.3s;

          &:focus {
            background: var(--fade-grey-light-6);
            border-color: var(--placeholder);

            ~ .auth-label,
            ~ .autv-icon i {
              color: var(--muted-grey);
            }
          }
        }

        .error-text {
          color: var(--danger);
          font-size: 0.8rem;
          display: none;
          padding: 2px 6px;
        }

        .auth-label {
          position: absolute;
          top: 6px;
          left: 55px;
          font-size: 0.8rem;
          color: var(--dark-text);
          font-weight: 500;
          z-index: 2;
          transition: all 0.3s;
        }

        .autv-icon {
          position: absolute;
          top: 0;
          left: 0;
          height: 60px;
          width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;

          i {
            font-size: 24px;
            color: var(--placeholder);
            transition: all 0.3s;
          }
        }

        &.has-validation {
          .validation-icon {
            position: absolute;
            top: 0;
            right: 0;
            height: 60px;
            width: 60px;
            display: none;
            justify-content: center;
            align-items: center;

            .icon-wrapper {
              height: 20px;
              width: 20px;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: var(--radius-rounded);

              svg {
                height: 10px;
                width: 10px;
                stroke-width: 3px;
                color: var(--white);
              }
            }

            &.is-success {
              .icon-wrapper {
                background: var(--success);
              }
            }

            &.is-error {
              .icon-wrapper {
                background: var(--danger);
              }
            }
          }

          &.has-success {
            .validation-icon {
              &.is-success {
                display: flex;
              }

              &.is-error {
                display: none;
              }
            }
          }

          &.has-error {
            .input {
              border-color: var(--danger);
            }

            .error-text {
              display: block;
            }

            .validation-icon {
              &.is-error {
                display: flex;
              }

              &.is-success {
                display: none;
              }
            }
          }
        }

        &.is-flex {
          display: flex;
          align-items: center;

          a {
            display: block;
            margin-left: auto;
            color: var(--muted-grey);
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s;

            &:hover {
              color: var(--primary);
            }
          }

          .remember-me {
            font-size: 0.9rem;
            color: var(--muted-grey);
            font-weight: 500;
          }
        }
      }

      .button-wrap {
        margin: 30px 0;

        &.has-help {
          display: flex;
          align-items: center;

          > span {
            margin-left: 12px;
            font-family: var(--font);

            a {
              color: var(--primary);
              font-weight: 500;
              padding: 0 2px;
            }
          }
        }

        .button {
          height: 46px;
          width: 140px;
          // margin-left: 6px;

          &:first-child {
            &:hover {
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
}

.remember-toggle {
  width: 65px;
  display: block;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  transform: scale(0.9);

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;

    &:checked ~ .toggler {
      border-color: var(--primary);

      .active,
      .inactive {
        transform: translateX(100%) rotate(360deg);
      }

      .active {
        opacity: 1;
      }

      .inactive {
        opacity: 0;
      }
    }
  }

  .toggler {
    position: relative;
    display: block;
    height: 34px;
    width: 61px;
    border: 2px solid var(--placeholder);
    border-radius: 100px;
    transition: all 0.3s;

    .active,
    .inactive {
      position: absolute;
      top: 2px;
      left: 2px;
      height: 26px;
      width: 26px;
      border-radius: var(--radius-rounded);
      background: black;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: translateX(0) rotate(0);
      transition: all 0.3s ease;

      svg {
        color: var(--white);
        height: 14px;
        width: 14px;
        stroke-width: 3px;
      }
    }

    .inactive {
      background: var(--placeholder);
      border-color: var(--placeholder);
      opacity: 1;
      z-index: 1;
    }

    .active {
      background: var(--primary);
      border-color: var(--primary);
      opacity: 0;
      z-index: 0;
    }
  }
}

@media only screen and (max-width: 767px) {
  .modern-login {
    .top-logo {
      top: 30px;
    }

    .dark-mode {
      top: 36px;
      right: 44px;
    }

    .is-form {
      padding-top: 100px;
    }
  }
}

@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
  .modern-login {
    .top-logo {
      svg {
        height: 60px;
        width: 60px;
      }
    }

    .dark-mode {
      top: -58px;
      right: 30%;
    }

    .columns {
      display: flex;
      height: 100vh;
    }
  }
}

/* ==========================================================================
Dark mode
========================================================================== */

.is-dark {
  .modern-login {
    background: var(--dark-sidebar);

    .underlay {
      background: var(--dark-sidebar-light-10);
    }

    .is-image {
      border-color: var(--dark-sidebar-light-10);
    }

    .is-form {
      .form-text {
        h2 {
          color: var(--primary);
        }
      }

      .login-wrapper {
        .control {
          &.is-flex {
            a:hover {
              color: var(--primary);
            }
          }

          .input {
            background: var(--dark-sidebar-light-4);

            &:focus {
              border-color: var(--primary);

              ~ .autv-icon {
                i {
                  color: var(--primary);
                }
              }
            }
          }

          .auth-label {
            color: var(--light-text);
          }
        }

        .button-wrap {
          &.has-help {
            span {
              color: var(--light-text);

              a {
                color: var(--primary);
              }
            }
          }
        }
      }
    }
  }
  .remember-toggle {
    input {
      &:checked + .toggler {
        border-color: var(--primary);

        > span {
          background: var(--primary);
        }
      }
    }

    .toggler {
      border-color: var(--dark-sidebar-light-12);

      > span {
        background: var(--dark-sidebar-light-12);
      }
    }
  }
}
</style>
