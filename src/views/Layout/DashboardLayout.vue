<template>
  <v-app>
    <drawer :drawer="drawer" style="z-index: 7"></drawer>
    <v-main :class="[darkmode ? 'darkmodebg' : 'lightmodebg']">
      <div class="mx-md-4">
        <div @click="drawer = false" v-if="drawer" class="drawer-state"></div>
        <app-bar
          background="transparent"
          linkColor="rgba(0,0,0,.6)"
          @drawer-toggle="drawer = !drawer"
          :toggle-active="drawer"
        ></app-bar>
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <div style="margin-top: 65px" id="scroll-reference">
            <div
              style="border-radius: 8px"
              class="pa-xl-12 pa-md-6 pa-2 mb-4 text-subtitle-2 text-center announcement-banner"
            >
              <span class="mr-2">
                0xTracker.app &#38; Optical.finance announce strategic
                partnership. More info soon
              </span>
              <v-btn
                class="text-subtitle-2 text-none font-weight-regular black--text"
                elevation="0"
                href="https://t.me/bsc0xtracker"
                small
                :dark="darkmode"
                target="_blank"
                color="white"
              >
                Learn more
              </v-btn>
            </div>
            <div
              style="border-radius: 28px; min-height: 90vh"
              :style="{ backgroundColor: darkmode ? '#232228' : '#f3f4fd' }"
              class="pa-xl-12 pa-md-6 pa-2"
            >
              <HeaderTopDashboard :show-refresh="$route.name === 'Portfolio'">
              </HeaderTopDashboard>
              <router-view></router-view>
            </div>
          </div>
        </fade-transition>
        <Footer v-if="!$route.meta.hideFooter" />
        <v-snackbar :value="alerts.length" :timeout="-1">
          <template v-for="(alert, index) in alerts">
            <p :key="index">{{ alert }}</p>
          </template>
        </v-snackbar>
      </div>
    </v-main>
  </v-app>
</template>

<script>
// /* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import { mapGetters } from "vuex";
import { FadeTransition } from "vue2-transitions";
import Drawer from "@/components/Drawer.vue";
import AppBar from "@/components/AppBar.vue";
import Footer from "@/components/Footer.vue";
import HeaderTopDashboard from "@/components/HeaderTopDashboard.vue";

export default {
  components: {
    Footer,
    FadeTransition,
    Drawer,
    AppBar,
    HeaderTopDashboard,
  },
  data() {
    return {
      drawer: null,
    };
  },
  computed: {
    ...mapGetters("generalStore", ["alerts", "darkmode"]),
  },
  methods: {
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    },
  },
  watch: {
    "$vuetify.breakpoint.mobile": {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val) this.drawer = true;
        else this.drawer = false;
      },
    },
  },
  mounted() {
    this.initScrollbar();
    document.body.classList.add(
      this.darkmode ? "dark-scrollbar" : "light-scrollbar"
    );
  },
};
</script>

<style lang="scss">
.darkmodebg {
  background-color: #0c0b10 !important;
}

.lightmodebg {
  background-color: #ebebf5 !important;
}

.dark-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #232228;
}

.dark-scrollbar::-webkit-scrollbar {
  width: 10px;
  background-color: #232228;
}

.dark-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #5c6bc0;
}

.light-scrollbar::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f3f4fd;
}

.light-scrollbar::-webkit-scrollbar {
  width: 10px;
  background-color: #f3f4fd;
}

.light-scrollbar::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.3);
  background-color: #5e72e4;
}

.announcement-banner {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
