<template>
  <div>
    <v-row>
      <WalletInput :show-easy-submit="true" />
      <PortfolioTotalValue />
      <Wallet />
      <Farms />
      <Sponsors />
    </v-row>
  </div>
</template>

<script>
import WalletInput from "@/components/WalletInput.vue";
import PortfolioTotalValue from "@/components/PortfolioTotalValue.vue";
import Farms from "@/components/Farms.vue";
import Wallet from "@/components/Wallet.vue";
import Sponsors from "@/components/Sponsors.vue";

export default {
  name: "Portfolio",
  components: {
    WalletInput,
    PortfolioTotalValue,
    Farms,
    Wallet,
    Sponsors,
  },
};
</script>
