<template>
  <div>
    <RektForm />
    <HeaderTopDashboard />

    <v-container class="px-6 mt-n16">
      <v-row>
              <p>{{ approvals }}</p>
      </v-row>
      <v-row>
        <v-col class="mx-auto pt-0">
          <v-card class="card-shadow mb-30" :dark="darkmode">
            <v-card-text class="card-padding card-shadow">
              <v-card-text class="px-0 py-0">
                <v-data-table
                  :headers="headers"
                  :items="approvals"
                  hide-default-footer
                  :page.sync="page"
                  class="table"
                  mobile-breakpoint="0"
                  @page-count="pageCount = $event"
                >
                  <template v-slot:item.tokenID="{ item }" class="text-center">
                    <a>{{ item.tokenID }}</a>
                  </template>
                  <template v-slot:item.lastTx.contractApproved="{ item }" class="text-center">
                    <a>{{ item.lastTx && item.lastTx.contractApproved || 'NA' }}</a>
                  </template>
                  <template v-slot:item.management="{ item }" class="text-center">
                    <v-tooltip color="#212529" top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          v-bind="attrs"
                          v-on="on"
                          size="14"
                          class="text-muted me-2 cursor-pointer"
                          >fas fa-ban</v-icon
                        >
                      </template>
                      <span>Revoke Access</span>
                    </v-tooltip>
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
                />
              </div>
            </v-card-text>
            <v-overlay
              :absolute="true"
              :value="loading"
            >
              <div class="text-center">
                <v-progress-circular
                  indeterminate
                  color="white"
                  :opacity="1"
                />
              </div>
            </v-overlay>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { store } from '@/store.js';
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
          text: 'Token',
          align: 'center',
          sortable: true,
          value: 'tokenData.tkn0s',
        },
        {
          text: 'Token ID',
          align: 'center',
          sortable: true,
          value: 'tokenID',
        },
        {
          text: 'Contract',
          align: 'center',
          sortable: true,
          value: 'network',
        },
        {
          text: 'Contract',
          align: 'center',
          sortable: true,
          value: 'lastTx.contractApproved',
        },
        {
          text: 'Value',
          align: 'center',
          sortable: true,
          value: 'balance',
        },
        {
        sortable: false,
        text: "Manage",
        value: "management",
        align: "center"
      }
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    loading() {
      return store.loadingApprovals;
    },
    farms() {
      return store.farmsList;
    },
    approvals() {
      const tokens = [];
      for (const tokenId in store.approvedTokens.approvals) {
        if (Object.hasOwnProperty.call(store.approvedTokens.approvals, tokenId)) {
          let transactions = store.approvedTokens.approvals[tokenId].contracts[Object.keys(store.approvedTokens.approvals[tokenId].contracts)[0]].tx;
          const lastTx = transactions[transactions.length - 1][0];
          store.approvedTokens.approvals[tokenId].lastTx = lastTx;
          tokens.push(store.approvedTokens.approvals[tokenId]);
        }
      }
      return tokens;
    }
  },
};
</script>
