<template>
  <v-row justify="center">
    <v-dialog
      v-model="singleFarmDialog"
      @click:outside="setSingleFarmDialog(false)"
      persistent
      max-width="600"
      :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
      :overlay-opacity="darkmode ? 0.2 : 0.46"
    >
      <v-card v-if="singleFarmDialog" :dark="darkmode" class="py-3">
        <p class="text-h3 font-weight-bold text-center mb-2 font-weight-bold">
          Farm Details
        </p>
        <v-divider></v-divider>
        <v-card-text class="pt-6 mt-2">
          <div v-if="farmInfo.transactions && !loading">
            <v-row class="mb-8">
              <v-col cols="6" md="4" class="my-2 text-center">
                <v-row justify="center">
                  <p class="text-h4 mb-0 text-muted font-weight-bold">
                    Total Deposits
                  </p>
                </v-row>
                <v-row justify="center" class="font-weight-bold text-h2">
                  {{ farmInfo.transactions.totalDeposits | to2Decimals(round) }}
                </v-row>
              </v-col>
              <v-col cols="6" md="4" class="my-2 text-center">
                <v-row justify="center">
                  <p class="text-h4 mb-0 text-muted font-weight-bold">
                    Total Withdrawals
                  </p>
                </v-row>
                <v-row justify="center" class="font-weight-bold text-h2">
                  {{
                    farmInfo.transactions.totalWithdrawls | to2Decimals(round)
                  }}
                </v-row>
              </v-col>
              <v-col cols="6" md="4" class="my-2 text-center">
                <v-row justify="center">
                  <p class="text-h4 mb-0 text-muted font-weight-bold">Delta</p>
                </v-row>
                <v-row justify="center" class="font-weight-bold text-h2">
                  {{ delta | to2Decimals(round) }}
                </v-row>
              </v-col>
              <v-col cols="6" md="4" class="my-2 text-center">
                <v-row justify="center">
                  <p class="text-h4 mb-0 text-muted font-weight-bold">
                    Total Staked
                  </p>
                </v-row>
                <v-row justify="center" class="font-weight-bold text-h2">
                  {{ farmInfo.poolData.actualStaked | to2Decimals(round) }}
                </v-row>
              </v-col>
              <v-col cols="6" md="4" class="my-2 text-center">
                <v-row justify="center">
                  <p class="text-h4 mb-0 text-muted font-weight-bold">+/-</p>
                </v-row>
                <v-row
                  justify="center"
                  class="font-weight-bold text-h2"
                  :class="{
                    'red--text':
                      Math.sign(
                        ((farmInfo.poolData.actualStaked -
                          farmInfo.transactions.estStake) /
                          farmInfo.transactions.estStake) *
                          100
                      ) < 0,
                    'green--text':
                      Math.sign(
                        ((farmInfo.poolData.actualStaked -
                          farmInfo.transactions.estStake) /
                          farmInfo.transactions.estStake) *
                          100
                      ) > 0,
                  }"
                >
                  {{
                    (((farmInfo.poolData.actualStaked -
                      farmInfo.transactions.estStake) /
                      farmInfo.transactions.estStake) *
                      100)
                      | to2Decimals(round)
                  }}%
                </v-row>
              </v-col>
              <v-col cols="6" md="4" class="my-2 text-center">
                <v-row justify="center">
                  <p class="text-h4 mb-0 text-muted font-weight-bold">
                    Gas Used
                  </p>
                </v-row>
                <v-row justify="center" class="font-weight-bold text-h2">
                  {{ farmInfo.transactions.gasUsed | toCurrency(round) }}
                </v-row>
              </v-col>
            </v-row>
            <v-row justify="center" align-content="center">
              <p class="text-h4 mb-0 text-muted font-weight-bold">
                Transaction History
              </p>
            </v-row>
            <v-row>
              <v-col class="d-flex justify-center justify-sm-start">
                <v-list dense flat style="background-color: transparent">
                  <v-subheader>Deposits</v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in farmInfo.transactions.deposits"
                      :key="i"
                      style="min-height: 25px"
                    >
                      <v-list-item-content class="py-0">
                        <v-list-item-title>
                          <div class="d-flex align-center">
                            <div
                              class="mr-4 text-overline font-weight-bold text-muted"
                              style="line-height: 1rem"
                            >
                              {{
                                formatDate(item.block_signed_at, "MM-dd-yyyy")
                              }}
                            </div>
                            <div class="font-weight-bold">
                              {{
                                $options.filters.to2Decimals(
                                  item.token_transfer_amount
                                )
                              }}
                            </div>
                          </div>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
              <v-col class="d-flex justify-center justify-sm-start">
                <v-list
                  dense
                  flat
                  disabled
                  style="background-color: transparent"
                >
                  <v-subheader>Withdrawals</v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item
                      v-for="(item, i) in farmInfo.transactions.withdrawls"
                      :key="i"
                      style="min-height: 25px"
                    >
                      <v-list-item-content class="py-0">
                        <v-list-item-title>
                          <div class="d-flex align-center">
                            <div
                              class="mr-4 text-overline font-weight-bold text-muted"
                              style="line-height: 1rem"
                            >
                              {{
                                formatDate(item.block_signed_at, "MM-dd-yyyy")
                              }}
                            </div>
                            <div class="font-weight-bold">
                              {{
                                $options.filters.to2Decimals(
                                  item.token_transfer_amount
                                )
                              }}
                            </div>
                          </div>
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-col>
            </v-row>
          </div>
          <div v-else>
            <v-skeleton-loader type="article"></v-skeleton-loader>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { format } from "date-fns";
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapGetters("generalStore", ["darkmode", "round"]),
    ...mapGetters("generalStore", ["singleFarmDialog"]),
    ...mapGetters("poolStore", ["farmInfo"]),
    loading() {
      return this.$store.state.poolStore.singleFarmLoading;
    },
    delta() {
      return (
        this.farmInfo.transactions?.totalDeposits -
        this.farmInfo.transactions?.totalWithdrawls
      );
    },
  },
  methods: {
    ...mapActions("generalStore", ["setSingleFarmDialog"]),
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat);
    },
  },
};
</script>

<style lang="scss">
.v-dialog {
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  border-radius: 28px;
}

.theme--dark.v-skeleton-loader .v-skeleton-loader__article {
  background: transparent !important;
}
</style>
