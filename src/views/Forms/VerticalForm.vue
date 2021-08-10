<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-card class="card-shadow" :dark="darkmode">
      <v-card-text
        class="card-header-padding pt-8 text-center font-size-root"
        :class="{'px-12' : !$vuetify.breakpoint.mobile, 'px-2' : $vuetify.breakpoint.mobile}"
      >
        <label for="" class="label-color font-weight-600 mb-2 d-block" :class="{'text-white': darkmode}">Wallet Address</label>
        <v-text-field
          v-model="wallet"
          rounded
          outlined
          solo
          class="font-size-input placeholder-dark input-alternative input-icon mb-5"
          :rules="walletRules"
        >
          <template slot="prepend-inner">
            <v-icon size=".875rem">fas fa-wallet</v-icon>
          </template>
          <template v-slot:append v-if="!wallet">
            <v-icon @click="connectWallet()">
              fas fa-plug
            </v-icon>
          </template>
        </v-text-field>

        <label for="" class="label-color font-weight-600 mb-2 d-block" :class="{'text-white': darkmode}">Farms</label>
        <v-autocomplete
          rounded
          v-model="selectedFarms"
          :disabled="loading"
          :rules="farmRules"
          :items="farms"
          outlined
          chips
          small-chips
          multiple
          deletable-chips
          solo
          class="font-size-input text-color-dark input-alternative input-focused-alternative input-icon mb-0"
          :dark="darkmode"
          :search-input.sync="farmSearchInput"
          @change="farmSearchInput=''"
          :menu-props="darkmode ? 'dark' : 'light'"
        >
          <template v-slot:item="data">
            <template>
              <v-list-item-avatar v-if="data.item.group">
                <v-icon>fas fa-star</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="data.item.text" />
                <v-list-item-subtitle v-html="`${data.item.group ? 'Featured' : ''}`" />
              </v-list-item-content>
            </template>
          </template>
          <template slot="prepend-inner">
            <v-icon size=".875rem">fas fa-tractor</v-icon>
          </template>
        </v-autocomplete>

        <v-btn
          elevation="0"
          :ripple="false"
          height="43"
          class="font-weight-600 text-capitalize btn-primary py-3 px-6 rounded-sm mt-6"
          color="#5e72e4"
          @click="viewPortfolio()"
          >Go!</v-btn
        >
      </v-card-text>
      <v-overlay
        :absolute="true"
        :value="loading"
      >
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="white"
          ></v-progress-circular>
        </div>
      </v-overlay>
    </v-card>
  </v-form>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "VerticalForm",
  data() {
    return {
      valid: true,
      walletRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters.',
      ],
      farmRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 1) || 'Min 1 farm.',
      ],
      farmSearchInput: '',
    };
  },
  mounted () {
    if (this.$route.name === "Portfolio" && this.$route?.params?.wallet && this.$route?.params?.wallet != this.wallet) {
      this.wallet = this.$route?.params?.wallet;
      this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet }}).catch(()=>{});
    }
  },
  created () {
    this.getFarmsList();
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    width() {
      return store.userData.width;
    },
    loading: function() {
      return store.loadingPools || store.loadingFarms || store.loadingWallet;
    },
    wallet: {
      get () {
        return store.userData.wallet;
      },
      set (value) {
        mutations.setFarmsAndWallet(this.selectedFarms, value);
      }
    },
    selectedFarms: {
      get () {
        return store.userData.selectedFarms;
      },
      set (value) {
        console.log("wallet", value)
        mutations.setFarmsAndWallet(value, this.wallet);
      }
    },
    sortFarmsAlpha: function() {
      // make a new array as .sort modifies original array
      const array = store.farmsList;
      return array.sort((a, b) => a.name.localeCompare(b.name));
    },
    allFeaturedFarms: function() {
      return this.sortFarmsAlpha.filter(farm => farm.featured === 1)
    },
    allRegularFarms: function() {
      return this.sortFarmsAlpha.filter(farm => farm.featured !== 1)
    },
    joinedFarms: function() {
      return this.allFeaturedFarms.concat(this.allRegularFarms);
    },
    farms: function() {
      return this.joinedFarms.map(farm => {return { text: `${farm.name} (${this.$t(farm.network)})`, value: farm, network: farm.network, group: farm.featured === 1 ? 'Featured' : '' }});
    },
  },
  methods: {
    async connectWallet() {
      await mutations.connectWallet();
    },
    // TODO: Move to store
    async getFarmsList() {
      mutations.getFarms();
    },
    viewPortfolio() {
      if (this.$refs.form.validate()) {
        console.log("this.wallet", this.wallet)
        mutations.setFarmsAndWallet(this.selectedFarms, this.wallet);
        // pushing additional params to trigger loading of farms and wallets when navigating from this page
        this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet, loadFarms: true, loadWallet: true }});
      } else this.valid = false;
    },
  }
};
</script>

<style scoped>
.bg-gradient-default {
  background: linear-gradient(87deg,#172b4d,#1a174d) !important
}

.bg-gradient-primary {
  background: linear-gradient(87deg,#5e72e4,#825ee4) !important;
}
</style>
