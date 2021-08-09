<template>
  <div>
    <v-container>
      <v-row
        v-if="farm.name === 'fortress.loans'"
        align="center"
        justify="center"
      >
        <v-col cols="12" sm="6">
          <v-card outlined class="card-shadow">
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
                  color="#5e72e4"
                >
                  <strong
                    >{{
                      ((farm.mintedFAI / loanAmount) * 100)
                        | to2Decimals(round)
                    }}%</strong
                  >
                </v-progress-linear>
                {{ farm.mintedFAI | toCurrency(round) }}/{{
                  loanAmount | toCurrency(round)
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
                  color="#5e72e4"
                >
                  <strong>
                    {{((farm.mintedFAI / loanAmount) * 100) | to2Decimals(round)}}%
                  </strong>
                </v-progress-linear>
                {{ farm.mintedFAI | toCurrency(round) }} /
                {{ loanAmount | toCurrency(round) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <!-- Dynamic Lending Protocols -->
      <v-row
        v-if="farm.type === 'lending'"
        align="center"
        justify="center"
      >
        <v-col cols="12" sm="6">
          <v-card outlined class="card-shadow">
            <v-card-text>
              <p
                :set="(loanAmount = farm.availableLimit)"
                class="text-center"
              >
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="(farm.totalBorrowed / loanAmount) * 100"
                  height="25"
                  rounded
                  color="#5e72e4"
                >
                  <strong>
                    {{((farm.totalBorrowed / loanAmount) * 100) | to2Decimals(round)}}%
                  </strong>
                </v-progress-linear>
                {{ farm.totalBorrowed | toCurrency(round) }} /
                {{ loanAmount | toCurrency(round) }}
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
          sm="3"
          
        >
          <v-card outlined class="card-shadow">
            <v-card-title class="font-weight-600 text-uppercase text-h3">
              {{ pool.tokenPair }}
              <v-spacer />
              {{ (pool.lpPrice + pool.pendingAmount) | toCurrency(round) }}
            </v-card-title>
            <v-card-text>
              <p>
                <strong>Total Staked:</strong>
                {{ pool.staked | to2Decimals(round) }}
              </p>
              <p v-if="pool.borrowed">
                <strong>Total Borrowed:</strong>
                {{ pool.borrowed | to2Decimals(round) }} ({{ pool.borrowedUSD | toCurrency(round) }})
              </p>
              <p v-if="pool.lpTotal">
                <strong>Total LP:</strong> {{ pool.lpTotal || 0 }}
                {{ pool.elevenBalance }}
              </p>
              <div v-if="pool.gambitRewards && pool.gambitRewards.length">
                <p v-for="(gReward, index) in pool.gambitRewards" :key="index">
                  <strong>Pending {{ gReward.symbol }}:</strong>
                  {{ gReward.pending | to2Decimals(round) }} ({{
                    gReward.pendingAmount | toCurrency(round)
                  }})
                </p>
              </div>
              <p v-else>
                <strong>Pending {{ pool.rewardSymbol || "Rewards" }}:</strong>
                {{ pool.pending | to2Decimals(round) }} ({{
                  pool.pendingELE ||
                  pool.pendingRewardAmount ||
                  pool.pendingAmount | toCurrency(round)
                }})
              </p>
              <p v-if="pool.pendingNerve">
                <strong>Pending 11NRV:</strong>
                {{ pool.pendingNerve | to2Decimals(round) }} ({{
                  pool.pendingNRVAmount | toCurrency(round)
                }})
              </p>
              <p v-if="pool.pendingBunny">
                <strong>Pending BUNNY:</strong>
                {{ pool.pendingBunny | to2Decimals(round) }} ({{
                  pool.pendingBunnyAmount | toCurrency(round)
                }})
              </p>
              <p v-if="pool.pendingMerlin">
                <strong>Pending MERLIN:</strong>
                {{ pool.pendingMerlin | to2Decimals(round) }} ({{
                  pool.pendingMerlinAmount | toCurrency(round)
                }})
              </p>
            </v-card-text>
            <v-card-actions :disabled="farm.network != network || farm.wallet !== connectedWallet">
              <v-spacer />
              <!-- <v-btn text>
                  <v-icon class="fa fa-plus"></v-icon>
              </v-btn>
              <v-btn text>
                  <v-icon class="fa fa-minus"></v-icon>
              </v-btn> -->
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn text :disabled="pool.rawPending < 1">
                    <v-icon
                      @click="claimReward(pool.contractAddress, pool.poolID, pool.rawPending)"
                      v-bind="attrs"
                      v-on="on"
                      class="fa fa-shopping-basket"
                    />
                  </v-btn>
                </template>
                <span>Claim Rewards</span>
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
import { store } from "@/store.js";
import { ethers } from "ethers";
import ERC20_ABI from "../../abi/ERC20.json"

export default {
  name: "Farm",
  props: {
    farm: Object,
  },
  computed: {
    round() {
      return store.userData.round;
    },
    provider() {
      if (store?.walletData?.provider) return store.walletData.provider;
      else return false;
    },
    noLPPools() {
      return store.userData.noLPPools;
    },
    poolsWithoutTotalLP: function () {
      if (this.noLPPools) {
        return this.farm.userData;
      } else {
        let pools = [];
        for (const key in this.farm.userData) {
          if (Object.hasOwnProperty.call(this.farm.userData, key)) {
            const pool = this.farm.userData[key];
            if (pool.lpPrice + pool.pendingAmount) pools.push(pool);
          }
        }
        return pools;
      }
    },
    network() {
      return store.walletData.network;
    },
    connectedWallet() {
      return store.walletData.connectedWallet;
    },
  },
  methods: {
    async claimReward(contractAddress, poolIndex, rawTokens, claimFunction) {
      const signer = this.provider.getSigner()
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
      if (rawTokens > 0) {
        if (claimFunction) {
          contract.claimFunction(poolIndex, {gasLimit: 500000})
          .then(function(t) {
            console.log(t.hash)
            return this.provider.waitForTransaction(t.hash)
          })
        }
        else {
          contract.deposit(poolIndex, 0, {gasLimit: 500000})
          .then(function(t) {
            return this.provider.waitForTransaction(t.hash)
          })
          .catch(function(){
            console.log('Complete')
          })
        }
        }
      },
  },
};
</script>

<style scoped>
</style>
