<template>
  <v-col cols="12">
    <v-card
      :dark="darkmode"
      class="mx-auto pb-1 pt-5"
      outlined
    >
      <div class="mx-5">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="wallet"
            :disabled="loading"
            :rules="walletRules"
            :append-icon="showEasySubmit ? 'mdi-refresh' : ''"
            outlined
            clear-icon="mdi-close-circle"
            clearable
            label="Enter Wallet Address"
            type="text"
            @click:append="viewPortfolio()"
            @click:clear="wallet = ''"
            :loading="loading"
          />
          <v-autocomplete
            v-model="selectedFarms"
            :disabled="loading"
            :rules="farmRules"
            :items="farms"
            outlined
            chips
            small-chips
            label="Select Farms"
            :loading="loading"
            multiple
            deletable-chips
          >
            <template v-slot:item="data">
              <template>
                <v-list-item-avatar v-if="data.item.group">
                  <v-icon>mdi-star</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-html="data.item.text"></v-list-item-title>
                  <v-list-item-subtitle v-html="`${data.item.group ? 'Featured - ' : ''}${data.item.network}`"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </template>
          </v-autocomplete>
          <v-btn
            block
            color="primary"
            class="mb-5"
            :disabled="loading || !valid"
            @click="viewPortfolio()"
          >
            GO
          </v-btn>
        </v-form>
      </div>
    </v-card>
  </v-col>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "WalletInput",
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
  created () {
    this.getFarmsList();
    if (this.$route.name === 'Portfolio') this.wallet = this.$route?.params?.wallet;
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    width() {
      return store.userData.width;
    },
    loading: function() {
      return store.loadingPortfolio || store.loadingFarms || store.loadingBalances;
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
