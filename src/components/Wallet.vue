<template>
  <v-col cols="12" v-if="balances.length">
    <v-card
      :dark="darkmode"
      class="mx-auto pb-5" outlined
    >
      <v-card-title>
        Wallet
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
        <v-spacer></v-spacer>
        <v-switch
          v-if="show"
          v-model="smallValues"
          :label="`${smallValues ? 'Hide' : 'Show'} Small Values`"
          sort-by="tokenValue"
        ></v-switch>
      </v-card-title>
      <div class="mx-5">
        <WalletTotalValue class="mb-5" style="border: 1px solid grey;" :value="total" />
        <v-slide-y-transition>
          <div v-show="show">
            <v-data-table
              :headers="headers"
              :items="balances"
              :loading="loading"
              :page.sync="page"
              hide-default-footer
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
            <div class="pt-2">
              <v-pagination
                v-model="page"
                :length="pageCount"
              ></v-pagination>
            </div>
          </div>
        </v-slide-y-transition>
      </div>
      <v-card-actions v-if="show">
        <v-spacer></v-spacer>
        <v-btn
          fab
          small
          color="primary"
          :disabled="loading"
          @click="loadWallet()"
        >
          <v-icon dark>
            mdi-refresh
          </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-col>
</template>

<script>
import { store, mutations } from '@/store.js';
import WalletTotalValue from "@/components/WalletTotalValue.vue";

export default {
  name: "Wallet",
  components: {
    WalletTotalValue,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    round() {
      return store.userData.round;
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
    total: function() {
      let total = 0;
      for (const balance of this.unfilteredBalances) {
        total += balance.tokenValue;
      }
      return total;
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
      page: 1,
      pageCount: 0,
      smallValues: false,
      show: false,
    }
  },
  async created() {
    if (this.$route?.params?.loadWallet) this.loadWallet();
    this.$eventHub.$on('load-wallet', this.loadWallet);
  },
  watch: {
    total: (val) => {
      mutations.setTotalWalletValue(val);
    },
  },
  methods: {
    loadWallet() {
      mutations.getBalancesForWallet();
    },
  },
};
</script>

<style scoped></style>
