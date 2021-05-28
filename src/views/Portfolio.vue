<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          :dark="darkmode"
          class="mx-auto pb-1 pt-5"
          outlined
        >
          <WalletInput :current-wallet="portfolio.wallet" :current-farms="portfolio.selectedFarms" :show-easy-submit="true" />
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-card
          :dark="darkmode"
          class="mx-auto py-5" outlined
        >
          <Wallet :wallet="portfolio.wallet"/>
        </v-card>
      </v-col>
      <Sponsors />
    </v-row>
  </div>
</template>

<script>
import { store } from '@/store.js'
import WalletInput from "@/components/WalletInput.vue";
import Wallet from "@/components/Wallet.vue";
import Sponsors from "@/components/Sponsors.vue";

export default {
  name: "Portfolio",
  components: {
    WalletInput,
    Wallet,
    Sponsors,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    portfolio() {
      return { wallet: store.userData.wallet, selectedFarms: store.userData.selectedFarms };
    },
  },
};
</script>
