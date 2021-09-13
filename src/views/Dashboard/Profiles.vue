<template>
  <div>
    <HeaderTopDashboard />
    <v-container fluid class="pt-0 px-6 mt-n13">
      <p
        class="font-weight-600 text-h3 mb-0"
        :class="{ 'text-muted': !darkmode }"
      >
        Name : {{ userProfiles[$route.params.id].name }}
      </p>
      <v-row class="mt-0">
        <v-col cols="12" lg="12" class="pt-6">
          <v-card class="card-shadow mb-6" :dark="darkmode">
            <div class="card-header-padding card-border-bottom card-shadow">
              <p
                class="font-weight-600 text-h3 mb-0"
                :class="{ 'text-muted': !darkmode }"
              >
                Wallets
              </p>
              <v-list>
                <v-list-item-group>
                  <v-list-item
                    v-for="(wallet, i) in userProfiles[$route.params.id]
                      .wallets"
                    :key="i"
                  >
                    <v-list-item-icon>{{ wallet.walletType }}</v-list-item-icon>
                    <v-list-item-content append-icon="mdi-delete">
                      <v-list-item-title
                        v-text="wallet.walletAddress"
                      ></v-list-item-title>
                    </v-list-item-content>
                    <v-btn
                      @click="
                        removeWallet({
                          walletKey: i,
                          profileKey: $route.params.id,
                        })
                      "
                    >
                      <v-icon small>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-dialog v-model="dialog" width="500">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on"> Add Wallet </v-btn>
                </template>

                <v-card :dark="darkmode">
                  <v-card-title class="text-h5 lighten-2">
                    Add Wallet
                  </v-card-title>

                  <v-card-text>
                    <v-form v-model="valid">
                      <v-container>
                        <v-row>
                          <v-col cols="12" md="4">
                            <v-select
                              v-model="walletType"
                              :items="walletTypes"
                              label="Type"
                              :menu-props="darkmode ? 'dark' : 'light'"
                            ></v-select>
                          </v-col>

                          <v-col cols="12" md="4">
                            <v-text-field
                              v-model="walletAddress"
                              label="Wallet Address"
                              required
                              :dark="darkmode"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-form>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="
                        addWallet({
                          walletAddress: walletAddress,
                          walletType: walletType,
                          walletID: $route.params.id,
                        }),
                          (dialog = false)
                      "
                    >
                      Add Wallet
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
                Selected Farms {{  userProfiles[$route.params.id].skipNetworks }} {{  userProfiles[$route.params.id].skipFarms }}  
              </p>
            </div>

            <v-row
              v-for="(networkWithFarms, network) in farmsByNetwork"
              :key="network"
            >
              <v-col cols="12" lg="12" class="pt-6">
                {{ network }} <v-switch 
                :input-value="checkNetwork($route.params.id, network)"
                @change="toggleNetwork({'profileKey' : $route.params.id, 'network' : network})"></v-switch>
                
              </v-col>
                  <v-chip
                    v-for="(farm, key) in networkWithFarms"
                    :key="key"
                    class="ma-2"
                    label
                    outlined
                    @click="toggleFarm({'sendValue' : farm.sendValue, 'profileKey' : $route.params.id})"
                  >
                    {{ farm.name }}
                  </v-chip>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";

export default {
  components: {
    HeaderTopDashboard,
  },
  data() {
    return {
      valid: true,
      dialog: false,
      walletAddress: "",
      walletType: "",
      walletTypes: ["EVM", "Solana"],
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
  methods: {
    ...mapActions("farmStore", ["getFarms"]),
    ...mapActions("profileStore", ["addWallet", "removeWallet", "toggleNetwork", "toggleFarm"]),
    checkNetwork(profileKey, network) {
      const networkArray = this.userProfiles[profileKey].skipNetworks;
      if (networkArray.includes(network)) {
        return false
      } else {
        return true
      }
    }
  },
};
</script>