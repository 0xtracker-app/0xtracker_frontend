<template>
  <v-navigation-drawer
    width="250"
    fixed
    app
    floating
    :expand-on-hover="mini"
    :value="drawer"
    :dark="darkmode"
  >
    <v-list-item class="pa-0">
      <v-list-item-content class="pa-0">
        <v-list-item-title class="title d-flex align-center mb-0">
          <div class="v-navigation-drawer-brand pa-5 d-flex align-center">
            <img v-if="darkmode" src="@/assets/0xtracker-white.svg" class="w-70" />
            <img v-else src="@/assets/0xtracker-black.svg" class="w-70" />
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
    
    <div class="border-bottom ma-0"></div>

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
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" :class="{'text-white': darkmode}" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <div class="border-bottom-dark ma-0"></div>

    <v-list nav dense>
      <v-list-item-group>
        <v-list-item
          @click="connectWallet()"
          class="pb-1 no-default-hover"
          :ripple="false"
          active-class="item-active"
        >
          <v-list-item-icon>
            <v-icon v-if="provider" v-text="'fas fa-plug v-icon-drawer'" color="green" />
            <v-icon v-else v-text="'fas fa-plug v-icon-drawer'" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-if="provider" :class="{'text-white': darkmode}">Connected: {{ connectedWalletShortened }}</v-list-item-title>
            <v-list-item-title v-else :class="{'text-white': darkmode}">Connect Wallet</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { store, mutations } from "@/store.js";

export default {
  name: "Drawer",
  props: {
    drawer: {
      type: Boolean,
      default: null,
    },
  },
  data: () => ({      
    portfolios: [],
    selectedPortfolio: "",
    mini: false,
    togglerActive: false,
    itemsSimple: [
      {
        icon: "fa-home v-icon-drawer",
        link: "/home",
        title: "Home",
      },
      {
        icon: "fa-piggy-bank v-icon-drawer",
        link: "/portfolio",
        title: "Portfolio",
      },
      {
        icon: "fa-tractor v-icon-drawer",
        link: "/farms",
        title: "Supported Farms",
      },
      {
        icon: "fa-ambulance v-icon-drawer",
        link: "/rekt",
        title: "Rekt?",
      },
      {
        icon: "fa-cog v-icon-drawer",
        link: "/settings",
        title: "Settings",
      },
    ],
  }),
  computed: {
    currentRoute() {
      return this.$route.name;
    },
    darkmode() {
      return store.userData.darkmode;
    },
    provider() {
      if (store?.walletData?.provider) return store?.walletData?.provider;
      else return false;
    },
    connectedWallet() {
      return store.walletData.connectedWallet;
    },
    connectedWalletShortened() {
      return this.connectedWallet.slice(0,6) + '...' + this.connectedWallet.slice(-4);
    }
  },
  watch: {
    "$vuetify.breakpoint.mobile"(val) {
      if (val) this.mini = !val;
    },
  },
  methods: {
    async connectWallet() {
      await mutations.connectWallet();
    },
    minifyDrawer() {
      this.togglerActive = !this.togglerActive;
      this.mini = !this.mini;
      const body = document.getElementsByTagName("body")[0];

      if (body.classList.contains("drawer-mini")) {
        body.classList.remove("drawer-mini");
      } else {
        body.classList.add("drawer-mini");
      }
    },
  },
};
</script>
