<template>
  <div>
    <v-container fluid>
      <v-row class="d-flex">
        <v-col
          class="d-flex flex-column justify-space-between align-center"
          cols="12"
        >
          <SponsorsHeader />
          <v-btn
            elevation="0"
            :ripple="false"
            height="43"
            class="font-weight-600 text-capitalize drawer-toggler py-3 px-6 rounded-sm"
            :class="{
              'btn-dark-toggler-hover': !hasBg,
              'btn-toggler-hover': hasBg,
              active: togglerActive,
            }"
            v-if="$vuetify.breakpoint.mobile"
            color="transparent"
            @click="drawerClose"
          >
            <div class="drawer-toggler-inner">
              <i class="drawer-toggler-line" :class="{ 'bg-white': hasBg }"></i>
              <i class="drawer-toggler-line" :class="{ 'bg-white': hasBg }"></i>
              <i class="drawer-toggler-line" :class="{ 'bg-white': hasBg }"></i>
            </div>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mutations } from "@/store.js";
import SponsorsHeader from "@/components/SponsorsHeader.vue";

export default {
  name: "app-bar",
  components: {
    SponsorsHeader,
  },
  props: {
    background: String,
    hasBg: Boolean,
    linkColor: String,
    toggleActive: Boolean,
  },
  data() {
    return {
      // Mocked for testing purposes
      portfolios: [
        {
          text: "BSC Main Wallet",
          value: "0x72Dc7f18ff4B59143ca3D21d73fA6e40D286751f",
        },
        {
          text: "Matic Main Wallet",
          value: "0x117e1e54B3b138374d1AE94032F34F0ed6A3E276",
        },
      ],
      selectedPortfolio: "0x123",
      walletRules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 3) || "Min 3 characters.",
      ],
      farmRules: [
        (value) => !!value || "Required.",
        (value) => (value && value.length >= 1) || "Min 1 farm.",
      ],
      drawer: false,
      togglerActive: false,
    };
  },
  created () {
    this.getFarmsList();
    if (this.$route.name === "Portfolio") this.wallet = this.$route?.params?.wallet;
  },
  methods: {
    drawerClose() {
      this.togglerActive = !this.togglerActive;
      this.$emit("drawer-toggle", true);
    },
    async getFarmsList() {
      mutations.getFarms();
    },
    viewPortfolio() {
      if (this.$refs.form.validate()) {
        mutations.setFarmsAndWallet(this.selectedFarms, this.wallet);
        this.$eventHub.$emit("load-wallet");
        this.$eventHub.$emit("load-farms");
      } else this.valid = false;
    },
  },
  watch: {
    toggleActive(val) {
      this.togglerActive = val;
    },
  },
};
</script>
