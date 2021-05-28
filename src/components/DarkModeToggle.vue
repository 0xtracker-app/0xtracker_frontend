<template>
  <v-card-text style="height: 100px; position: relative">
    <v-btn
      @click="toggleDarkMode()"
      :dark="!darkmode"
      absolute
      top
      right
      fab
    >
      <v-icon v-if="darkmode">mdi-weather-sunny</v-icon>
      <v-icon v-else>mdi-weather-night</v-icon>
    </v-btn>
  </v-card-text>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "DarkModeToggle",
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
  },
  methods: {
    toggleDarkMode() {
      mutations.toggleDarkMode();
    },
  },
};
</script>

<style scoped></style>
