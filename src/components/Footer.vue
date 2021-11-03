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
                  v-for="item in footer"
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
                  </li>
                </ul>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-footer>
    </template>
  </div>
</template>

<script>
import SponsorsFooter from "@/components/SponsorsFooter.vue";
import { mapGetters } from "vuex";

export default {
  name: "content-footer",
  components: {
    SponsorsFooter,
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
    };
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
  },
};
</script>
