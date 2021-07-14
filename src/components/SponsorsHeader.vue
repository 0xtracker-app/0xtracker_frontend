<template>
  <v-card class="flex text-center" color="transparent">
    <a v-if="sponsor === 1" :key="sponsor" href="https://jetswap.finance/" target="_blank">
      <img
        data-orig-file="@/assets/images/wide-jetswap.gif"
        data-orig-size="1920,106"
        data-image-title="Jetswap"
        data-medium-file="@/assets/images/wide-jetswap.gif"
        data-large-file="@/assets/images/wide-jetswap.gif"

        src="@/assets/images/wide-jetswap.gif"
        class="image wp-image-2182 attachment-full size-full jetpack-lazy-image lazyloaded jetpack-lazy-image--handled"
        alt=""
        loading="eager"
        style="max-width: 100%; height: auto;"
        data-src="@/assets/images/wide-jetswap.gif"
        data-lazy-loaded="1"
      >
    </a>
    <!-- <a v-if="sponsor === 2" :key="sponsor" href="https://via.placeholder.com/1124x94.png?text=This+Is+Another+Sponsor" target="_blank">
      <img
        data-orig-file="https://via.placeholder.com/1124x94.png?text=This+Is+Another+Sponsor"
        data-orig-size="1920,106"
        data-image-title="Jetswap"
        data-medium-file="https://via.placeholder.com/1124x94.png?text=This+Is+Another+Sponsor"
        data-large-file="https://via.placeholder.com/1124x94.png?text=This+Is+Another+Sponsor"

        src="https://via.placeholder.com/1124x94.png?text=This+Is+Another+Sponsor"
        class="image wp-image-2182 attachment-full size-full jetpack-lazy-image lazyloaded jetpack-lazy-image--handled"
        alt=""
        loading="eager"
        style="max-width: 100%; height: auto;"
        data-src="https://via.placeholder.com/1124x94.png?text=This+Is+Another+Sponsor"
        data-lazy-loaded="1"
      >
    </a> -->
    <p class="text-h6 text-white">Sponsor</p>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      sponsor: 1,
      totalSponsors: 1,
      interval: '',
    }
  },
  created() {
    let self = this;
    self.interval = setInterval(function() {
      if (self.sponsor === self.totalSponsors) {
        self.sponsor = 1;
      } else self.sponsor++;
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>