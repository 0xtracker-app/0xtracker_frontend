<template>
  <v-app :class="{darkmode: darkmode}">
    <Nav />
    <v-main>
      <Banner />
      <v-container :fluid="width === 1 ? true : false" :class="{slim: width === 2}">
        <Alert />
        <router-view />
      </v-container>
    </v-main>
    <SettingsToggle />
    <SettingsDialog />
    <Footer />
  </v-app>
</template>

<script>
import { store, mutations } from '@/store.js';

import Nav from "@/components/Nav.vue";
import Banner from "@/components/Banner.vue";
import Alert from "@/components/Alert.vue";
import SettingsToggle from "@/components/SettingsToggle.vue";
import SettingsDialog from "@/components/SettingsDialog.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: 'App',
  components: {
    Nav,
    Banner,
    Alert,
    SettingsToggle,
    SettingsDialog,
    Footer,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    width() {
      return store.userData.width;
    },
  },
  created() {
    mutations.initStore();
    console.log("Of all existing things some are in our power, and others are not in our power. In our power are thought, impulse, will to get and will to avoid, and, in a word, everything which is our own doing. Things not in our power include the body, property, reputation, office, and, in a word, everything which is not our own doing. Things in our power are by nature free, unhindered, untrammelled; things not in our power are weak, servile, subject to hindrance, dependent on others. Remember then that if you imagine that what is naturally slavish is free, and what is naturally another's is your own, you will be hampered, you will mourn, you will be put to confusion, you will blame gods and men; but if you think that only your own belongs to you, and that what is another's is indeed another's, no one will ever put compulsion or hindrance on you, you will blame none, you will accuse none, you will do nothing against your will, no one will harm you, you will have no enemy, for no harm can touch you.")
  },
};
</script>

<style>
.darkmode {
  background-color: #383838 !important;
}

.slim {
  max-width: 760px !important;
}
</style>