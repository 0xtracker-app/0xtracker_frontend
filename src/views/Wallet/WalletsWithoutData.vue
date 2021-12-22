<template>
  <v-card
    class="mx-auto mx-5 pb-3"
    v-if="Object.keys(walletsWithoutData).length"
  >
    <v-card-text class="d-flex flex-column">
      <div class="mt-4">Wallets We Couldn't Check:</div>
      <div class="d-flex flex-wrap">
        <v-chip
          :color="wallet.error ? 'red' : ''"
          v-for="(wallet, key) in walletsWithoutData"
          :key="key"
          class="ma-2"
          :disabled="loading"
          elevation="0"
          @click="getSingleFailedWallet({ key, wallet })"
        >
          <v-icon left v-if="wallet.error"> fas fa-exclamation-circle </v-icon>
          {{ wallet.wallet }}
          <v-icon right v-if="wallet.error" size="15" class="px-1">
            fas fa-redo
          </v-icon>
        </v-chip>
        <v-chip
          v-if="Object.keys(walletsWithoutData).length > 1"
          color="red"
          class="ma-2"
          :disabled="loading"
          elevation="0"
          @click="getAllFailedWallets()"
        >
          <v-icon left> fas fa-exclamation-circle </v-icon>
          <span class="font-weight-bold text-caption text-uppercase">
            Retry All
          </span>
          <v-icon right size="15" class="px-1"> fas fa-redo </v-icon>
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "WalletsWithoutData",
  computed: {
    walletsWithoutData: function () {
      return this.$store.state.walletStore.walletsWithoutData;
    },
    loading: function () {
      return this.$store.state.walletStore.loading;
    },
  },
  methods: {
    ...mapActions("walletStore", [
      "getSingleFailedWallet",
      "getAllFailedWallets",
    ]),
  },
};
</script>

<style scoped></style>
