<template>
  <v-col cols="12">
    <v-card
      :dark="darkmode"
      class="mx-auto" outlined
    >
      <v-card-text>
      <p class="text-center">
        Check Out Our Sponsors!
      </p>
      </v-card-text>
      <v-row justify="space-around">
        <div class="text-center">
          <a href="https://iron.finance/" target="_blank">
            <v-avatar>
              <v-img
                max-height="50"
                max-width="50"
                src="@/assets/images/iron-finance.gif"
              ></v-img>
            </v-avatar>
          </a>
          <a href="https://iron.finance/" target="_blank">
            <p>Iron Finance</p>
          </a>
        </div>
        <div class="text-center">
          <a href="https://stablegaj.finance/" target="_blank">
            <v-avatar>
              <v-img
                max-height="50"
                max-width="50"
                src="@/assets/images/stablegaj.svg"
              ></v-img>
            </v-avatar>
          </a>
          <a href="https://stablegaj.finance/" target="_blank">
            <p>StableGaj</p>
          </a>
        </div>
        <div class="text-center">
          <a href="https://www.prismfinance.net/" target="_blank">
            <v-avatar>
              <v-img
                max-height="50"
                max-width="50"
                src="@/assets/images/prism-finance.jpg"
              ></v-img>
            </v-avatar>
          </a>
          <a href="https://www.prismfinance.net/" target="_blank">
            <p>Prism Finance</p>
          </a>
        </div>
      </v-row>
    </v-card>
  </v-col>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Sponsors",
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
  },
};
</script>

<style scoped></style>
