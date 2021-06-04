<template>
  <v-card
    class="mx-auto"
    outlined
  >
    <v-card-text>
      <div>
        Farms Without Data
      </div>
    </v-card-text>
    <v-chip
      :color="farm.error ? 'red' : ''"
      v-for="(farm, key) in farms" :key="key"
      class="ma-2"
      close
      close-icon="mdi-refresh"
      :disabled="loading"
      @click:close="refreshSingleFarm(key, farm)"
    >
      <v-icon left v-if="farm.error">
        mdi-alert-circle
      </v-icon>
      {{ farm.name }} - {{ farm.network }}
    </v-chip>
  </v-card>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "FarmsWithoutData",
  props: {
    wallet: String,
    farms: Object,
  },
  computed: {
    loading: function() {
      return store.loadingPortfolio || store.loadingFarms || store.loadingBalances;
    },
  },
  methods: {
    async refreshSingleFarm(key, selectedFarm) {
      mutations.refreshSingleFarm(key, selectedFarm);
    },
  },
};
</script>

<style scoped></style>
