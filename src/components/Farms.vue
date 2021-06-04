<template>
  <v-col cols="12" v-if="Object.keys(farmsWithData).length || Object.keys(farmsWithoutData).length">
    <v-card
      :dark="darkmode"
      class="mx-auto py-5" outlined
    >
      <v-card-title>
        Farms
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              @click="show = !show"
              v-bind="attrs"
              v-on="on"
              class="ml-1"
            >
              {{ show ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </template>
          <span>Toggle More Details</span>
        </v-tooltip>
      </v-card-title>
      <div class="mx-5">
        <FarmTotalValue class="mb-5" style="border: 1px solid grey;" :value="total" />
        <v-slide-y-transition>
          <div v-show="show">
            <FarmsWithoutData v-if="Object.keys(farmsWithoutData).length" :wallet="wallet" :farms="farmsWithoutData" class="mb-5" style="border: 1px solid grey;" />
            <v-expansion-panels v-if="Object.keys(farmsWithData).length" accordion focusable multiple flat style="border: 1px solid grey;" :value="panelsArray">
              <v-expansion-panel
                v-for="(farm, key) in farmsWithData" :key="key"
              >
                <v-expansion-panel-header>
                  {{ farm.name }} - {{ farm.total | toCurrency(round) }} ({{ farm.pendingTotal | toCurrency(round) }})
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <Farm :farm="farm" />
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      fab
                      small
                      color="primary"
                      @click="refreshSingleFarm(farm.contract, farm)"
                      :disabled="loading"
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
        </v-slide-y-transition>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { store, mutations } from '@/store.js';
import FarmTotalValue from "@/components/FarmTotalValue.vue";
import Farm from "@/components/Farm.vue";
import FarmsWithoutData from "@/components/FarmsWithoutData.vue";

export default {
  name: "Farms",
  components: {
    FarmTotalValue,
    Farm,
    FarmsWithoutData,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    round() {
      return store.userData.round;
    },
    wallet: function() {
      return store.userData.wallet;
    },
    selectedFarms: function() {
      return store.userData.selectedFarms;
    },
    loading: function() {
      return store.loadingPortfolio || store.loadingFarms || store.loadingBalances;
    },
    farmsWithData: function() {
      // getting object keys and sorting them highest to lowest into an array based on value of total,
      // then adding the contract to the object so that it can be mapped back and removed from the
      // farmsWith/Without objects when a single refresh is done 😬
      return Object.keys(store.farmsWithData).sort((a,b) => (store.farmsWithData[a].total < store.farmsWithData[b].total) ? 1 : -1).map(contract => {let farm = store.farmsWithData[contract];farm.contract = contract;return farm});
    },
    farmsWithoutData: function() {
      return store.farmsWithoutData;
    },
    total: function() {
      let total = 0;
      for (const contract in this.farmsWithData) {
        const farm = this.farmsWithData[contract];
        total += farm.total;
      }
      return total;
    },
    panelsArray: function() {
      return Array.from({length: Object.keys(this.farmsWithData).length}, (e, i)=> i);
    },
  },
  data() {
    return {
      show: true,
    }
  },
  async created() {
    if (this.$route?.params?.loadPortfolio) this.loadPortfolio();
    this.$eventHub.$on('load-farms', this.loadPortfolio);
  },
  watch: {
    total: (val) => {
      mutations.setTotalFarmsValue(val);
    },
  },
  methods: {
    loadPortfolio() {
      // .catch(()=>{}) to allow router navigation to the same component
      this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet, loadPortfolio: true }}).catch(()=>{});
      mutations.getFarmData();
    },
    refreshSingleFarm(key, selectedFarm) {
      mutations.refreshSingleFarm(key, selectedFarm);
    },
  },
  beforeDestroy() {
    this.$eventHub.$off('load-farms', this.loadPortfolio);
  },
};
</script>

<style scoped></style>
