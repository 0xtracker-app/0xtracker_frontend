<template>
  <div>
    <HeaderTopDashboard />
    <v-container class="px-6 mt-n16">
      <v-row v-if="!loading && farmsByNetwork && Object.keys(farmsByNetwork).length">
        <v-col v-for="(networkWithFarms, network) in farmsByNetwork" :key="network" class="mx-auto pt-0" lg="8">
          <SupportedNetworkAndFarms :network="network" :farms="networkWithFarms" />
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col class="mx-auto pt-0" lg="8">
          <v-overlay
            :absolute="true"
            :value="loading"
          >
            <div class="text-center">
              <v-progress-circular
                indeterminate
                color="white"
              />
            </div>
          </v-overlay>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { store, mutations } from '@/store.js';
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";
import SupportedNetworkAndFarms from "@/components/SupportedNetworksAndFarms/SupportedNetworkAndFarms.vue";

export default {
  name: "SupportedNetworksAndFarms",
  components: {
    HeaderTopDashboard,
    SupportedNetworkAndFarms,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    loading: function() {
      return store.loadingFarms;
    },
    farms() {
      return store.farmsList;
    },
    farmsByNetwork() {
      let farmsByNetwork = {};
      this.farms.forEach(farm => {
        if (farmsByNetwork.hasOwnProperty(farm.network)) {
          farmsByNetwork[farm.network].push(farm);
        } else {
          farmsByNetwork[farm.network] = [];
          farmsByNetwork[farm.network].push(farm);
        }
      });
      return farmsByNetwork;
    },
  },
  methods: {
    async getAllFarms() {
      mutations.getFarms();
    },
  },
};
</script>
