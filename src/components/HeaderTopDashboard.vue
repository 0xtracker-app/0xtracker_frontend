<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col cols="6">
        <h2
          class="text-h2 text-uppercase font-weight-bold"
          :style="{
            color: darkmode ? 'white' : '#15121F99',
          }"
        >
          <template>{{ $route.name }}</template>
        </h2>
      </v-col>
      <v-col class="d-flex justify-end align-center" v-if="showRefresh">
        <v-btn
          :disabled="
            loading ||
            Object.values(recentQuery).every((x) => x === null || x === '')
          "
          elevation="0"
          small
          min-width="40"
          outlined
          height="40"
          :ripple="false"
          class="me-3 py-1 font-weight-600 text-capitalize rounded-pill"
          :style="{ backgroundColor: darkmode ? '#232228' : '#f3f4fd' }"
          @click="executeRecentQuery()"
          :dark="darkmode"
        >
          <v-icon size=".875rem" color="primary" class="mr-2">
            fas fa-redo {{ loading ? "fa-spin" : "" }}
          </v-icon>
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <slot></slot>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { detectWalletType } from "@/util/helpers";

export default {
  name: "HeaderTopDashboard",
  props: {
    showRefresh: Boolean,
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("walletStore", ["recentQuery"]),
    loading: function () {
      return (
        this.$store.state.farmStore.loading ||
        this.$store.state.walletStore.loading ||
        this.$store.state.poolStore.loading
      );
    },
  },
  mounted() {
    if (this.recentQuery.profile) {
      this.executeRecentQuery();
    } else if (this.$store.state.walletStore.wallet) {
      this.loadPortfolio({
        walletAddress: this.$store.state.walletStore.wallet,
        walletType: detectWalletType(this.$store.state.walletStore.wallet),
      });
    }
  },
  methods: {
    ...mapActions("walletStore", ["loadPortfolio", "loadProfile"]),
    executeRecentQuery() {
      if (this.recentQuery?.type === "portfolio") {
        this.loadPortfolio(this.recentQuery.profile.wallets[0]);
      } else if (this.recentQuery?.type === "profile") {
        this.loadProfile(this.recentQuery);
      }
    },
  },
};
</script>
