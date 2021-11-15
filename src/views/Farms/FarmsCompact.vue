<template>
  <div>
    <v-progress-linear
      v-show="loading"
      :indeterminate="loading"
      color="indigo lighten-1"
    ></v-progress-linear>

    <v-card class="rounded-t-0">
      <v-card-text class="px-0 py-0">
        <v-overlay :absolute="true" :value="loading">
          <div class="text-center"></div>
        </v-overlay>
        <v-data-table
          :headers="headers"
          :items="poolsWithoutTotalLP"
          :loading="loading"
          hide-default-footer
          :items-per-page="-1"
          sort-by="poolValue"
          :sort-desc="true"
          class="table px-4"
          style="background-color: transparent"
        >
          <template v-slot:item.actions="{ item }">
            <div class="d-flex flex-row flex-sm-column">
              <v-card-actions
                v-if="
                  item.contractAddress && item.rawPending > 0 && item.poolID
                "
              >
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
                      block
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
              </v-card-actions>
              <v-card-actions v-if="item.contractAddress && item.poolID">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      text
                      block
                      :disabled="
                        !connectedWallet ||
                        item.network != connectedWalletNetwork ||
                        item.wallet !== connectedWallet
                      "
                      @click="
                        emergencyHarvest({
                          contractAddress: item.contractAddress,
                          poolIndex: item.poolID,
                          rawTokens: item.rawStakes,
                        })
                      "
                      v-bind="attrs"
                      v-on="on"
                      elevation="2"
                      outlined
                      x-small
                    >
                      E. WITHDRAW
                    </v-btn>
                  </template>
                  <span>
                    Withdraw without caring about rewards. EMERGENCY ONLY.
                  </span>
                </v-tooltip>
              </v-card-actions>
            </div>
          </template>
          <template v-slot:item.farmName="{ item }">
            <div class="d-flex">
              <div
                style="width: 30px"
                class="d-flex justify-center align-center mr-2"
              >
                <v-avatar rounded tile size="20">
                  <v-img :src="getNetworkLogo(item.network)" />
                </v-avatar>
              </div>
              <span>{{ item.farmName }}</span>
            </div>
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
            <div class="d-flex justify-start fill-height align-center">
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
              <v-btn
                text
                icon
                @click="getPoolItemDetails({ item: item })"
                v-if="
                  item.contractAddress &&
                  farmInfoNetworks.includes(item.network)
                "
              >
                <v-icon> mdi-information-outline </v-icon>
              </v-btn>
            </div>
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
            {{ item.poolValue | toCurrency(round) }}
          </template>
          <template v-slot:item.pending="{ item }">
            <div v-if="item.pending > 0">
              {{ item.pending | to2Decimals(round) }}
              <span v-if="item.rewardSymbol">{{ item.rewardSymbol }}</span>
            </div>

            <div v-if="item.gambitRewards">
              <div v-for="(gReward, key) in item.gambitRewards" :key="key">
                {{ gReward.pending | to2Decimals(round) }} {{ gReward.symbol }}
              </div>
            </div>
          </template>
        </v-data-table>
        <SingleFarmHistory />
        <div class="card-padding d-flex justify-end"></div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import SingleFarmHistory from "@/components/FarmDetails/SingleFarmHistory";
import { generateColors } from "@/util/helpers";
import { interpolateSpectral } from "d3";

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
    ...mapGetters("generalStore", ["round", "noLPPools"]),
    ...mapGetters("walletStore", [
      "connectedWallet",
      "connectedWalletNetwork",
      "historicalData",
    ]),
    ...mapGetters("poolStore", ["farmInfoNetworks"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    poolsWithoutTotalLP: function () {
      const colors = generateColors(
        this.historicalData.length,
        interpolateSpectral,
        {
          colorStart: 0,
          colorEnd: 1,
          useEndAsStart: true,
        }
      );

      let pools = [];
      for (const key in this.farmsWithData) {
        if (Object.hasOwnProperty.call(this.farmsWithData, key)) {
          const pool = Object.assign(
            {
              poolValue:
                this.farmsWithData[key].lpPrice +
                this.farmsWithData[key].pendingAmount,
            },
            this.farmsWithData[key]
          );
          if (this.noLPPools) {
            pools.push(pool);
          } else {
            if (pool.lpPrice + pool.pendingAmount > 5) {
              pools.push(pool);
            }
          }

          pool.color =
            colors[
              this.historicalData.length > 0
                ? this.historicalData.findIndex((element) => {
                    if (element.wallet.walletAddress === pool.wallet) {
                      return true;
                    }
                  })
                : 0
            ];
        }
      }
      return pools;
    },
  },
  methods: {
    ...mapActions("generalStore", ["setSingleFarmDialog"]),
    ...mapActions("poolStore", ["getPoolItemDetails"]),
    ...mapActions("walletStore", [
      "claimReward",
      "emergencyHarvest",
      "harvestAll",
    ]),
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

.v-data-table__mobile-row {
  min-height: 20px !important;
}

.v-data-table__mobile-row:last-child {
  padding-bottom: 20px !important;
}

.v-data-table__mobile-table-row {
  padding: 0px 10px;
}

.v-data-table__mobile-row__header {
  font-size: 0.75rem;
}

.v-data-table__mobile-row__cell {
  font-size: 0.75rem;
}
</style>
