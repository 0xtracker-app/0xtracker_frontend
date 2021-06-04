<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          :dark="darkmode"
          class="mx-auto pb-1"
          outlined
        >
          <Welcome />
          <WalletInput />
        </v-card>
      </v-col>
      <Sponsors />
    </v-row>
  </div>
</template>

<script>
import { store } from '@/store.js';
import Welcome from "@/components/Welcome.vue";
import WalletInput from "@/components/WalletInput.vue";
import Sponsors from "@/components/Sponsors.vue";

export default {
  name: "Home",
  components: {
    Welcome,
    WalletInput,
    Sponsors
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    wallet() {
      return store.userData.wallet;
    },
    width() {
      return store.userData.width;
    },
  },
  async created () {
    this.$eventHub.$on('load-farms', this.viewPortfolio);
  },
  methods: {
    viewPortfolio() {
      this.$router.push({ name: 'Portfolio', params: { wallet: this.wallet, loadPortfolio: true, loadWallet: true }})
    }
  },
  beforeDestroy() {
    this.$eventHub.$off('load-farms', this.viewPortfolio);
  }
};
</script>
