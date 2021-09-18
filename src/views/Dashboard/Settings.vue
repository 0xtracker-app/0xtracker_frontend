<template>
  <div>
    <HeaderTopDashboard />
    <v-container class="px-6 mt-n16">
      <v-row>
        <v-col class="mx-auto pt-0" xl="8">
          <v-card class="card-shadow mb-30" :dark="darkmode">
            <v-card-text class="card-padding">
              <v-hover
                v-slot="{ hover }"
                v-for="(settingsOption, key) in settingsOptions"
                :key="key"
              >
                <v-chip
                  class="ma-2"
                  @click="settingsOption.actionMethod"
                  :class="[
                    darkmode ? '' : 'grey--text',
                    hover && !darkmode ? 'text--darken-4' : 'text--darken-1',
                  ]"
                >
                  <v-icon
                    v-if="settingsOption.showCondition"
                    class="pr-1"
                    :class="[
                      darkmode ? '' : 'grey--text',
                      hover && !darkmode ? 'text--darken-4' : 'text--darken-1',
                      key === 1 ? 'yellow--text' : '',
                    ]"
                  >
                    {{ settingsOption.onIcon }}
                  </v-icon>
                  <v-icon v-else class="pr-1">
                    {{ settingsOption.offIcon }}
                  </v-icon>
                  {{ settingsOption.text }}
                </v-chip>
              </v-hover>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="mx-auto pt-0" xl="8">
          <v-card class="card-shadow mb-30" :dark="darkmode">
            <v-card-text class="card-padding">
              <v-card-text>
                <v-chip-group v-if="userProfiles.length > 0" class="mt-6">
                  <v-chip
                    v-for="(profile, key) in userProfiles"
                    :key="key"
                    class="ma-2 no-default-hover"
                    close
                    link
                    :class="[darkmode ? 'btn-dark-hover' : 'btn-light-hover']"
                    :to="`/profiles/${key}/`"
                    @click:close="removeProfile(key)"
                  >
                    <span class="px-2">
                      {{ profile.name }}
                    </span>
                  </v-chip>
                </v-chip-group>
                <v-dialog
                  v-model="dialog"
                  width="500"
                  :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
                  :overlay-opacity="darkmode ? 0.2 : 0.46"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      class="d-flex flex-column align-center"
                      :class="{ 'my-12': userProfiles.length === 0 }"
                    >
                      <div
                        v-if="userProfiles.length === 0"
                        class="d-flex flex-column align-center justify-center text-h3 grey--text mb-4 text-center"
                        :class="[
                          darkmode ? 'text--darken-2' : 'text--lighten-1',
                        ]"
                      >
                        <v-icon
                          size="30"
                          class="grey--text"
                          :class="[
                            darkmode ? 'text--darken-2' : 'text--lighten-1',
                          ]"
                        >
                          mdi-account-off-outline
                        </v-icon>
                        You have no profile yet. Try to create one!
                      </div>
                      <v-btn
                        v-bind="attrs"
                        v-on="on"
                        :absolute="userProfiles.length > 0"
                        :top="userProfiles.length > 0"
                        :right="userProfiles.length > 0"
                        class="text-none"
                      >
                        <v-icon class="mr-2">mdi-plus-thick</v-icon>
                        Add Profile
                      </v-btn>
                    </div>
                  </template>

                  <v-card :dark="darkmode" class="black-shadow">
                    <v-card-title
                      class="text-h4 font-weight-bold flex justify-center lighten-2"
                    >
                      Add Profile
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text>
                      <v-row class="d-flex justify-center mt-6">
                        <v-col cols="12" md="8">
                          <v-text-field
                            placeholder="Enter profile name"
                            class="text-h5"
                            dense
                            v-model="profileName"
                            :counter="10"
                          >
                            <template v-slot:label>
                              <span style="font-size: 14px">Profile Name</span>
                            </template>
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-card-text>

                    <v-card-actions class="pb-4 px-6 flex justify-end">
                      <v-btn
                        class="text-none px-4"
                        elevation="0"
                        :block="$vuetify.breakpoint.smAndDown"
                        rippple
                        :disabled="!profileName"
                        @click="createNewProfile(profileName), (dialog = false)"
                      >
                        <v-icon class="mr-2">mdi-plus-thick</v-icon>
                        Create New Profile
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
import { mapActions, mapGetters } from "vuex";
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";

export default {
  name: "Settings",
  data() {
    return {
      dialog: false,
      profileName: "",
    };
  },
  components: {
    HeaderTopDashboard,
  },
  computed: {
    ...mapGetters("generalStore", [
      "compactView",
      "darkmode",
      "noLPPools",
      "round",
      "smallValues",
    ]),
    ...mapGetters("profileStore", ["userProfiles"]),
    settingsOptions() {
      return [
        {
          actionMethod: this.toggleCompactView,
          showCondition: this.compactView,
          onIcon: "mdi-view-list",
          offIcon: "mdi-view-compact",
          text: `${this.compactView ? "List View" : "Card View"} Mode`,
        },
        {
          actionMethod: this.toggleDarkMode,
          showCondition: this.darkmode,
          onIcon: "mdi-weather-night",
          offIcon: "mdi-weather-sunny",
          text: `${this.darkmode ? "Dark" : "Light"} Mode`,
        },
        {
          actionMethod: this.toggleRounding,
          showCondition: this.round,
          onIcon: "mdi-decimal",
          offIcon: "mdi-decimal-increase",
          text: `${this.round ? "Rounded" : "No Rounding"}`,
        },
        {
          actionMethod: this.toggleSmallValues,
          showCondition: this.smallValues,
          onIcon: "mdi-less-than",
          offIcon: "mdi-greater-than",
          text: `${this.smallValues ? "Small" : "No Small"} Values`,
        },
        {
          actionMethod: this.toggleNoLPPools,
          showCondition: this.noLPPools,
          onIcon: "mdi-water-plus",
          offIcon: "mdi-water-minus",
          text: `${this.noLPPools ? "Empty" : "No Empty"} Pools`,
        },
      ];
    },
  },
  methods: {
    ...mapActions("generalStore", [
      "toggleCompactView",
      "toggleDarkMode",
      "toggleNoLPPools",
      "toggleRounding",
      "toggleSmallValues",
    ]),
    ...mapActions("profileStore", ["createProfile", "removeProfile"]),
    createNewProfile(profileName) {
      this.createProfile(profileName).then(() => {
        this.$router.push({
          name: "Edit Profile",
          params: {
            id: this.userProfiles.length - 1,
          },
        });
      });
    },
  },
};
</script>

<style lang="scss">
.v-dialog {
  box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
    0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);
}
</style>
