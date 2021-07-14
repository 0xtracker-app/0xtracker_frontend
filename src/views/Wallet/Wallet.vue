<template>
  <div>
    <v-card v-if="balances.length" class="card-shadow">
      <v-card-text class="px-0 py-0">
        <v-data-table
          :headers="headers"
          :items="balances"
          hide-default-footer
          :page.sync="page"
          class="table"
          mobile-breakpoint="0"
          @page-count="pageCount = $event"
        >
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
        ></v-pagination>
      </div>
    </v-card>
    <NoDataCard v-else />
  </div>
</template>
<script>
import { store, mutations } from '@/store.js';
import NoDataCard from '@/components/Cards/NoDataCard.vue';

export default {
  name: "WalletTable",
  components: {
    NoDataCard,
  },
  data() {
    return {
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
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    round() {
      return store.userData.round;
    },
    smallValues() {
      return store.userData.smallValues;
    },
    loading: function() {
      return store.loadingWallet;
    },
    unfilteredBalances: function() {
      const balancesList =  store.balancesList;
      return balancesList.map(balance => {return { symbol: balance.symbol, tokenBalance: balance.tokenBalance, tokenPrice: balance.tokenPrice, tokenValue: balance.tokenBalance*balance.tokenPrice }});
    },
    balances: function() {
      const unfilteredBalances =  this.unfilteredBalances;
      return unfilteredBalances.filter(balance => this.smallValues || balance.tokenValue > 1);
    },
    total: function() {
      let total = 0;
      for (const balance of this.unfilteredBalances) {
        total += balance.tokenValue;
      }
      return total;
    },
  },
  async created() {
    if (this.$route?.params?.loadWallet) this.loadWallet();
    this.$eventHub.$on('load-wallet', this.loadWallet);
  },
  watch: {
    total: function (val) {
      mutations.setTotalWalletValue(val);
    },
  },
  methods: {
    loadWallet() {
      mutations.getBalancesForWallet();
    },
  },
  beforeDestroy() {
    this.$eventHub.$off('load-wallet', this.loadWallet);
  },
};
</script>
