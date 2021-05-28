<template>
  <div>
    <a href="https://fortress.loans/" target="_blank"><img data-orig-file="https://0xtracker.app/static/img/wide-fortress.gif" data-orig-size="1920,106" data-image-title="wide fortress" data-medium-file="/static/img/wide-fortress.gif" data-large-file="https://0xtracker.app/static/img/wide-fortress.gif" width="1920" height="106" src="https://0xtracker.app/static/img/wide-fortress.gif" class="image wp-image-2182 attachment-full size-full jetpack-lazy-image lazyloaded jetpack-lazy-image--handled" alt="" loading="eager" style="max-width: 100%; height: auto;" data-src="https://0xtracker.app/static/img/wide-fortress.gif" data-lazy-loaded="1"></a>
  </div>
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
