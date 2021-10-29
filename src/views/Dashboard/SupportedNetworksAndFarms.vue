<template>
  <div>
    <v-container>
      <v-row>
        <v-col class="mx-auto pt-0" lg="10">
          <v-text-field
            v-model="search"
            :disabled="loading"
            rounded
            outlined
            flat
            class="font-size-input input-icon mr-2"
            hide-details
            :dark="darkmode"
            :placeholder="`Search ${farms.length} farms...`"
          >
            <template slot="prepend-inner">
              <v-icon size=".875rem" color="grey">fas fa-search</v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row
        v-if="!loading && farmsByNetwork && Object.keys(farmsByNetwork).length"
      >
        <v-col
          v-for="(networkWithFarms, network) in farmsByNetwork"
          :key="network"
          class="mx-auto pt-0"
          cols="12"
          lg="10"
        >
          <SupportedNetworkAndFarms
            :network="network"
            :farms="networkWithFarms"
          />
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col class="mx-auto pt-0" lg="8">
          <v-overlay :absolute="true" :value="loading">
            <div class="text-center">
              <v-progress-circular indeterminate color="white" />
            </div>
          </v-overlay>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import SupportedNetworkAndFarms from "@/components/SupportedNetworksAndFarms/SupportedNetworkAndFarms.vue";

export default {
  name: "SupportedNetworksAndFarms",
  components: {
    SupportedNetworkAndFarms,
  },
  data: () => ({
    search: "",
  }),
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("farmStore", ["farms"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    farmsByNetwork() {
      let farmsByNetwork = {};
      this.farms.forEach((farm) => {
        if (
          this.search &&
          farm.name.toLowerCase().includes(this.search.toLowerCase())
        ) {
          if (farmsByNetwork.hasOwnProperty(farm.network)) {
            farmsByNetwork[farm.network].push(farm);
          } else {
            farmsByNetwork[farm.network] = [];
            farmsByNetwork[farm.network].push(farm);
          }
        } else if (!this.search) {
          if (farmsByNetwork.hasOwnProperty(farm.network)) {
            farmsByNetwork[farm.network].push(farm);
          } else {
            farmsByNetwork[farm.network] = [];
            farmsByNetwork[farm.network].push(farm);
          }
        }
      });
      return farmsByNetwork;
    },
  },
  created() {
    this.getFarms();
  },
  methods: {
    ...mapActions("farmStore", ["getFarms"]),
  },
};
</script>
