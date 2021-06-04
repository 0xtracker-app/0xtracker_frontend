<template>
  <v-card
    class="mx-auto"
    outlined
    :loading="loading"
  >
    <template slot="progress">
      <v-progress-linear
        height="2"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-card-text class="text-center">
      <div>
        Total Farms Value
      </div>
      <p class="display-1 mb-1">
        {{ value | toCurrency(round) }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "FarmTotalValue",
  props: {
    value: Number,
    farms: String,
  },
  computed: {
    loading: function() {
      return store.loadingPortfolio || store.loadingFarms || store.loadingBalances;
    },
    round() {
      return store.userData.round;
    },
  },
};
</script>

<style scoped></style>