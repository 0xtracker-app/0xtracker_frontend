<template>
  <v-card class="card-shadow mt-6" :dark="darkmode">
    <v-card-text
      class="card-header-padding px-12 text-center font-size-root"
    >
      Check Out Our Sponsors!
    </v-card-text>
    <v-row justify="space-around">
      <div class="text-center">
        <a href="https://iron.finance/" target="_blank" :class="{'text-white': darkmode}">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/iron-finance.gif"
            ></v-img>
          </v-avatar>
          <p>Iron Finance</p>
        </a>
      </div>
      <div class="text-center">
        <a href="https://stablegaj.finance/" target="_blank" :class="{'text-white': darkmode}">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/stablegaj.svg"
            ></v-img>
          </v-avatar>
          <p>StableGaj</p>
        </a>
      </div>
      <div class="text-center">
        <a href="https://www.prismfinance.net/" target="_blank" :class="{'text-white': darkmode}">
          <v-avatar>
            <v-img
              max-height="50"
              max-width="50"
              src="@/assets/images/prism-finance.jpg"
            ></v-img>
          </v-avatar>
          <p>Prism Finance</p>
        </a>
      </div>
    </v-row>
  </v-card>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: 'SponsorsFooter',
  components: {
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
  },
  created() {
    mutations.initStore();
    console.log("Of all existing things some are in our power, and others are not in our power. In our power are thought, impulse, will to get and will to avoid, and, in a word, everything which is our own doing. Things not in our power include the body, property, reputation, office, and, in a word, everything which is not our own doing. Things in our power are by nature free, unhindered, untrammelled; things not in our power are weak, servile, subject to hindrance, dependent on others. Remember then that if you imagine that what is naturally slavish is free, and what is naturally another's is your own, you will be hampered, you will mourn, you will be put to confusion, you will blame gods and men; but if you think that only your own belongs to you, and that what is another's is indeed another's, no one will ever put compulsion or hindrance on you, you will blame none, you will accuse none, you will do nothing against your will, no one will harm you, you will have no enemy, for no harm can touch you.")
  },
};
</script>
