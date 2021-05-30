<template>
  <div>
    <v-container>
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
          ${{ pool.lpPrice + pool.pendingAmount | to2Decimals }}
        </v-card-title>
        <v-card-text>
          <p v-if="farm.name === 'fortress.loans'" :set="value = (farm.mintedFAI/(farm.poolTotal*0.6))*100">
            <strong>Credit / Borrow Balance</strong>
            <v-progress-linear
              :value="value"
              height="25"
            >
              <strong>{{ value }}%</strong>
            </v-progress-linear>
          </p>
          <p><strong>Total Staked:</strong> {{ pool.staked | to2Decimals }}</p>
          <p><strong>Total LP:</strong> {{ pool.lpTotal }} {{ pool.elevenBalance }}</p>
          <div v-if="pool.gambitRewards && pool.gambitRewards.length">
            <p v-for="(gReward, index) in pool.gambitRewards" :key="index"><strong>Pending {{ gReward.symbol }}:</strong> {{ gReward.pending | to2Decimals }} (${{ gReward.pendingAmount | to2Decimals }})</p>
          </div>
          <p v-else><strong>Pending {{ pool.rewardSymbol || 'Rewards' }}:</strong> {{ pool.pending | to2Decimals }} (${{ pool.pendingELE || pool.pendingRewardAmount || pool.pendingAmount | to2Decimals }})</p>
          <p v-if="pool.pendingNerve"><strong>Pending 11NRV:</strong> {{ pool.pendingNerve | to2Decimals }} (${{ pool.pendingNRVAmount | to2Decimals }})</p>
          <p v-if="pool.pendingBunny"><strong>Pending BUNNY:</strong> {{ pool.pendingBunny | to2Decimals }} (${{ pool.pendingBunnyAmount | to2Decimals }})</p>
          <p v-if="pool.pendingMerlin"><strong>Pending MERLIN:</strong> {{ pool.pendingMerlin | to2Decimals }} (${{ pool.pendingMerlinAmount | to2Decimals }})</p>
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
    accordion: Number,
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
