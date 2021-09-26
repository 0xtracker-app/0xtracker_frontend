<template>
  <v-form
    class="py-1 px-5 border-bottom-dark"
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-row>
      <v-col cols="12">
        <v-row>
          <v-col md="8" lg="9" cols="12">
            <v-row>
              <v-col cols="10">
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
                    v-if="
                      !wallet || !connectedWallet || wallet !== connectedWallet
                    "
                  >
                    <span
                      v-if="wallet || walletType"
                      class="caption px-2 font-weight-bold text-uppercase"
                      :class="[walletType ? 'blue--text' : 'red--text']"
                    >
                      {{ walletType || "UNSUPPORTED" }}
                    </span>
                    <v-icon @click="setWalletDialog(true)">
                      fas fa-plug
                    </v-icon>
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
              <v-col cols="auto" class="text-center">
                <label for="" class="font-weight-600 mb-3 d-block text-white">
                  Go!
                </label>
                <v-btn
                  :disabled="loading || !walletType"
                  elevation="0"
                  :ripple="false"
                  height="40"
                  min-width="40"
                  width="40"
                  class="font-weight-600 text-capitalize btn-ls btn-default rounded-circle"
                  @click="loadPortfolio({ walletAddress: wallet, walletType })"
                  :dark="darkmode"
                >
                  <v-icon size="18" color="#5e72e4"
                    >fa-arrow-circle-right</v-icon
                  >
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col md="4" lg="3" cols="12">
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
              :menu-props="{
                offsetY: true,
                dark: darkmode,
                light: !darkmode,
              }"
              return-object
              class="font-size-input text-color-dark input-alternative input-focused-alternative input-icon mb-0"
              @input="loadProfile({ profile: $event })"
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
    ...mapActions("walletStore", [
      "setWallet",
      "loadCosmosWallet",
      "loadSolWallet",
      "loadProfile",
      "loadPortfolio",
    ]),
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
