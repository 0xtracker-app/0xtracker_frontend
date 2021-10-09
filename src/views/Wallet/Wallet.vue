<template>
  <div>
    <v-card v-if="balances.length">
      <v-card-text class="px-0 py-0">
        <v-progress-linear
          v-show="loading"
          :indeterminate="loading"
          color="#5e72e4"
          slot="progress"
        ></v-progress-linear>
        <v-overlay :absolute="true" :value="loading">
          <div class="text-center"></div>
        </v-overlay>
        <v-data-table
          :headers="headers"
          :items="balances"
          hide-default-footer
          :page.sync="page"
          class="table"
          mobile-breakpoint="0"
          @page-count="pageCount = $event"
          sort-by="tokenValue"
          calculate-widths
          :sort-desc="true"
        >
          <template v-slot:item.symbol="{ item }">
            <div class="d-flex">
              <div class="d-flex justify-center align-center">
                <v-avatar rounded tile size="20" class="mr-4">
                  <v-img :src="getNetworkLogo(item.network)" />
                </v-avatar>
                <v-avatar size="20" class="mr-1">
                  <v-img :src="getTokenLogo(item.network, item.tokenAddress)" />
                </v-avatar>
              </div>
              {{ item.symbol }}
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
          color="#5e72e4"
          v-model="page"
          :length="pageCount"
          circle
          total-visible="8"
        ></v-pagination>
      </div>
    </v-card>
    <NoDataCard v-else :loading="loading" />
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import NoDataCard from "@/components/Cards/NoDataCard.vue";

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
    ...mapGetters("generalStore", ["darkmode", "smallValues", "round"]),
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
      return this.walletBalancesList.map((balance) => {
        return {
          symbol: balance.symbol,
          tokenBalance: balance.tokenBalance,
          tokenPrice: balance.tokenPrice,
          tokenValue: balance.tokenBalance * balance.tokenPrice,
          tokenAddress: balance.token_address,
          network: balance.network,
        };
      });
    },
    balances: function () {
      const unfilteredBalances = this.unfilteredBalances;
      return unfilteredBalances.filter(
        (balance) => this.smallValues || balance.tokenValue > 1
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
</style>
