<script setup lang="ts">
import { useUserStore } from '/@src/stores/userStore'
const userStore = useUserStore()
</script>


<template>
  <div class="step-content">
    <div class="step-title">
      <h2 class="dark-inverted">Click continue and select a user type</h2>
    </div>

    <div class="wizard-types">
      <div class="columns">
        <div class="column is-6">
          <div class="wizard-card">
            <img src="/@src/assets/illustrations/wizard/type-1.svg" alt="" />
            <h3 class="dark-inverted">Teacher</h3>
            <p>Register yourself as a teacher</p>
            <div class="button-wrap">
              <VButton
                color="primary"
                class="type-select-button"
                rounded
                elevated
                bold
                @click="userStore.selectUserType('teacher')"
              >
                Continue
              </VButton>
            </div>
          </div>
        </div>
        <div class="column is-6">
          <div class="wizard-card">
            <img src="/@src/assets/illustrations/wizard/type-2.svg" alt="" />
            <h3 class="dark-inverted">Student</h3>
            <p>Register yourself as a student</p>
            <div class="button-wrap">
              <VButton
                color="primary"
                class="type-select-button"
                rounded
                elevated
                bold
                @click="userStore.selectUserType('student')"
              >
                Continue
              </VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

function useUserStore() {
  throw new Error("Function not implemented.");
}
