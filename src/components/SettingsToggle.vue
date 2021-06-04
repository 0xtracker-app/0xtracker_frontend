<template>
  <v-btn
    @click="showSettings = !showSettings"
    :dark="!darkmode"
    fixed
    bottom
    right
    fab
  >
    <v-icon>mdi-cog</v-icon>
  </v-btn>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "SettingsToggle",
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    showSettings: {
      get () {
        return store.showSettings;
      },
      set () {
        mutations.toggleShowSettings();
      }
    },
  },
};
</script>

<style scoped></style>
