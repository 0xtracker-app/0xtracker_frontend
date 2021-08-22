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
              <v-expansion-panels v-if="approvals.length" accordion multiple>
                <v-expansion-panel
                  v-for="(approval, key) in approvals" :key="key"
                >
                  <v-expansion-panel-header>
                    {{ approval.tokenData.tkn0s }} ({{ $t(approval.network) }}) - {{ approval.balance }}
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-data-table
                      :headers="headers"
                      :items="approval.contractsArr"
                      hide-default-footer
                      :page.sync="page"
                      class="table"
                      mobile-breakpoint="0"
                      @page-count="pageCount = $event"
                    >
                      <template v-slot:item.management="{ item }" class="text-center">
                        <v-tooltip color="#212529" top>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              v-on="on"
                              size="14"
                              class="text-muted me-2 cursor-pointer"
                              @click="revoke()"
                              >
                              fas fa-ban
                            </v-icon>
                          </template>
                          <span>Revoke Permissions</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
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
import { mapActions, mapGetters } from 'vuex';
import { store, mutations } from '@/store-old.js';
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
          text: 'Contract',
          align: 'center',
          sortable: true,
          value: 'contractId',
        },
        {
          text: 'Amount',
          align: 'center',
          sortable: true,
          value: 'lastTx.amount',
        },
        {
          text: 'Block',
          align: 'center',
          sortable: true,
          value: 'lastTx.block_number',
        },
        {
        sortable: false,
        text: "Revoke",
        value: "management",
        align: "center"
      }
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    ...mapGetters('generalStore', ['darkmode']),
    loading() {
      return store.loadingApprovals;
    },
    farms() {
      return store.farmsList;
    },
    approvals() {
      let approvals = [];
      for (const tokenId in store.approvedTokens.approvals) {
        if (Object.hasOwnProperty.call(store.approvedTokens.approvals, tokenId)) {
          let approval = store.approvedTokens.approvals[tokenId];
          for (const contractId in approval.contracts) {
            if (Object.hasOwnProperty.call(approval.contracts, contractId)) {
              let contract = approval.contracts[contractId];
              if (!approval.contractsArr) approval.contractsArr = [];
              contract.contractId = contractId;
              if (contract.tx && contract.tx.length > 1) {
                contract.lastTx = contract.tx[contract.tx.length - 1][0];
              } else if (contract.tx && contract.tx.length === 1) {
                contract.lastTx = contract.tx[0][0];
              }
              delete contract.tx;
              approval.contractsArr.push(contract);
            }
          }
          delete approval.contracts;
          approvals.push(store.approvedTokens.approvals[tokenId])
        }
      }
      return approvals;
    }
  },
  methods: {
    async revoke() {
      mutations.revokePermissions();
    }
  },
};
</script>
