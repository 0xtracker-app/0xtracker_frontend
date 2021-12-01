<template>
  <v-container fluid>
    <v-row no-gutters class="d-flex align-center">
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
          <v-icon
            size=".875rem"
            color="primary"
            :class="{ 'mr-2': $vuetify.breakpoint.smAndUp }"
          >
            fas fa-redo {{ loading ? "fa-spin" : "" }}
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">Refresh</span>
        </v-btn>
        <v-btn
          :disabled="loading"
          elevation="0"
          small
          min-width="40"
          outlined
          height="40"
          :ripple="false"
          class="me-3 py-1 font-weight-600 text-capitalize rounded-pill"
          :style="{ backgroundColor: darkmode ? '#232228' : '#f3f4fd' }"
          @click="filterDialog = true"
          :dark="darkmode"
        >
          <v-icon
            size=".875rem"
            color="primary"
            :class="{ 'mr-2': $vuetify.breakpoint.smAndUp }"
          >
            fas fa-filter
          </v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">Filters</span>
        </v-btn>
        <v-dialog
          v-model="filterDialog"
          width="600"
          :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
          :overlay-opacity="darkmode ? 0.2 : 0.46"
        >
          <v-card :dark="darkmode">
            <v-card-title
              class="text-h4 font-weight-bold flex justify-center lighten-2"
            >
              Tracking Filters
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text class="py-6">
              <v-row class="d-flex justify-start">
                <v-col
                  cols="12"
                  class="d-flex justify-space-between align-center"
                >
                  <h4 class="text-h4 font-weight-bold">Networks:</h4>
                  <v-btn
                    small
                    outlined
                    color="indigo lighten-1"
                    class="text-none text-caption font-weight-bold"
                    @click="networks = walletNetworks"
                  >
                    Select All
                  </v-btn>
                </v-col>
                <v-col
                  cols="auto"
                  v-for="(network, index) in walletNetworks"
                  :key="index"
                  class="py-0"
                >
                  <v-checkbox
                    v-model="networks"
                    hide-details
                    class="d-flex mt-0"
                    :label="$t(network)"
                    :value="network"
                    color="indigo lighten-1"
                  >
                    <template #label>
                      <span class="text-caption" style="line-height: 1">
                        <span class="font-weight-bold">
                          {{ $t(network) }}
                        </span>
                        ({{ network }})
                      </span>
                    </template>
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions class="pb-4 px-6 flex justify-end items-center">
              <v-btn
                class="text-none text-caption font-weight-bold white--text px-4"
                elevation="0"
                color="indigo lighten-1"
                :block="$vuetify.breakpoint.smAndDown"
                rippple
                @click="saveFilters()"
              >
                <v-icon class="mr-2"> mdi-filter-outline </v-icon>
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <slot></slot>
  </v-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "HeaderTopDashboard",
  props: {
    showRefresh: Boolean,
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode", "selectedNetworks"]),
    ...mapGetters("walletStore", ["recentQuery", "walletNetworks"]),
    loading: function () {
      return (
        this.$store.state.farmStore.loading ||
        this.$store.state.walletStore.loading ||
        this.$store.state.poolStore.loading
      );
    },
  },
  data() {
    return {
      filterDialog: false,
      networks: [],
    };
  },
  mounted() {
    this.networks = this.selectedNetworks;
  },
  methods: {
    ...mapActions("walletStore", [
      "loadPortfolio",
      "loadProfile",
      "executeFilter",
    ]),
    ...mapActions("generalStore", ["saveSelectedNetworks"]),
    saveFilters() {
      this.saveSelectedNetworks(this.networks);
      this.executeFilter();
      this.filterDialog = false;
    },
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
