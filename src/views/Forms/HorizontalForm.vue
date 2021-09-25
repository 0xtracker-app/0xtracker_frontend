<template>
  <v-form
    class="py-1 px-5 border-bottom-dark"
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-row>
      <v-col md="11" cols="11">
        <v-row>
          <v-col md="8" cols="12">
            <label for="" class="font-weight-600 mb-2 d-block text-white">
              Wallet Address
            </label>
            <v-text-field
              v-model="wallet"
              :disabled="loading"
              rounded
              outlined
              solo
              class="font-size-input placeholder-dark input-alternative input-icon"
              :rules="walletRules"
              :dark="darkmode"
              @input="detectWalletType()"
            >
              <template slot="prepend-inner">
                <v-icon size=".875rem">fas fa-wallet</v-icon>
              </template>
              <template
                v-slot:append
                v-if="!wallet || !connectedWallet || wallet !== connectedWallet"
              >
                <span
                  v-if="wallet || walletType"
                  class="caption px-2 font-weight-bold text-uppercase"
                  :class="[walletType ? 'blue--text' : 'red--text']"
                >
                  {{ walletType || "UNSUPPORTED" }}
                </span>
                <v-icon @click="setWalletDialog(true)"> fas fa-plug </v-icon>
              </template>
              <template v-slot:append v-else-if="connectedWallet">
                <span
                  v-if="wallet || walletType"
                  class="caption px-2 font-weight-bold text-uppercase"
                  :class="[walletType ? 'blue--text' : 'red--text']"
                >
                  {{ walletType || "UNSUPPORTED" }}
                </span>
                <v-icon @click="setWalletDialog(true)" color="green">
                  fas fa-plug
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="4" cols="12">
            <label for="" class="font-weight-600 mb-2 d-block text-white">
              Profiles
            </label>
            <v-select
              rounded
              outlined
              solo
              v-model="selectedProfile"
              item-text="name"
              :disabled="loading"
              :items="userProfiles"
              placeholder="Select Profile"
              :dark="darkmode"
              :menu-props="darkmode ? 'dark' : 'light'"
              return-object
              class="font-size-input text-color-dark input-alternative input-focused-alternative input-icon mb-0"
              @input="loadProfile"
            >
              <!-- <template v-slot:item="data">
                <template>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.name" />
                  </v-list-item-content>
                </template>
              </template> -->
            </v-select>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="1" sm="1" class="text-center">
        <label for="" class="font-weight-600 mb-1 d-block text-white">
          Go!
        </label>
        <v-btn
          :disabled="loading || !walletType"
          elevation="0"
          :ripple="false"
          height="40"
          min-width="40"
          width="40"
          class="font-weight-600 text-capitalize btn-ls btn-default me-2 my-2 rounded-circle"
          @click="loadPortfolio()"
          :dark="darkmode"
        >
          <v-icon size="18" color="#5e72e4">fa-arrow-circle-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import WAValidator from "trezor-address-validator";
import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";

export default {
  data() {
    return {
      selectedProfile: {},
      farmSearchInput: "",
      valid: true,
      walletType: null,
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

    this.detectWalletType();
  },
  created() {
    this.getFarms();
  },
  computed: {
    ...mapState("farmStore", ["farms", "cosmosFarms", "solFarms"]),
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("farmStore", ["farmRules"]),
    ...mapGetters("walletStore", ["connectedWallet", "walletRules"]),
    ...mapGetters("profileStore", ["userProfiles"]),
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
  methods: {
    ...mapActions("farmStore", ["getFarms", "setSelectedFarms"]),
    ...mapActions("generalStore", ["setWalletDialog"]),
    ...mapActions("poolStore", ["getPoolsForFarms", "newGetPoolsForFarms"]),
    ...mapActions("walletStore", [
      "loadWallet",
      "setWallet",
      "loadWallets",
      "loadCosmosWallet",
      "loadSolWallet",
    ]),
    loadPortfolio() {
      const data = {
        name: "Single Wallet",
        wallets: [
          {
            walletAddress: this.wallet,
            walletType: this.walletType,
          },
        ],
        skipNetworks: [],
        skipFarms: {
          kcc: [],
          oke: [],
          matic: [],
          ftm: [],
          eth: [],
          harmony: [],
          avax: [],
          bsc: [],
          cosmos: [],
          moon: [],
        },
      };

      this.loadProfile(data);
    },
    loadProfile(selected) {
      let skipFarmsData = [];
      const skipFarmsValues = Object.values(selected.skipFarms);
      skipFarmsValues.map((farms) =>
        farms.map((farm) => skipFarmsData.push(farm))
      );
      this.$store.commit("walletStore/SET_WALLET_BALANCES", []);
      selected.wallets.map((wallet) => {
        if (wallet.walletType === "EVM") {
          this.loadWallets({ wallet: wallet.walletAddress });
          this.farms.map((selectFarm) => {
            if (
              !skipFarmsData.includes(selectFarm.sendValue) &&
              !["sol", "cosmos"].includes(selectFarm.network)
            ) {
              this.newGetPoolsForFarms({
                walletAddress: wallet.walletAddress,
                selectFarm,
                network: "evm",
              });
            }
          });
        } else if (wallet.walletType === "Cosmos") {
          this.loadCosmosWallet({ wallet: wallet.walletAddress });
          this.cosmosFarms.map((selectFarm) => {
            if (!skipFarmsData.includes(selectFarm.sendValue)) {
              this.newGetPoolsForFarms({
                walletAddress: wallet.walletAddress,
                selectFarm,
                network: "cosmos",
              });
            }
          });
        } else if (wallet.walletType === "Solana") {
          this.loadSolWallet({ wallet: wallet.walletAddress });
          this.solFarms.map((selectFarm) => {
            if (!skipFarmsData.includes(selectFarm.sendValue)) {
              this.newGetPoolsForFarms({
                walletAddress: wallet.walletAddress,
                selectFarm,
                network: "sol",
              });
            }
          });
        }
      });
    },
    detectWalletType() {
      let isTypeEVM = ethers.utils.isAddress(this.wallet);
      let isTypeCosmos = WAValidator.validate(this.wallet, "cosmos");
      let isTypeSolana;
      try {
        const key = new PublicKey(this.wallet);
        isTypeSolana = Boolean(key);
      } catch (e) {
        isTypeSolana = false;
      }

      const walletType = isTypeEVM
        ? "EVM"
        : isTypeCosmos
        ? "Cosmos"
        : isTypeSolana
        ? "Solana"
        : null;

      this.walletType = walletType;
    },
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
</style>
