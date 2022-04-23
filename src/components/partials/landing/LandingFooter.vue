<script setup lang="ts">
var currentTime = new Date()
var year = currentTime.getFullYear()
</script>

<template>
  <footer class="vuero-footer">
    <div class="container">
      <div class="footer-head">
        <div class="head-text">
          <h3>Ready to get started?</h3>
          <p>email us info@tenrol.com</p>
        </div>
        <div class="head-action">
          <div class="buttons">
            <VButton
              href="/contact-us"
              class="action-button"
              color="primary"
              rounded
            >
              Contact Us
            </VButton>
          </div>
        </div>
      </div>

      <div class="columns footer-body">
        <!-- Column -->
        <div class="column is-4">
          <div class="p-t-10 p-b-10">
            <img
              src="/@src/assets/Tenrol-Logo-01.svg"
              alt="Footer Logo Tenrol Recruitment Wide - tenrol.com recruitment solution"
              width="135px"
              style="width: 135px !important"
            />

            <div class="footer-description p-t-10 p-b-10">
              Get the best talent in the market each time with a brilliant
              automated process.
            </div>
          </div>
          <div>
            <div class="social-links p-t-10 p-b-10">
              <a
                href="https://fb.com/Teamtenrol-111405224808708"
                target="_blank"
              >
                <span class="icon">
                  <i aria-hidden="true" class="fab fa-facebook"></i>
                </span>
              </a>
              <a href="https://twitter.com/teamtenrol" target="_blank">
                <span class="icon">
                  <i aria-hidden="true" class="fab fa-twitter"></i>
                </span>
              </a>
              <a href="https://linkedin.com/company/tenrol/" target="_blank">
                <span class="icon">
                  <i aria-hidden="true" class="fab fa-linkedin"></i>
                </span>
              </a>
              <a href="https://instagram.com/teamtenrol/" target="_blank">
                <span class="icon">
                  <i aria-hidden="true" class="fab fa-instagram"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
        <!-- Column -->
        <div class="column is-6 is-offset-2">
          <div class="columns is-flex-tablet-p">
            <!-- Column -->
            <div class="column">
              <ul class="footer-column">
                <li class="column-header">Tenrol</li>
                <li class="column-item">
                  <a href="/about-us" target="_blank">About us</a>
                </li>
                <li class="column-item">
                  <a href="/pricing" target="_blank">View Pricing</a>
                </li>
                <li class="column-item">
                  <a href="/contact-us" target="_blank">Contact us</a>
                </li>
              </ul>
            </div>
            <!-- Column -->
            <div class="column">
              <ul class="footer-column">
                <li class="column-header">Resources</li>

                <li class="column-item">
                  <a href="/help-and-faq">Frequent questions</a>
                </li>
                <li class="column-item">
                  <a href="/term-and-conditions" target="_blank"
                    >Terms and Conditions</a
                  >
                </li>
                <li class="column-item">
                  <a href="/privacy-and-policy" target="_blank"
                    >Privacy and Policy</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-copyright has-text-centered">
        <p>
          &copy; 2021- {{ year }} - <a href="https://tenrol.com">Tenrol</a> -
          All Rights Reserved.
        </p>
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