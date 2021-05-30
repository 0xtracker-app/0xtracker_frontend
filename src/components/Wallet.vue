<template>
  <div class="mx-5">
    <WalletTotalValue class="mb-5" style="border: 1px solid grey;" :value="total" />
    <FarmsWithoutData v-if="farmsWithoutData.length" :wallet="wallet" :farms="farmsWithoutData" class="mb-5" style="border: 1px solid grey;" />
    <v-expansion-panels v-if="farmsWithData && farmsWithData.length" accordion focusable multiple flat style="border: 1px solid grey;" :value="panelsArray">
      <v-expansion-panel
        v-for="(farm, index) in farmsWithData" :key="index"
      >
        <v-expansion-panel-header>
          {{ farm.name }} - {{ farm.total | toCurrency }} ({{ farm.pendingTotal | toCurrency }})
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <Farm :farm="farm" :accordion="index" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              fab
              small
              color="primary"
              @click="refreshSingleFarm(farm, index, 'with')"
            >
              <v-icon dark>
                mdi-refresh
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
import { store, mutations } from '@/store.js';
import axios from "axios";
import WalletTotalValue from "@/components/WalletTotalValue.vue";
import Farm from "@/components/Farm.vue";
import FarmsWithoutData from "@/components/FarmsWithoutData.vue";

export default {
  name: "Wallet",
  components: {
    WalletTotalValue,
    Farm,
    FarmsWithoutData,
  },
  data() {
    return {
      // # of requests completed
      processed: 0,
    };
  },
  computed: {
    wallet: function() {
      return store.userData.wallet;
    },
    selectedFarms: function() {
      return store.userData.selectedFarms;
    },
    loading: function() {
      return store.loadingPortfolio;
    },
    farmsWithData: function() {
      let farmsWithData = store.farmsWithData;
      return farmsWithData.sort((a, b) => (b.total > a.total) ? 1 : -1)
    },
    farmsWithoutData: function() {
      return store.farmsWithoutData;
    },
    total: function() {
      const values = this.farmsWithData.map(farm => {return farm.total});
      return values.reduce((a, b) => a + b, 0)
    },
    panelsArray: function() {
      return Array.from({length: this.farmsWithData.length}, (e, i)=> i);
    },
  },
  async created() {
    mutations.setLoadingPortfolio(true);

    if (!this.selectedFarms || this.selectedFarms.length === 0) this.$router.push({ name: 'Home' });

    // If we get CORS errors we can handle them with this
    axios.interceptors.response.use((response) => response, (error) => {
      if (typeof error.response === 'undefined') 'override undefined error response (cors)';
    });

    this.getFarmData();
    this.$eventHub.$on('load-wallet', this.getFarmData);
  },
  methods: {
    // TODO: Move to store
    async getFarmData() {
      try {
        mutations.setLoadingPortfolio(true);
        mutations.setAlert('', '');
        mutations.clearFarmsWithData();
        mutations.clearFarmsWithoutData();
        this.processed = 0;
        if (!this.selectedFarms || this.selectedFarms.length === 0) throw 'No farms selected, is this a bug?';
        // TODO: Move to promise.all with map
        this.selectedFarms.forEach(async farm => {
          const requestBody = {
            wallet : this.wallet,
            farms : [farm.sendValue]
          }
          const response = await axios.post(process.env.VUE_APP_MYFARM_URL, requestBody);
          if (!response || !response.data) {
            mutations.setAlert('error', `No data returned for ${farm.name}, you might need to retry.`);
            farm.error = true;
            mutations.addFarmsWithoutData(farm);
          } else {
            const farmData = response.data[farm.sendValue];
            if (farmData?.total && farmData.total > 0) {
              mutations.addFarmsWithData(Object.assign({name: farm.name, sendValue: farm.sendValue}, farmData));
            } else mutations.addFarmsWithoutData(farm);
          }
          this.processed++;
          if (this.processed === this.selectedFarms.length) mutations.setLoadingPortfolio(false);
        });
      } catch (error) {
        mutations.setAlert('error', error);
        mutations.setLoadingPortfolio(false);
      }
    },
    // TODO: Move to store
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
        const response = await axios.post(process.env.VUE_APP_MYFARM_URL, requestBody);
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
  beforeDestroy() {
    this.$eventHub.$off('load-wallet', this.getFarmData);
  },
};
</script>

<style scoped></style>
