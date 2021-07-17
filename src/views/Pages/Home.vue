<template>
  <v-row class="d-flex justify-center mt-n16">
    <v-col cols="12" md="8">
      <VerticalForm />
      <SponsorsFooter />
      <v-snackbar
        :value="alerts.length"
        :timeout="-1"
      >
        {{ alerts.join(' ') }}
      </v-snackbar>
      <v-btn
        @click="darkmode = !darkmode"
        :dark="darkmode"
        fixed
        bottom
        right
        fab
      >
        <v-icon v-if="darkmode">mdi-weather-sunny</v-icon>
        <v-icon v-else>mdi-weather-night</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { store, mutations } from '@/store.js';
import VerticalForm from '@/views/Forms/VerticalForm.vue'
import SponsorsFooter from '@/components/SponsorsFooter.vue'

export default {
  name: "WalletInput",
  components: {
    VerticalForm,
    SponsorsFooter,
  },
  props: {
    showEasySubmit: Boolean,
  },
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
    };
  },
  computed: {
    alerts() {
      return store.alerts;
    },
    count() {
      return store.count;
    },
    darkmode: {
      get () {
        return store.userData.darkmode;
      },
      set () {
        mutations.toggleDarkMode();
      }
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
      return this.joinedFarms.map(farm => {return { text: farm.name, value: farm, network: farm.network, group: farm.featured === 1 ? 'Featured' : '' }});
    },
  },
  methods: {
    // TODO: Move to store
    async getFarmsList() {
      mutations.getFarms();
    },
    viewPortfolio() {
      if (this.$refs.form.validate()) {
        mutations.setFarmsAndWallet(this.selectedFarms, this.wallet);
        this.$eventHub.$emit('load-wallet');
        this.$eventHub.$emit('load-farms');
      } else this.valid = false;
    },
  }
};
</script>

<style scoped></style>
