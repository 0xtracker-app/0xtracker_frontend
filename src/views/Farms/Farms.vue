<template>
  <div>
    <v-card v-if="Object.keys(farmsWithData).length || Object.keys(farmsWithoutData).length" class="card-shadow">
      <v-card-text class="px-0 py-0">
        <v-expansion-panels v-if="Object.keys(farmsWithData).length" accordion multiple :value="panelsArray">
          <v-expansion-panel
            v-for="(farm, key) in farmsWithData" :key="key"
          >
            <v-expansion-panel-header>
              {{ farm.name }} ({{ farm.network }}) - {{ farm.total | toCurrency(round) }} ({{ farm.pendingTotal | toCurrency(round) }})
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <Farm :farm="farm" />
              <v-card-actions>
                <v-spacer></v-spacer>
                  <v-icon @click="refreshSingleFarm(farm.contract, farm)">
                    fas fa-redo
                  </v-icon>
              </v-card-actions>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
    <NoDataCard v-else />
  </div>
</template>
<script>
import { store, mutations } from '@/store.js';
import Farm from './Farm.vue';
import NoDataCard from '@/components/Cards/NoDataCard.vue';

export default {
  name: "Farms",
  components: {
    Farm,
    NoDataCard,
  },
  props: {
    heading: String,
  },
  data() {
    return {
      smallValues: false,
      page: 1,
      headers: [
        {
          text: 'Ticker',
          align: 'start',
          sortable: true,
          value: 'symbol',
        },
        { text: 'Balance', value: 'tokenBalance' },
        { text: 'Price', value: 'tokenPrice' },
        { text: 'Value', value: 'tokenValue' },
      ],
    };
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
      return store.loadingPools || store.loadingFarms || store.loadingWallet;
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
  async created() {
    if (this.$route?.params?.loadFarms) this.loadFarms();
    this.$eventHub.$on('load-farms', this.loadFarms);
  },
  watch: {
    total: function (val) {
      mutations.setTotalFarmsValue(val);
    },
  },
  methods: {
    loadFarms() {
      mutations.getFarmData();
    },
    refreshSingleFarm(key, selectedFarm) {
      mutations.refreshSingleFarm(key, selectedFarm);
    },
  },
  beforeDestroy() {
    this.$eventHub.$off('load-farms', this.loadFarms);
  },
};
</script>
