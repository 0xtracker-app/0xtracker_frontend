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
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
  },
  watch: {
    chartData() {
      this.render();
    },
  },
  data() {
    return {
      gradient: null,
      gradient2: null,
      gradient3: null,
      gradient4: null,
      gradient5: null,
      gradient6: null,
    };
  },
  mounted() {
    this.gradient = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient.addColorStop(0, "#f5365c");
    this.gradient.addColorStop(1, "#f56036");

    this.gradient2 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient2.addColorStop(0, "#2dce89");
    this.gradient2.addColorStop(1, "#2dcecc");

    this.gradient3 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient3.addColorStop(0, "#fb6340");
    this.gradient3.addColorStop(1, "#fbb140");

    this.gradient4 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient4.addColorStop(0, "#8965e0");
    this.gradient4.addColorStop(1, "#bc65e0");

    this.gradient5 = this.$refs.canvas
      .getContext("2d")
      .createLinearGradient(0, 0, 0, 450);
    this.gradient5.addColorStop(0, "#7796cb");
    this.gradient5.addColorStop(1, "#a3bcf9");

    this.render();
  },
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.chartLabels,
          datasets: [
            {
              backgroundColor: [
                this.gradient,
                this.gradient2,
                this.gradient3,
                this.gradient4,
                this.gradient5,
                this.darkmode ? "white" : "#666",
              ],
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
