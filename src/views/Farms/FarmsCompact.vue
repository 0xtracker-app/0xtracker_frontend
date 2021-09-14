<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="farmsWithCompact"
        :loading="loading"
        hide-default-footer
        :items-per-page=-1
        sort-by="poolValue"
        :sort-desc="true"
    >
        <template v-slot:item.actions="{ item }">
            <v-card-actions v-if="item.contractAddress && item.rawPending > 0">
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
            <v-icon>mdi-information-outline</v-icon>
        </template>
        <template v-slot:item.tokenPair="{ item }">
              <!-- <v-avatar
                size="20"
                v-if="item.token1"
              >
                <v-img :src="getTokenLogo(item.network, item.token1)" />
              </v-avatar>
              <v-avatar size="20">
                <v-img :src="getTokenLogo(item.network, item.token0)" />
              </v-avatar> -->
            <div>
              {{ item.tokenPair }}
            </div>
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
                    {{ gReward.pending | to2Decimals(round) }} {{gReward.symbol}} 
                </div>
            </div>
        </template>
    
    </v-data-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import NoDataCard from '@/components/Cards/NoDataCard.vue';
export default {
  name: "FarmsCompact",
  props: {
    farmsCompact: Object,
  },
  data() {
    return {
      headers: [
          
        {
          text: '',
          align: 'start',
          value: 'info',
        },
        { text: 'Platform', value: 'farmName' },
        { text: 'Asset', value: 'tokenPair' },
        { text: 'Staked', value: 'staked' },
        { text: 'LP Balance', value: 'lpTotal' },
        { text: 'Pending Rewards', value: 'pending' },
        { text: 'Value', value: 'poolValue', sortable: true, },
        { text: 'Actions', value: 'actions' },
      ],
    };
  },
  computed: {
    ...mapGetters('generalStore', ['darkmode', 'round']),
    ...mapGetters("walletStore", ["connectedWallet", "connectedWalletNetwork"]),
    loading: function() {
      return this.$store.state.poolStore.loading;
    },
    farmsWithCompact: function() {
        let array = [];
        for (const contract in this.$store.state.farmStore.farmsWithData) {
            if (Object.hasOwnProperty.call(this.$store.state.farmStore.farmsWithData, contract)) {
            const farmData = this.$store.state.farmStore.farmsWithData[contract];
            // just insert data you want in the pool data here
            for (const pool in farmData.userData) {
                if (Object.hasOwnProperty.call(farmData.userData, pool) && farmData.type != 'lending') {
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
    total: function() {
      let total = 0;
      for (const contract in this.farmsWithData) {
        const farm = this.farmsWithData[contract];
        total += farm.total;
      }
      return total;
    },
    panelsArray: function() {
      return Array.from({length: Object.keys(this.farmsWithData).length}, (e, i)=> i);
    },
    pendingRewards: function() {
      let pendingTotal = 0;
      for (const contract in this.farmsWithData) {
        const farm = this.farmsWithData[contract];
        pendingTotal += farm.pendingTotal;
      }
      return pendingTotal;
    },
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
    ...mapActions('farmStore', ['setFarmsValue']),
    ...mapActions('poolStore', ['getPoolsForSelectedFarms', 'getPoolsForSingleFarm', 'setPendingRewardsValue']),
    getTokenLogo(network, token) {
      try {
        return require(`@/assets/images/tokens/${network}/${token.toLowerCase()}.png`);
      } catch (_) {
        return require(`@/assets/images/tokens/default.png`);
      }
    },
  },
};
</script>