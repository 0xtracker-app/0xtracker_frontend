<template>
  <div>
    <div v-if="!valueOnly" class="card-container">
      <v-card
        class="mb-6 overflow-hidden"
        :dark="darkmode"
        :class="[darkmode ? 'card-border-red' : '']"
      >
        <v-card-text
          class="card-stats-padding pa-6"
          :class="[darkmode ? 'card-content-red' : '']"
        >
          <v-row no-gutters>
            <v-col cols="12" class="d-flex flex-column align-start">
              <h1
                class="font-weight-bold text-h1 mb-0"
                :class="[
                  darkmode ? 'white--text' : 'grey--text text--darken-3',
                ]"
              >
                {{ farmsValue | toSelectedCurrency }}
              </h1>
              <div
                class="font-weight-600 text-uppercase text-h4 grey--text"
                :class="[darkmode ? 'text--lighten-3' : 'text--darken-1']"
              >
                Farms
              </div>
            </v-col>
            <div style="position: relative">
              <v-icon
                size="100"
                :class="[
                  darkmode ? 'white--text' : 'grey--text text--darken-3',
                ]"
                style="
                  position: absolute;
                  top: -30px;
                  right: 0px;
                  transform: rotate(-25deg);
                  z-index: 0;
                  opacity: 0.25;
                "
              >
                fas fa-tractor
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
    <div v-else class="d-flex">
      <div
        class="font-weight-600 text-uppercase text-subtitle-2 grey--text mr-2"
        :class="[darkmode ? 'text--lighten-3' : 'text--darken-1']"
      >
        Farms
      </div>
      <h6 class="font-weight-bold text-subtitle-2 mb-0" style="color: #ee786c">
        {{ farmsValue | toSelectedCurrency }}
      </h6>
    </div>
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
    farmsValue: function () {
      return this.$store.state.farmStore.farmsValue;
    },
  },
  props: {
    valueOnly: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.card-border-red {
  position: relative;
  filter: drop-shadow(-1px 1px 0px #0c0b10) drop-shadow(1px -1px 0px #ee786c);
  background: rgba(27, 26, 31, 1) !important;
}

.card-content-red {
  background: linear-gradient(
    45deg,
    rgba(27, 26, 31, 1) 60%,
    rgba(238, 120, 108, 0.05) 75%,
    rgba(238, 120, 108, 0.3) 100%
  ) !important;
}

.card-container {
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  border-radius: 48px;
}
</style>
