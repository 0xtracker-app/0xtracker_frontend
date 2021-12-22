<template>
  <div>
    <v-container fluid>
      <ValueCards />
      <v-row class="mt-8">
        <v-col cols="12" md="7" xl="8">
          <div class="px-md-6 py-4" style="opacity: 0.9">
            <SponsorsHeader />
          </div>
          <HistoricalProfileCard />
        </v-col>
        <v-col cols="12" md="5" xl="4" class="pt-6">
          <KPICards />
        </v-col>
        <v-col cols="12" class="pt-6 d-flex">
          <v-card
            class="mb-3 flex-grow-1"
            :dark="darkmode"
            :style="{
              filter: darkmode
                ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                : '',
            }"
          >
            <div class="card-header-padding">
              <p
                class="font-weight-600 text-h3 mb-0 d-flex justify-space-between align-center fill-height"
                :class="{ 'text-muted': !darkmode }"
              >
                <span
                  class="text-muted text-uppercase text-h5 font-weight-600 d-flex align-center"
                >
                  <v-icon class="mr-2 text-muted"> mdi-wallet-outline </v-icon>
                  Wallet
                </span>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      depressed
                      outlined
                      icon
                      @click="showWallet = !showWallet"
                      class="rounded-lg"
                      small
                      :ripple="false"
                    >
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        class="show-button"
                        size="15"
                      >
                        {{ showWallet ? "mdi-minus-thick" : "mdi-plus-thick" }}
                      </v-icon>
                    </v-btn>
                  </template>
                  <span v-if="showWallet">Hide Wallet Details</span>
                  <span v-else>Show Wallet Details</span>
                </v-tooltip>
              </p>
            </div>
            <v-card-text class="px-0 py-0">
              <v-slide-y-transition>
                <div v-show="showWallet">
                  <WalletsWithoutData />
                  <v-divider></v-divider>
                  <Wallet />
                </div>
              </v-slide-y-transition>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="12" class="pt-6">
          <v-card
            class="mb-6"
            :dark="darkmode"
            :style="{
              filter: darkmode
                ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                : '',
            }"
          >
            <div class="card-header-padding">
              <v-row>
                <v-col cols="12" sm="">
                  <p
                    class="font-weight-600 text-h3 mb-0 d-flex justify-space-between align-center fill-height"
                    :class="{ 'text-muted': !darkmode }"
                  >
                    <span
                      class="text-muted text-uppercase text-h5 font-weight-600 d-flex align-center"
                    >
                      <v-icon class="mr-2 text-muted"> mdi-tractor </v-icon>
                      Farms
                    </span>
                  </p>
                </v-col>
                <v-col
                  cols="12"
                  sm="auto"
                  class="text-right d-flex align-center justify-start justify-sm-end"
                >
                  <span class="font-weight-bold text-subtitle-2 mr-2">
                    Export:
                  </span>
                  <v-btn
                    text
                    @click="csvExport()"
                    outlined
                    x-small
                    class="mr-2"
                    :disabled="
                      loading || Object.keys(farmsWithData).length === 0
                    "
                  >
                    CSV
                  </v-btn>
                  <v-btn
                    text
                    @click="jsonExport()"
                    outlined
                    x-small
                    class="mr-6"
                    :disabled="
                      loading || Object.keys(farmsWithData).length === 0
                    "
                  >
                    JSON
                  </v-btn>

                  <span class="font-weight-bold text-subtitle-2 mr-2">
                    View:
                  </span>
                  <p
                    class="font-weight-600 text-h3 mb-0 mr-2"
                    :class="{ 'text-muted': !darkmode }"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          @click="toggleCompactView()"
                          v-bind="attrs"
                          v-on="on"
                          class="mr-1 pb-1 toggle"
                        >
                          {{ compactView ? "fas fa-list" : "fas fa-th-large" }}
                        </v-icon>
                      </template>
                      <span v-if="compactView">Toggle Card View</span>
                      <span v-else>Toggle List View</span>
                    </v-tooltip>
                  </p>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        depressed
                        outlined
                        icon
                        @click="showFarms = !showFarms"
                        class="rounded-lg"
                        small
                        :ripple="false"
                      >
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          class="show-button"
                          size="15"
                        >
                          {{ showFarms ? "mdi-minus-thick" : "mdi-plus-thick" }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span v-if="showFarms">Hide Farms Details</span>
                    <span v-else>Show Farms Details</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
            <v-card-text class="px-0 py-0">
              <v-slide-y-transition>
                <div v-show="showFarms">
                  <FarmsWithoutData />
                  <v-divider></v-divider>
                  <Farms />
                </div>
              </v-slide-y-transition>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="12" class="pt-6" v-if="compactView">
          <v-card
            class="mb-6"
            :dark="darkmode"
            :style="{
              filter: darkmode
                ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                : '',
            }"
          >
            <div class="card-header-padding">
              <v-row>
                <v-col cols="12" sm="6">
                  <span
                    class="text-muted text-uppercase text-h5 font-weight-600 d-flex align-center"
                  >
                    <v-icon class="mr-2 text-muted"> mdi-hand-coin </v-icon>
                    Lending / Borrowing
                  </span>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  class="text-right d-flex align-center justify-start justify-sm-end"
                >
                  <span
                    class="font-weight-bold text-subtitle-2 mr-2"
                    v-if="
                      lendingFarms.length > 0 && !$store.state.farmStore.loading
                    "
                  >
                    Total: {{ total | toSelectedCurrency }}
                  </span>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        depressed
                        outlined
                        icon
                        @click="showLending = !showLending"
                        class="rounded-lg"
                        small
                        :ripple="false"
                      >
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          class="show-button"
                          size="15"
                        >
                          {{
                            showLending ? "mdi-minus-thick" : "mdi-plus-thick"
                          }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span v-if="showLending">Hide Farms Details</span>
                    <span v-else>Show Farms Details</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </div>
            <v-card-text class="px-0 py-0">
              <v-slide-y-transition>
                <div v-if="showLending">
                  <v-divider />
                  <LendingFarmsTable />
                </div>
              </v-slide-y-transition>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import ValueCards from "@/views/Dashboard/Widgets/ValueCards.vue";
import KPICards from "@/views/Dashboard/Widgets/KPICards.vue";
import Wallet from "@/views/Wallet/Wallet.vue";
import Farms from "@/views/Farms/Farms.vue";
import FarmsWithoutData from "@/views/Farms/FarmsWithoutData.vue";
import WalletsWithoutData from "@/views/Wallet/WalletsWithoutData.vue";
import LendingFarmsTable from "@/views/Farms/LendingFarmsTable.vue";
import HistoricalProfileCard from "@/components/Cards/HistoricalProfileCard.vue";
import SponsorsHeader from "@/components/SponsorsHeader.vue";

export default {
  name: "Dashboard",
  components: {
    ValueCards,
    KPICards,
    Wallet,
    Farms,
    FarmsWithoutData,
    WalletsWithoutData,
    LendingFarmsTable,
    HistoricalProfileCard,
    SponsorsHeader,
  },
  data: function () {
    return {
      showWallet: true,
      showFarms: true,
      showLending: true,
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode", "compactView", "round"]),
    ...mapGetters("farmStore", ["lendingFarms"]),
    loading() {
      return (
        this.$store.state.poolStore.loading ||
        this.$store.state.walletStore.loading
      );
    },
    walletBalancesList: function () {
      return this.$store.state.walletStore.filteredWalletBalancesList;
    },
    unfilteredBalances: function () {
      return this.walletBalancesList.map((balance) => {
        return {
          symbol: balance.symbol,
          tokenBalance: balance.tokenBalance,
          tokenPrice: balance.tokenPrice,
          tokenValue: balance.tokenBalance * balance.tokenPrice,
          tokenAddress: balance.token_address,
          network: balance.network,
        };
      });
    },
    balances: function () {
      const unfilteredBalances = this.unfilteredBalances;
      return unfilteredBalances.filter(
        (balance) => this.smallValues || balance.tokenValue > 1
      );
    },
    farmsCsv: function () {
      let array = [];
      for (const contract in this.$store.state.farmStore
        .filteredFarmsWithData) {
        if (
          Object.hasOwnProperty.call(
            this.$store.state.farmStore.filteredFarmsWithData,
            contract
          )
        ) {
          const farmData = this.$store.state.farmStore.filteredFarmsWithData[
            contract
          ];
          // just insert data you want in the pool data here
          for (const pool in farmData.userData) {
            if (
              Object.hasOwnProperty.call(farmData.userData, pool) &&
              farmData.type != "lending"
            ) {
              const poolData = farmData.userData[pool];
              const flatPool = {
                network: farmData.network,
                farmName: farmData.name,
                tokenPair: poolData.tokenPair,
                actualStaked: poolData.actualStaked,
                dollarValueStake: poolData.lpPrice,
                dollarValuePending: poolData.pendingAmount,
                totalDollarValue: poolData.lpPrice + poolData.pendingAmount,
              };
              array.push(flatPool);
            }
          }
        }
      }
      for (const walletBalance in this.balances) {
        const flatPool = {
          network: this.balances[walletBalance].network,
          farmName: "wallet",
          tokenPair: this.balances[walletBalance].symbol,
          actualStaked: this.balances[walletBalance].tokenBalance,
          dollarValueStake: this.balances[walletBalance].tokenValue,
          dollarValuePending: 0,
          totalDollarValue: this.balances[walletBalance].tokenValue,
        };
        array.push(flatPool);
      }
      return array;
    },
    farmsWithData() {
      // getting object keys and sorting them highest to lowest into an array based on value of total,
      // then adding the contract to the object so that it can be mapped back and removed from the
      // farmsWith/Without objects when a single refresh is done
      return Object.keys(this.$store.state.farmStore.filteredFarmsWithData)
        .sort((a, b) =>
          this.$store.state.farmStore.filteredFarmsWithData[a].total <
          this.$store.state.farmStore.filteredFarmsWithData[b].total
            ? 1
            : -1
        )
        .map((contract) => {
          let farm = this.$store.state.farmStore.filteredFarmsWithData[
            contract
          ];
          farm.contract = contract;
          return farm;
        });
    },
    total() {
      return this.lendingFarms.length > 0
        ? this.lendingFarms.length !== 1
          ? this.lendingFarms.reduce((previousValue, currentValue) => {
              const previousTotal =
                previousValue.poolTotal - previousValue.totalBorrowed;
              const currentTotal =
                currentValue.poolTotal - currentValue.totalBorrowed;
              return previousTotal + currentTotal;
            })
          : this.lendingFarms[0].poolTotal - this.lendingFarms[0].totalBorrowed
        : 0;
    },
  },
  methods: {
    ...mapActions("generalStore", ["toggleCompactView"]),
    csvExport() {
      let csvContent = "data:text/csv;charset=utf-8,";
      let arrData = this.farmsCsv;
      csvContent += [
        Object.keys(arrData[0]).join(","),
        ...arrData.map((item) => Object.values(item).join(",")),
      ]
        .join("\n")
        .replace(/(^\[)|(\]$)/gm, "");

      const data = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", data);
      link.setAttribute("download", "export.csv");
      link.click();
    },
    jsonExport() {
      let dataStr = JSON.stringify(this.farmsCsv);
      let jsonContent =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

      const link = document.createElement("a");
      link.setAttribute("href", jsonContent);
      link.setAttribute("download", "export.json");
      link.click();
    },
  },
};
</script>

<style scoped>
.toggle.v-icon:focus::after {
  background-color: transparent;
}

.show-button:focus::after {
  opacity: 0 !important;
}
</style>
