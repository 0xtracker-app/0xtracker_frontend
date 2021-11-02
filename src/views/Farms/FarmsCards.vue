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
            <div class="d-flex justify-space-between mr-4" style="width: 100%">
              <span class="mr-2 font-weight-bold">
                <v-avatar rounded tile size="20" class="mr-2">
                  <v-img :src="getNetworkLogo(farm.network)" />
                </v-avatar>
                <span> {{ farm.name }} - </span>
                <span class="orange--text text--lighten-1">
                  {{ farm.total | toCurrency(round) }}
                </span>
                ({{ farm.pendingTotal | toCurrency(round) }})
              </span>
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
    </v-card-text>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { detectWalletType } from "@/util/helpers";
import Farm from "./Farm.vue";

export default {
  components: {
    Farm,
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
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode", "round"]),
    panelsArray: function () {
      return Array.from(
        { length: Object.keys(this.farmsWithData).length },
        (e, i) => i
      );
    },
  },
  methods: {
    ...mapActions("poolStore", ["getPoolsForSingleFarm"]),
    detectWalletType(walletAddress) {
      return detectWalletType(walletAddress);
    },
    getNetworkLogo(network) {
      return require(`@/assets/images/networks/${network}.jpg`);
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
