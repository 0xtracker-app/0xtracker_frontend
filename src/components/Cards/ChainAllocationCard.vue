<template>
  <v-card
    class="mb-6"
    :dark="darkmode"
    :style="{
      filter: darkmode
        ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
        : '',
    }"
  >
    <v-card-text class="card-stats-padding">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon class="mr-2"> fas fa-cubes </v-icon>
          <h4 class="font-weight-600 text-muted text-uppercase text-h5 mb-0">
            Network Distribution
          </h4>
        </div>

        <v-dialog
          v-model="dialog"
          width="500"
          :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
          :overlay-opacity="darkmode ? 0.2 : 0.46"
          style="overflow: hidden"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="text-caption text-none font-weight-bold white--text"
              elevation="0"
              small
              :dark="darkmode"
              color="indigo lighten-1"
              :disabled="farmsByNetwork.length === 0"
            >
              View All
            </v-btn>
          </template>

          <v-card
            :dark="darkmode"
            class="black-shadow"
            style="max-height: 600px"
          >
            <v-card-title
              class="text-h4 font-weight-bold flex justify-center lighten-2"
            >
              Network Distribution
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text
              class="custom-scrollbar pa-0"
              style="max-height: 500px; overflow-y: auto; overflow-x: hidden"
            >
              <v-row class="d-flex justify-center">
                <v-col cols="12">
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="farmsByNetwork"
                    item-key="name"
                    class="elevation-0"
                    hide-default-footer
                    :items-per-page="-1"
                    mobile-breakpoint="0"
                    style="background-color: transparent"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td class="font-weight-bold flex">
                          <v-avatar rounded tile size="20">
                            <v-img :src="getNetworkLogo(item.network)" />
                          </v-avatar>
                          {{ $t(item.network) }}
                        </td>
                        <td>${{ item.total.toFixed(2) }}</td>
                        <td>
                          <span class="text-right" style="min-width: 50px">
                            {{ getPercentage(item.total).toFixed(2) }}%
                          </span>
                        </td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
      <v-divider class="my-2"></v-divider>
      <v-progress-linear
        v-show="loading"
        :indeterminate="loading"
        color="indigo lighten-1"
        slot="progress"
      ></v-progress-linear>
      <v-overlay :absolute="true" :value="loading">
        <div class="text-center"></div>
      </v-overlay>
      <div v-if="farmsByNetwork.length > 0">
        <div
          class="d-flex align-center mb-1"
          v-for="(farm, index) in farmsByNetwork.length > 5
            ? farmsByNetwork.slice(0, 5)
            : farmsByNetwork"
          :key="index"
        >
          <div
            style="width: 30px"
            class="d-flex justify-center align-center mr-1"
          >
            <v-avatar rounded tile size="20">
              <v-img :src="getNetworkLogo(farm.network)" />
            </v-avatar>
          </div>
          <span
            class="font-weight-bold"
            style="
              min-width: 140px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            "
          >
            {{ $t(farm.network) }}
          </span>
          <v-tooltip top :color="darkmode ? 'white' : 'primary'">
            <template v-slot:activator="{ on, attrs }">
              <v-progress-linear
                v-bind="attrs"
                v-on="on"
                :value="getPercentage(farm.total)"
                rounded
                height="7"
                color="indigo lighten-1"
                class="mx-2"
              />
            </template>
            <span
              class="text-caption font-weight-bold"
              :class="darkmode ? 'blue--text' : ''"
            >
              ${{ farm.total.toFixed(2) }}
            </span>
          </v-tooltip>
          <span class="text-right" style="min-width: 50px">
            {{ getPercentage(farm.total).toFixed(2) }}%
          </span>
        </div>
      </div>
      <div
        v-else
        class="d-flex align-center justify-content-center flex-column py-10 w-full"
      >
        No data available...
      </div>
    </v-card-text>
    <!-- <v-overlay :absolute="true" :value="loading">
      <div class="text-center">
        <v-progress-circular indeterminate color="white"></v-progress-circular>
      </div>
    </v-overlay> -->
  </v-card>
</template>

<script>
import { groupBy } from "@/util/helpers";
import { mapGetters } from "vuex";

export default {
  name: "ChainAllocationCard",
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "Network Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Value", value: "total" },
        { text: "Ratio", value: "ratio" },
      ],
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    farmsByNetwork() {
      const farmsGroupedByNetwork = groupBy(
        Object.entries(this.$store.state.farmStore.farmsWithData).map(
          ([, value]) => value
        ),
        "network"
      );

      const networks = Object.entries(farmsGroupedByNetwork)
        .map(([key, value]) => {
          return {
            network: key,
            total: value.reduce(function (accumulator, item) {
              return accumulator + item.total;
            }, 0),
          };
        })
        .sort((a, b) => b.total - a.total);

      return networks;
    },
    total() {
      return Object.entries(this.$store.state.farmStore.farmsWithData)
        .map(([, value]) => value.total)
        .reduce((prev, next) => prev + next);
    },
  },
  methods: {
    getPercentage(value) {
      return (value / this.total) * 100;
    },
    getNetworkLogo(network) {
      return require(`@/assets/images/networks/${network}.jpg`);
    },
  },
};
</script>

<style lang="scss">
.v-dialog {
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
  border-radius: 28px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f51c;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f51c;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #5e72e4;
}
</style>
