import { Doughnut } from "vue-chartjs";
import { mapGetters } from "vuex";

export default {
  extends: Doughnut,
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
    chartLabels: {
      type: Array,
      default: () => [],
    },
    options: {
      type: Object,
      default: null,
    },
    colors: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    calculatedColors() {
      if (this.colors.length > this.chartData.length) {
        let colors = [];
        for (let i = 0; i < this.colors.length; i++) {
          if (i % 2 == 0) {
            let gradient = this.$refs.canvas
              .getContext("2d")
              .createLinearGradient(0, 0, 0, 150);
            gradient.addColorStop(0, this.colors[i]);
            gradient.addColorStop(1, this.colors[i + 1]);
            colors.push(gradient);
          }
        }

        return colors;
      }

      return this.colors;
    },
  },
  watch: {
    chartData() {
      this.render();
    },
  },
  mounted() {
    this.render();
  },
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.chartLabels,
          datasets: [
            {
              backgroundColor: this.calculatedColors,
              hoverBackgroundColor: this.calculatedColors,
              hoverBorderColor: "transparent",
              hoverBorderWidth: 0,
              data: this.chartData,
            },
          ],
        },
        this.options
      );
    },
  },
};
