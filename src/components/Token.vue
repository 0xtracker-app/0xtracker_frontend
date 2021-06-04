<template>
  <v-col cols="12">
    <v-card
      :dark="darkmode"
      class="mx-auto pb-5" outlined
    >
      <v-card-title>
        Wallet
        <v-spacer></v-spacer>
        <v-switch
          v-model="smallValues"
          :label="`${smallValues ? 'Hide' : 'Show'} Small Values`"
          sort-by="tokenValue"
        ></v-switch>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="balances"
      ></v-data-table>
    </v-card>
  </v-col>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "Token",
  components: {
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    loading: function() {
      return store.loadingPortfolio || store.loadingFarms || store.loadingBalances;
    },
    unfilteredBalances: function() {
      const balancesList =  store.balancesList;
      return balancesList.map(balance => {return { symbol: balance.symbol, tokenBalance: balance.tokenBalance, tokenPrice: balance.tokenPrice, tokenValue: balance.tokenBalance*balance.tokenPrice }});
    },
    balances: function() {
      const unfilteredBalances =  this.unfilteredBalances;
      return unfilteredBalances.filter(balance => this.smallValues || balance.tokenValue > 1);
    },
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
      smallValues: false,
    }
  },
  async created() {
    this.loadBalances();
    if (this.$route?.params?.loadBalances) this.loadBalances();
  },
  methods: {
    loadBalances() {
      // this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet, loadBalances: true }}).catch(()=>{});
      mutations.getBalancesForWallet();
    },
  },
};
</script>

<style scoped></style>
