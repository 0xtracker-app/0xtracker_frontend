<template>
  <v-form class="py-1" ref="form" v-model="valid" lazy-validation>
    <v-row no-gutters class="px-4 px-md-0">
      <v-col cols="12">
        <v-row class="flex-nowrap d-flex">
          <v-col
            md="8"
            lg="6"
            :cols="fieldActive ? '12' : '6'"
            :class="fieldActive ? 'flex-shrink-0' : 'flex-shrink-1'"
          >
            <div class="d-flex align-center">
              <v-text-field
                v-model="wallet"
                :disabled="loading"
                rounded
                outlined
                flat
                color="white"
                class="font-size-input input-alternative input-icon mr-2 custom-placeholder-color search-bar"
                :style="{
                  backgroundColor: darkmode ? '#232228' : 'white',
                }"
                :rules="walletRules"
                :dark="darkmode"
                hide-details
                placeholder="Enter wallet address..."
                @focus="fieldActive = true"
                @blur="fieldActive = false"
              >
                <template slot="prepend-inner">
                  <v-icon size=".875rem">fas fa-search</v-icon>
                </template>
                <template
                  v-slot:append
                  v-if="
                    (!wallet ||
                      !connectedWallet ||
                      wallet !== connectedWallet) &&
                    ($vuetify.breakpoint.smAndUp || fieldActive)
                  "
                >
                  <span
                    v-if="wallet || walletType"
                    class="caption pl-2 font-weight-bold text-uppercase mt-n1"
                    :class="[walletType ? 'blue--text' : 'red--text']"
                  >
                    <span v-if="Boolean(walletType)">
                      {{ walletType }}
                    </span>
                    <v-icon v-else color="red"> mdi-alert-outline </v-icon>
                  </span>
                </template>
                <template
                  v-slot:append
                  v-else-if="
                    connectedWallet &&
                    ($vuetify.breakpoint.smAndUp || fieldActive)
                  "
                >
                  <span
                    v-if="wallet || walletType"
                    class="caption pr-4 pl-2 font-weight-bold text-uppercase"
                    :class="[walletType ? 'blue--text' : 'red--text']"
                  >
                    <span v-if="Boolean(walletType)">
                      {{ walletType }}
                    </span>
                    <v-icon v-else> mdi-alert-outline </v-icon>
                  </span>
                </template>
              </v-text-field>
              <div class="d-none d-sm-flex ml-2">
                <v-btn
                  :disabled="loading || !walletType"
                  :ripple="false"
                  height="25"
                  min-width="25"
                  depressed
                  width="25"
                  class="font-weight-600 text-capitalize rounded-circle grow pa-0"
                  color="indigo lighten-1"
                  @click="loadPortfolio({ walletAddress: wallet, walletType })"
                  :dark="darkmode"
                >
                  <v-icon size="15" color="white"> fa-arrow-right </v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>
          <v-col class="d-flex justify-end align-center">
            <v-tooltip bottom :color="darkmode ? 'white' : 'primary'">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="mr-4 rounded-circle px-0 elevation-0"
                  large
                  style="height: 40px; min-width: 40px"
                  :style="{
                    backgroundColor: darkmode ? '#232228' : 'white',
                  }"
                  @click="setWalletDialog(true)"
                >
                  <v-icon
                    size="20"
                    :color="darkmode ? 'indigo lighten-1' : '#232228'"
                  >
                    mdi-connection
                  </v-icon>
                </v-btn>
              </template>
              <span
                class="text-caption font-weight-bold"
                :class="darkmode ? 'indigo--text text--lighten-2' : ''"
              >
                Connect your wallet
              </span>
            </v-tooltip>
            <v-menu
              transition="slide-y-transition"
              bottom
              offset-y
              elevation="0"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="mr-4 rounded-circle px-0 elevation-0"
                  large
                  style="height: 40px; min-width: 40px"
                  :style="{
                    backgroundColor: darkmode ? '#232228' : 'white',
                  }"
                >
                  <v-icon size="20" :color="darkmode ? 'white' : '#232228'">
                    mdi-cog-outline
                  </v-icon>
                </v-btn>
              </template>
              <div
                class="mt-2 rounded-lg"
                style="max-width: 230px"
                :style="{
                  backgroundColor: darkmode ? '#0C0B10' : 'white',
                }"
              >
                <v-list
                  :disabled="loading"
                  dense
                  style="background: transparent"
                  class="px-2"
                >
                  <v-list-item
                    dense
                    v-for="(settingsOption, key) in settingsOptions"
                    :key="key"
                    @click="settingsOption.actionMethod"
                    class="d-flex py-1 my-1 rounded-lg"
                    :class="settingsOption.showCondition ? 'grey darken-4' : ''"
                  >
                    <v-list-item-icon class="d-flex align-self-start mr-6">
                      <v-icon
                        v-if="settingsOption.showCondition"
                        size="25"
                        :class="[
                          !darkmode ? 'text--darken-4' : 'text--darken-1',
                          key === 1
                            ? 'yellow--text'
                            : darkmode
                            ? 'grey--text'
                            : 'white--text',
                        ]"
                      >
                        {{ settingsOption.onIcon }}
                      </v-icon>
                      <v-icon
                        v-else
                        size="25"
                        :class="[
                          !darkmode ? 'text--darken-4' : 'text--darken-1',
                          key === 1 ? 'yellow--text' : 'grey--text',
                        ]"
                      >
                        {{ settingsOption.offIcon }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                      class="font-weight-bold text-caption text-truncate mr-5 d-flex flex-column justify-end"
                      :style="{
                        color: darkmode ? '#f3f4fd' : '',
                      }"
                    >
                      <span>
                        {{ settingsOption.text }}
                      </span>
                      <span
                        v-if="settingsOption.description"
                        class="grey--text text-pre-wrap"
                        style="font-size: 10px; margin-top: 5px"
                        >{{ settingsOption.description }}</span
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
            </v-menu>

            <v-menu
              transition="slide-y-transition"
              bottom
              offset-y
              elevation="0"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  class="mr-4 rounded-circle px-0 elevation-0"
                  large
                  style="height: 40px; min-width: 40px"
                  :style="{
                    backgroundColor: darkmode ? '#232228' : 'white',
                  }"
                >
                  <v-icon
                    :dark="darkmode"
                    :color="darkmode ? 'white' : '#232228'"
                    size="25"
                  >
                    mdi-account-outline
                  </v-icon>
                </v-btn>
              </template>
              <div
                class="mt-2 rounded-lg"
                style="max-width: 230px; min-width: 200px"
                :style="{
                  backgroundColor: darkmode ? '#0C0B10' : 'white',
                }"
              >
                <v-list
                  :disabled="loading"
                  dense
                  style="background: transparent"
                >
                  <v-list-item
                    v-if="selectedProfile"
                    class="text-h5 text-uppercase font-weight-bold pt-2 pb-4"
                    :style="{
                      borderBottom: darkmode
                        ? '1px solid grey'
                        : '1px solid #EEE',
                    }"
                  >
                    <span
                      :style="{
                        color: darkmode ? '#f3f4fd' : '#0C0B10',
                      }"
                      style="letter-spacing: 0px"
                      class="d-flex flex-column align-center justify-center mx-auto text-truncate"
                    >
                      <v-icon
                        size="50"
                        :color="darkmode ? 'indigo lighten-1' : 'grey'"
                      >
                        mdi-account-circle-outline
                      </v-icon>
                      {{ selectedProfile.name }}
                    </span>
                  </v-list-item>
                  <v-list-item class="text-h4 text-uppercase font-weight-bold">
                    <span
                      :style="{
                        color: darkmode ? '#f3f4fd' : '#0C0B10',
                      }"
                      style="letter-spacing: 0px"
                    >
                      Select profile
                    </span>
                  </v-list-item>
                  <div
                    class="custom-scrollbar"
                    style="max-height: 180px; overflow-y: auto"
                  >
                    <v-list-item
                      dense
                      v-for="(profile, i) in userProfiles.filter((profile) => {
                        if (selectedProfile) {
                          return profile.name !== selectedProfile.name;
                        }

                        return true;
                      })"
                      :key="i"
                      @click="loadProfile({ profile: profile })"
                    >
                      <v-list-item-icon class="mr-2">
                        <v-icon
                          size="20"
                          :color="darkmode ? 'grey' : '#232228'"
                        >
                          mdi-account-circle-outline
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-title
                        class="font-weight-bold text-caption text-truncate"
                        :style="{
                          color: darkmode ? '#f3f4fd' : '',
                        }"
                      >
                        {{ profile.name }}
                      </v-list-item-title>
                    </v-list-item>
                  </div>
                </v-list>
              </div>
            </v-menu>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { detectWalletType } from "@/util/helpers";

export default {
  data() {
    return {
      farmSearchInput: "",
      valid: true,
      walletType: null,
      fieldActive: false,
    };
  },
  mounted() {
    if (
      this.$route.name === "Portfolio" &&
      this.$route?.params?.wallet &&
      this.$route?.params?.wallet != this.wallet
    ) {
      this.wallet = this.$route?.params?.wallet;
      this.$router
        .push({ name: "Portfolio", params: { wallet: this.wallet } })
        .catch(() => {});
    }

    this.walletType = detectWalletType(this.wallet);
  },
  created() {
    this.getFarms();
  },
  computed: {
    ...mapState("farmStore", ["farms", "cosmosFarms", "solFarms"]),
    ...mapGetters("generalStore", [
      "compactView",
      "darkmode",
      "noLPPools",
      "round",
      "smallValues",
    ]),
    ...mapGetters("farmStore", ["farmRules"]),
    ...mapGetters("walletStore", [
      "connectedWallet",
      "walletRules",
      "selectedProfile",
    ]),
    ...mapGetters("profileStore", ["userProfiles"]),
    settingsOptions() {
      return [
        {
          actionMethod: this.toggleCompactView,
          showCondition: this.compactView,
          onIcon: "mdi-view-list",
          offIcon: "mdi-view-compact",
          text: `${this.compactView ? "List View" : "Card View"} Mode`,
          description: `${
            this.compactView
              ? "Display farm assets in a compact table"
              : "Display farm assets in as individual cards"
          }`,
        },
        {
          actionMethod: this.toggleDarkMode,
          showCondition: this.darkmode,
          onIcon: "mdi-weather-night",
          offIcon: "mdi-weather-sunny",
          text: `${this.darkmode ? "Dark" : "Light"} Mode`,
        },
        {
          actionMethod: this.toggleRounding,
          showCondition: this.round,
          onIcon: "mdi-decimal",
          offIcon: "mdi-decimal-increase",
          text: `${this.round ? "Rounded" : "No Rounding"}`,
          description: `${
            this.round
              ? "Round all numbers to 2 decimal places"
              : "Remove rounding from all numbers"
          }`,
        },
        {
          actionMethod: this.toggleSmallValues,
          showCondition: this.smallValues,
          onIcon: "mdi-less-than",
          offIcon: "mdi-greater-than",
          text: `${this.smallValues ? "Small" : "No Small"} Values`,
          description: `${
            this.smallValues ? "Show" : "Hide"
          } small balances in wallet`,
        },
        {
          actionMethod: this.toggleNoLPPools,
          showCondition: this.noLPPools,
          onIcon: "mdi-water-plus",
          offIcon: "mdi-water-minus",
          text: `${this.noLPPools ? "Empty" : "No Empty"} Pools`,
          description: `${
            this.smallValues ? "Show" : "Hide"
          } small balances in farms`,
        },
      ];
    },
    loading: function () {
      return (
        this.$store.state.farmStore.loading ||
        this.$store.state.walletStore.loading ||
        this.$store.state.poolStore.loading
      );
    },
    wallet: {
      get() {
        return this.$store.state.walletStore.wallet;
      },
      set(value) {
        this.setWallet(value);
      },
    },
    selectedFarms: {
      get() {
        return this.$store.state.farmStore.selectedFarms;
      },
      set(value) {
        this.setSelectedFarms(value);
      },
    },
    sortFarmsAlpha: function () {
      // make a new array as .sort modifies original array
      const array = JSON.parse(
        JSON.stringify(this.$store.state.farmStore.farms)
      );
      return array.sort((a, b) => a.name.localeCompare(b.name));
    },
    allFeaturedFarms: function () {
      return this.sortFarmsAlpha.filter((farm) => farm.featured === 1);
    },
    allRegularFarms: function () {
      return this.sortFarmsAlpha.filter((farm) => farm.featured !== 1);
    },
    joinedFarms: function () {
      return this.allFeaturedFarms.concat(this.allRegularFarms);
    },
  },
  watch: {
    wallet: {
      immediate: true,
      deep: true,
      handler(value) {
        this.walletType = detectWalletType(value);
      },
    },
  },
  methods: {
    ...mapActions("farmStore", ["getFarms", "setSelectedFarms"]),
    ...mapActions("generalStore", [
      "setWalletDialog",
      "toggleCompactView",
      "toggleDarkMode",
      "toggleNoLPPools",
      "toggleRounding",
      "toggleSmallValues",
    ]),
    ...mapActions("walletStore", [
      "setWallet",
      "loadCosmosWallet",
      "loadSolWallet",
      "loadProfile",
      "loadPortfolio",
    ]),
  },
};
</script>

<style scoped>
.bg-gradient-default {
  background: linear-gradient(87deg, #172b4d, #1a174d) !important;
}

.bg-gradient-primary {
  background: linear-gradient(87deg, #5e72e4, #825ee4) !important;
}

.grow {
  transition: all 0.2s ease-in-out;
}

.grow:hover {
  transform: scale(1.5);
  filter: drop-shadow(0 0 0.35rem #5e72e4);
}

.v-menu__content {
  box-shadow: none;
  filter: drop-shadow(0px 0px 20px #5e72e444);
}
</style>

<style>
.custom-placeholder-color input::placeholder {
  color: #8e8e90 !important;
}

.custom-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f51c;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f51c;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #5e72e4;
}

.search-bar .v-input__slot {
  min-height: 40px !important;
}

.search-bar .v-input__prepend-inner,
.search-bar .v-input__append-inner {
  margin-top: 14px !important;
}
</style>
