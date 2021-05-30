<template>
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
        @click:append="viewWallet()"
        @click:clear="clear"
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
        :disabled="loading"
        @click="viewWallet()"
      >
        GO
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { store, mutations } from '@/store.js';
import axios from "axios";

export default {
  name: "WalletInput",
  props: {
    currentWallet: String,
    currentFarms: Array,
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
      farmsList: [
        // Leaving this here to easily mock
        // {
        //   sendValue: "0x1ac6C0B955B6D7ACb61c9Bdf3EE98E0689e07B8A",
        //   name: "Eleven.finance",
        //   network: "bsc",
        //   featured: 1
        // },
        // {
        //   sendValue: "0x7f7Bf15B9c68D23339C31652C8e860492991760d",
        //   name: "farm.br34p.finance",
        //   network: "bsc",
        //   featured: 2
        // },
        // {
        //   sendValue: "0x2EBe8CDbCB5fB8564bC45999DAb8DA264E31f24E",
        //   name: "Nerve.fi",
        //   network: "bsc",
        //   featured: 2
        // },
        // {
        //   sendValue: "0x0895196562C7868C5Be92459FaE7f877ED450452",
        //   name: "AutoFarm.network",
        //   network: "bsc",
        //   featured: 2
        // },
      ],
    };
  },
  created () {
    this.getFarmsList();
  },
  computed: {
    store: function() {
      return store.loadingFarms || store.loadingPortfolio;
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
    loading: function() {
      return store.loadingFarms || store.loadingPortfolio;
    },
    sortFarmsAlpha: function() {
      // make a new array as .sort modifies original array
      const array = this.farmsList;
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
      try {
        mutations.setAlert('', '')
        mutations.setLoadingFarms(true);
        this.$eventHub.$emit("alert", {type: '', message: ''});
        const response = await axios.get(process.env.VUE_APP_FARMS_URL);
        this.farmsList = response.data;
        mutations.setLoadingFarms(false);
      } catch (error) {
        mutations.setAlert('error', error)
        mutations.setLoadingFarms(false);
      }
    },
    clear() {
      this.wallet = "";
    },
    viewWallet() {
      if (this.$refs.form.validate()) {
        mutations.setFarmsAndWallet(this.selectedFarms, this.wallet);
        this.$eventHub.$emit('load-wallet');
      }
    },
  }
};
</script>

<style scoped></style>
