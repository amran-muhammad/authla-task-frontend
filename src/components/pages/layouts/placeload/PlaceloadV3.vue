<script setup lang="ts">
import { ref } from 'vue'

const filters = ref('')
const valueSingle = ref(0)
const optionsSingle = [
  'All',
  'UI/UX Design',
  'Web Development',
  'Software Eng.',
  'Business',
]
</script>

<template>
  <div>
    <div class="user-grid user-grid-v1" style="padding: 1rem">
      <div class="columns is-multiline">
        <!--Grid item-->
        <div v-for="key in 9" :key="key" class="column is-4">
          <div class="grid-item">
            <VPlaceloadText
              class="mb-4"
              width="80%"
              :lines="1"
              last-line-width="60%"
              centered
            />
            <VButtons>
              <VButton placeload="100%" dark-outlined>loading ...</VButton>
            </VButtons>
            <VButtons>
              <VButton placeload="100%" dark-outlined>loading ...</VButton>
            </VButtons>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../../../scss/abstracts/_mixins.scss';
@import '../../../../scss/pages/lists/_user-grid-v1.scss';
</style>
