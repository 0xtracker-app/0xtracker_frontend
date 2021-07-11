<template>
  <v-card class="flex text-center" color="transparent">
    <a :href="sponsorLink" target="_blank">
      <img
        data-orig-file="@/assets/images/wide-jetswap.gif"
        data-orig-size="1920,106"
        :data-image-title="sponsorTitle"
        data-medium-file="@/assets/images/wide-jetswap.gif"
        data-large-file="@/assets/images/wide-jetswap.gif"
        height="80"

        src="@/assets/images/wide-jetswap.gif"
        class="image wp-image-2182 attachment-full size-full jetpack-lazy-image lazyloaded jetpack-lazy-image--handled"
        alt=""
        loading="eager"
        style="max-width: 100%; height: auto;"
        data-src="@/assets/images/wide-jetswap.gif"
        data-lazy-loaded="1"
      >
    </a>
    <p class="text-h6 text-white">Sponsor</p>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      sponsorLink: 'https://jetswap.finance/',
      sponsorTitle: 'Jetswap',
    }
  },
}
</script>