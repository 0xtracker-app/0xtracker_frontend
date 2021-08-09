<template>
  <v-form
    class="py-1 px-5 border-bottom-dark"
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-row>
      <v-col md="11" sm="11">
        <v-row>
          <v-col md="6" sm="12">
            <label for="" class="font-weight-600 mb-2 d-block text-white">Wallet Address</label>
            <v-text-field
              v-model="wallet"
              :disabled="loading"
              rounded
              outlined
              solo
              class="font-size-input placeholder-dark input-alternative input-icon"
              :rules="walletRules"
              :dark="darkmode"
            >
              <template slot="prepend-inner">
                <v-icon size=".875rem">fas fa-wallet</v-icon>
              </template>
              <template v-slot:append v-if="!wallet">
                <v-icon @click="connectWallet()" v-bind="attrs" v-on="on">
                  fas fa-plug
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <label for="" class="font-weight-600 mb-2 d-block text-white">Farms</label>
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
                    <v-list-item-title v-html="data.item.text"></v-list-item-title>
                    <v-list-item-subtitle v-html="`${data.item.group ? 'Featured' : ''}`"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </template>
              <template slot="prepend-inner">
                  <v-icon size=".875rem"
                  >fas fa-tractor</v-icon
                >
              </template>
            </v-autocomplete>
          </v-col>
        </v-row>
      </v-col>
      <v-col md="1" sm="1" class="text-center">
        <label for="" class="font-weight-600 mb-1 d-block text-white">Go!</label>
        <v-btn
          :disabled="loading"
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
import { store, mutations } from '@/store.js';

export default {
  name: "HorizontalForm",
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
      return this.joinedFarms.map(farm => {return { text: `${farm.name} (${farm.network})`, value: farm, network: farm.network, group: farm.featured === 1 ? 'Featured' : '' }});
    },
  },
  methods: {
    async getFarmsList() {
      mutations.getFarms();
    },
    loadPortfolio() {
      if (this.$refs.form.validate()) {
        // .catch(()=>{}) to allow router navigation to the same component
        this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet }}).catch(()=>{});
        mutations.setFarmsAndWallet(this.selectedFarms, this.wallet);
        this.$eventHub.$emit('load-wallet');
        this.$eventHub.$emit('load-farms');
      } else this.valid = false;
    },
    async connectWallet() {
      await mutations.connectWallet();
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
