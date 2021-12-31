<template>
  <div>
    <template>
      <v-btn @click="signMessage()"> Sign Message </v-btn>
    </template>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Rev0xForm from "@/views/Forms/Rev0xForm.vue";

export default {
  components: {
    Rev0xForm,
  },
  data() {
    return {
      headers: [
        {
          text: "Contract",
          align: "center",
          sortable: true,
          value: "contractId",
        },
        {
          text: "Approval Amount",
          align: "center",
          sortable: true,
          value: "lastTx.amount",
        },
        {
          text: "Block",
          align: "center",
          sortable: true,
          value: "lastTx.block_number",
        },
        {
          sortable: false,
          text: "Revoke",
          value: "management",
          align: "center",
        },
      ],
      page: 1,
      pageCount: 0,
    };
  },
  computed: {
    ...mapGetters("approvalsStore", ["searchedWallet", "wallet"]),
    ...mapGetters("farmStore", ["farms"]),
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("walletStore", ["connectedWallet"]),
    loading: function () {
      return (
        this.$store.state.farmStore.loading ||
        this.$store.state.approvalsStore.loading
      );
    },
    approvals() {
      let approvals = [];
      if (
        this.$store.state.approvalsStore.approvals &&
        Object.keys(this.$store.state.approvalsStore.approvals).length
      ) {
        for (const tokenId in this.$store.state.approvalsStore.approvals) {
          if (
            Object.hasOwnProperty.call(
              this.$store.state.approvalsStore.approvals,
              tokenId
            )
          ) {
            let approval = this.$store.state.approvalsStore.approvals[tokenId];
            for (const contractId in approval.contracts) {
              if (Object.hasOwnProperty.call(approval.contracts, contractId)) {
                let contract = approval.contracts[contractId];
                if (!approval.contractsArr) approval.contractsArr = [];
                contract.contractId = contractId;
                if (contract.tx && contract.tx.length > 1) {
                  const lastTx = contract.tx[contract.tx.length - 1][0];
                  if (lastTx.amount) {
                    for (const farm in this.farms) {
                      if (Object.hasOwnProperty.call(this.farms, farm)) {
                        const farmData = this.farms[farm];
                        if (
                          farmData.sendValue.toLowerCase() ===
                          lastTx.contractApproved.toLowerCase()
                        ) {
                          contract.friendlyName = farmData.name;
                        }
                      }
                    }
                    contract.lastTx = lastTx;
                  }
                } else if (contract.tx && contract.tx.length === 1) {
                  const lastTx = contract.tx[0];
                  if (lastTx.amount) {
                    for (const farm in this.farms) {
                      if (Object.hasOwnProperty.call(this.farms, farm)) {
                        const farmData = this.farms[farm];
                        if (
                          (farmData.sendValue.toLowerCase() ===
                            lastTx.contractApproved.toLowerCase(),
                          farmData.sendValue.toLowerCase() ===
                            lastTx.contractApproved.toLowerCase())
                        ) {
                          contract.friendlyName = farmData.name;
                        }
                      }
                    }
                    contract.lastTx = lastTx;
                  }
                }
                if (contract.lastTx) {
                  delete contract.tx;
                  approval.contractsArr.push(contract);
                }
              }
            }
            delete approval.contracts;
            if (approval.contractsArr.length)
              approvals.push(
                this.$store.state.approvalsStore.approvals[tokenId]
              );
          }
        }
      }
      return approvals;
    },
    approvalsSortedByAmount() {
      const _approvals = this.approvals;
      return _approvals.sort((a, b) =>
        a.balance < b.balance ? 1 : b.balance < a.balance ? -1 : 0
      );
    },
  },
  created() {
    this.getFarms();
  },
  methods: {
    ...mapActions("approvalsStore", ["revokePermissions", "signMessage"]),
    ...mapActions("farmStore", ["getFarms"]),
  },
};
</script>
