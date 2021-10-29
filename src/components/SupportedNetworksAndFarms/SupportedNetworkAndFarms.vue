<template>
  <v-card
    class="mb-4 card-padding"
    :dark="darkmode"
    :style="{
      filter: darkmode
        ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
        : '',
    }"
  >
    <div>
      <v-row class="d-flex align-center">
        <v-col>
          <p class="font-weight-bold text-h1 mb-0">{{ $t(network) }}</p>
        </v-col>
        <v-col class="text-right font-weight-bold text-h4">
          {{ $tc("farm", farms.length, { count: farms.length }) }}
        </v-col>
      </v-row>
    </div>
    <v-card-text>
      <v-card-text class="px-0 py-0">
        <v-data-table
          :headers="headers"
          :items="farms"
          hide-default-footer
          dense
          :page.sync="page"
          class="table px-4"
          mobile-breakpoint="0"
          @page-count="pageCount = $event"
          sort-by="name"
          :sort-desc="false"
          style="background-color: transparent"
        >
          <template v-slot:item.featured="{ item }">
            <v-icon color="green" v-if="item.featured === 1" class="pr-1"
              >mdi-star-face</v-icon
            >
            <v-icon v-else class="pr-1">mdi-emoticon-sad</v-icon>
          </template>
        </v-data-table>
      </v-card-text>
      <div class="card-padding d-flex justify-end">
        <v-pagination
          prev-icon="fa fa-angle-left"
          next-icon="fa fa-angle-right"
          class="pagination"
          color="#5e72e4"
          v-model="page"
          :length="pageCount"
          circle
          :total-visible="$vuetify.breakpoint.smAndDown ? 4 : 8"
        ></v-pagination>
      </div>
    </v-card-text>
    <v-overlay :absolute="true" :value="loading">
      <div class="text-center">
        <v-progress-circular indeterminate color="white"></v-progress-circular>
      </div>
    </v-overlay>
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "SupportedNetworkAndFarms",
  props: {
    network: String,
    farms: Array,
  },
  data() {
    return {
      headers: [
        {
          text: "Name",
          align: "center",
          sortable: true,
          value: "name",
        },
        // { text: 'Network', value: 'network', align: 'center', },
        { text: "Featured", value: "featured", align: "center" },
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    loading: function () {
      return this.$store.state.farmStore.loading;
    },
  },
};
</script>
