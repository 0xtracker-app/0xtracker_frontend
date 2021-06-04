<template>
  <v-col cols="12" v-if="total > 0">
    <v-card
      class="mx-auto"
      outlined
      :loading="loading"
      :dark="darkmode"
    >
      <template slot="progress">
        <v-progress-linear
          height="2"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-card-text class="text-center">
        <div>
          Total Portfolio Value
        </div>
        <p class="display-1 mb-1">
          {{ total | toCurrency(round) }}
        </p>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "PortfolioTotalValue",
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    round() {
      return store.userData.round;
    },
    loading: function() {
      return store.loadingPortfolio || store.loadingFarms || store.loadingBalances;
    },
    total: function() {
      return store.totalWalletValue + store.totalFarmsValue;
    },
  },
};
</script>

<style scoped></style>