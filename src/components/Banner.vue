<template>
  <v-col
    class="d-flex flex-column justify-space-between align-center"
    cols="12"
  >
    <a href="https://jetswap.finance/" target="_blank"><img data-orig-file="@/assets/images/wide-jetswap.gif" data-orig-size="1920,106" data-image-title="wide fortress" data-medium-file="@/assets/images/wide-jetswap.gif" data-large-file="@/assets/images/wide-jetswap.gif" width="1920" height="106" src="@/assets/images/wide-jetswap.gif" class="image wp-image-2182 attachment-full size-full jetpack-lazy-image lazyloaded jetpack-lazy-image--handled" alt="" loading="eager" style="max-width: 100%; height: auto;" data-src="@/assets/images/wide-jetswap.gif" data-lazy-loaded="1"></a>
  </v-col>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Banner",
  data() {
    return {
      type: '',
      message: '',
    };
  },
  computed: {
    darkmode() {
      return store.userData.darkmode
    },
    alertMessage() {
      if (this.type === "error") return `An error has occurred: ${this.message}`;
      return this.message;
    }
  },
  created () {
    this.$eventHub.$on("alert", alertData => {
      this.type = alertData.type;
      this.message = alertData.message;
    });
  },
};
</script>

<style scoped></style>
