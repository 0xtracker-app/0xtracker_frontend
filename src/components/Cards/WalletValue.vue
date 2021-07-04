<template>
  <v-card class="card-shadow mb-6" :dark="darkmode">
    <v-card-text class="card-stats-padding">
      <v-row no-gutters>
        <v-col>
          <div
            class="font-weight-600 text-muted text-uppercase text-h5"
          >
            Wallet Value
          </div>
          <p class="font-weight-600 text-h2 mb-0">
            {{ walletValue | toCurrency(round) }}
          </p>
        </v-col>
        <v-col class="text-right">
          <v-avatar color="bg-gradient-warning">
            <v-icon size="20" class="text-white">
              fas fa-wallet
            </v-icon>
          </v-avatar>
        </v-col>
      </v-row>

      <!-- <p class="mt-4 mb-0 text-body font-weight-light">
        <span class="text-success me-2">3.48%</span> Since last month
      </p> -->
    </v-card-text>
    <v-overlay
      :absolute="true"
      :value="loading"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="white"
        ></v-progress-circular>
      </div>
    </v-overlay>
  </v-card>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Wallet",
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    loading: function() {
      return store.loadingWallet;
    },
    walletValue: function() {
      return store.totalWalletValue;
    },
    round() {
      return store.userData.round;
    },
  }
}
</script>