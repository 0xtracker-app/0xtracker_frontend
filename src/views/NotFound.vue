<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-card
          :dark="darkmode"
          class="mx-auto pb-1"
          outlined
        >
          <v-card-text>
            <p class="display-1 mb-5 text-center">
              The page you are looking for doesn't exist...
            </p>
            <v-row
              align="center"
              justify="space-around"
            >
              <v-btn color="primary" :to="{ name: 'Home' }">
                <v-icon left>
                  mdi-home
                </v-icon>
                Go Home
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <Sponsors />
    </v-row>
  </div>
</template>

<script>
import { store } from '@/store.js';
import Sponsors from "@/components/Sponsors.vue";

export default {
  name: "NotFound",
  components: {
    Sponsors,
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
  },
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' })
    }
  },
};
</script>
