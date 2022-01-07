<template>
  <v-row>
    <v-col cols="12" class="bridge d-flex justify-center">
      <v-card
        class="mb-6 pa-6 bridge__wrapper"
        :dark="darkmode"
        :style="{
          filter: darkmode
            ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
            : '',
        }"
      >
        <v-overlay :value="$store.state.bridgeStore.loading" opacity="0.6">
          <div class="d-flex flex-column align-center justify-center">
            <v-progress-circular
              indeterminate
              size="50"
              color="indigo lighten-1"
              class="mb-6"
            ></v-progress-circular>
            <span style="font-size: 12px" class="font-weight-bold">
              Loading tokens and blockchains...
            </span>
          </div>
        </v-overlay>
        <h4>Swap in 27+ blockchains</h4>
        <div class="d-flex flex-column mt-10">
          <h5>You pay</h5>
          <div
            class="d-flex justify-space-between rounded-lg px-4 py-2 mt-2"
            :style="{
              color: darkmode ? 'white' : 'black',
              backgroundColor: darkmode
                ? 'rgb(35, 34, 40)'
                : 'rgb(35, 34, 40, 0.1)',
            }"
          >
            <div class="d-flex flex-column">
              <v-text-field
                class="bridge__input font-weight-bold"
                :style="{ color: darkmode ? 'white' : 'black' }"
                placeholder="0"
                dense
                hide-details
                solo
                flat
                v-model="amount"
                @keypress="onlyForCurrency"
              />
              <span> ≈ ${{ fromAmount }} </span>
            </div>

            <v-dialog
              v-model="fromDialog"
              width="500"
              :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
              :overlay-opacity="darkmode ? 0.2 : 0.46"
              style="overflow: hidden"
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                  class="d-flex justify-space-between align-center pa-2 rounded"
                  :style="{
                    color: darkmode ? 'white' : 'black',
                    backgroundColor: darkmode
                      ? 'rgb(0,0,0,0.4)'
                      : 'rgb(35, 34, 40, 0.2)',
                  }"
                >
                  <div class="d-flex align-center mr-4">
                    <v-img
                      height="32"
                      width="32"
                      class="rounded-circle mr-2"
                      :src="from ? from.image : defaultImage"
                    ></v-img>
                    <div class="d-flex flex-column">
                      <h4>
                        {{ from ? from.symbol : "BNB" }}
                      </h4>
                      <h5 class="font-weight-regular">
                        {{
                          from
                            ? $t(`rangoBlockchains.names.${from.blockchain}`)
                            : "BSC"
                        }}
                      </h5>
                    </div>
                  </div>
                  <v-icon large> mdi-chevron-down </v-icon>
                </div>
              </template>

              <v-card
                :dark="darkmode"
                class="black-shadow"
                style="max-height: 650px"
              >
                <v-card-title
                  class="text-h4 font-weight-bold d-flex align-start lighten-2 flex-column"
                >
                  <div style="width: 100%">
                    <v-text-field
                      v-model="searchCoin"
                      placeholder="Search in 7000+ tokens"
                      outlined
                      dense
                      hide-details
                      full-width
                    >
                      <template #prepend-inner>
                        <v-icon size="24"> mdi-magnify </v-icon>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="d-flex flex-wrap justify-center mt-3">
                    <v-btn
                      x-small
                      depressed
                      class="ma-1"
                      @click="blockchainFilter = ''"
                      :outlined="blockchainFilter !== ''"
                      :color="!blockchainFilter ? 'blue' : ''"
                    >
                      ALL
                    </v-btn>
                    <v-btn
                      v-for="(blockchain, index) in popularBlockchains"
                      :key="index"
                      x-small
                      depressed
                      class="ma-1"
                      @click="blockchainFilter = blockchain.value"
                      :outlined="blockchainFilter !== blockchain.value"
                      :color="
                        blockchainFilter === blockchain.value
                          ? getColor(blockchain.value)
                          : ''
                      "
                    >
                      {{ blockchain.name }}
                    </v-btn>
                    <v-btn
                      x-small
                      depressed
                      class="ma-1"
                      @click="blockchainFilter = 'OTHERS'"
                      :outlined="blockchainFilter !== 'OTHERS'"
                      :color="blockchainFilter === 'OTHERS' ? 'indigo' : ''"
                    >
                      OTHERS
                    </v-btn>
                  </div>
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text
                  class="custom-scrollbar px-4 py-2"
                  style="
                    max-height: 400px;
                    overflow-y: auto;
                    overflow-x: hidden;
                  "
                  @scroll="onScroll"
                >
                  <v-row class="d-flex justify-center">
                    <v-col
                      cols="12"
                      class="d-flex flex-column"
                      style="max-height: 400px"
                    >
                      <span v-for="(token, index) in mappedTokens" :key="index">
                        <v-hover v-slot="{ hover }">
                          <div
                            class="d-flex justify-space-between align-center px-4 py-2 rounded"
                            :style="{
                              color: darkmode ? 'white' : 'black',
                              backgroundColor: hover
                                ? 'rgba(0,0,0,0.1)'
                                : 'transparent',
                            }"
                            style="cursor: pointer"
                            @click="changeFrom(token)"
                          >
                            <div class="d-flex align-center mr-4">
                              <v-img
                                height="50"
                                width="50"
                                class="rounded-circle mr-2"
                                :src="token ? token.image : defaultImage"
                              ></v-img>
                              <div class="d-flex flex-column">
                                <div class="d-flex align-center">
                                  <h4 class="mr-2 font-weight-bold">
                                    {{ token ? token.symbol : "BNB" }}
                                  </h4>
                                  <v-chip
                                    label
                                    small
                                    :color="getColor(token.blockchain)"
                                    class="font-weight-bold white--text"
                                  >
                                    {{
                                      $t(
                                        `rangoBlockchains.names.${token.blockchain}`
                                      )
                                    }}
                                  </v-chip>
                                </div>
                                <div v-if="token.name">
                                  {{ token.name }}
                                </div>
                              </div>
                            </div>
                            <v-icon small> mdi-chevron-right </v-icon>
                          </div>
                        </v-hover>
                      </span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="mt-2"> <v-spacer /> </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </div>

        <div class="d-flex justify-center mt-5">
          <v-btn
            outlined
            class="rounded-circle"
            large
            icon
            :disabled="loading"
            @click="swapDirection()"
          >
            <v-icon size="24" v-if="!loading"> mdi-swap-vertical </v-icon>
            <v-progress-circular
              indeterminate
              color="purple"
              size="24"
              v-else
            ></v-progress-circular>
          </v-btn>
        </div>

        <div class="d-flex flex-column mt-5">
          <h5>You receive</h5>
          <div
            class="d-flex justify-space-between rounded-lg px-4 py-2 mt-2"
            :style="{
              color: darkmode ? 'white' : 'black',
              backgroundColor: darkmode
                ? 'rgb(35, 34, 40)'
                : 'rgb(35, 34, 40, 0.1)',
            }"
          >
            <div class="d-flex flex-column">
              <v-text-field
                class="bridge__input font-weight-bold"
                :style="{ color: darkmode ? 'white' : 'black' }"
                placeholder="0"
                dense
                hide-details
                solo
                flat
                disabled
                :value="
                  receiveAmount
                    ? receiveAmount.toFixed(receiveAmount < 1 ? 4 : 2)
                    : '?'
                "
              >
                <template #prepend-inner> ≈ </template>
              </v-text-field>
              <span
                v-if="amount && bestRouteResponse && !loading && receiveAmount"
              >
                ≈ ${{ (receiveAmount * to.usdPrice).toFixed(2) }}
              </span>
            </div>

            <v-dialog
              v-model="toDialog"
              width="500"
              :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
              :overlay-opacity="darkmode ? 0.2 : 0.46"
              style="overflow: hidden"
            >
              <template v-slot:activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                  class="d-flex justify-space-between align-center pa-2 rounded"
                  :style="{
                    color: darkmode ? 'white' : 'black',
                    backgroundColor: darkmode
                      ? 'rgb(0,0,0,0.4)'
                      : 'rgb(35, 34, 40, 0.2)',
                  }"
                >
                  <div class="d-flex align-center mr-4">
                    <v-img
                      height="32"
                      width="32"
                      class="rounded-circle mr-2"
                      :src="from ? to.image : defaultImage"
                    ></v-img>
                    <div class="d-flex flex-column">
                      <h4>
                        {{ from ? to.symbol : "Luna" }}
                      </h4>
                      <h5 class="font-weight-regular">
                        {{
                          from
                            ? $t(`rangoBlockchains.names.${to.blockchain}`)
                            : "Terra"
                        }}
                      </h5>
                    </div>
                  </div>
                  <v-icon large> mdi-chevron-down </v-icon>
                </div>
              </template>

              <v-card
                :dark="darkmode"
                class="black-shadow"
                style="max-height: 650px"
              >
                <v-card-title
                  class="text-h4 font-weight-bold d-flex align-start lighten-2 flex-column"
                >
                  <div style="width: 100%">
                    <v-text-field
                      v-model="searchCoin"
                      placeholder="Search in 7000+ tokens"
                      outlined
                      dense
                      hide-details
                      full-width
                    >
                      <template #prepend-inner>
                        <v-icon size="24"> mdi-magnify </v-icon>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="d-flex flex-wrap justify-center mt-3">
                    <v-btn
                      x-small
                      depressed
                      class="ma-1"
                      @click="blockchainFilter = ''"
                      :outlined="blockchainFilter !== ''"
                      :color="!blockchainFilter ? 'blue' : ''"
                    >
                      ALL
                    </v-btn>
                    <v-btn
                      v-for="(blockchain, index) in popularBlockchains"
                      :key="index"
                      x-small
                      depressed
                      class="ma-1"
                      @click="blockchainFilter = blockchain.value"
                      :outlined="blockchainFilter !== blockchain.value"
                      :color="
                        blockchainFilter === blockchain.value
                          ? getColor(blockchain.value)
                          : ''
                      "
                    >
                      {{ blockchain.name }}
                    </v-btn>
                    <v-btn
                      x-small
                      depressed
                      class="ma-1"
                      @click="blockchainFilter = 'OTHERS'"
                      :outlined="blockchainFilter !== 'OTHERS'"
                      :color="blockchainFilter === 'OTHERS' ? 'indigo' : ''"
                    >
                      OTHERS
                    </v-btn>
                  </div>
                </v-card-title>
                <v-divider></v-divider>

                <v-card-text
                  class="custom-scrollbar px-4 py-2"
                  style="
                    max-height: 400px;
                    overflow-y: auto;
                    overflow-x: hidden;
                  "
                  @scroll="onScroll"
                >
                  <v-row class="d-flex justify-center">
                    <v-col
                      cols="12"
                      class="d-flex flex-column"
                      style="max-height: 400px"
                    >
                      <span v-for="(token, index) in mappedTokens" :key="index">
                        <v-hover v-slot="{ hover }">
                          <div
                            class="d-flex justify-space-between align-center px-4 py-2 rounded"
                            :style="{
                              color: darkmode ? 'white' : 'black',
                              backgroundColor: hover
                                ? 'rgba(0,0,0,0.1)'
                                : 'transparent',
                            }"
                            style="cursor: pointer"
                            @click="changeTo(token)"
                          >
                            <div class="d-flex align-center mr-4">
                              <v-img
                                height="50"
                                width="50"
                                class="rounded-circle mr-2"
                                :src="token ? token.image : defaultImage"
                              ></v-img>
                              <div class="d-flex flex-column">
                                <div class="d-flex align-center">
                                  <h4 class="mr-2 font-weight-bold">
                                    {{ token ? token.symbol : "BNB" }}
                                  </h4>
                                  <v-chip
                                    label
                                    small
                                    :color="getColor(token.blockchain)"
                                    class="font-weight-bold white--text"
                                  >
                                    {{
                                      $t(
                                        `rangoBlockchains.names.${token.blockchain}`
                                      )
                                    }}
                                  </v-chip>
                                </div>
                                <div v-if="token.name">
                                  {{ token.name }}
                                </div>
                              </div>
                            </div>
                            <v-icon small> mdi-chevron-right </v-icon>
                          </div>
                        </v-hover>
                      </span>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text class="mt-2"> <v-spacer /> </v-card-text>
              </v-card>
            </v-dialog>
          </div>
        </div>

        <div class="bridge__best--preview mt-5 rounded-xl mb-8">
          <div v-if="amount && bestRouteResponse && !loading">
            <div v-if="bestRouteResponse.result" class="d-flex flex-column">
              <div class="d-flex justify-center flex-wrap my-6">
                <div class="ml-2">
                  <div class="d-flex flex-column align-center mr-4">
                    <div
                      class="pa-2 rounded-circle"
                      style="background-color: rgba(255, 255, 255, 0.12)"
                    >
                      <v-img
                        height="24"
                        width="24"
                        class="rounded-circle"
                        :src="from ? from.image : defaultImage"
                      ></v-img>
                    </div>
                    <div class="d-flex flex-column align-center mt-2">
                      <h5 style="font-size: 12px">
                        {{ from.symbol }}
                      </h5>
                      <h6 style="font-size: 10px" class="font-weight-regular">
                        {{ $t(`rangoBlockchains.names.${from.blockchain}`) }}
                      </h6>
                    </div>
                  </div>
                </div>
                <div
                  v-for="(swap, index) in bestRouteResponse.result.swaps"
                  :key="index"
                  class="ml-2"
                >
                  <div class="d-flex flex-column align-center mr-4">
                    <div
                      class="pa-2 rounded-circle"
                      style="
                        position: relative;
                        background-color: rgba(255, 255, 255, 0.12);
                      "
                    >
                      <v-img
                        height="24"
                        width="24"
                        class="rounded-circle"
                        :src="swap.to.logo"
                      ></v-img>
                      <div
                        style="position: absolute; top: 0px; left: -20px"
                        class="d-flex flex-column align-center"
                      >
                        <v-tooltip top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              size="16"
                              v-bind="attrs"
                              v-on="on"
                              class="mb-1"
                            >
                              mdi-help-circle-outline
                            </v-icon>
                          </template>
                          <div class="d-flex flex-column align-center">
                            <v-img
                              height="16"
                              width="16"
                              :src="getSwapperLogo(swap.swapperId)"
                            ></v-img>
                            <span
                              style="font-size: 10px"
                              class="font-weight-bold"
                            >
                              {{ swap.swapperId }}
                            </span>
                            <span style="font-size: 12px">
                              Fee ≈ ${{ getSwapperTotalFees(swap) }}
                            </span>
                            <span style="font-size: 12px">
                              ETA ≈
                              {{ getSwapperETA(swap.estimatedTimeInSeconds) }}
                            </span>
                          </div>
                        </v-tooltip>
                        <v-icon size="16"> mdi-arrow-right-thick </v-icon>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-center mt-2">
                      <h5 style="font-size: 12px">
                        {{ swap.to.symbol }}
                      </h5>
                      <h6 style="font-size: 10px" class="font-weight-regular">
                        {{ $t(`rangoBlockchains.names.${swap.to.blockchain}`) }}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex justify-space-between" style="font-size: 12px">
                <div class="d-flex flex-column">
                  <span>
                    1 {{ from.symbol }} = {{ fromRate }}
                    {{ to.symbol }}
                  </span>
                  <span>
                    1 {{ to.symbol }} = {{ toRate }}
                    {{ from.symbol }}
                  </span>
                </div>
                <div class="d-flex flex-column justify-end align-end">
                  <span> Total Fee: ≈ ${{ totalFees.toFixed(2) }} </span>
                  <span> ETA: ≈ {{ totalETA }} </span>
                </div>
              </div>
            </div>
            <div
              v-else
              class="my-12 grey--text text--darken-1 text-center font-weight-medium text-subtitle-2"
            >
              No routes found
            </div>
          </div>
          <div v-else-if="loading">
            <v-skeleton-loader type="paragraph,button"></v-skeleton-loader>
          </div>
          <div
            v-else
            class="my-12 grey--text text--darken-1 text-center font-weight-medium text-subtitle-2"
          >
            Enter
            <span class="font-weight-bold">
              {{ from ? from.symbol : "BNB" }}
            </span>
            to begin the journey!
          </div>
        </div>

        <v-btn
          :disabled="!Boolean(amount) || !Boolean(bestRouteResponse) || loading"
          block
          color="indigo lighten-1"
          large
          class="rounded-pill"
          @click="swapOnRango()"
        >
          <span class="font-weight-bold text-overline"> Swap on Rango! </span>
        </v-btn>

        <div class="row d-flex justify-center align-center mt-4 px-8 mb-4">
          <span class="mr-4 font-weight-bold" style="font-size: 10px">
            Powered by:
          </span>
          <v-img
            v-if="darkmode"
            max-width="80"
            src="@/assets/rango-logo.svg"
          ></v-img>
          <v-img
            v-else
            max-width="80"
            src="@/assets/rango-logo-dark.svg"
          ></v-img>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { generateColors } from "@/util/helpers";
import { interpolateRainbow } from "d3";
import Chance from "chance";
import axios from "axios";

export default {
  name: "Bridge",
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("bridgeStore", [
      "tokens",
      "blockchains",
      "popularTokens",
      "swappers",
    ]),
    defaultImage() {
      return require(`@/assets/images/tokens/default.png`);
    },
    fromAmount() {
      return this.from ? (this.from.usdPrice * this.amount).toFixed(2) : "0.00";
    },
    popularBlockchains() {
      return [
        { name: "BSC", value: "BSC" },
        { name: "Polygon", value: "POLYGON" },
        { name: "Terra", value: "TERRA" },
        { name: "ETH", value: "ETH" },
        { name: "Harmony", value: "HARMONY" },
        { name: "Fantom", value: "FANTOM" },
        { name: "Sifchain", value: "SIF" },
        { name: "Osmosis", value: "OSMOSIS" },
        { name: "AVAX-C", value: "AVAX_CCHAIN" },
      ];
    },
    mappedTokens() {
      let tokens = [...this.tokens];

      if (this.blockchainFilter) {
        const popularBlockchains = [...this.popularBlockchains].map(
          (popularBlockchain) => popularBlockchain.value
        );

        tokens =
          this.blockchainFilter === "OTHERS"
            ? tokens.filter((token) => {
                return !popularBlockchains.includes(token.blockchain);
              })
            : tokens.filter((token) => {
                return (
                  token.blockchain.toLowerCase() ===
                  this.blockchainFilter.toLowerCase()
                );
              });
      }

      if (this.searchCoin) {
        tokens = tokens.filter((token) => {
          return (
            token.symbol
              .toLowerCase()
              .includes(this.searchCoin.toLowerCase()) ||
            (token.name &&
              token.name.toLowerCase().includes(this.searchCoin.toLowerCase()))
          );
        });
      }

      return tokens.slice(0, this.totalShown);
    },
    colors() {
      return this.chanceWrapper.shuffle(
        generateColors(this.blockchains.length, interpolateRainbow, {
          colorStart: 0,
          colorEnd: 1,
          useEndAsStart: true,
        })
      );
    },
    receiveAmount() {
      return this.bestRouteResponse && this.bestRouteResponse.result
        ? parseFloat(this.bestRouteResponse.result.outputAmount)
        : 0;
    },
    fromRate() {
      const rate = this.receiveAmount / this.amount;
      return rate.toFixed(rate < 1 ? 4 : 2);
    },
    toRate() {
      const rate = this.amount / this.receiveAmount;
      return rate.toFixed(rate < 1 ? 4 : 2);
    },
    totalFees() {
      let fees = 0;

      if (this.bestRouteResponse && this.bestRouteResponse.result) {
        this.bestRouteResponse.result.swaps.forEach((swap) => {
          const _fees = swap.fee
            .filter((fee) => fee.expenseType === "FROM_SOURCE_WALLET")
            .map((fee) => {
              const token = this.tokens.find((token) => {
                return (
                  token.symbol === fee.asset.symbol &&
                  token.blockchain === fee.asset.blockchain
                );
              });
              return parseFloat(fee.amount * token.usdPrice);
            })
            .reduce((a, b) => a + b, 0);

          fees += parseFloat(_fees);
        });
      }

      return fees;
    },
    totalETA() {
      const totalETASeconds =
        this.bestRouteResponse && this.bestRouteResponse.result
          ? this.bestRouteResponse.result.swaps.reduce(
              (a, b) => +a + +b.estimatedTimeInSeconds,
              0
            )
          : 0;

      return (
        Math.floor(totalETASeconds / 60) +
        ":" +
        ("0" + Math.floor(totalETASeconds % 60)).slice(-2)
      );
    },
  },
  data() {
    return {
      from: null,
      to: null,
      amount: 0,
      bestRouteResponse: null,
      fromDialog: false,
      toDialog: false,
      searchCoin: "",
      blockchainFilter: "",
      totalShown: 10,
      chanceWrapper: new Chance(1),
      loading: false,
    };
  },
  async created() {
    await this.getMeta();
    this.from = this.tokens.find((token) => {
      return token.symbol === "BNB" && token.blockchain === "BSC";
    });
    this.to = this.tokens.find((token) => {
      return token.symbol === "Luna" && token.blockchain === "TERRA";
    });
    let blocks = {};
    this.blockchains.forEach((blockchain) => {
      blocks[blockchain.name] = blockchain.name;
    });
  },
  watch: {
    amount: {
      immediate: true,
      deep: true,
      async handler(value) {
        if (value) {
          await this.getBestRoute();
        }
      },
    },
    from: {
      immediate: true,
      deep: true,
      async handler() {
        if (this.amount) {
          await this.getBestRoute();
        }
      },
    },
    to: {
      immediate: true,
      deep: true,
      async handler() {
        if (this.amount) {
          await this.getBestRoute();
        }
      },
    },
  },
  methods: {
    ...mapActions("bridgeStore", ["getMeta"]),
    ...mapActions("generalStore", ["addAlert"]),
    onlyForCurrency($event) {
      let keyCode = $event.keyCode ? $event.keyCode : $event.which;

      if (
        (keyCode < 48 || keyCode > 57) &&
        (keyCode !== 46 || this.amount.indexOf(".") != -1)
      ) {
        $event.preventDefault();
      }
    },
    onScroll({ target: { scrollTop, clientHeight, scrollHeight } }) {
      if (scrollTop + clientHeight >= scrollHeight) {
        if (this.tokens.length > this.mappedTokens.length) {
          this.totalShown += 10;
        } else {
          this.totalShown = this.tokens.length;
        }
      }
    },
    getColor(blockchain) {
      const index = this.blockchains
        .map((chain) => chain.name)
        .indexOf(blockchain);
      return index !== -1 ? this.colors[index] : "grey";
    },
    changeFrom(token) {
      this.from = token;
      this.fromDialog = false;
      this.totalShown = 10;
      this.blockchainFilter = "";
      this.searchCoin = "";
    },
    changeTo(token) {
      this.to = token;
      this.toDialog = false;
      this.totalShown = 10;
      this.blockchainFilter = "";
      this.searchCoin = "";
    },
    async getBestRoute() {
      if (this.amount) {
        this.bestRouteResponse = null;
        try {
          this.loading = true;
          const { data } = await axios.post(
            process.env.VUE_APP_RANGO_BEST_ROUTE_URL,
            {
              from: {
                blockchain: this.from.blockchain,
                symbol: this.from.symbol,
                address: this.from.address,
              },
              to: {
                blockchain: this.to.blockchain,
                symbol: this.to.symbol,
                address: this.to.address,
              },
              amount: parseFloat(this.amount),
              connectedWallets: [],
              selectedWallets: {},
              checkPrerequisites: false,
              affiliateRef: "omZxbI",
            },
            {
              params: { apiKey: process.env.VUE_APP_RANGO_API_KEY },
              headers: {
                "X-Rango-Id": this.$uuid.v4(),
              },
            }
          );

          this.bestRouteResponse = data;
        } catch (error) {
          this.addAlert(error);
        } finally {
          this.loading = false;
        }
      }
    },
    async swapDirection() {
      const to = {
        ...this.to,
      };

      this.to = this.from;
      this.from = to;
    },
    getSwapperLogo(id) {
      return this.swappers.find((swapper) => swapper.id === id).logo;
    },
    getSwapperTotalFees(swapper) {
      const totalFees = swapper.fee
        .filter((fee) => fee.expenseType === "FROM_SOURCE_WALLET")
        .map((fee) => {
          const token = this.tokens.find((token) => {
            return (
              token.symbol === fee.asset.symbol &&
              token.blockchain === fee.asset.blockchain
            );
          });
          return parseFloat(fee.amount * token.usdPrice);
        })
        .reduce((a, b) => a + b, 0);

      return totalFees.toFixed(2);
    },
    getSwapperETA(estimatedTimeInSeconds) {
      return (
        Math.floor(estimatedTimeInSeconds / 60) +
        ":" +
        ("0" + Math.floor(estimatedTimeInSeconds % 60)).slice(-2)
      );
    },
    swapOnRango() {
      const link = `${process.env.VUE_APP_RANGO_SWAP_URL}/${
        this.from.blockchain
      }.${this.from.symbol}${
        this.from.address ? "--" + this.from.address : ""
      }/${this.to.blockchain}.${this.to.symbol}${
        this.to.address ? "--" + this.to.address : ""
      }/?a=${this.amount}&ref=${process.env.VUE_APP_RANGO_REFERRAL_ID}`;

      window.open(link, "_blank");
    },
  },
};
</script>

<style lang="scss">
.bridge {
  &__wrapper {
    max-width: 32rem;
    width: 100%;
  }
  &__input,
  &__input:focus {
    outline: none;
    border: 0;
    font-size: 1.5rem;
  }

  .v-input__slot {
    background: transparent !important;
    padding: 0px !important;
  }

  &__best--preview {
    border: dashed 2px #666;
    padding: 10px;
  }
}

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
