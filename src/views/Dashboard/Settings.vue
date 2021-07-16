<template>
  <div>
    <HeaderTopDashboard />
    <v-container class="px-6 mt-n16">
      <v-row>
        <v-col class="mx-auto pt-0" lg="8">
          <v-card class="card-shadow mb-30" :dark="darkmode">
            <v-card-text class="card-padding">
            <v-card-text>
              <v-chip
                class="ma-2"
                @click="darkmode = !darkmode"
              >
                <v-icon v-if="darkmode" class="pr-1">mdi-weather-night</v-icon>
                <v-icon v-else class="pr-1">mdi-weather-sunny</v-icon>
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
                @click="smallValues = !smallValues"
              >
                <v-icon v-if="smallValues" class="pr-1">mdi-less-than</v-icon>
                <v-icon v-else class="pr-1">mdi-greater-than</v-icon>
                {{ smallValues ? 'Small Values' : 'No Small Values'}}
              </v-chip>
              <v-chip
                class="ma-2"
                @click="noLPPools = !noLPPools"
              >
                <v-icon v-if="noLPPools" class="pr-1">mdi-water-plus</v-icon>
                <v-icon v-else class="pr-1">mdi-water-minus</v-icon>
                {{ noLPPools ? 'Show No LP Pools' : 'Hide No LP Pools'}}
              </v-chip>
            </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { store, mutations } from '@/store.js';
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";

export default {
  name: "Settings",
  components: {
    HeaderTopDashboard,
  },
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
    smallValues: {
      get () {
        return store.userData.smallValues;
      },
      set () {
        mutations.toggleSmallValues();
      }
    },
    noLPPools: {
      get () {
        return store.userData.noLPPools;
      },
      set () {
        mutations.toggleNoLPPools();
      }
    },
  },
};
</script>
