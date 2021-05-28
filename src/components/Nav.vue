<template>
  <v-app-bar
    app
    :dark="darkmode"
  >
    <v-btn :to="{ name: 'Home' }" icon>
      <v-icon>mdi-home</v-icon>
    </v-btn>
    <v-toolbar-title>0xTracker</v-toolbar-title>
  </v-app-bar>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Nav",
  components: {
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    }
  },
};
</script>

<style scoped>
</style>
