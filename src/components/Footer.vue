<template>
  <div class="d-flex flex-column flex-wrap">
    <SponsorsFooter />

    <template>
      <v-footer color="transparent" class="px-6 mt-16">
        <v-card class="flex" color="transparent">
          <v-card-text class="px-0">
            <v-row>
              <v-col
                cols="12"
                md="6"
                class="d-flex justify-center justify-md-start align-center"
              >
                <div
                  class="copyright text-body-2 ls-0"
                  :style="{ color: darkmode ? 'white' : '#232228' }"
                >
                  <span class="font-weight-regular text-h3 d-flex align-end">
                    <span class="mr-2 text-subtitle-2 font-weight-bold">
                      &copy; {{ new Date().getFullYear() }}
                    </span>
                    <div :style="{ color: darkmode ? 'white' : '#15121D' }">
                      <span class="font-serif">0</span>
                      <span class="font-weight-600">x</span>
                    </div>
                    <span
                      class="font-weight-bold indigo--text text--lighten-1"
                      style="letter-spacing: -2px !important"
                    >
                      Tracker
                    </span>
                  </span>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                class="d-flex justify-center justify-md-end"
              >
                <ul
                  v-for="(item, index) in footer"
                  :key="item.linkName"
                  class="d-flex list-style-none"
                >
                  <li>
                    <a
                      :href="item.link"
                      class="text-decoration-none text-subtitle-2 font-weight-bold ls-0"
                      :style="{ color: darkmode ? 'white' : '#232228' }"
                      :class="{
                        'btn-dark-hover no-default-hover': darkmode,
                      }"
                      target="_blank"
                      v-if="index !== 2"
                    >
                      <span v-if="item.linkName">
                        {{ item.linkName }}
                      </span>
                      <v-icon
                        v-if="item.linkIcon"
                        size="20"
                        :color="darkmode ? 'white' : '#232228'"
                      >
                        {{ item.linkIcon }}
                      </v-icon>
                    </a>
                    <span
                      v-else
                      @click="donateDialog = true"
                      class="text-decoration-none text-subtitle-2 font-weight-bold ls-0"
                      style="cursor: pointer"
                      :style="{ color: darkmode ? 'white' : '#232228' }"
                      :class="{
                        'btn-dark-hover no-default-hover': darkmode,
                      }"
                    >
                      <span v-if="item.linkName">
                        {{ item.linkName }}
                      </span>
                      <v-icon
                        v-if="item.linkIcon"
                        size="20"
                        :color="darkmode ? 'white' : '#232228'"
                      >
                        {{ item.linkIcon }}
                      </v-icon>
                    </span>
                  </li>
                </ul>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-footer>
      <v-dialog
        v-model="donateDialog"
        width="400"
        :overlay-color="darkmode ? 'grey' : 'rgb(33, 33, 33)'"
        :overlay-opacity="darkmode ? 0.2 : 0.46"
      >
        <v-card :dark="darkmode">
          <v-card-title
            class="text-h4 font-weight-bold flex justify-center lighten-2"
          >
            Donate Manually
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text class="py-6 px-6">
            <v-row>
              <v-col cols="12" class="d-flex flex-column align-center">
                <v-select
                  v-model="selectedWallet"
                  :items="donationAddresses"
                  item-text="network"
                  item-value="value"
                  return-object
                  :menu-props="darkmode ? 'dark' : 'light'"
                  dense
                  flat
                  color="white"
                  class="d-flex align-center custom-scrollbar"
                  hide-details
                >
                  <template #selection="{ item }">
                    <div
                      class="d-flex justify-space-between align-center"
                      style="width: 100%"
                    >
                      <span class="font-weight-bold text-subtitle-2">
                        {{ item.network }}
                      </span>
                    </div>
                  </template>
                  <template #item="{ item }">
                    <div
                      class="d-flex justify-space-between align-center"
                      style="width: 100%"
                    >
                      <span class="font-weight-bold text-subtitle-2">
                        {{ item.network }}
                      </span>
                    </div>
                  </template>
                </v-select>

                <vue-qr
                  v-if="selectedWallet"
                  :text="selectedWallet.value"
                  :margin="5"
                  :size="150"
                  logoSrc="./logo.png"
                  class="my-6"
                ></vue-qr>

                <v-text-field
                  v-if="selectedWallet"
                  :value="selectedWallet.value"
                  rounded
                  outlined
                  readonly
                  class="font-size-input placeholder-dark input-alternative input-icon"
                  style="width: 100%"
                  :dark="darkmode"
                  :label="selectedWallet.network + ' Address'"
                >
                  <template v-slot:append>
                    <v-icon color="indigo lighten-1" @click="copyToClipboard()">
                      mdi-clipboard
                    </v-icon>
                  </template>
                </v-text-field>
                <span v-if="copied" style="font-size: 12px">
                  Address copied to clipboard!
                </span>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <!-- <v-card-actions class="pb-4 px-6 flex justify-end items-center">
              <v-btn
                class="text-none text-caption font-weight-bold white--text px-4"
                elevation="0"
                color="indigo lighten-1"
                :block="$vuetify.breakpoint.smAndDown"
                rippple
                @click="saveFilters()"
              >
                <v-icon class="mr-2"> mdi-filter-outline </v-icon>
                Save
              </v-btn>
            </v-card-actions> -->
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import SponsorsFooter from "@/components/SponsorsFooter.vue";
import donationAddresses from "@/data/donationAddresses";
import VueQr from "vue-qr";
import { mapGetters } from "vuex";

export default {
  name: "content-footer",
  components: {
    SponsorsFooter,
    VueQr,
  },
  data() {
    return {
      footer: [
        {
          linkIcon: "mdi-twitter",
          link: "https://twitter.com/0x_tracker/",
        },
        {
          linkIcon: "fab fa-telegram-plane",
          link: "https://t.me/bsc0xtracker",
        },
        {
          linkName: "Donate",
          link:
            "https://bscscan.com/address/0xE0d0a6F70f13dB9193a815793242C98C3092a932",
        },
        {
          linkName: "Bugs/Request",
          link: "https://0xtracker.hellonext.co/roadmap",
        },
      ],
      donateDialog: false,
      selectedWallet: null,
      copied: false,
    };
  },
  mounted() {
    this.selectedWallet = this.donationAddresses[0];
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    donationAddresses() {
      return donationAddresses;
    },
  },
  methods: {
    copyToClipboard() {
      navigator.clipboard.writeText(this.selectedWallet.value);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    },
  },
};
</script>
