<template>
  <v-footer
    padless
    :dark="darkmode"
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-btn
        v-for="link in links"
        :key="link.name"
        text
        rounded
        class="my-2"
        :href="link.url"
      >
        {{ link.name }}
      </v-btn>
      <v-col
        class="lighten-2 py-4 text-center"
        cols="12"
      >
        2021 — <strong>0xTracker</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Footer",
  components: {
  },
  data() {
    return {
      links: [
        {name: 'Twitter', url: 'https://twitter.com/0x_tracker/'},
        {name: 'Telegram', url: 'https://t.me/bsc0xtracker'},
        {name: 'Donate', url: 'https://bscscan.com/address/0xE0d0a6F70f13dB9193a815793242C98C3092a932'},
        {name: 'Bugs/Requests', url: 'https://0xtracker.hellonext.co/roadmap'},
      ],
    }
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    }
  },
};
</script>

<style scoped>
</style>
