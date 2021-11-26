<template>
  <div class="card-container">
    <v-card
      class="mb-6 overflow-hidden"
      :dark="darkmode"
      :class="[darkmode ? 'card-border-purple' : '']"
    >
      <v-card-text
        class="card-stats-padding pa-6"
        :class="[darkmode ? 'card-content-purple' : '']"
      >
        <v-row no-gutters>
          <v-col cols="12" class="d-flex flex-column align-start">
            <h1
              class="font-weight-bold text-h1 mb-0"
              :class="[darkmode ? 'white--text' : 'grey--text text--darken-3']"
            >
              {{ pendingRewardsValue | toSelectedCurrency }}
            </h1>
            <div
              class="font-weight-600 text-uppercase text-h4 grey--text"
              :class="[darkmode ? 'text--lighten-3' : 'text--darken-1']"
            >
              Pending Rewards
            </div>
          </v-col>
          <div style="position: relative">
            <v-icon
              size="100"
              :class="[darkmode ? 'white--text' : 'grey--text text--darken-3']"
              style="
                position: absolute;
                top: -30px;
                right: 0px;
                transform: rotate(-25deg);
                z-index: 0;
                opacity: 0.25;
              "
            >
              fas fa-hourglass-half
            </v-icon>
          </div>
        </v-row>
      </v-card-text>
      <v-overlay :absolute="true" :value="loading">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="white"
          ></v-progress-circular>
        </div>
      </v-overlay>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Farms",
  computed: {
    ...mapGetters("generalStore", [
      "darkmode",
      "round",
      "selectedCurrency",
      "currencyRates",
    ]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    pendingRewardsValue: function () {
      return this.$store.state.poolStore.pendingRewardsValue;
    },
  },
};
</script>

<style scoped>
.card-border-purple {
  position: relative;
  filter: drop-shadow(-1px 1px 0px #0c0b10) drop-shadow(1px -1px 0px #5c6bc0);
  background: rgba(27, 26, 31, 1) !important;
}

.card-content-purple {
  background: linear-gradient(
    45deg,
    rgba(27, 26, 31, 1) 60%,
    rgba(92, 107, 192, 0.05) 75%,
    rgba(92, 107, 192, 0.3) 100%
  ) !important;
}

.card-container {
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  border-radius: 48px;
}
</style>
