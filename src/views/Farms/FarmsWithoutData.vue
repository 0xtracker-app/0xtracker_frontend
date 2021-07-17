<template>
  <v-card
    class="mx-auto mx-5 pb-3"
    v-if="Object.keys(farmsWithoutData).length"
  >
    <v-card-text>
      <div>
        Farms Without Data
      </div>
    </v-card-text>
    <v-chip
      :color="farm.error ? 'red' : ''"
      v-for="(farm, key) in farmsWithoutData" :key="key"
      class="ma-2"
      close
      close-icon="fas fa-redo"
      :disabled="loading"
      @click:close="refreshSingleFarm(key, farm)"
    >
      <v-icon left v-if="farm.error">
        fas fa-exclamation-circle
      </v-icon>
      {{ farm.name }} ({{ farm.network }})
    </v-chip>
  </v-card>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "FarmsWithoutData",
  computed: {
    loading: function() {
      return store.loadingPortfolio || store.loadingBalances;
    },
    farmsWithoutData: function() {
      return store.farmsWithoutData;
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
