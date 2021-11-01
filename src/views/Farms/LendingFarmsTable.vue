<template>
  <div>
    <NoDataCard v-if="lendingFarms.length === 0" :loading="loading" />
    <div v-else>
      <v-progress-linear
        v-show="loading"
        :indeterminate="loading"
        color="indigo lighten-1"
        slot="progress"
      ></v-progress-linear>
      <v-card class="rounded-t-0">
        <v-card-text class="px-0 py-0">
          <v-overlay :absolute="true" :value="loading">
            <div class="text-center"></div>
          </v-overlay>
          <v-data-table
            class="table px-4"
            :headers="headers"
            :items="lendingFarms"
            :loading="loading"
            hide-default-footer
            :items-per-page="-1"
            sort-by="value"
            :sort-desc="true"
            :expanded.sync="expanded"
            item-key="name"
            style="background-color: transparent"
            mobile-breakpoint="0"
          >
            <template v-slot:item="{ item, expand, isExpanded }">
              <tr>
                <td>
                  <v-btn text icon @click="expand(!isExpanded)">
                    <v-icon>
                      {{ isExpanded ? "mdi-chevron-up" : "mdi-chevron-down" }}
                    </v-icon>
                  </v-btn>
                </td>
                <td>
                  <div class="d-flex">
                    <div
                      style="width: 30px"
                      class="d-flex justify-center align-center mr-2"
                    >
                      <v-avatar rounded tile size="20">
                        <v-img :src="getNetworkLogo(item.network)" />
                      </v-avatar>
                    </div>
                    <span>{{ item.name }}</span>
                  </div>
                </td>
                <td>
                  {{ item.poolTotal | toCurrency(round) }}
                </td>
                <td>
                  {{ item.totalBorrowed | toCurrency(round) }}
                </td>
                <td>
                  <v-card-text>
                    <p
                      :set="(loanAmount = item.availableLimit)"
                      class="text-center mb-0"
                    >
                      <v-progress-linear
                        :value="(item.totalBorrowed / loanAmount) * 100"
                        height="25"
                        rounded
                        color="indigo lighten-1"
                      >
                        <strong>
                          {{
                            ((item.totalBorrowed / loanAmount) * 100)
                              | to2Decimals(round)
                          }}%
                        </strong>
                      </v-progress-linear>
                      {{ item.totalBorrowed | toCurrency(round) }} /
                      {{ loanAmount | toCurrency(round) }}
                    </p>
                  </v-card-text>
                </td>
                <td>
                  {{
                    (item.poolTotal - item.totalBorrowed) | toCurrency(round)
                  }}
                </td>
              </tr>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length" class="pa-4">
                <v-data-table
                  :headers="itemHeaders"
                  :items="Object.values(item.userData)"
                  hide-default-footer
                  :items-per-page="-1"
                  :sort-desc="true"
                  item-key="name"
                  style="border: 1px solid grey"
                >
                  <template v-slot:item="{ item }">
                    <tr>
                      <td class="font-weight-bold flex">
                        <v-avatar size="25" class="mr-2">
                          <v-img
                            :src="getTokenLogo(item.network, item.token0)"
                          />
                        </v-avatar>
                        {{ item.tokenPair }}
                      </td>
                      <td>
                        {{ item.staked | to2Decimals(round) }}
                      </td>
                      <td>
                        {{ item.lpPrice | toCurrency(round) }}
                      </td>
                      <td>
                        {{ item.borrowed | to2Decimals(round) }}
                      </td>
                      <td>
                        {{ item.borrowedUSD | toCurrency(round) }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
              </td>
            </template>
          </v-data-table>
          <div class="py-1 d-flex justify-end"></div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import NoDataCard from "@/components/Cards/NoDataCard.vue";

export default {
  name: "LendingFarmsTable",
  components: {
    NoDataCard,
  },
  data() {
    return {
      headers: [
        {
          text: "",
          align: "start",
          value: "userData",
        },
        { text: "Platform", value: "name" },
        { text: "Deposited", value: "poolTotal" },
        { text: "Borrowed", value: "totalBorrowed" },
        { text: "Borrow Limit", value: "borrowLimit", align: "center" },
        { text: "Value", value: "total", sortable: true },
      ],
      expanded: [],
      itemHeaders: [
        { text: "Asset", value: "tokenPair" },
        { text: "Deposited", value: "staked" },
        { text: "Deposited Value", value: "lpPrice" },
        { text: "Borrowed", value: "borrowed" },
        { text: "Borrowed Value", value: "borrowedUSD" },
        // { text: "Total Value", value: "total", sortable: true },
      ],
    };
  },
  computed: {
    ...mapGetters("farmStore", ["lendingFarms"]),
    ...mapGetters("generalStore", ["darkmode", "round"]),
    loading() {
      return this.$store.state.farmStore.loading;
    },
  },
  methods: {
    getTokenLogo(network, token) {
      try {
        return require(`@/assets/images/tokens/${network}/${token.toLowerCase()}.png`);
      } catch (_) {
        return require(`@/assets/images/tokens/default.png`);
      }
    },
    getNetworkLogo(network) {
      return require(`@/assets/images/networks/${network}.jpg`);
    },
  },
};
</script>

<style lang="scss" scoped></style>
