<template>
  <v-card class="card-shadow mb-6" :dark="darkmode">
    <v-card-text class="card-stats-padding">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon class="mr-2"> mdi-bitcoin </v-icon>
          <h4 class="font-weight-600 text-muted text-uppercase text-h5 mb-0">
            Token Distribution
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
              :disabled="tokens.length === 0"
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
                    :items="tokens"
                    item-key="name"
                    class="elevation-1"
                    hide-default-footer
                    :items-per-page="-1"
                  >
                    <template v-slot:item="{ item }">
                      <tr>
                        <td class="font-weight-bold flex">
                          <v-avatar rounded tile size="20">
                            <v-img
                              :src="getTokenLogo(item.network, item.token)"
                            />
                          </v-avatar>
                          {{ item.name }}
                        </td>
                        <td>{{ item.amount.toFixed(2) }}</td>
                        <td>${{ item.value.toFixed(2) }}</td>
                        <td>
                          <span
                            class="text-right"
                            style="mcolorsin-width: 50px"
                          >
                            {{ getPercentage(item.value).toFixed(2) }}%
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
      <div class="d-flex" v-if="tokens.length > 0">
        <v-row class="d-flex align-center">
          <v-col cols="12" sm="6" class="pa-10 d-flex justify-center">
            <div>
              <DoughnutChart
                :chart-data="chartData"
                :options="options"
                style="max-height: 200px; max-width: 200px"
                :chart-labels="chartLabels"
                :colors="colors"
                ref="portfolioExposureChart"
              ></DoughnutChart>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
            class="pa-10 d-flex flex-column justify-center"
          >
            <v-flex
              v-for="(token, index) in mappedTokens"
              :key="index"
              class="mb-3 mx-auto"
              style="max-width: 250px; width: 100%"
            >
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <div
                    class="rounded-circle mr-2"
                    :style="{
                      backgroundColor: `${labelColors[index]}`,
                      width: '13px',
                      height: '13px',
                    }"
                  ></div>
                  <div
                    style="width: 30px"
                    class="d-flex justify-center align-center mr-1"
                  >
                    <v-avatar rounded tile size="20">
                      <v-img :src="getTokenLogo(token.network, token.token)" />
                    </v-avatar>
                  </div>
                  <span class="text-h4 font-weight-bold">
                    {{ token.name }}
                  </span>
                </div>
                <v-divider class="mx-2" />
                <div class="d-flex">
                  <span> {{ getPercentage(token.value).toFixed(2) }}% </span>
                </div>
              </div>
            </v-flex>
            <div
              v-if="otherTokens"
              class="mx-auto"
              style="max-width: 250px; width: 100%"
            >
              <div class="d-flex justify-space-between align-center">
                <div class="d-flex align-center">
                  <div
                    class="rounded-circle mr-2"
                    :style="{
                      background: `${labelColors[5]}`,
                      width: '13px',
                      height: '13px',
                    }"
                  ></div>
                  <div
                    style="width: 30px"
                    class="d-flex justify-center align-center mr-1"
                  >
                    <v-avatar rounded tile size="20">
                      <v-icon color="#5e72e4" size="20">
                        mdi-shield-link-variant
                      </v-icon>
                    </v-avatar>
                  </div>
                  <span class="text-h4 font-weight-bold">
                    {{ otherTokens.name }}
                  </span>
                </div>
                <v-divider class="mx-2" />
                <div class="d-flex">
                  <span>
                    {{ getPercentage(otherTokens.value).toFixed(2) }}%
                  </span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
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
import DoughnutChart from "@/components/Charts/DoughnutChart";
import { interpolateSpectral } from "d3";
import { generateColors } from "@/util/helpers";
import { groupBy } from "@/util/helpers";
import { mapGetters } from "vuex";

export default {
  name: "PortfolioExposureCard",
  components: {
    DoughnutChart,
  },
  data() {
    return {
      dialog: false,
      headers: [
        {
          text: "Token Name",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Amount", value: "amount" },
        { text: "Value", value: "value" },
        { text: "Ratio", value: "ratio" },
      ],
    };
  },
  methods: {
    getTokenLogo(network, token) {
      try {
        return require(`@/assets/images/tokens/${network}/${token.toLowerCase()}.png`);
      } catch (_) {
        return require(`@/assets/images/tokens/default.png`);
      }
    },
    getPercentage(value) {
      return (value / this.total) * 100;
    },
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
    tokens() {
      let tokens = [];
      Object.entries(this.$store.state.farmStore.farmsWithData)
        .map(([, value]) => [
          ...Object.entries(value.userData).map(([, value]) => value),
        ])
        .flat()
        .forEach((token) => {
          if (token.tokenSymbols.length === 1) {
            tokens.push({
              name: token.tokenSymbols[0],
              amount: token.actualStaked,
              value: token.lpPrice,
              network: token.network,
              token: token.token0,
            });
          } else {
            tokens.push(
              {
                name: token.tokenSymbols[0],
                network: token.network,
                amount: token.lpPrice === 0 ? 0 : token.lpBalances[0],
                value: token.lpPrice === 0 ? 0 : token.lpPrice / 2,
                token: token.token0,
              },
              {
                name: token.tokenSymbols[1],
                network: token.network,
                amount: token.lpPrice === 0 ? 0 : token.lpBalances[1],
                value: token.lpPrice === 0 ? 0 : token.lpPrice / 2,
                token: token.token1,
              }
            );
          }
        });

      const groupedTokens = Object.entries(groupBy(tokens, "name"))
        .map(([key, value]) => {
          return {
            name: key,
            amount: value.reduce(function (accumulator, item) {
              return accumulator + item.amount;
            }, 0),
            value: value.reduce(function (accumulator, item) {
              return accumulator + item.value;
            }, 0),
            network: value[0].network,
            token: value[0].token,
          };
        })
        .sort((a, b) => b.value - a.value);

      return groupedTokens;
    },
    total() {
      return this.tokens.reduce(function (accumulator, item) {
        return accumulator + item.value;
      }, 0);
    },
    mappedTokens() {
      return this.tokens.length > 5 ? this.tokens.slice(0, 5) : this.tokens;
    },
    otherTokens() {
      if (this.tokens.length > 5) {
        return {
          name: "Others",
          amount: this.tokens
            .slice(5, this.tokens.length)
            .reduce(function (accumulator, item) {
              return accumulator + item.amount;
            }, 0),
          value: this.tokens
            .slice(5, this.tokens.length)
            .reduce(function (accumulator, item) {
              return accumulator + item.value;
            }, 0),
        };
      }

      return null;
    },
    chartData() {
      const tokens = this.mappedTokens.map((token) => token.value);
      return [...tokens, this.otherTokens ? this.otherTokens.value : null];
    },
    chartLabels() {
      return [...this.mappedTokens.map((token) => token.name), "Others"];
    },
    colors() {
      return generateColors(this.chartData.length * 2, interpolateSpectral, {
        colorStart: 0,
        colorEnd: 1,
        useEndAsStart: true,
      });
    },
    labelColors() {
      return this.colors.filter((_, index) => index % 2 === 0);
    },
    options() {
      return {
        elements: {
          arc: {
            borderWidth: 5,
            borderColor: this.darkmode ? "#1E1E1E" : "white",
          },
        },
        legend: {
          display: false,
        },
        responsive: true,
        cutoutPercentage: 50,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },

            label: function (tooltipItem, data) {
              return (
                "$" +
                data["datasets"][0]["data"][tooltipItem["index"]].toFixed(2)
              );
            },
          },
          titleFontSize: 15,
          titleFontColor: "#CCC",
          titleAlign: "center",
          titleFontFamily: " 'Quicksand', sans-serif",
          bodyFontFamily: " 'Quicksand', sans-serif",
          bodyAlign: "center",
          displayColors: false,
        },
        plugins: {
          datalabels: {
            boxShadow: "0 0 14px 0 rgba(0, 0, 0, 0.24)",
            borderRadius: 25,
            color: "white",
            backgroundColor: "#356a88",
            width: 40,
            height: 40,
            padding: {
              left: 10,
              right: 10,
              top: 14,
              bottom: 14,
            },
            textAlign: "center",
            font: {
              weight: "bold",
              size: 20,
            },
            align: "end",
            formatter(value) {
              return value + "%";
            },
          },
        },
      };
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
