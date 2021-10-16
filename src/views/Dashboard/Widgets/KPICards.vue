<template>
  <v-row class="mt-0">
    <v-col cols="12" class="py-0">
      <PortfolioExposureCard />
    </v-col>
    <v-col cols="12" class="py-0">
      <AssetAllocationCard />
    </v-col>
    <v-col cols="12" class="py-0">
      <ChainAllocationCard />
    </v-col>
  </v-row>
</template>

<script>
import PortfolioExposureCard from "@/components/Cards/PortfolioExposureCard.vue";
import AssetAllocationCard from "@/components/Cards/AssetAllocationCard.vue";
import ChainAllocationCard from "@/components/Cards/ChainAllocationCard.vue";

export default {
  name: "KPICards",
  components: {
    PortfolioExposureCard,
    AssetAllocationCard,
    ChainAllocationCard,
  },
};
</script>
