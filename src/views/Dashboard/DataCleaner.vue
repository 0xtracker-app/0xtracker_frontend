<template>
  <div>
    <v-card
      class="mb-4 card-padding"
      :dark="darkmode"
      :style="{
        filter: darkmode
          ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
          : '',
      }"
    >
      <v-card-text class="px-0 py-0">
        <div>
          <v-btn
            @click="removeMultiple"
            class="text-caption text-none font-weight-bold white--text"
            elevation="0"
            small
            :dark="darkmode"
            color="indigo lighten-1"
            :disabled="selectedTimestamps.length === 0"
          >
            Delete Selected
          </v-btn>
        </div>
        <v-data-table
          v-if="historicalData[0]"
          :headers="headers"
          :items="historicalData[0].data"
          v-model="selectedTimestamps"
          show-select
          hide-default-footer
          item-key="_id"
          :page.sync="page"
          class="table px-4"
          mobile-breakpoint="0"
          @page-count="pageCount = $event"
          sort-by="name"
          :sort-desc="false"
          style="background-color: transparent"
        >
          <template #item._id="{ item }">
            <span>
              {{ formatDate(item._id, "MM-dd-yyyy hh:mm aa") }}
            </span>
          </template>
          <template v-slot:item.average="{ item }">
            <span>
              {{ item.average | to2Decimals(round) }}
            </span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              class="text-none text-caption font-weight-bold white--text"
              elevation="0"
              color="red"
              icon
              :ripple="false"
              @click="remove([item._id])"
            >
              <v-icon class="mr-2"> mdi-trash-can </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
      <div class="card-padding d-flex justify-end">
        <v-pagination
          prev-icon="fa fa-angle-left"
          next-icon="fa fa-angle-right"
          class="pagination"
          color="indigo lighten-1"
          v-model="page"
          :length="pageCount"
          circle
          :total-visible="$vuetify.breakpoint.smAndDown ? 4 : 8"
        ></v-pagination>
      </div>
      <v-overlay :absolute="true" :value="loading">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="white"
          ></v-progress-circular>
        </div>
      </v-overlay>
    </v-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { format } from "date-fns";

export default {
  data() {
    return {
      selectedTimestamps: [],
      headers: [
        {
          text: "Timestamp",
          align: "center",
          sortable: true,
          value: "_id",
        },
        {
          text: "Average Amount",
          align: "center",
          sortable: true,
          value: "average",
        },
        {
          text: "Actions",
          align: "center",
          sortable: true,
          value: "actions",
        },
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    ...mapGetters("approvalsStore", ["searchedWallet", "wallet", "signature"]),
    ...mapGetters("farmStore", ["farms"]),
    ...mapGetters("generalStore", ["darkmode", "round"]),
    ...mapGetters("walletStore", ["connectedWallet", "historicalData"]),
    loading: function () {
      return (
        this.$store.state.farmStore.loading ||
        this.$store.state.approvalsStore.loading
      );
    },
  },
  created() {
    this.getFarms();
    if (!this.connectedWallet || this.historicalData.length === 0) {
      this.$router.push("/portfolio");
    }
  },
  methods: {
    ...mapActions("approvalsStore", [
      "revokePermissions",
      "signMessage",
      "deleteData",
    ]),
    ...mapActions("walletStore", ["removeHistoricalData"]),
    ...mapActions("farmStore", ["getFarms"]),
    formatDate(date, dateFormat) {
      return format(new Date(date), dateFormat);
    },
    async remove(items) {
      if (!this.signature) {
        await this.signMessage();
      }

      if (this.signature) {
        await this.deleteData({
          wallet: this.connectedWallet,
          signature: this.signature,
          timestamps: items,
        });
      }
    },
    async removeMultiple() {
      const timestamps = this.selectedTimestamps.map((data) => data._id);

      if (timestamps.length > 0) {
        this.remove(timestamps);
      }
    },
  },
};
</script>
