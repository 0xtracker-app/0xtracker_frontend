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
        <v-row class="d-flex align-center">
          <v-col cols="12" class="pa-md-10 d-flex justify-center">
            <LineChart
              :datasets="datasets"
              :options="options"
              ref="historicalDataRef"
              style="width: 100%"
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
import { mapGetters } from "vuex";
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
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("walletStore", ["historicalData"]),
    loading: function () {
      return this.$store.state.walletStore.loading;
    },
    options() {
      return {
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                minUnit: "hour",
                displayFormats: {
                  hour: "MMM D, hA",
                },
                tooltipFormat: "MMM D, hA",
              },
              scaleLabel: {
                display: true,
                labelString: "Time",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: 18,
                fontStyle: "bold",
              },
              ticks: {
                fontFamily: "'Quicksand', sans-serif",
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
                fontSize: 18,
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
        aspectRatio: 10,
        cutoutPercentage: 50,
        tooltips: {
          enabled: true,
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
    this.generateDatasets();
  },
  methods: {
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

        color = this.$refs.historicalDataRef.$refs.canvas
          .getContext("2d")
          .createLinearGradient(0, 0, 0, 450);
        color.addColorStop(0, this.colors[index]);
        color.addColorStop(1, "rgba(0, 0, 0, 0)");

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
          lineTension: 0,
          pointRadius: 2,
        });
      });

      this.datasets = _historicalData;
    },
  },
};
</script>
