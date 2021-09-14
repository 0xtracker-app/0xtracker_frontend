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
                @click="toggleCompactView"
              >
                <v-icon v-if="compactView" class="pr-1">mdi-view-list</v-icon>
                <v-icon v-else class="pr-1">mdi-view-compact</v-icon>
                {{ compactView ? 'List View' : 'Card View' }} Mode
              </v-chip>
              <v-chip
                class="ma-2"
                @click="toggleDarkMode"
              >
                <v-icon v-if="darkmode" class="pr-1">mdi-weather-night</v-icon>
                <v-icon v-else class="pr-1">mdi-weather-sunny</v-icon>
                {{ darkmode ? 'Dark' : 'Light' }} Mode
              </v-chip>
              <v-chip
                class="ma-2"
                @click="toggleRounding"
              >
                <v-icon v-if="round" class="pr-1">mdi-decimal</v-icon>
                <v-icon v-else class="pr-1">mdi-decimal-increase</v-icon>
                {{ round ? 'Rounded' : 'No Rounding'}}
              </v-chip>
              <v-chip
                class="ma-2"
                @click="toggleSmallValues"
              >
                <v-icon v-if="smallValues" class="pr-1">mdi-less-than</v-icon>
                <v-icon v-else class="pr-1">mdi-greater-than</v-icon>
                {{ smallValues ? 'Small Values' : 'No Small Values'}}
              </v-chip>
              <v-chip
                class="ma-2"
                @click="toggleNoLPPools"
              >
                <v-icon v-if="noLPPools" class="pr-1">mdi-water-plus</v-icon>
                <v-icon v-else class="pr-1">mdi-water-minus</v-icon>
                {{ noLPPools ? 'Empty Pools' : 'No Empty Pools'}}
              </v-chip>
            </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mx-auto pt-0" lg="8">
          <v-card class="card-shadow mb-30" :dark="darkmode">
            <v-card-text class="card-padding">
            <v-card-text>
              <v-chip-group>
              <v-chip
                v-for="(profile, key) in userProfiles" :key="key"
                class="ma-2"
                close
                link
                :to="`/profiles/${key}/`"
                @click:close="removeProfile(key)">
                {{profile.name}}
              </v-chip>
              
              </v-chip-group>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
        >
          Add Profile
        </v-btn>
      </template>

      <v-card :dark="darkmode">
        <v-card-title class="text-h5 lighten-2">
          Add Profile
        </v-card-title>

        <v-card-text>
                <v-row>
        <v-col
          cols="1"
          md="4"
        >
          <v-text-field
            v-model="profileName"
            :counter="10"
            label="Profile Name"
          ></v-text-field>
        </v-col>
                </v-row>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="createProfile(profileName), dialog=false"
          >
            Add New Profile
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
            </v-card-text>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";

export default {
  name: "Settings",
  data () {
      return {
        dialog: false,
        profileName: ''
      }
    },
  components: {
    HeaderTopDashboard,
  },
  computed: {
    ...mapGetters('generalStore', ['compactView', 'darkmode', 'noLPPools', 'round', 'smallValues']),
    ...mapGetters('profileStore', ['userProfiles']),
  },
  methods: {
    ...mapActions('generalStore', ['toggleCompactView', 'toggleDarkMode', 'toggleNoLPPools', 'toggleRounding', 'toggleSmallValues']),
    ...mapActions('profileStore', ['createProfile', 'removeProfile']),
  }
};
</script>
