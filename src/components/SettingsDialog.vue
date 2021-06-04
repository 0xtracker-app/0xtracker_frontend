<template>
  <v-dialog
      :dark="darkmode"
      v-model="showSettings"
      persistent
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Settings
        </v-card-title>
        <v-card-text>
          <v-chip
            class="ma-2"
            @click="darkmode = !darkmode"
          >
            <v-icon v-if="darkmode" class="pr-1">mdi-weather-sunny</v-icon>
            <v-icon v-else class="pr-1">mdi-weather-night</v-icon>
            {{ darkmode ? 'Dark' : 'Light' }} Mode
          </v-chip>
          <v-chip
            class="ma-2"
            @click="round = !round"
          >
            <v-icon v-if="round" class="pr-1">mdi-decimal</v-icon>
            <v-icon v-else class="pr-1">mdi-decimal-increase</v-icon>
            {{ round ? 'Rounded' : 'No Rounding'}}
          </v-chip>
          <v-chip
            class="ma-2"
            @click="width = !width"
          >
            <v-icon class="pr-1">mdi-aspect-ratio</v-icon>
             Width: {{ width }}
          </v-chip>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            text
            @click="showSettings = !showSettings"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: "SettingsDialog",
  computed: {
    darkmode: {
      get () {
        return store.userData.darkmode;
      },
      set () {
        mutations.toggleDarkMode();
      }
    },
    round: {
      get () {
        return store.userData.round;
      },
      set () {
        mutations.toggleRounding();
      }
    },
    width: {
      get () {
        if (store.userData.width === 0) return 'Default';
        if (store.userData.width === 1) return 'Wide';
        if (store.userData.width === 2) return 'Slim';
        return store.userData.width
      },
      set () {
        mutations.toggleWidth();
      }
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
