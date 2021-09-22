<template>
  <div>
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
      :items="farmsWithData"
      :loading="loading"
      hide-default-footer
      :items-per-page="-1"
      sort-by="poolValue"
      :sort-desc="true"
    >
      <template v-slot:item.actions="{ item }">
        <v-card-actions
          v-if="item.contractAddress && item.rawPending > 0 && item.poolID"
        >
          <v-spacer />
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                :disabled="
                  !connectedWallet ||
                  item.rawPending < 1 ||
                  item.network != connectedWalletNetwork ||
                  item.wallet !== connectedWallet
                "
                @click="
                  claimReward({
                    contractAddress: item.contractAddress,
                    poolIndex: item.poolID,
                    rawTokens: item.rawPending,
                  })
                "
                v-bind="attrs"
                v-on="on"
                elevation="2"
                outlined
                x-small
              >
                HARVEST
              </v-btn>
            </template>
            <span>Claim Rewards</span>
          </v-tooltip>
          <v-spacer />
        </v-card-actions>
      </template>
      <template v-slot:item.staked="{ item }">
        {{ item.actualStaked | to2Decimals(round) }}
      </template>
      <template v-slot:item.lpTotal="{ item }">
        <div v-for="(balance, key) in item.lpBalances" :key="key">
          {{ balance | to2Decimals(round) }} {{ item.tokenSymbols[key] }}
        </div>
      </template>
      <template v-slot:item.info="{ item }">
        <v-btn
          text
          icon
          @click="getPoolItemDetails({ item: item })"
          v-if="item.contractAddress && farmInfoNetworks.includes(item.network)"
        >
          <v-icon> mdi-information-outline </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.tokenPair="{ item }">
        <div class="d-flex">
          <div
            style="width: 30px"
            class="d-flex justify-center align-center mr-2"
          >
            <v-avatar size="20" class="mr-n2" v-if="item.token1">
              <v-img :src="getTokenLogo(item.network, item.token1)" />
            </v-avatar>
            <v-avatar size="20">
              <v-img :src="getTokenLogo(item.network, item.token0)" />
            </v-avatar>
          </div>
          <span class="font-weight-bold">{{ item.tokenPair }}</span>
        </div>
      </template>
      <template v-slot:item.pendingAmount="{ item }">
        {{ item.pendingAmount | toCurrency(round) }}
      </template>
      <template v-slot:item.poolValue="{ item }">
        {{ (item.lpPrice + item.pendingAmount) | toCurrency(round) }}
      </template>
      <template v-slot:item.pending="{ item }">
        <div v-if="item.pending > 0">
          {{ item.pending | to2Decimals(round) }}
        </div>
        <div v-if="item.gambitRewards">
          <div v-for="(gReward, key) in item.gambitRewards" :key="key">
            {{ gReward.pending | to2Decimals(round) }} {{ gReward.symbol }}
          </div>
        </div>
      </template>
    </v-data-table>
    <SingleFarmHistory />
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import SingleFarmHistory from "@/components/FarmDetails/SingleFarmHistory";

export default {
  components: {
    SingleFarmHistory,
  },
  props: {
    farmsWithData: Array,
  },
  data() {
    return {
      headers: [
        {
          text: "",
          align: "start",
          value: "info",
        },
        { text: "Platform", value: "farmName" },
        { text: "Asset", value: "tokenPair" },
        { text: "Staked", value: "staked" },
        { text: "LP Balance", value: "lpTotal" },
        { text: "Pending Rewards", value: "pending" },
        { text: "Pending Value", value: "pendingAmount", sortable: true },
        { text: "Total Value", value: "poolValue", sortable: true },
        { text: "Actions", value: "actions" },
      ],
    };
  },
  computed: {
    ...mapGetters("generalStore", ["round"]),
    ...mapGetters("walletStore", ["connectedWallet", "connectedWalletNetwork"]),
    ...mapGetters("poolStore", ["farmInfoNetworks"]),
    loading: function () {
      return this.$store.state.walletStore.loading;
    },
  },
  methods: {
    ...mapActions("generalStore", ["setSingleFarmDialog"]),
    ...mapActions("poolStore", ["getPoolItemDetails"]),
    getTokenLogo(network, token) {
      console.log(network, token);
      try {
        return require(`@/assets/images/tokens/${network}/${token.toLowerCase()}.png`);
      } catch (_) {
        return require(`@/assets/images/tokens/default.png`);
      }
    },
  },
};
</script>
