<script setup lang="ts">
var currentTime = new Date()
var year = currentTime.getFullYear()
</script>

<template>
  <footer class="vuero-footer">
    <div class="container">
      <div class="footer-copyright has-text-centered">
        <p>&copy; 2021- {{ year }} - All Rights Reserved.</p>
      </div>
    </div>
  </footer>
  <!-- /Simple light footer -->
</template>

<style lang="scss" scoped>
.logo {
  image {
    min-width: 150px !important;
  }
}
</style>