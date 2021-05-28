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
      v-for="(farm, index) in farms" :key="index"
      class="ma-2"
      close
      close-icon="mdi-refresh"
      :disabled="loading"
      @click:close="refreshSingleFarm(farm, index, 'without')"
    >
      <v-icon left v-if="farm.error">
        mdi-alert-circle
      </v-icon>
      {{ farm.name }}
    </v-chip>
  </v-card>
</template>

<script>
import { store, mutations } from '@/store.js';
import axios from "axios";

export default {
  name: "FarmsWithoutData",
  props: {
    wallet: String,
    farms: Array,
  },
  computed: {
    loading: function() {
      return store.loadingFarms || store.loadingPortfolio;
    },
  },
  methods: {
    async refreshSingleFarm(farm, index, source) {
      try {
        mutations.setAlert('', '');
        mutations.setLoadingPortfolio(true);
        if (source === 'without') mutations.removeFarmWithoutData(index);
        if (source === 'with') mutations.removeFarmWithData(index);
        console.log("refreshSingleFarm", farm, index, source)
        const requestBody = {
          wallet : this.wallet,
          farms : [farm.sendValue]
        }
        const response = await axios.post(process.env.VUE_APP_MYFARM_URL_TEST, requestBody);
        if (!response || !response.data) throw `No data returned for ${farm.name}, you might need to retry.`;
        const farmData = response.data[farm.sendValue];
        if (farmData?.total && farmData.total > 0) {
          mutations.addFarmsWithData(Object.assign(farm, farmData));
        } else mutations.addFarmsWithoutData(farm);
        mutations.setLoadingPortfolio(false);
      } catch (error) {
        mutations.setAlert('error', error);
        mutations.setLoadingPortfolio(false);
        farm.error = true;
        mutations.addFarmsWithoutData(farm);
      }
    },
  },
};
</script>

<style scoped></style>
