<template>
  <v-row class="mt-0">
    <v-col
      cols="12"
      lg="4"
      md="4"
      class="py-0"
    >
      <PortfolioValue />
    </v-col>
    <v-col
      cols="12"
      lg="4"
      md="4"
      class="py-0"
    >
      <WalletValue />
    </v-col>
    <v-col
      cols="12"
      lg="4"
      md="4"
      class="py-0"
    >
      <FarmsValue />
    </v-col>
  </v-row>
</template>

<script>
import PortfolioValue from "@/components/Cards/PortfolioValue.vue";
import WalletValue from "@/components/Cards/WalletValue.vue";
import FarmsValue from "@/components/Cards/FarmsValue.vue";

export default {
  name: "ValueCards",
  components: {
    PortfolioValue,
    WalletValue,
    FarmsValue,
  },
}
</script>
