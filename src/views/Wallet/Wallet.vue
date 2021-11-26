<template>
  <div>
    <v-progress-linear
      v-show="loading"
      :indeterminate="loading"
      color="indigo lighten-1"
    ></v-progress-linear>
    <v-card v-if="balances.length" style="overflow: hidden" class="rounded-t-0">
      <v-card-text class="px-0 py-0">
        <v-overlay :absolute="true" :value="loading">
          <div class="text-center"></div>
        </v-overlay>
        <v-data-table
          :headers="headers"
          :items="balances"
          hide-default-footer
          :page.sync="page"
          class="table px-4 custom-scrollbar"
          mobile-breakpoint="0"
          @page-count="pageCount = $event"
          sort-by="tokenValue"
          calculate-widths
          :sort-desc="true"
          style="background-color: transparent"
        >
          <template v-slot:item.symbol="{ item }">
            <div class="d-flex justify-start align-center fill-height">
              <v-tooltip top v-if="historicalData.length > 1">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    :style="{ backgroundColor: item.color }"
                    style="width: 5px; height: 70%; margin-right: 10px"
                    v-bind="attrs"
                    v-on="on"
                  ></div>
                </template>
                <span class="text-caption font-weight-bold">
                  {{ item.wallet }}
                </span>
              </v-tooltip>
              <div class="d-flex font-weight-bold">
                <div class="d-flex justify-center align-center">
                  <v-avatar rounded tile size="20" class="mr-4">
                    <v-img :src="getNetworkLogo(item.network)" />
                  </v-avatar>
                  <v-avatar size="20" class="mr-1">
                    <v-img
                      :src="getTokenLogo(item.network, item.tokenAddress)"
                    />
                  </v-avatar>
                </div>
                {{ item.symbol }}
              </div>
            </div>
          </template>
          <template v-slot:item.tokenBalance="{ item }">
            {{ item.tokenBalance | to2Decimals(round) }}
          </template>
          <template v-slot:item.tokenPrice="{ item }">
            {{ item.tokenPrice | toCurrency(round) }}
          </template>
          <template v-slot:item.tokenValue="{ item }">
            {{ item.tokenValue | toCurrency(round) }}
          </template>
        </v-data-table>
      </v-card-text>
      <div class="card-padding d-flex justify-end">
        <v-pagination
          prev-icon="fa fa-angle-left"
          next-icon="fa fa-angle-right"
          class="pagination"
          color="indigo lighten-1"
          v-model="page"
          :length="pageCount"
          circle
          :total-visible="$vuetify.breakpoint.smAndDown ? 4 : 8"
        ></v-pagination>
      </div>
    </v-card>
    <NoDataCard v-else />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import NoDataCard from "@/components/Cards/NoDataCard.vue";
import { generateColors } from "@/util/helpers";
import { interpolateSpectral } from "d3";

export default {
  components: {
    NoDataCard,
  },
  data() {
    return {
      headers: [
        {
          text: "Ticker",
          sortable: true,
          value: "symbol",
        },
        { text: "Balance", value: "tokenBalance" },
        { text: "Price", value: "tokenPrice" },
        { text: "Value", value: "tokenValue" },
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    ...mapGetters("generalStore", [
      "darkmode",
      "smallValues",
      "round",
      "selectedNetworks",
    ]),
    ...mapGetters("walletStore", ["historicalData"]),
    loading: function () {
      return (
        this.$store.state.walletStore.loading ||
        this.$store.state.poolStore.loading
      );
    },
    walletBalancesList: function () {
      return this.$store.state.walletStore.walletBalancesList;
    },
    unfilteredBalances: function () {
      const colors = generateColors(
        this.historicalData.length,
        interpolateSpectral,
        {
          colorStart: 0,
          colorEnd: 1,
          useEndAsStart: true,
        }
      );

      return this.walletBalancesList.map((balance) => {
        const color =
          colors[
            this.historicalData.length > 0
              ? this.historicalData.findIndex((element) => {
                  if (element.wallet.walletAddress === balance.wallet) {
                    return true;
                  }
                })
              : 0
          ];

        return {
          symbol: balance.symbol,
          tokenBalance: balance.tokenBalance,
          tokenPrice: balance.tokenPrice,
          tokenValue: balance.tokenBalance * balance.tokenPrice,
          tokenAddress: balance.token_address,
          network: balance.network,
          wallet: balance.wallet,
          color: color,
        };
      });
    },
    balances: function () {
      const unfilteredBalances = this.unfilteredBalances;
      return unfilteredBalances.filter(
        (balance) =>
          (this.smallValues || balance.tokenValue > 1) &&
          this.selectedNetworks.some((network) => network === balance.network)
      );
    },
    total: function () {
      let total = 0;
      for (const balance of this.unfilteredBalances) {
        total += balance.tokenValue;
      }
      return total;
    },
  },
  async created() {
    if (this.$route?.params?.loadWallet) this.loadWallet();
  },
  watch: {
    total: function (val) {
      this.setWalletValue(val);
    },
  },
  methods: {
    ...mapActions("walletStore", ["loadWallet", "setWalletValue"]),
    getTokenLogo(network, token) {
      try {
        return require(`@/assets/images/tokens/${network}/${token.toLowerCase()}.png`);
      } catch (_) {
        return require(`@/assets/images/tokens/default.png`);
      }
    },
    getNetworkLogo(network) {
      return require(`@/assets/images/networks/${network}.jpg`);
    },
  },
};
</script>

<style>
.v-data-table__progress .column {
  padding: 0px !important;
}

.custom-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f51c;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f51c;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #5e72e4;
}
</style>
