<template>
  <v-container fluid class="pt-0 px-6 pb-16">
    <v-row no-gutters class="py-3">
      <v-col
        cols="6"
        v-if="$route.name === 'Portfolio' || $route.name === 'Rev0x'"
      >
        <!-- <h2
          class="text-h2 font-weight-600 text-white"
        >
          <template>{{ $route.name }}</template>
        </h2> -->
      </v-col>
      <v-col cols="12" v-else>
        <h2
          class="text-h1 text-uppercase font-weight-bold text-white text-center"
        >
          <template v-if="$route.name === 'Dashboard'">Dashboard</template>
          <template v-else>{{ $route.name }}</template>
        </h2>
      </v-col>
      <v-col v-if="showRefresh" cols="6" md="6" class="d-flex justify-end">
        <v-btn
          :disabled="
            loading ||
            Object.values(recentQuery).every((x) => x === null || x === '')
          "
          elevation="0"
          small
          min-width="45"
          :ripple="false"
          class="me-3 py-1 px-2 font-weight-600 text-capitalize rounded-sm"
          @click="executeRecentQuery()"
          :dark="darkmode"
        >
          <v-icon size=".875rem" class="mr-2" color="primary">
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

export default {
  name: "header-top",
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
