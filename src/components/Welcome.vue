<template>
  <v-card-text>
    <p class="display-1 mb-0 text-center">
      Welcome to 0xTracker
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="previousSession"
            icon
            @click="viewWallet()"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon
              dark
            >
              mdi-history
            </v-icon>
          </v-btn>
        </template>
        <span>Restore previous session?</span>
      </v-tooltip>
    </p>
  </v-card-text>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Welcome",
  computed: {
    store() {
      return store.userData;
    },
    previousSession() {
      if (this.store.wallet && this.store.selectedFarms && this.store.selectedFarms.length > 0) return true;
      else return false;
    },
  },
  methods: {
    viewWallet() {
      this.$router.push({ name: 'Portfolio', params: { wallet: this.store.wallet, loadPortfolio: true }});
    }
  },
};
</script>

<style scoped></style>
