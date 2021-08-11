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
                <v-icon @click="connectWallet()">
                  fas fa-plug
                </v-icon>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="6" sm="12">
            <label for="" class="font-weight-600 mb-2 d-block text-white">Network</label>
            <v-select
              rounded
              v-model="selectedNetwork"
              :items="items"
              class="font-size-input text-color-dark input-alternative input-focused-alternative input-icon mb-0"
              :dark="darkmode"
              :menu-props="darkmode ? 'dark' : 'light'"
            ></v-select>
              <template>
                <template>
                  <v-list-item-content>
                    <v-list-item-title :v-text="$t(items)"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </template>
              <template slot="prepend-inner">
                  <v-icon size=".875rem"
                  >fas fa-bolt</v-icon
                >
              </template>
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
          @click="loadApprovals()"
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
  name: "RektForm",
  data() {
    return {
      valid: true,
      walletRules: [
        value => !!value || 'Required.',
        value => (value && value.length >= 3) || 'Min 3 characters.',
      ],
    items: ['bsc', 'matic', 'ftm'],
    selectedNetwork : ''
    };
  },
  mounted () {
    if (this.$route.name === "Portfolio" && this.$route?.params?.wallet && this.$route?.params?.wallet != this.wallet) {
      this.wallet = this.$route?.params?.wallet;
      this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet }}).catch(()=>{});
    }
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    width() {
      return store.userData.width;
    },
    loading: function() {
      return store.loadingApprovals;
    },
    wallet: {
      get () {
        return store.userData.wallet;
      }
    }
  },
  methods: {
    loadApprovals() {
      if (this.$refs.form.validate()) {
        // .catch(()=>{}) to allow router navigation to the same component
        mutations.getTokenApprovals(this.wallet, this.selectedNetwork);
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
