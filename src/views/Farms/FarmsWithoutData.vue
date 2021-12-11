<template>
  <v-card class="mx-auto mx-5 pb-3" v-if="Object.keys(farmsWithoutData).length">
    <v-card-text class="d-flex flex-column">
      <div class="mt-4">Farms We Couldn't Check:</div>
      <div class="d-flex flex-wrap">
        <v-chip
          :color="farm.error ? 'red' : ''"
          v-for="(farm, key) in farmsWithoutData"
          :key="key"
          class="ma-2"
          :disabled="loading"
          elevation="0"
          @click="getPoolsForSingleFarm({ key, selectedFarm: farm })"
        >
          <v-icon left v-if="farm.error"> fas fa-exclamation-circle </v-icon>
          {{ farm.name }}
          <v-icon right v-if="farm.error" size="15" class="px-1">
            fas fa-redo
          </v-icon>
        </v-chip>
        <v-chip
          v-if="Object.keys(farmsWithoutData).length > 1"
          color="red"
          class="ma-2"
          :disabled="loading"
          elevation="0"
          @click="getPoolsForAllFailedFarms()"
        >
          <v-icon left> fas fa-exclamation-circle </v-icon>
          <span class="font-weight-bold text-caption text-uppercase">
            Retry All
          </span>
          <v-icon right size="15" class="px-1"> fas fa-redo </v-icon>
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
    ...mapActions("poolStore", [
      "getPoolsForSingleFarm",
      "getPoolsForAllFailedFarms",
    ]),
  },
};
</script>

<style scoped></style>
