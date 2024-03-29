<template>
  <div>
    <NoDataCard
      v-if="Object.keys(farmsWithData).length === 0"
      :loading="loading"
    />
    <FarmsCards
      v-if="Object.keys(farmsWithData).length > 0 && !compactView"
      :farmsWithData="farmsWithData"
    />
    <FarmsCompact
      v-else-if="Object.keys(farmsWithData).length > 0 && compactView"
      :farmsWithData="farmsWithDataCompact"
    />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import FarmsCards from "./FarmsCards.vue";
import FarmsCompact from "./FarmsCompact.vue";
import NoDataCard from "@/components/Cards/NoDataCard.vue";
import { generateColors } from "@/util/helpers";
import { interpolateSpectral } from "d3";

export default {
  components: {
    FarmsCards,
    FarmsCompact,
    NoDataCard,
  },
  props: {
    heading: String,
  },
  computed: {
    ...mapGetters("generalStore", ["compactView", "darkmode", "round"]),
    ...mapGetters("walletStore", ["historicalData"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    farmsWithData: function () {
      // getting object keys and sorting them highest to lowest into an array based on value of total,
      // then adding the contract to the object so that it can be mapped back and removed from the
      // farmsWith/Without objects when a single refresh is done 😬
      return Object.keys(this.$store.state.farmStore.filteredFarmsWithData)
        .sort((a, b) =>
          this.$store.state.farmStore.filteredFarmsWithData[a].total <
          this.$store.state.farmStore.filteredFarmsWithData[b].total
            ? 1
            : -1
        )
        .map((contract) => {
          const colors = generateColors(
            this.historicalData.length,
            interpolateSpectral,
            {
              colorStart: 0,
              colorEnd: 1,
              useEndAsStart: true,
            }
          );
          let farm = this.$store.state.farmStore.filteredFarmsWithData[
            contract
          ];
          farm.contract = contract;
          farm.color =
            colors[
              this.historicalData.length > 0
                ? this.historicalData.findIndex((element) => {
                    if (element.wallet.walletAddress === farm.wallet) {
                      return true;
                    }
                  })
                : 0
            ];
          return farm;
        });
    },
    farmsWithDataCompact: function () {
      let array = [];
      for (const contract in this.$store.state.farmStore
        .filteredFarmsWithData) {
        if (
          Object.hasOwnProperty.call(
            this.$store.state.farmStore.filteredFarmsWithData,
            contract
          )
        ) {
          const farmData = this.$store.state.farmStore.filteredFarmsWithData[
            contract
          ];
          // just insert data you want in the pool data here
          for (const pool in farmData.userData) {
            if (
              Object.hasOwnProperty.call(farmData.userData, pool) &&
              farmData.type != "lending"
            ) {
              const poolData = farmData.userData[pool];
              poolData.farmName = farmData.name;
              poolData.farmID = farmData.sendValue;
              poolData.wallet = farmData.wallet;
              poolData.farmAssetTotal = farmData.poolTotal;
              poolData.farmPendingTotal = farmData.pendingTotal;
              poolData.farmTotal = farmData.total;
              array.push(poolData);
            }
          }
        }
      }
      return array;
    },
    total: function () {
      let total = 0;
      for (const contract in this.farmsWithData) {
        const farm = this.farmsWithData[contract];
        total += farm.total;
      }
      return total;
    },
    pendingRewards: function () {
      let pendingTotal = 0;
      for (const contract in this.farmsWithData) {
        const farm = this.farmsWithData[contract];
        pendingTotal += farm.pendingTotal;
      }
      return pendingTotal;
    },
  },
  async created() {
    if (this.$route?.params?.loadFarms) this.getPoolsForFarms();
  },
  watch: {
    total: function (val) {
      this.setFarmsValue(val);
    },
    pendingRewards: function (val) {
      this.setPendingRewardsValue(val);
    },
  },
  methods: {
    ...mapActions("farmStore", ["setFarmsValue"]),
    ...mapActions("poolStore", ["getPoolsForFarms", "setPendingRewardsValue"]),
  },
};
</script>
