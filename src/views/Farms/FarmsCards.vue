<template>
  <v-card class="card-shadow">
    <v-card-text v-if="Object.keys(farmsWithData).length" class="px-0 py-0">
      <v-expansion-panels accordion hover multiple :value="panelsArray">
        <v-expansion-panel v-for="(farm, key) in farmsWithData" :key="key">
          <v-expansion-panel-header>
            {{ farm.name }} ({{ farm.network }}) -
            {{ farm.total | toCurrency(round) }} ({{
              farm.pendingTotal | toCurrency(round)
            }})
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <Farm :farm="farm" />
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-icon
                @click="
                  getPoolsForSingleFarm({
                    key: farm.contract,
                    selectedFarm: farm,
                  })
                "
              >
                fas fa-redo
              </v-icon>
            </v-card-actions>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Farm from "./Farm.vue";

export default {
  components: {
    Farm,
  },
  props: {
    farmsWithData: Array,
  },
  data() {
    return {
      page: 1,
      headers: [
        {
          text: "Ticker",
          align: "start",
          sortable: true,
          value: "symbol",
        },
        { text: "Balance", value: "tokenBalance" },
        { text: "Price", value: "tokenPrice" },
        { text: "Value", value: "tokenValue" },
      ],
    };
  },
  computed: {
    ...mapGetters("generalStore", ["round"]),
    panelsArray: function () {
      return Array.from(
        { length: Object.keys(this.farmsWithData).length },
        (e, i) => i
      );
    },
  },
  methods: {
    ...mapActions("poolStore", ["getPoolsForSingleFarm"]),
  },
};
</script>
