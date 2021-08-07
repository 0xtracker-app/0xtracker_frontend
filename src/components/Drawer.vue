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
      <v-list-item
          class="pb-1 no-default-hover"
          :class="{'item-active' : address != ''}"
          :ripple="false"
      >
          <v-list-item-icon>
            <v-icon class="fa fa-wallet v-icon-drawer"></v-icon>
          </v-list-item-icon>

          <v-list-item-content v-if="address == ''">
            <v-list-item-title :class="{'text-white': darkmode}"  v-on:click="connectWallet">Connect Wallet</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content v-else>
            <v-list-item-title :class="{'text-white': darkmode}"  v-on:click="connectWallet">[{{ address }}]</v-list-item-title>
          </v-list-item-content>

            <span style="font-weight: bold" ></span>
      </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import { store, mutations } from "@/store.js";
import { ethers } from "ethers";

export default {
  name: "Drawer",
  props: {
    drawer: {
      type: Boolean,
      default: null,
    },
  },
  data: () => ({      
    address: "",
    response: "",
    portfolios: [],
    selectedPortfolio: "",
    mini: false,
    togglerActive: false,
    itemsDocs: [],
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
  },
  watch: {
    "$vuetify.breakpoint.mobile"(val) {
      if (val) this.mini = !val;
    },
  },
  methods: {
    async connectWallet() {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })

          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner()
          const network = await signer.getChainId()
          const address = await signer.getAddress()
          console.log('connected: ',this.address)
          mutations.setProvider(provider)
          print(store.WalletData.provider.isProvider())
        } catch (err) {
          console.log(err.message)
        }
      }
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
