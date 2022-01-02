<template>
  <v-navigation-drawer
    width="250"
    fixed
    app
    floating
    :mini-variant="mini"
    :value="drawer"
    :dark="darkmode"
    :style="{
      backgroundColor: $vuetify.breakpoint.mobile
        ? darkmode
          ? '#232228'
          : '#f3f4fd'
        : 'transparent',
      boxShadow: $vuetify.breakpoint.mobile
        ? 'black -20px 0px 50px !important'
        : 'none !important',
    }"
  >
    <div class="flex-column d-flex fill-height justify-space-between py-6">
      <div>
        <v-list-item class="pa-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title
              class="title d-flex justify-space-between align-center mb-0"
            >
              <div class="v-navigation-drawer-brand pa-5 d-flex align-center">
                <h1 class="font-weight-regular text-h1 d-flex">
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
                </h1>
              </div>

              <div
                v-if="!$vuetify.breakpoint.mobile"
                class="drawer-toggler pa-5 cursor-pointer"
                :class="{ active: togglerActive }"
                @click="minifyDrawer"
              >
                <div class="drawer-toggler-inner">
                  <i class="drawer-toggler-line bg-primary"></i>
                  <i class="drawer-toggler-line bg-primary"></i>
                  <i class="drawer-toggler-line bg-primary"></i>
                </div>
              </div>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <div class="d-flex flex-column justify-space-between mt-10">
          <v-list nav dense>
            <v-list-item-group>
              <v-list-item
                v-for="(item, i) in itemsSimple"
                :key="i"
                link
                :to="item.link"
                class="pb-1 no-default-hover"
                :ripple="false"
                active-class="item-active"
              >
                <v-list-item-icon :class="{ 'px-2': !mini }">
                  <v-icon size="25" v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.title"
                    :class="{ 'text-white': darkmode }"
                    class="font-weight-600"
                  />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-divider class="mx-2"> </v-divider>

          <v-list nav dense>
            <v-list-item-group>
              <v-list-item
                @click="setWalletDialog(true)"
                class="pb-1 no-default-hover"
                :ripple="false"
              >
                <v-list-item-icon :class="{ 'px-2': !mini }">
                  <v-icon
                    v-if="connectedWallet"
                    size="20"
                    v-text="'fas fa-plug v-icon-drawer'"
                    color="green"
                  />
                  <v-icon
                    v-else
                    size="20"
                    v-text="'fas fa-plug v-icon-drawer'"
                  />
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    v-if="connectedWallet"
                    :class="{ 'text-white': darkmode }"
                    class="font-weight-600"
                  >
                    Connected: {{ connectedWalletShort }}
                  </v-list-item-title>
                  <v-list-item-title
                    v-else
                    :class="{ 'text-white': darkmode }"
                    class="font-weight-600"
                  >
                    Connect Wallet
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <WalletConnectDialog />
            </v-list-item-group>
          </v-list>
        </div>
      </div>

      <div class="d-flex flex-column">
        <div class="mx-2 mt-10 mb-4 d-flex flex-column justify-center">
          <span
            style="font-size: 12px"
            class="font-weight-600"
            :class="[darkmode ? 'white--text' : 'grey--text text--darken-3']"
          >
            Currency:
          </span>
          <v-select
            v-model="currency"
            :items="currencies"
            item-text="value"
            item-value="value"
            return-object
            :menu-props="darkmode ? 'dark' : 'light'"
            dense
            outlined
            flat
            color="white"
            class="d-flex align-center custom-scrollbar"
            hide-details
            @change="saveSelectedCurrency(currency)"
          >
            <template #selection="{ item }">
              <div
                class="d-flex justify-space-between align-center"
                style="width: 100%"
              >
                <span class="font-weight-bold">
                  {{ item.symbol }}
                </span>
                {{ item.value }}
              </div>
            </template>
            <template #item="{ item }">
              <div
                class="d-flex justify-space-between align-center"
                style="width: 100%"
              >
                <span class="font-weight-bold">
                  {{ item.symbol }}
                </span>
                {{ item.value }}
              </div>
            </template>
          </v-select>
        </div>
        <div
          v-if="!mini"
          class="mx-2 px-6 py-4 rounded-lg d-flex flex-column text-caption font-weight-600 text-center"
          :style="{ backgroundColor: darkmode ? '#232228' : '#f3f4fd' }"
          :class="[darkmode ? 'white--text' : 'grey--text text--darken-3']"
        >
          <v-icon size="50" color="indigo lighten-1" class="mb-2">
            mdi-face-agent
          </v-icon>
          Found some bugs? Reach out to the developers!
          <a
            href="https://0xtracker.hellonext.co/roadmap"
            target="_blank"
            class="text-decoration-none"
          >
            <v-btn
              small
              outlined
              color="indigo lighten-1"
              class="text-none text-caption font-weight-bold mt-6"
            >
              Report/Request
            </v-btn>
          </a>
        </div>
        <v-list v-else nav dense>
          <v-list-item-group>
            <v-list-item
              href="https://0xtracker.hellonext.co/roadmap"
              target="_blank"
              class="pb-1 no-default-hover"
              :ripple="false"
            >
              <v-list-item-icon>
                <v-icon size="30" color="indigo lighten-1" class="mb-2">
                  mdi-face-agent
                </v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import WalletConnectDialog from "@/components/Wallet/WalletConnectDialog";
import currencies from "@/data/currencies";

export default {
  components: {
    WalletConnectDialog,
  },
  props: {
    drawer: {
      type: Boolean,
      default: null,
    },
  },
  data: () => ({
    togglerActive: false,
    itemsSimple: [
      {
        icon: "mdi-piggy-bank-outline v-icon-drawer",
        link: "/portfolio",
        title: "Portfolio",
      },
      {
        icon: "mdi-tractor-variant v-icon-drawer",
        link: "/farms",
        title: "Supported Farms",
      },
      {
        icon: "mdi-ambulance v-icon-drawer",
        link: "/rev0x",
        title: "Rev0x",
      },
      {
        icon: "mdi-account-search-outline v-icon-drawer",
        link: "/profiles",
        title: "Profiles",
      },
      {
        icon: "mdi-ambulance v-icon-drawer",
        link: "/signer",
        title: "Message Signer",
      },
    ],
    miniData: false,
    currency: null,
  }),
  computed: {
    currentRoute() {
      return this.$route.name;
    },
    ...mapGetters("generalStore", ["darkmode", "mini", "selectedCurrency"]),
    ...mapGetters("walletStore", ["connectedWallet", "connectedWalletShort"]),
    currencies() {
      return currencies;
    },
  },
  watch: {
    miniData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.toggleMini(val);
      },
    },
    "$vuetify.breakpoint.mobile"(val) {
      if (val) {
        this.toggleMini(false);
        this.miniData = false;
      }
      const body = document.getElementsByTagName("body")[0];
      if (body.classList.contains("drawer-mini") && val) {
        body.classList.remove("drawer-mini");
      } else {
        if (this.miniData && !body.classList.contains("drawer-mini")) {
          body.classList.add("drawer-mini");
        }
      }
    },
  },
  mounted() {
    this.currency = this.selectedCurrency;
  },
  methods: {
    ...mapActions("generalStore", [
      "setWalletDialog",
      "toggleMini",
      "saveSelectedCurrency",
    ]),
    ...mapActions("walletStore", ["connectWallet"]),
    minifyDrawer() {
      this.togglerActive = !this.togglerActive;
      this.toggleMini();
      this.miniData = true;
      const body = document.getElementsByTagName("body")[0];

      if (!this.$vuetify.breakpoint.mobile) {
        if (body.classList.contains("drawer-mini")) {
          body.classList.remove("drawer-mini");
        } else {
          body.classList.add("drawer-mini");
        }
      }
    },
  },
};
</script>

<style>
.v-menu__content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f51c;
}

.v-menu__content::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f51c;
}

.v-menu__content::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #5e72e4;
}
</style>
