<template>
  <div>
    <v-container>
      <v-row
        v-if="farm.name === 'fortress.loans'"
        align="center"
        justify="center"
      >
        <v-col cols="12" sm="12">
          <v-card
            :dark="darkmode"
            :style="{
              filter: darkmode
                ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                : '',
            }"
          >
            <v-card-text>
              <p
                v-if="
                  farm.userData &&
                  farm.userData['0x066807c7B22c6c0a7fa370A2cA812e5Fc22DBef6']
                "
                :set="
                  (loanAmount =
                    (farm.poolTotal -
                      farm.userData[
                        '0x066807c7B22c6c0a7fa370A2cA812e5Fc22DBef6'
                      ].lpPrice) *
                    0.6)
                "
                class="text-center"
              >
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="(farm.mintedFAI / loanAmount) * 100"
                  height="25"
                  rounded
                  color="indigo lighten-1"
                >
                  <strong
                    >{{
                      ((farm.mintedFAI / loanAmount) * 100)
                        | to2Decimals(round)
                    }}%</strong
                  >
                </v-progress-linear>
                {{ farm.mintedFAI | toSelectedCurrency }}/{{
                  loanAmount | toSelectedCurrency
                }}
              </p>
              <p
                v-else
                :set="(loanAmount = farm.poolTotal * 0.6)"
                class="text-center"
              >
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="(farm.mintedFAI / loanAmount) * 100"
                  height="25"
                  rounded
                  color="indigo lighten-1"
                >
                  <strong>
                    {{
                      ((farm.mintedFAI / loanAmount) * 100)
                        | to2Decimals(round)
                    }}%
                  </strong>
                </v-progress-linear>
                {{ farm.mintedFAI | toSelectedCurrency }} /
                {{ loanAmount | toSelectedCurrency }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Dynamic Lending Protocols -->
      <v-row v-if="farm.type === 'lending'" align="center" justify="center">
        <v-col cols="12" sm="12">
          <v-card outlined>
            <v-card-text>
              <p :set="(loanAmount = farm.availableLimit)" class="text-center">
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="(farm.totalBorrowed / loanAmount) * 100"
                  height="25"
                  rounded
                  color="indigo lighten-1"
                >
                  <strong>
                    {{
                      ((farm.totalBorrowed / loanAmount) * 100)
                        | to2Decimals(round)
                    }}%
                  </strong>
                </v-progress-linear>
                {{ farm.totalBorrowed | toSelectedCurrency }} /
                {{ loanAmount | toSelectedCurrency }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(pool, index) in poolsWithoutTotalLP"
          :key="index"
          cols="12"
          sm="4"
        >
          <v-card
            :outlined="!darkmode"
            class="py-sm-3 px-sm-2"
            :dark="darkmode"
            :style="{
              filter: darkmode
                ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                : '',
            }"
          >
            <v-card-title
              class="font-weight-600 text-uppercase text-h3 d-flex justify-space-between"
            >
              <div
                class="d-flex flex-shrink-1 flex-grow-0"
                style="position: relative"
              >
                <v-avatar
                  style="position: absolute; left: 10px"
                  size="25"
                  v-if="pool.token1"
                >
                  <v-img :src="getTokenLogo(pool.network, pool.token1)" />
                </v-avatar>
                <v-avatar size="25" class="mr-4">
                  <v-img :src="getTokenLogo(pool.network, pool.token0)" />
                </v-avatar>
                <div>
                  {{ pool.tokenPair }}
                </div>
              </div>
              <span class="font-weight-bold" style="font-size: 22px">
                {{ (pool.lpPrice + pool.pendingAmount) | toSelectedCurrency }}
              </span>
            </v-card-title>
            <v-card-text>
              <p v-if="pool.staked" class="mb-0">
                <strong>Total Staked:</strong>
                {{ pool.staked | to2Decimals(round) }}
              </p>
              <p v-if="pool.borrowed" class="mb-0">
                <strong>Total Borrowed:</strong>
                {{ pool.borrowed | to2Decimals(round) }} ({{
                  pool.borrowedUSD | toSelectedCurrency
                }})
              </p>
              <p v-if="pool.lpTotal" class="mb-0">
                <strong>Total LP:</strong> {{ pool.lpTotal || 0 }}
                {{ pool.elevenBalance }}
              </p>
              <div v-if="pool.gambitRewards && pool.gambitRewards.length">
                <p
                  v-for="(gReward, index) in pool.gambitRewards"
                  :key="index"
                  class="mb-0"
                >
                  <strong>Pending {{ gReward.symbol }}:</strong>
                  {{ gReward.pending | to2Decimals(round) }} ({{
                    gReward.pendingAmount | toSelectedCurrency
                  }})
                </p>
              </div>
              <p v-else-if="pool.pending > 0" class="mb-0">
                <strong>Pending {{ pool.rewardSymbol || "Rewards" }}:</strong>
                {{ pool.pending | to2Decimals(round) }} ({{
                  pool.pendingELE ||
                  pool.pendingRewardAmount ||
                  pool.pendingAmount | toSelectedCurrency
                }})
              </p>
              <p v-if="pool.pendingNerve" class="mb-0">
                <strong>Pending 11NRV:</strong>
                {{ pool.pendingNerve | to2Decimals(round) }} ({{
                  pool.pendingNRVAmount | toSelectedCurrency
                }})
              </p>
              <p v-if="pool.pendingBunny" class="mb-0">
                <strong>Pending BUNNY:</strong>
                {{ pool.pendingBunny | to2Decimals(round) }} ({{
                  pool.pendingBunnyAmount | toSelectedCurrency
                }})
              </p>
              <p v-if="pool.pendingMerlin" class="mb-0">
                <strong>Pending MERLIN:</strong>
                {{ pool.pendingMerlin | to2Decimals(round) }} ({{
                  pool.pendingMerlinAmount | toSelectedCurrency
                }})
              </p>
            </v-card-text>
            <v-card-actions v-if="pool.contractAddress && pool.rawPending > 0">
              <v-spacer />
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    icon
                    @click="
                      getPoolItemDetails({
                        item: {
                          ...pool,
                          wallet: farm.wallet,
                        },
                      })
                    "
                    v-bind="attrs"
                    v-on="on"
                    v-if="
                      pool.contractAddress &&
                      farmInfoNetworks.includes(pool.network)
                    "
                  >
                    <v-icon> mdi-information-outline </v-icon>
                  </v-btn>
                </template>
                <span>View details</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    :disabled="
                      !connectedWallet ||
                      pool.rawPending < 1 ||
                      farm.network != connectedWalletNetwork ||
                      farm.wallet !== connectedWallet
                    "
                  >
                    <v-icon
                      @click="
                        claimReward({
                          contractAddress: pool.contractAddress,
                          poolIndex: pool.poolID,
                          rawTokens: pool.rawPending,
                        })
                      "
                      v-bind="attrs"
                      v-on="on"
                      class="fa fa-shopping-basket"
                    />
                  </v-btn>
                </template>
                <span>Claim Rewards</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    text
                    :disabled="
                      !connectedWallet ||
                      farm.network != connectedWalletNetwork ||
                      farm.wallet !== connectedWallet
                    "
                  >
                    <v-icon
                      @click="
                        emergencyHarvest({
                          contractAddress: pool.contractAddress,
                          poolIndex: pool.poolID,
                          rawTokens: pool.rawStakes,
                        })
                      "
                      v-bind="attrs"
                      v-on="on"
                      class="fas fa-exclamation-triangle"
                    />
                  </v-btn>
                </template>
                <span>
                  Withdraw without caring about rewards. EMERGENCY ONLY.
                </span>
              </v-tooltip>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Farm",
  props: {
    farm: Object,
  },
  computed: {
    ...mapGetters("generalStore", ["noLPPools", "round", "darkmode"]),
    ...mapGetters("walletStore", ["connectedWallet", "connectedWalletNetwork"]),
    ...mapGetters("poolStore", ["farmInfoNetworks"]),
    poolsWithoutTotalLP: function () {
      if (this.noLPPools) {
        return this.farm.userData;
      } else {
        let pools = [];
        for (const key in this.farm.userData) {
          if (Object.hasOwnProperty.call(this.farm.userData, key)) {
            const pool = this.farm.userData[key];
            if (pool.lpPrice + pool.pendingAmount > 5) pools.push(pool);
          }
        }
        return pools;
      }
    },
  },
  methods: {
    ...mapActions("walletStore", ["claimReward", "emergencyHarvest"]),
    ...mapActions("poolStore", ["getPoolItemDetails"]),
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

<style scoped></style>
