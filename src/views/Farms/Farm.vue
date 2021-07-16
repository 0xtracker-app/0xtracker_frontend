<template>
  <div>
    <v-container>
      <v-row v-if="farm.name === 'fortress.loans'" align="center" justify="center">
        <v-col
          cols="12"
          sm="6"
        >
          <v-card outlined class="card-shadow">
            <v-card-text>
              <p
                v-if="farm.userData && farm.userData['0x066807c7B22c6c0a7fa370A2cA812e5Fc22DBef6']"
                :set="loanAmount = (farm.poolTotal-farm.userData['0x066807c7B22c6c0a7fa370A2cA812e5Fc22DBef6'].lpPrice)*0.6"
                class="text-center"
              >
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="farm.mintedFAI/loanAmount*100"
                  height="25"
                >
                  <strong>{{ farm.mintedFAI/loanAmount*100 | to2Decimals(round) }}%</strong>
                </v-progress-linear>
                {{ farm.mintedFAI | toCurrency(round) }}/{{ loanAmount | toCurrency(round) }}
              </p>
              <p
                v-else
                :set="loanAmount = farm.poolTotal*0.6"
                class="text-center"
              >
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="farm.mintedFAI/loanAmount*100"
                  height="25"
                >
                  <strong>{{ farm.mintedFAI/loanAmount*100 | to2Decimals(round) }}%</strong>
                </v-progress-linear>
                {{ farm.mintedFAI | toCurrency(round) }} / {{ loanAmount | toCurrency(round) }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="(pool, index) in farm.userData" :key="index"
          cols="12"
          sm="3"
        >
          <v-card outlined class="card-shadow">
            <v-card-title class="font-weight-600 text-uppercase text-h3">
              {{ pool.tokenPair }}
              <v-spacer />
              {{ pool.lpPrice + pool.pendingAmount | toCurrency(round) }}
            </v-card-title>
            <v-card-text>
              <p><strong>Total Staked:</strong> {{ pool.staked | to2Decimals(round) }}</p>
              <p><strong>Total LP:</strong> {{ pool.lpTotal || 0 }} {{ pool.elevenBalance }}</p>
              <div v-if="pool.gambitRewards && pool.gambitRewards.length">
                <p v-for="(gReward, index) in pool.gambitRewards" :key="index"><strong>Pending {{ gReward.symbol }}:</strong> {{ gReward.pending | to2Decimals(round) }} ({{ gReward.pendingAmount | toCurrency(round) }})</p>
              </div>
              <p v-else><strong>Pending {{ pool.rewardSymbol || 'Rewards' }}:</strong> {{ pool.pending | to2Decimals(round) }} ({{ pool.pendingELE || pool.pendingRewardAmount || pool.pendingAmount | toCurrency(round) }})</p>
              <p v-if="pool.pendingNerve"><strong>Pending 11NRV:</strong> {{ pool.pendingNerve | to2Decimals(round) }} ({{ pool.pendingNRVAmount | toCurrency(round) }})</p>
              <p v-if="pool.pendingBunny"><strong>Pending BUNNY:</strong> {{ pool.pendingBunny | to2Decimals(round) }} ({{ pool.pendingBunnyAmount | toCurrency(round) }})</p>
              <p v-if="pool.pendingMerlin"><strong>Pending MERLIN:</strong> {{ pool.pendingMerlin | to2Decimals(round) }} ({{ pool.pendingMerlinAmount | toCurrency(round) }})</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Farm",
  props: {
    farm: Object,
  },
  computed: {
    round() {
      return store.userData.round;
    },
  },
  data() {
    return {
      farmData: "",
    };
  },
};
</script>

<style scoped>
</style>
