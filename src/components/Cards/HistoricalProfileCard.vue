<template>
  <v-card class="card-shadow mb-3" :dark="darkmode">
    <v-card-text class="card-stats-padding">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon class="mr-2"> mdi-chart-timeline-variant-shimmer </v-icon>
          <h4 class="font-weight-600 text-muted text-uppercase text-h5 mb-0">
            Historical Profile
          </h4>
        </div>
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
      <div v-if="historicalData.length > 0" class="d-flex pb-10">
        <v-row class="d-flex align-center mt-2" style="width: 100%">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn-toggle v-model="selectedInterval" mandatory dense>
              <v-btn
                :dark="darkmode"
                v-for="(interval, index) in intervals"
                :key="index"
                active-class="active-btn"
              >
                <span class="text-caption font-weight-bold">
                  {{ interval.text }}
                </span>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" class="pa-md-10 d-flex justify-center">
            <LineChart
              :datasets="datasets"
              :options="options"
              ref="historicalDataRef"
              style="max-height: 300px; width: 100%; overflow: visible"
            ></LineChart>
          </v-col>
          <v-col cols="12" class="d-flex justify-center flex-column align-end">
            <div
              v-for="(data, index) in historicalData"
              :key="index"
              class="d-flex align-center mb-1"
              style="max-width: 350px; width: 100%"
            >
              <div
                class="rounded-circle mr-3"
                style="min-width: 15px"
                :style="{
                  width: '15px',
                  height: '15px',
                  backgroundColor: colors[index],
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
                {{ data.wallet.walletAddress }}
              </span>
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
  </v-card>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import { generateColors } from "@/util/helpers";
import { mapGetters, mapActions } from "vuex";
import { interpolateSpectral } from "d3";

export default {
  name: "HistoricalProfileCard",
  components: {
    LineChart,
  },
  data() {
    return {
      datasets: [],
      colors: [],
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
      selectedInterval: 0,
    };
  },
  watch: {
    loading: {
      immediate: false,
      deep: true,
      handler() {
        if (!this.loading) {
          this.generateDatasets();
        }
      },
    },
    historicalData: {
      immediate: false,
      deep: true,
      handler() {
        this.generateDatasets();
      },
    },
    selectedInterval: {
      immediate: true,
      deep: true,
      handler() {
        this.setSelectedInterval(this.intervals[this.selectedInterval].value);
      },
    },
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("walletStore", ["historicalData"]),
    loading: function () {
      return this.$store.state.walletStore.historicalDataLoading;
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
                  this.intervals[this.selectedInterval].value === 1
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
                display: true,
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
                  ? this.selectedInterval === 0
                    ? 12
                    : this.selectedInterval === 1
                    ? 7
                    : this.intervals[this.selectedInterval].value / 2
                  : 4,
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
                fontFamily: "'Quicksand', sans-serif",
              },
              scaleLabel: {
                display: true,
                labelString: "Value",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 14,
                fontStyle: "bold",
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
    if (!this.loading) {
      this.generateDatasets();
    }
  },
  methods: {
    ...mapActions("walletStore", ["setSelectedInterval"]),
    generateDatasets() {
      let _historicalData = [];
      this.colors = generateColors(
        this.historicalData.length,
        interpolateSpectral,
        {
          colorStart: 0,
          colorEnd: 1,
          useEndAsStart: true,
        }
      );

      this.historicalData.forEach((historicalData, index) => {
        let color = null;

        this.$nextTick(() => {
          color = this.$refs.historicalDataRef.$refs.canvas
            .getContext("2d")
            .createLinearGradient(0, 0, 0, 450);
          color.addColorStop(0, this.colors[index]);
          color.addColorStop(
            1,
            this.darkmode ? "rgba(0, 0, 0, 0)" : "rgba(255, 255, 255, 0)"
          );

          _historicalData.push({
            label: historicalData.wallet.walletAddress,
            fill: true,
            backgroundColor: color,
            hoverBackgroundColor: this.colors[index],
            borderColor: this.colors[index],
            borderWidth: 2,
            data: historicalData.data.map((data) => ({
              x: data._id,
              y: data.average,
            })),
            lineTension: 0.15,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointBorderColor: this.colors[index]
              .replace(/rgb/i, "rgba")
              .replace(/\)/i, ",0.20)"),
            pointBackgroundColor: this.colors[index],
            spanGaps: false,
          });
        });
      });

      this.datasets = _historicalData;
    },
  },
};
</script>

<style>
.active-btn {
  background: #5e72e4 !important;
  color: white !important;
}
</style>
