<template>
  <div>
    <v-container>
      <v-row v-if="farm.name === 'fortress.loans'" align="center" justify="center">
        <v-col
          cols="12"
          sm="6"
        >
          <v-card outlined>
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
                  <strong>{{ farm.mintedFAI/loanAmount*100 | to2Decimals }}%</strong>
                </v-progress-linear>
                {{ farm.mintedFAI | toCurrency }}/{{ loanAmount | toCurrency }}
              </p>
              <p
                v-else
                :set="loanAmount = farm.mintedFAI/(farm.poolTotal*0.6)"
                class="text-center"
              >
                <strong>Borrow / Credit Balance</strong>
                <v-progress-linear
                  :value="loanAmount"
                  height="25"
                >
                  <strong>{{ loanAmount*100 | to2Decimals }}%</strong>
                </v-progress-linear>
                {{ farm.mintedFAI | toCurrency }} / {{ loanAmount | toCurrency }}
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
          <v-card outlined>
            <v-card-title>
              {{ pool.tokenPair }}
              <v-spacer />
              {{ pool.lpPrice + pool.pendingAmount | toCurrency }}
            </v-card-title>
            <v-card-text>
              <p><strong>Total Staked:</strong> {{ pool.staked | to2Decimals }}</p>
              <p><strong>Total LP:</strong> {{ pool.lpTotal }} {{ pool.elevenBalance }}</p>
              <div v-if="pool.gambitRewards && pool.gambitRewards.length">
                <p v-for="(gReward, index) in pool.gambitRewards" :key="index"><strong>Pending {{ gReward.symbol }}:</strong> {{ gReward.pending | to2Decimals }} ({{ gReward.pendingAmount | toCurrency }})</p>
              </div>
              <p v-else><strong>Pending {{ pool.rewardSymbol || 'Rewards' }}:</strong> {{ pool.pending | to2Decimals }} ({{ pool.pendingELE || pool.pendingRewardAmount || pool.pendingAmount | toCurrency }})</p>
              <p v-if="pool.pendingNerve"><strong>Pending 11NRV:</strong> {{ pool.pendingNerve | to2Decimals }} ({{ pool.pendingNRVAmount | toCurrency }})</p>
              <p v-if="pool.pendingBunny"><strong>Pending BUNNY:</strong> {{ pool.pendingBunny | to2Decimals }} ({{ pool.pendingBunnyAmount | toCurrency }})</p>
              <p v-if="pool.pendingMerlin"><strong>Pending MERLIN:</strong> {{ pool.pendingMerlin | to2Decimals }} ({{ pool.pendingMerlinAmount | toCurrency }})</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Farm",
  props: {
    farm: Object,
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
