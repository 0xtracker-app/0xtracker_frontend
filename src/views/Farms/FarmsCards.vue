<template>
  <v-card>
    <v-card-text v-if="Object.keys(farmsWithData).length" class="px-0 py-0">
      <v-expansion-panels accordion hover multiple :value="panelsArray" tile>
        <v-expansion-panel v-for="(farm, key) in farmsWithData" :key="key">
          <v-expansion-panel-header>
            <div class="d-flex justify-space-between mr-4" style="width: 100%">
              <span class="mr-2 font-weight-bold">
                <span> {{ farm.name }} ({{ farm.network }}) - </span>
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
                <v-btn dense outlined color="#5e72e4" class="text-none" small>
                  <v-icon> mdi-chart-timeline-variant </v-icon>
                  <span class="ml-2 d-none d-sm-block"> View History </span>
                </v-btn>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div class="grey pa-0" :class="darkmode ? 'darken-4' : 'lighten-4'">
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
  },
};
</script>

<style>
.v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
