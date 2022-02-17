<template>
  <v-card class="mx-auto text-center" color="transparent" tile>
    <v-carousel
      height="100%"
      hide-delimiter-background
      hide-delimiters
      :show-arrows="false"
      :value="slide"
      :reverse="slide + 1 === slides.length"
    >
      <v-carousel-item
        v-for="(slide, i) in slides"
        :key="i"
        :href="slide.href"
        target="_blank"
      >
        <img
          :src="slide.src"
          style="width: 100%; height: auto"
          class="rounded-lg overflow-hidden"
        />
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      slide: 0,
      slides: [
        {
          src: require("@/assets/images/sponsors-header/thorus.gif"),
          href: "https://thorus.fi/",
        },
        {
          src: require("@/assets/images/sponsors-header/wide-jetswap.gif"),
          href: "https://jetswap.finance/",
        },
        {
          src: require("@/assets/images/sponsors-header/hunny.gif"),
          href:
            "https://dao.hunny.finance/?utm_source=0xtracker.app&utm_medium=banner&utm_campaign=fairlaunch",
        },
        {
          src: require("@/assets/images/sponsors-header/grand.png"),
          href: "https://www.thegrandbanks.finance/",
        },
      ],
      interval: "",
    };
  },
  created() {
    let self = this;
    self.interval = setInterval(function () {
      if (self.slide + 1 === self.slides.length) {
        self.slide = 0;
      } else self.slide++;
    }, 9000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
