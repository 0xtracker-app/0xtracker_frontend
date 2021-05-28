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
      <v-col
        class="d-flex flex-column justify-space-between align-center"
        cols="12"
      >
        <a href="https://iron.finance/" target="_blank">
          <v-img
            max-height="50"
            max-width="50"
            src="@/assets/images/iron-finance.gif"
          ></v-img>
        </a>
        <p>Iron Finance</p>
      </v-col>
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
