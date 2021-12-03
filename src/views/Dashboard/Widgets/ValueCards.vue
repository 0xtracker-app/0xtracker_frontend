<template>
  <span>
    <v-row class="mt-0" v-view="handleView">
      <v-col cols="12" lg="3" sm="6" class="py-0">
        <PortfolioValue />
      </v-col>
      <v-col cols="12" lg="3" sm="6" class="py-0">
        <WalletValue />
      </v-col>
      <v-col cols="12" lg="3" sm="6" class="py-0">
        <FarmsValue />
      </v-col>
      <v-col cols="12" lg="3" sm="6" class="py-0">
        <PendingRewardsValue />
      </v-col>
    </v-row>
    <v-row
      class="sticky-cards pa-2"
      :style="{
        top: $vuetify.breakpoint.mobile ? '55px' : '63px',
        backgroundColor: darkmode ? '#0c0b10' : '#EBEBF5',
      }"
      v-if="!isVisible"
    >
      <v-col cols="12" lg="3" sm="6" class="py-0 text-center">
        <PortfolioValue value-only />
      </v-col>
      <v-col cols="12" lg="3" sm="6" class="py-0 text-center">
        <WalletValue value-only />
      </v-col>
      <v-col cols="12" lg="3" sm="6" class="py-0 text-center">
        <FarmsValue value-only />
      </v-col>
      <v-col cols="12" lg="3" sm="6" class="py-0 text-center">
        <PendingRewardsValue value-only />
      </v-col>
    </v-row>
  </span>
</template>

<script>
import PortfolioValue from "@/components/Cards/PortfolioValue.vue";
import WalletValue from "@/components/Cards/WalletValue.vue";
import FarmsValue from "@/components/Cards/FarmsValue.vue";
import PendingRewardsValue from "@/components/Cards/PendingRewardsValue.vue";
import { mapGetters } from "vuex";

export default {
  name: "ValueCards",
  components: {
    PortfolioValue,
    WalletValue,
    FarmsValue,
    PendingRewardsValue,
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
  },
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    handleView(e) {
      this.isVisible = e.percentInView !== 0;
    },
  },
};
</script>

<style>
.sticky-cards {
  position: sticky;
  z-index: 6;
  border-radius: 0px 0px 8px 8px;
}
</style>
