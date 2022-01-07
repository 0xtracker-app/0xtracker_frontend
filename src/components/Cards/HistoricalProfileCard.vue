<template>
  <v-card class="mb-3" :dark="darkmode" style="background-color: transparent">
    <v-card-text class="card-stats-padding">
      <div
        class="d-flex flex-column flex-lg-row justify-space-between align-center"
      >
        <div
          class="d-flex justify-space-between align-center mb-4 mb-lg-0"
          style="width: 100%"
        >
          <div class="d-flex align-center mb-lg-0">
            <v-icon> mdi-chart-timeline-variant-shimmer </v-icon>
            <h4
              class="font-weight-600 text-uppercase text-caption text-uppercase mb-0 mx-2"
              :style="{ color: darkmode ? '#d5d5d5' : '#15121D' }"
            >
              Historical Profile
            </h4>
            <v-tooltip top :open-on-hover="false" v-model="isTooltipOpen">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  v-bind="attrs"
                  v-on="on"
                  small
                  color="yellow"
                  class="d-flex align-center text-caption font-weight-bold grey--text text--darken-4"
                  style="font-size: 10px !important"
                >
                  <v-icon size="15" class="mr-1"> mdi-alert-octagon </v-icon>
                  Beta {{ $vuetify.breakpoint.xlAndUp ? "Feature" : "" }}
                </v-chip>
              </template>
              <span
                class="text-caption text-white font-weight-bold"
                @click:outside="isTooltipOpen = false"
              >
                This feature is currently in beta version. If you see some bugs,
                let us know
                <a
                  href="https://0xtracker.hellonext.co/roadmap"
                  class="font-weight-bold text-decoration-none blue--text text--lighten-2"
                >
                  here </a
                >.
              </span>
            </v-tooltip>
          </div>
          <div class="d-flex">
            <v-tooltip
              bottom
              v-if="
                $vuetify.breakpoint.mdAndDown &&
                historicalData.length > 0 &&
                showHistoricalData
              "
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-btn
                    depressed
                    outlined
                    icon
                    @click="$router.push('cleaner')"
                    class="rounded-lg mr-2"
                    small
                    :ripple="false"
                    :disabled="!connectedWallet"
                  >
                    <v-icon class="show-button" size="15"> mdi-broom </v-icon>
                  </v-btn>
                </div>
              </template>
              <span v-if="connectedWallet">Select Data To Remove (Clean)</span>
              <span v-else>Connect wallet to clean up records</span>
            </v-tooltip>
            <v-tooltip bottom v-if="$vuetify.breakpoint.mdAndDown">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  depressed
                  outlined
                  icon
                  @click="showHistoricalData = !showHistoricalData"
                  class="rounded-lg"
                  small
                  :ripple="false"
                >
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                    class="show-button"
                    size="15"
                  >
                    {{
                      showHistoricalData ? "mdi-minus-thick" : "mdi-plus-thick"
                    }}
                  </v-icon>
                </v-btn>
              </template>
              <span v-if="showHistoricalData">Hide Historical Data</span>
              <span v-else>Show Historical Data</span>
            </v-tooltip>
          </div>
        </div>
        <v-btn-toggle
          v-if="historicalData.length > 0 && showHistoricalData"
          v-model="selectedInterval"
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
        <v-tooltip
          bottom
          v-if="
            $vuetify.breakpoint.lgAndUp &&
            historicalData.length > 0 &&
            showHistoricalData
          "
        >
          <template v-slot:activator="{ on }">
            <div v-on="on">
              <v-btn
                depressed
                outlined
                icon
                @click="$router.push('cleaner')"
                class="rounded-lg ml-2"
                style="text-decoration: none"
                small
                :ripple="false"
                :disabled="!connectedWallet"
              >
                <v-icon class="show-button" size="15"> mdi-broom </v-icon>
              </v-btn>
            </div>
          </template>
          <span v-if="connectedWallet">Select Data To Remove (Clean)</span>
          <span v-else>Connect wallet to clean up records</span>
        </v-tooltip>
        <v-tooltip bottom v-if="$vuetify.breakpoint.lgAndUp">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              depressed
              outlined
              icon
              @click="showHistoricalData = !showHistoricalData"
              class="rounded-lg ml-2"
              small
              :ripple="false"
            >
              <v-icon v-bind="attrs" v-on="on" class="show-button" size="15">
                {{ showHistoricalData ? "mdi-minus-thick" : "mdi-plus-thick" }}
              </v-icon>
            </v-btn>
          </template>
          <span v-if="showHistoricalData">Hide Historical Data</span>
          <span v-else>Show Historical Data</span>
        </v-tooltip>
      </div>
      <v-progress-linear
        v-show="loading"
        :indeterminate="loading"
        color="indigo lighten-1"
        slot="progress"
      ></v-progress-linear>
      <v-overlay :absolute="true" :value="loading">
        <div class="text-center"></div>
      </v-overlay>
      <div v-if="showHistoricalData">
        <div v-if="historicalData.length > 0" class="d-flex">
          <v-row class="d-flex align-center mt-2" style="width: 100%">
            <v-col cols="12" class="d-flex justify-center">
              <LineChart
                :datasets="datasets"
                :options="options"
                ref="historicalDataRef"
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
      selectedInterval: 1,
      isTooltipOpen: false,
      showHistoricalData: true,
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
    ...mapGetters("walletStore", ["historicalData", "connectedWallet"]),
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
                  ? this.selectedInterval === 0
                    ? 12
                    : this.selectedInterval === 1
                    ? 7
                    : 6
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
          color.addColorStop(0, this.colors[index].replace(")", ",0.5)"));
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
  background: #5c6bc0 !important;
  color: white !important;
}

.v-tooltip__content {
  pointer-events: auto;
}
</style>
