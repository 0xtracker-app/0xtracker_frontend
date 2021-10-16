<template>
  <v-card class="card-shadow mb-6" :dark="darkmode">
    <v-card-text class="card-stats-padding">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon class="mr-2"> mdi-lifebuoy </v-icon>
          <h4 class="font-weight-600 text-muted text-uppercase text-h5 mb-0">
            Platform Distribution
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
              color="#5e72e4"
              :disabled="farms.length === 0"
            >
              View All
            </v-btn>
          </template>

          <v-card :dark="darkmode" class="black-shadow">
            <v-card-title
              class="text-h4 font-weight-bold flex justify-center lighten-2"
            >
              Platform Distribution
            </v-card-title>
            <v-divider></v-divider>

            <v-card-text
              class="custom-scrollbar"
              style="max-height: calc(90vh - 520px); overflow-y: auto"
            >
              <v-row class="d-flex justify-center mt-6">
                <v-col cols="12">
                  <v-data-table
                    dense
                    :headers="headers"
                    :items="farms"
                    item-key="name"
                    class="elevation-1"
                    hide-default-footer
                    :items-per-page="-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td class="font-weight-bold flex">
                          <v-avatar rounded tile size="20">
                            <v-img :src="getNetworkLogo(item.network)" />
                          </v-avatar>
                          {{ item.name }}
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
        color="#5e72e4"
        slot="progress"
      ></v-progress-linear>
      <v-overlay :absolute="true" :value="loading">
        <div class="text-center"></div>
      </v-overlay>
      <div v-if="farms.length > 0">
        <div
          class="d-flex align-center mb-1"
          v-for="(farm, index) in farms.length > 5 ? farms.slice(0, 5) : farms"
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
            {{ farm.name }}
          </span>
          <v-tooltip top :color="darkmode ? 'white' : 'primary'">
            <template v-slot:activator="{ on, attrs }">
              <v-progress-linear
                v-bind="attrs"
                v-on="on"
                :value="getPercentage(farm.total)"
                rounded
                height="7"
                color="#5e72e4"
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
import { mapGetters } from "vuex";

export default {
  name: "AssetAllocationCard",
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "Platform Name",
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
    farms() {
      const farms = Object.entries(this.$store.state.farmStore.farmsWithData)
        .map(([, value]) => value)
        .sort((a, b) => b.total - a.total);

      return farms;
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
