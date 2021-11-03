<template>
  <div class="mt-12">
    <v-container class="px-6">
      <v-row>
        <v-col class="mx-auto pt-0" xl="12">
          <v-dialog
            v-model="dialog"
            width="500"
            :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
            :overlay-opacity="darkmode ? 0.2 : 0.46"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                v-if="userProfiles.length === 0"
                class="d-flex flex-column align-center"
                :class="{ 'my-12': userProfiles.length === 0 }"
              >
                <div
                  class="d-flex flex-column align-center justify-center text-h4 mb-4 text-center"
                  :class="[
                    darkmode ? 'white--text' : 'grey--text text--darken-2',
                  ]"
                >
                  <v-icon
                    size="30"
                    :class="[
                      darkmode ? 'white--text' : 'grey--text text--darken-2',
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
                  class="text-none text-caption font-weight-bold white--text"
                  elevation="0"
                  color="indigo lighten-1"
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
                  class="text-none px-4 text-caption font-weight-bold white--text"
                  elevation="0"
                  color="indigo lighten-1"
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
          <v-row v-if="userProfiles.length > 0" class="d-flex">
            <v-col
              v-for="(profile, key) in userProfiles"
              :key="key"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
              class="flex-grow-1"
            >
              <v-card
                @click="$router.replace(`/profiles/${key}/`)"
                :dark="darkmode"
                flat
                class="profile-card fill-height"
                :ripple="false"
                :style="{
                  filter: darkmode
                    ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
                    : '',
                }"
              >
                <v-card-title class="d-flex flex-column">
                  <v-btn
                    @click.stop="removeProfile(key)"
                    icon
                    class="text-caption text-none font-weight-bold ml-auto"
                    :class="[darkmode ? 'white--text' : 'grey--text']"
                    elevation="0"
                    small
                    :dark="darkmode"
                    circle
                  >
                    <v-icon size="16"> mdi-close-thick </v-icon>
                  </v-btn>
                </v-card-title>
                <v-card-text
                  class="text-center pb-10 text-h3 font-weight-bold"
                  :class="[darkmode ? 'white--text' : 'grey--text']"
                >
                  {{ profile.name }}
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="flex-grow-1">
              <v-card
                @click="dialog = true"
                :dark="darkmode"
                :style="{
                  border: darkmode ? '3px dashed #5C6BC0' : '3px dashed grey',
                }"
                :ripple="false"
                style="background-color: transparent"
                class="fill-height d-flex justify-center align-center"
              >
                <v-card-text
                  class="text-center font-weight-600 text-h3 d-flex flex-column"
                  :class="[darkmode ? 'white--text' : 'grey--text']"
                >
                  <v-icon size="30">mdi-plus</v-icon>
                  Create new
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Profiles",
  data() {
    return {
      dialog: false,
      profileName: "",
    };
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
  border-radius: 28px;
}

.v-card--link:focus:before {
  opacity: 0;
}

.profile-card:focus::after {
  opacity: 0 !important;
}
</style>
