<template>
  <v-card class="card-shadow">
    <v-card-text class="text-center">
      <p>No data available...</p>
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
  name: "NoDataCard",
  computed: {
    loading: function() {
      return store.loadingWallet;
    },
  },
}
</script>