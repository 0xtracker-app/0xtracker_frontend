<template>
  <v-card class="card-shadow mt-6" :dark="darkmode">
    <v-card-text
      class="card-header-padding px-12 text-center font-size-root"
    >
      Check Out Our Sponsors!
    </v-card-text>
    <v-row justify="space-around">
      <div class="text-center">
        <a href="https://farmhero.io?r=start" target="_blank">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/sponsors-footer/farmhero.png"
            ></v-img>
          </v-avatar>
          <p :class="{'text-white': darkmode}">Farm Hero</p>
        </a>
      </div>
      <div class="text-center">
        <a href="https://iron.finance/" target="_blank">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/sponsors-footer/iron-finance.gif"
            ></v-img>
          </v-avatar>
          <p :class="{'text-white': darkmode}">Iron Finance</p>
        </a>
      </div>
      <!-- <div class="text-center">
        <a href="https://stablegaj.finance/" target="_blank">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/sponsors-footer/stablegaj.svg"
            ></v-img>
          </v-avatar>
          <p :class="{'text-white': darkmode}">StableGaj</p>
        </a>
      </div> -->
      <div class="text-center">
        <a href="http://kogefarm.io/" target="_blank">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/sponsors-footer/koge.png"
            ></v-img>
          </v-avatar>
          <p :class="{'text-white': darkmode}">Koge Farm</p>
        </a>
      </div>
    </v-row>
    <v-row justify="space-around">
      <div class="text-center">
        <a href="https://jetswap.finance/" target="_blank">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/sponsors-footer/jetswap.png"
            ></v-img>
          </v-avatar>
          <p :class="{'text-white': darkmode}">Jetswap</p>
        </a>
      </div>
    </v-row>
  </v-card>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: 'SponsorsFooter',
  components: {
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>>
