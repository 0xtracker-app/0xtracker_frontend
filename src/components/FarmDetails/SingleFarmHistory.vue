<template>
  <v-row justify="center">
    <v-dialog
      v-model="singleFarmDialog"
      @click:outside="setSingleFarmDialog(false)"
      persistent
      max-width="600"
    >
      <v-card :dark="darkmode" class="pt-5">
        <p class="text-h1 text-center">Info</p>
        <v-divider></v-divider>
        <v-card-text
          v-if="farmInfo.transactions"
          :set="
            (delta =
              farmInfo.transactions.totalDeposits -
              farmInfo.transactions.totalWithdrawls)
          "
        >
          <v-row>
            <v-col>
              <v-row justify="center">
                <p class="text-h3">Total Deposits</p>
              </v-row>
              <v-row justify="center">
                {{ farmInfo.transactions.totalDeposits | to2Decimals(round) }}
              </v-row>
            </v-col>
            <v-col>
              <v-row justify="center">
                <p class="text-h3">Total Withdrawls</p>
              </v-row>
              <v-row justify="center">
                {{ farmInfo.transactions.totalWithdrawls | to2Decimals(round) }}
              </v-row>
            </v-col>
            <v-col>
              <v-row justify="center">
                <p class="text-h3">Delta</p>
              </v-row>
              <v-row justify="center">
                {{ delta | to2Decimals(round) }}
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-row justify="center">
                <p class="text-h3">Total Staked</p>
              </v-row>
              <v-row justify="center">
                {{ farmInfo.poolData.actualStaked | to2Decimals(round) }}
              </v-row>
            </v-col>
            <v-col>
              <v-row justify="center">
                <p class="text-h3">+/-</p>
              </v-row>
              <v-row justify="center">
                {{
                  (((farmInfo.poolData.actualStaked - delta) / delta) * 100)
                    | to2Decimals(round)
                }}%
              </v-row>
            </v-col>
            <v-col>
              <v-row justify="center">
                <p class="text-h3">Gas Used</p>
              </v-row>
              <v-row justify="center">
                {{ farmInfo.transactions.gasUsed | toCurrency(round) }}
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="center" align-content="center">
            <p class="text-h3">Transaction History</p>
          </v-row>
          <v-row>
            <v-col>
              <v-list dense flat>
                <v-subheader>Deposits</v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="(item, i) in farmInfo.transactions.deposits"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.token_transfer_amount"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
            <v-col>
              <v-list dense flat disabled>
                <v-subheader>Withdrawls</v-subheader>
                <v-list-item-group color="primary">
                  <v-list-item
                    v-for="(item, i) in farmInfo.transactions.withdrawls"
                    :key="i"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-text="item.token_transfer_amount"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapGetters("generalStore", ["darkmode", "round"]),
    ...mapGetters("generalStore", ["singleFarmDialog"]),
    ...mapGetters("poolStore", ["farmInfo"]),
  },
  methods: {
    ...mapActions("generalStore", ["setSingleFarmDialog"]),
  },
};
</script>
