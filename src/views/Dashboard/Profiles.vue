<template>
  <div>
    <v-container fluid class="pt-0 px-6">
      <p
        class="font-weight-600 text-h3 mb-0"
        :class="darkmode ? 'white--text' : 'grey--text text--darken-2'"
      >
        Name :
        <span class="font-weight-bold">
          {{ userProfiles[$route.params.id].name }}
        </span>
      </p>
      <v-row class="mt-0">
        <v-col cols="12" lg="12" class="pt-6">
          <v-card class="card-shadow mb-6" :dark="darkmode">
            <div class="card-border-bottom card-shadow">
              <div
                class="card-header-padding d-flex justify-space-between align-center"
              >
                <p
                  class="font-weight-600 text-h3 mb-0"
                  :class="{ 'text-muted': !darkmode }"
                >
                  Wallets
                </p>
                <v-btn
                  v-if="userProfiles[$route.params.id].wallets.length > 0"
                  class="text-none px-4"
                  elevation="0"
                  rippple
                  @click="dialog = true"
                >
                  <v-icon class="mr-2">mdi-credit-card-plus-outline</v-icon>
                  Add Wallet
                </v-btn>
              </div>
              <v-divider></v-divider>
              <div class="card-header-padding">
                <v-list flat>
                  <v-list-item-group>
                    <v-list-item
                      v-for="(wallet, i) in userProfiles[$route.params.id]
                        .wallets"
                      :key="i"
                      ripple
                      class="rounded-xl"
                    >
                      <v-list-item-content class="py-0 py-md-4">
                        <div
                          class="d-flex flex-column flex-sm-row justify-space-between align-md-center flex-shrink-1"
                          style="max-width: -webkit-fill-available"
                        >
                          <div class="d-flex flex-column">
                            <span
                              class="text-uppercase font-weight-bold text-muted text-overline mb-0"
                              style="line-height: 1rem"
                            >
                              {{ wallet.walletType }}
                            </span>
                            <span
                              class="font-weight-medium text-subtitle-2 text-md-subtitle-1 d-inline-block text-truncate"
                              :class="[
                                darkmode ? 'white--text' : 'black--text',
                              ]"
                            >
                              {{ wallet.walletAddress }}
                            </span>
                          </div>
                          <div
                            class="d-flex justify-end justify-sm-space-between"
                          >
                            <v-icon
                              size="24"
                              @click="openEditDialog(i)"
                              class="grey--text text--darken-1 rounded-circle pa-1"
                            >
                              mdi-credit-card-edit
                            </v-icon>
                            <v-spacer
                              v-if="$vuetify.breakpoint.smAndUp"
                              class="px-2"
                            ></v-spacer>
                            <v-icon
                              size="24"
                              @click="
                                removeWallet({
                                  walletKey: i,
                                  profileKey: $route.params.id,
                                })
                              "
                              class="red--text rounded-circle pa-1"
                            >
                              mdi-delete
                            </v-icon>
                          </div>
                          <v-divider
                            v-if="
                              $vuetify.breakpoint.xsOnly &&
                              userProfiles[$route.params.id].wallets.length >
                                i + 1
                            "
                            class="my-2"
                          ></v-divider>
                        </div>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-dialog
                  v-model="editDialog"
                  width="600"
                  :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
                  :overlay-opacity="darkmode ? 0.2 : 0.46"
                >
                  <v-card :dark="darkmode">
                    <v-card-title
                      class="text-h4 font-weight-bold flex justify-center lighten-2"
                    >
                      Edit Wallet
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>
                      <v-form v-model="valid">
                        <v-container>
                          <v-row>
                            <v-col class="d-flex align-center" cols="12" md="4">
                              <v-select
                                v-model="walletType"
                                :items="walletTypes"
                                :menu-props="darkmode ? 'dark' : 'light'"
                                required
                                class="text-h5"
                              >
                                <template v-slot:label>
                                  <span style="font-size: 14px"> Type </span>
                                </template>
                              </v-select>
                            </v-col>

                            <v-col class="d-flex align-center" cols="12" md="8">
                              <v-text-field
                                placeholder="Enter your wallet address"
                                class="text-h5"
                                dense
                                v-model="walletAddress"
                                required
                                hide-details
                                :dark="darkmode"
                              >
                                <template v-slot:label>
                                  <span style="font-size: 14px">
                                    Wallet Address
                                  </span>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-card-text>

                    <v-card-actions class="pb-4 px-6 flex justify-end">
                      <v-btn
                        class="text-none px-4"
                        elevation="0"
                        :block="$vuetify.breakpoint.smAndDown"
                        rippple
                        :disabled="!walletAddress || !walletType"
                        @click="updateExistingWallet()"
                      >
                        <v-icon class="mr-2">
                          mdi-credit-card-plus-outline
                        </v-icon>
                        Update Wallet
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <div
                  v-if="userProfiles[$route.params.id].wallets.length === 0"
                  class="d-flex flex-column align-center justify-center text-h3 grey--text mb-4 text-center"
                  :class="[darkmode ? 'text--darken-2' : 'text--lighten-1']"
                >
                  <v-icon
                    size="30"
                    class="grey--text"
                    :class="[darkmode ? 'text--darken-2' : 'text--lighten-1']"
                  >
                    mdi-account-off-outline
                  </v-icon>
                  You have no wallet yet. You can add one!
                  <v-btn
                    class="text-none px-4 mt-4"
                    elevation="0"
                    rippple
                    @click="dialog = true"
                  >
                    <v-icon class="mr-2">mdi-credit-card-plus-outline</v-icon>
                    Add Wallet
                  </v-btn>
                </div>
                <v-dialog
                  v-model="dialog"
                  width="600"
                  :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
                  :overlay-opacity="darkmode ? 0.2 : 0.46"
                >
                  <v-card :dark="darkmode">
                    <v-card-title
                      class="text-h4 font-weight-bold flex justify-center lighten-2"
                    >
                      Add Wallet
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>
                      <v-form v-model="valid">
                        <v-container>
                          <v-row>
                            <v-col class="d-flex align-center" cols="12" md="4">
                              <v-select
                                v-model="walletType"
                                :items="walletTypes"
                                :menu-props="darkmode ? 'dark' : 'light'"
                                required
                                class="text-h5"
                              >
                                <template v-slot:label>
                                  <span style="font-size: 14px"> Type </span>
                                </template>
                              </v-select>
                            </v-col>

                            <v-col class="d-flex align-center" cols="12" md="8">
                              <v-text-field
                                placeholder="Enter your wallet address"
                                class="text-h5"
                                dense
                                v-model="walletAddress"
                                required
                                hide-details
                                :dark="darkmode"
                              >
                                <template v-slot:label>
                                  <span style="font-size: 14px">
                                    Wallet Address
                                  </span>
                                </template>
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-form>
                    </v-card-text>

                    <v-card-actions class="pb-4 px-6 flex justify-end">
                      <v-btn
                        class="text-none px-4"
                        elevation="0"
                        :block="$vuetify.breakpoint.smAndDown"
                        rippple
                        :disabled="!walletAddress || !walletType"
                        @click="
                          addNewWallet(
                            walletAddress,
                            walletType,
                            $route.params.id
                          )
                        "
                      >
                        <v-icon class="mr-2"
                          >mdi-credit-card-plus-outline</v-icon
                        >
                        Add Wallet
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" lg="12" class="pt-6">
          <v-card class="card-shadow mb-6" :dark="darkmode">
            <div class="card-header-padding card-border-bottom card-shadow">
              <p
                class="font-weight-600 text-h3 mb-0"
                :class="{ 'text-muted': !darkmode }"
              >
                Selected Farms
              </p>
            </div>

            <v-col
              v-for="(networkWithFarms, network) in farmsByNetwork"
              :key="network"
            >
              <v-row class="mx-0 my-0 px-3 pt-3">
                {{ $tc(network) }}
                <v-switch
                  :input-value="
                    checkNetwork($route.params.id, network, networkWithFarms)
                  "
                  @change="
                    toggleNetwork({
                      profileKey: $route.params.id,
                      allFarms: networkWithFarms,
                      network: network,
                    })
                  "
                />
              </v-row>

              <div :class="{ 'chips-grid': $vuetify.breakpoint.smAndUp }">
                <v-chip
                  v-for="(farm, key) in networkWithFarms"
                  :key="key"
                  class="ma-2"
                  label
                  :outlined="
                    checkFarm($route.params.id, farm.sendValue, network)
                  "
                  @click="
                    toggleFarm({
                      sendValue: farm.sendValue,
                      profileKey: $route.params.id,
                      network: network,
                    })
                  "
                >
                  {{ farm.name }}
                </v-chip>
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";
import { detectWalletType } from "@/util/helpers";

export default {
  components: {
    HeaderTopDashboard,
  },
  data() {
    return {
      valid: true,
      dialog: false,
      editDialog: false,
      walletAddress: "",
      walletType: "",
      currentWalletId: null,
      walletTypes: ["EVM", "Solana", "Cosmos"],
    };
  },
  computed: {
    ...mapGetters("farmStore", ["farms"]),
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("profileStore", ["userProfiles"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    farmsByNetwork() {
      let farmsByNetwork = {};
      this.farms.forEach((farm) => {
        if (
          this.search &&
          farm.name.toLowerCase().includes(this.search.toLowerCase())
        ) {
          if (farmsByNetwork.hasOwnProperty(farm.network)) {
            farmsByNetwork[farm.network].push(farm);
          } else {
            farmsByNetwork[farm.network] = [];
            farmsByNetwork[farm.network].push(farm);
          }
        } else if (!this.search) {
          if (farmsByNetwork.hasOwnProperty(farm.network)) {
            farmsByNetwork[farm.network].push(farm);
          } else {
            farmsByNetwork[farm.network] = [];
            farmsByNetwork[farm.network].push(farm);
          }
        }
      });
      return farmsByNetwork;
    },
  },
  created() {
    this.getFarms();
  },
  watch: {
    walletAddress: {
      immediate: true,
      deep: true,
      handler(value) {
        this.walletType = detectWalletType(value);
      },
    },
  },
  methods: {
    ...mapActions("farmStore", ["getFarms"]),
    ...mapActions("profileStore", [
      "addWallet",
      "updateWallet",
      "removeWallet",
      "toggleNetwork",
      "toggleFarm",
    ]),
    checkNetwork(profileKey, network, allFarms) {
      const farmObj = this.userProfiles[profileKey].skipFarms;
      const farmLength = allFarms.length;
      if (farmObj.hasOwnProperty(network)) {
        if (farmObj[network].length == farmLength) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    checkFarm(profileKey, farm, network) {
      const farmObj = this.userProfiles[profileKey].skipFarms;
      if (farmObj.hasOwnProperty(network)) {
        if (farmObj[network].includes(farm)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    addNewWallet(walletAddress, walletType, id) {
      this.addWallet({
        walletAddress,
        walletType,
        walletID: id,
      }).then(() => {
        this.dialog = false;
        this.walletAddress = "";
        this.walletType = "";
      });
    },
    updateExistingWallet() {
      this.updateWallet({
        walletAddress: this.walletAddress,
        walletType: this.walletType,
        walletId: this.currentWalletId,
        userProfileId: this.$route.params.id,
      }).then(() => {
        this.editDialog = false;
        this.walletAddress = "";
        this.walletType = "";
        this.currentWalletId = null;
      });
    },
    openEditDialog(i) {
      this.editDialog = true;
      const wallet = this.userProfiles[this.$route.params.id].wallets[i];
      this.walletAddress = wallet.walletAddress;
      this.walletType = wallet.walletType;
      this.currentWalletId = i;
    },
  },
};
</script>

<style scoped>
.v-input--selection-controls {
  margin-top: 0;
  padding-top: 0;
  margin-left: 20px;
}

.chips-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
</style>
