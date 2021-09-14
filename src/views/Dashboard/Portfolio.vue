<template>
  <div>
    <HorizontalForm />
    <HeaderTopDashboard :showRefresh="true">
      <ValueCards />
    </HeaderTopDashboard>
    <v-container fluid class="pt-0 px-6 mt-n13">
      <v-row class="mt-0">
        <v-col cols="12" lg="12" class="pt-6">
          <v-card class="card-shadow mb-6" :dark="darkmode">
            <div class="card-header-padding card-border-bottom">
              <p
                class="font-weight-600 text-h3 mb-0"
                :class="{ 'text-muted': !darkmode }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="showWallet = !showWallet"
                      v-bind="attrs"
                      v-on="on"
                      class="mr-1 pb-1"
                    >
                      {{ showWallet ? "fas fa-eye-slash" : "fas fa-eye" }}
                    </v-icon>
                  </template>
                  <span v-if="showWallet">Hide Wallet Details</span>
                  <span v-else>Show Wallet Details</span>
                </v-tooltip>
                Wallet
              </p>
            </div>

            <v-card-text class="px-0 py-0">
              <v-slide-y-transition>
                <div v-show="showWallet">
                  <Wallet />
                </div>
              </v-slide-y-transition>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" lg="12" class="pt-6">
          <v-card class="card-shadow mb-6" :dark="darkmode">
            <div class="card-header-padding card-border-bottom">
              <p
                class="font-weight-600 text-h3 mb-0"
                :class="{ 'text-muted': !darkmode }"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="showFarms = !showFarms"
                      v-bind="attrs"
                      v-on="on"
                      class="mr-1 pb-1"
                    >
                      {{ showFarms ? "fas fa-eye-slash" : "fas fa-eye" }}
                    </v-icon>
                  </template>
                  <span v-if="showFarms">Hide Farms Details</span>
                  <span v-else>Show Farms Details</span>
                </v-tooltip>
                Farms
              </p>
              <v-chip class="ma-2" @click="toggleCompactView">
                <v-icon v-if="compactView" class="pr-1">mdi-grid-off</v-icon>
                <v-icon v-else class="pr-1">mdi-grid</v-icon>
                {{ compactView ? "Compact View" : "Card View" }}
              </v-chip>
              <v-btn
                text
                @click="csvExport()"
                v-bind="attrs"
                v-on="on"
                elevation="2"
                outlined
                x-small
              >
                EXPORT CSV
              </v-btn>
            </div>

            <v-card-text class="px-0 py-0">
              <v-slide-y-transition>
                <div v-show="showFarms" v-if="compactView">
                  <FarmsWithoutData />
                  <FarmsCompact />
                </div>
                <div v-show="showFarms" v-else>
                  <FarmsWithoutData />
                  <Farms />
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
import HorizontalForm from "@/views/Forms/HorizontalForm.vue";
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";
import ValueCards from "@/views/Dashboard/Widgets/ValueCards.vue";
import Wallet from "@/views/Wallet/Wallet.vue";
import Farms from "@/views/Farms/Farms.vue";
import FarmsWithoutData from "@/views/Farms/FarmsWithoutData.vue";
import FarmsCompact from "@/views/Farms/FarmsCompact.vue";

export default {
  name: "Dashboard",
  components: {
    HorizontalForm,
    HeaderTopDashboard,
    ValueCards,
    Wallet,
    Farms,
    FarmsWithoutData,
    FarmsCompact,
  },
  data: function () {
    return {
      showWallet: true,
      showFarms: true,
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode", "compactView"]),
    walletBalancesList: function () {
      return this.$store.state.walletStore.walletBalancesList;
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
      for (const contract in this.$store.state.farmStore.farmsWithData) {
        if (
          Object.hasOwnProperty.call(
            this.$store.state.farmStore.farmsWithData,
            contract
          )
        ) {
          const farmData = this.$store.state.farmStore.farmsWithData[contract];
          // just insert data you want in the pool data here
          for (const pool in farmData.userData) {
            if (
              Object.hasOwnProperty.call(farmData.userData, pool) &&
              farmData.type != "lending"
            ) {
              const poolData = farmData.userData[pool];
              const flatPool = {
                network : farmData.network,
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
          network : this.balances[walletBalance].network,
          farmName: 'wallet',
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
  },
};
</script>
