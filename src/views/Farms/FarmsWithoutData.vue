<template>
  <v-card class="mx-auto mx-5 pb-3" v-if="Object.keys(farmsWithoutData).length">
    <v-card-text class="d-flex flex-column">
      <div class="mt-4">Farms We Couldn't Check:</div>
      <div class="d-flex">
        <v-chip
          :color="farm.error ? 'red' : ''"
          v-for="(farm, key) in farmsWithoutData"
          :key="key"
          class="ma-2"
          close
          close-icon="fas fa-redo"
          :disabled="loading"
          @click:close="getPoolsForSingleFarm({ key, selectedFarm: farm })"
        >
          <v-icon left v-if="farm.error"> fas fa-exclamation-circle </v-icon>
          {{ farm.name }} ({{ $t(farm.network) }})
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "FarmsWithoutData",
  computed: {
    farmsWithoutData: function () {
      return this.$store.state.farmStore.farmsWithoutData;
    },
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
  },
  methods: {
    ...mapActions("poolStore", ["getPoolsForSingleFarm"]),
  },
};
</script>

<style scoped></style>
