<template>
  <v-card>
    <v-card-text
      v-if="Object.keys(farmsWithData).length"
      class="px-0 py-0 overflow-hidden"
      style="border-radius: 0 0 24px 24px"
    >
      <v-expansion-panels
        accordion
        hover
        multiple
        :value="panelsArray"
        tile
        :dark="darkmode"
      >
        <v-expansion-panel v-for="(farm, key) in farmsWithData" :key="key">
          <v-expansion-panel-header class="bg-transparent">
            <div
              class="d-flex justify-space-between mr-4 align-center"
              style="width: 100%"
            >
              <div class="mr-2 font-weight-bold d-flex align-center">
                <v-avatar
                  rounded
                  tile
                  :size="$vuetify.breakpoint.mobile ? '25' : '40'"
                  class="mr-2"
                >
                  <v-img :src="getNetworkLogo(farm.network)" />
                </v-avatar>
                <div class="d-flex flex-column">
                  <span
                    :style="{
                      fontSize: $vuetify.breakpoint.mobile ? '10px' : '14px',
                    }"
                  >
                    {{ farm.name }}
                  </span>
                  <span
                    :style="{
                      fontSize: $vuetify.breakpoint.mobile ? '12px' : '14px',
                    }"
                  >
                    <span class="orange--text text--lighten-1">
                      {{ farm.total | toCurrency(round) }}
                    </span>
                    ({{ farm.pendingTotal | toCurrency(round) }})
                  </span>
                </div>
              </div>
              <div class="d-flex align-center">
                <v-icon
                  class="mr-4"
                  :ripple="false"
                  @click.stop="
                    getPoolsForSingleFarm({
                      key: farm.sendValue,
                      selectedFarm: {
                        ...farm,
                        walletType: detectWalletType(farm.wallet),
                      },
                    })
                  "
                  size="25"
                >
                  mdi-refresh
                </v-icon>
                <v-btn
                  dense
                  outlined
                  color="indigo lighten-1"
                  class="text-none"
                  small
                  @click.stop="openHistoricalChartModal(farm)"
                >
                  <v-icon> mdi-chart-timeline-variant </v-icon>
                  <span class="ml-2 d-none d-sm-block"> View History </span>
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="pa-0">
              <Farm :farm="farm" />
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <SingleFarmHistoryChart :farm="selectedFarm" />
      <SingleFarmHistory />
    </v-card-text>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { detectWalletType } from "@/util/helpers";
import SingleFarmHistoryChart from "@/components/FarmDetails/SingleFarmHistoryChart";
import Farm from "./Farm.vue";
import SingleFarmHistory from "@/components/FarmDetails/SingleFarmHistory";

export default {
  components: {
    Farm,
    SingleFarmHistoryChart,
    SingleFarmHistory,
  },
  props: {
    farmsWithData: Array,
  },
  data() {
    return {
      page: 1,
      headers: [
        {
          text: "Ticker",
          align: "start",
          sortable: true,
          value: "symbol",
        },
        { text: "Balance", value: "tokenBalance" },
        { text: "Price", value: "tokenPrice" },
        { text: "Value", value: "tokenValue" },
      ],
      selectedFarm: null,
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode", "round"]),
    ...mapGetters("walletStore", ["recentQuery"]),
    panelsArray: function () {
      return Array.from(
        { length: Object.keys(this.farmsWithData).length },
        (e, i) => i
      );
    },
  },
  methods: {
    ...mapActions("poolStore", ["getPoolsForSingleFarm"]),
    ...mapActions("walletStore", ["loadSingleHistoricalProfile"]),
    detectWalletType(walletAddress) {
      return detectWalletType(walletAddress);
    },
    getNetworkLogo(network) {
      return require(`@/assets/images/networks/${network}.jpg`);
    },
    async openHistoricalChartModal(farm) {
      this.selectedFarm = farm;
      await this.loadSingleHistoricalProfile({
        profile: this.recentQuery.profile,
        farm: farm.sendValue,
      });
    },
  },
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background: transparent !important;
}

.v-expansion-panel::before {
  box-shadow: none !important;
}
</style>
