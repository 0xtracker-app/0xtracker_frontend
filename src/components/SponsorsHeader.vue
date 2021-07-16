<template>
  <v-card
    class="mx-auto text-center"
    color="transparent"
    tile
  >
    <v-carousel
      cycle
      height="100%"
      interval="6000"
      hide-delimiter-background
      hide-delimiters
      :show-arrows="false"
    >
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i"
        :href="item.href"
        target="_blank"
      >
        <img :src="item.src" style="max-width:900px;width:100%;height:auto;" />
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      sponsor: 1,
      totalSponsors: 1,
      interval: '',
      items: [
        {
          src: require('@/assets/images/sponsors-header/wide-jetswap.gif'),
          href: 'https://jetswap.finance/',
        },
        {
          src: require('@/assets/images/sponsors-header/mooncake.png'),
          href: 'https://www.mooncake.io/',
        },
      ],
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