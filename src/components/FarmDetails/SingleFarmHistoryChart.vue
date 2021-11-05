<template>
  <v-row justify="center">
    <v-dialog
      v-model="singleFarmHistoryDialog"
      @click:outside="setSingleFarmHistoryDialog(false)"
      persistent
      max-width="600"
      :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
      :overlay-opacity="darkmode ? 0.2 : 0.46"
    >
      <v-card v-if="singleFarmHistoryDialog" :dark="darkmode" class="py-3">
        <div
          class="d-flex justify-space-between align-center mb-4 mb-lg-0 px-6 pb-2"
          style="width: 100%"
        >
          <div class="d-flex align-center mb-lg-0">
            <v-icon> mdi-chart-timeline-variant-shimmer </v-icon>
            <h4
              class="font-weight-600 text-uppercase text-caption text-uppercase mb-0 mx-2"
              :style="{ color: darkmode ? '#d5d5d5' : '#15121D' }"
            >
              Historical Profile (<span class="text-caption text-none">{{
                farm.name
              }}</span
              >)
            </h4>
          </div>
          <v-btn
            @click="setSingleFarmHistoryDialog(false)"
            icon
            class="text-caption text-none font-weight-bold ml-auto"
            :class="[darkmode ? 'white--text' : 'grey--text']"
            elevation="0"
            small
            :dark="darkmode"
            outlined
            circle
          >
            <v-icon size="16"> mdi-close-thick </v-icon>
          </v-btn>
        </div>
        <v-divider></v-divider>
        <v-card-text class="pt-6 mt-2">
          <div v-if="!loading">
            <div
              class="d-flex flex-column flex-lg-row justify-center align-center"
            >
              <v-btn-toggle
                v-if="singleHistoricalData.length > 0"
                v-model="selectedSingleInterval"
                mandatory
                dense
                class="ml-0 ml-lg-2"
                :dark="darkmode"
                :style="{
                  filter: darkmode
                    ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                    : '',
                }"
              >
                <v-btn
                  v-for="(interval, index) in intervals"
                  :key="index"
                  active-class="active-btn"
                  :icon="$vuetify.breakpoint.lgAndDown"
                >
                  <span class="text-caption font-weight-bold">
                    {{ interval.text }}
                  </span>
                </v-btn>
              </v-btn-toggle>
            </div>
            <div>
              <div v-if="singleHistoricalData.length > 0" class="d-flex">
                <v-row class="d-flex align-center mt-2" style="width: 100%">
                  <v-col cols="12" class="d-flex justify-center">
                    <LineChart
                      :datasets="datasets"
                      :options="options"
                      ref="singleHistoricalDataRef"
                      style="width: 100%; overflow: visible"
                      :style="{
                        height: $vuetify.breakpoint.mdAndUp ? '100%' : '300px',
                      }"
                    ></LineChart>
                  </v-col>
                  <v-col
                    cols="12"
                    class="d-flex justify-center flex-column align-end"
                  >
                    <div
                      class="d-flex align-center mb-1"
                      style="max-width: 350px; width: 100%"
                    >
                      <div
                        class="rounded-circle mr-3"
                        style="min-width: 15px"
                        :style="{
                          width: '15px',
                          height: '15px',
                          backgroundColor: color,
                        }"
                      ></div>

                      <span
                        class="text-caption font-weight-bold"
                        style="
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                        "
                      >
                        {{ this.farm.wallet }}
                      </span>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
          <div v-else>
            <v-skeleton-loader type="article"></v-skeleton-loader>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import { generateColors } from "@/util/helpers";
import { mapGetters, mapActions } from "vuex";
import { interpolateSpectral } from "d3";

export default {
  name: "SingleFarmHistoryChart",
  components: {
    LineChart,
  },
  data() {
    return {
      datasets: [],
      colors: [],
      color: "",
      intervals: [
        {
          text: "1D",
          value: 1,
        },
        {
          text: "7D",
          value: 7,
        },
        {
          text: "14D",
          value: 14,
        },
        {
          text: "30D",
          value: 30,
        },
        {
          text: "90D",
          value: 90,
        },
      ],
      selectedSingleInterval: 1,
    };
  },
  watch: {
    loading: {
      immediate: false,
      deep: true,
      handler() {
        this.generateDatasets();
      },
    },
    singleHistoricalData: {
      immediate: true,
      deep: true,
      handler() {
        if (this.singleHistoricalData.length > 0 && this.farm) {
          this.generateDatasets();
        }
      },
    },
    selectedSingleInterval: {
      immediate: true,
      deep: true,
      async handler() {
        if (this.farm) {
          await this.setSelectedSingleInterval({
            value: this.intervals[this.selectedSingleInterval].value,
            farm: this.farm.sendValue,
          });
          this.generateDatasets();
        }
      },
    },
  },
  props: {
    farm: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters("generalStore", [
      "darkmode",
      "round",
      "singleFarmHistoryDialog",
    ]),
    ...mapGetters("walletStore", ["historicalData", "singleHistoricalData"]),
    ...mapGetters("poolStore", ["farmInfo"]),
    loading() {
      return this.$store.state.walletStore.singleHistoricalDataLoading;
    },
    options() {
      return {
        layout: {
          padding: {
            left: 5,
            right: 5,
            top: 10,
            bottom: 0,
          },
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                unit:
                  this.intervals[this.selectedSingleInterval].value === 1
                    ? "hour"
                    : "day",
                minUnit: "hour",
                displayFormats: {
                  hour: "hA",
                  day: "MM-D-YY",
                },
                tooltipFormat: "MMM D, hA",
              },
              scaleLabel: {
                display: false,
                labelString: "Time",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 14,
                fontStyle: "bold",
              },
              ticks: {
                fontFamily: "'Quicksand', sans-serif",
                autoSkip: true,
                maxRotation: this.$vuetify.breakpoint.smAndUp ? 0 : 50,
                minRotation: 0,
                maxTicksLimit: this.$vuetify.breakpoint.smAndUp
                  ? this.selectedSingleInterval === 0
                    ? 12
                    : this.selectedSingleInterval === 1
                    ? 7
                    : this.intervals[this.selectedSingleInterval].value / 2
                  : 4,
                padding: 10,
              },
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value) {
                  return "$" + value;
                },
                autoSkip: true,
                maxTicksLimit: 10,
                padding: 10,
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 15,
                fontStyle: 600,
                fontColor: this.darkmode ? "white" : "#9BA2B0",
              },
              scaleLabel: {
                display: false,
                labelString: "Value",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 14,
                fontStyle: "bold",
              },
              gridLines: {
                color: this.darkmode ? "#3B424C" : "#DDE2ED",
                borderDash: [8, 4],
              },
            },
          ],
        },
        easing: "easeInOutBack",
        bezierCurve: false,
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          mode: "nearest",
          position: "nearest",
          intersect: false,
          callbacks: {
            title: function (tooltipItem) {
              return "$" + tooltipItem[0].yLabel.toFixed(2);
            },
            label: function (tooltipItem) {
              return tooltipItem.xLabel;
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
        hover: {
          mode: "nearest",
          intersect: false,
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
  mounted() {
    if (!this.loading && this.singleHistoricalData.length > 0 && this.farm) {
      this.generateDatasets();
    }
  },
  methods: {
    ...mapActions("generalStore", ["setSingleFarmHistoryDialog"]),
    ...mapActions("walletStore", ["setSelectedSingleInterval"]),
    getColor() {
      this.colors = generateColors(
        this.historicalData.length,
        interpolateSpectral,
        {
          colorStart: 0,
          colorEnd: 1,
          useEndAsStart: true,
        }
      );

      this.color = this.colors[
        this.historicalData.length > 0
          ? this.historicalData.findIndex((element) => {
              if (element.wallet.walletAddress === this.farm.wallet) {
                return true;
              }
            })
          : 0
      ];
    },
    generateDatasets() {
      const singleHistoricalData = this.singleHistoricalData.filter((data) => {
        return data.wallet.walletAddress === this.farm.wallet;
      });

      this.getColor();

      let _singleHistoricalData = [];

      if (singleHistoricalData) {
        singleHistoricalData.forEach((data) => {
          let color = null;

          this.$nextTick(() => {
            color = this.$refs.singleHistoricalDataRef.$refs.canvas
              .getContext("2d")
              .createLinearGradient(0, 0, 0, 450);
            color.addColorStop(0, this.color.replace(")", ",0.5)"));
            color.addColorStop(
              1,
              this.darkmode ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)"
            );

            _singleHistoricalData.push({
              label: data.wallet.walletAddress,
              fill: true,
              backgroundColor: color,
              hoverBackgroundColor: this.color,
              borderColor: this.color,
              borderWidth: 2,
              data: data.data.map((data) => ({
                x: data._id,
                y: data.average,
              })),
              lineTension: 0.15,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointBorderColor: this.color
                .replace(/rgb/i, "rgba")
                .replace(/\)/i, ",0.20)"),
              pointBackgroundColor: this.color,
              spanGaps: false,
            });
          });
        });
      }

      this.datasets = _singleHistoricalData;
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

.theme--dark.v-skeleton-loader .v-skeleton-loader__article {
  background: transparent !important;
}
</style>
