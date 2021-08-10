<template>
  <v-container fluid class="pt-0 px-6 pb-16">
    <v-row no-gutters class="py-3">
      <v-col cols="12">
        <h2
          class="text-h2 font-weight-600 text-white text-center"
        >
          <template v-if="$route.name === 'Dashboard'">Dashboard</template>
          <template v-else>{{ $route.name }}</template>
        </h2>
      </v-col>
      <v-col v-if="showRefresh" cols="12" md="6" class="d-flex justify-end align-center">
        <v-btn
          elevation="0"
          small
          min-width="45"
          :ripple="false"
          class="me-3 py-1 px-2 font-weight-600 text-capitalize rounded-sm"
          :class="{'text-muted': !darkmode}"
          @click="loadPortfolio()"
          :dark="darkmode"
        >
          <v-icon size=".875rem" class="mr-2" color="#5e72e4">fas fa-redo</v-icon>
          Refresh
        </v-btn>
      </v-col>
    </v-row>

    <slot></slot>
  </v-container>
</template>
<script>
import { store } from '@/store.js';

export default {
  name: "header-top",
  props: {
    showRefresh: Boolean,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
  },
  methods: {
    loadPortfolio() {
      this.$eventHub.$emit('load-wallet');
      this.$eventHub.$emit('load-farms');
    },
  }
};
</script>
