<template>
  <div>
    <HeaderTopDashboard />

    <v-container class="px-6 mt-n16">
      <v-row>
              <RektForm />
              <p>{{ approvals }}</p>
        <v-col class="mx-auto pt-0" lg="8">
          <v-card class="card-shadow mb-30" :dark="darkmode">
            <v-card-text class="card-padding card-shadow">
              <v-card-text class="px-0 py-0">
                <v-data-table
                  :headers="headers"
                  :items="approvals.approvals"
                  hide-default-footer
                  :page.sync="page"
                  class="table"
                  mobile-breakpoint="0"
                  @page-count="pageCount = $event"
                  sort-by="name"
                  :sort-desc="false"
                >
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
                ></v-pagination>
              </div>
            </v-card-text>
                        </v-card-text>

            <v-overlay
              :absolute="true"
              :value="loading"
            >
              <div class="text-center">
                <v-progress-circular
                  indeterminate
                  color="white"
                ></v-progress-circular>
              </div>
            </v-overlay>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { store, mutations } from '@/store.js';
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";
import RektForm from '@/views/Forms/RektForm.vue'

export default {
  name: "Rekt",
  components: {
    HeaderTopDashboard,
    RektForm
  },
  data() {
    return {
      headers: [
        {
          text: 'TokenID',
          align: 'center',
          sortable: true,
          value: 'tokenID',
        },
        // { text: 'Network', value: 'network', align: 'center', },
        { text: 'Featured', value: 'approval.approvals.i.tokenID', align: 'center', },
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    loading: function() {
      return store.loadingApprovals;
    },
    farms() {
      return store.farmsList;
    },
    approvals() {
      return store.approvedTokens;
    }
  },
  methods: {
    async getAllFarms() {
      mutations.getFarms();
    },
  },
};
</script>
