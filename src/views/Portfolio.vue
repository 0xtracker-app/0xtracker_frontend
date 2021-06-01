<template>
  <div>
    <v-row>
      <WalletInput :show-easy-submit="true" />
      <Wallet />
      <Sponsors />
    </v-row>
  </div>
</template>

<script>
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
};
</script>
