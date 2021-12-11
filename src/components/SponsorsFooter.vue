<template>
  <div class="px-3">
    <v-container>
      <div class="mb-6">
        <div class="card-header-padding card-border-bottom mb-5">
          <p
            class="font-weight-bold text-h2 text-uppercase mb-0 text-center"
            :style="{ color: darkmode ? 'white' : '#15121D' }"
          >
            Check Out Our Sponsors!
          </p>
        </div>
        <v-row align="center" justify="center" no-gutters style="height: 100px">
          <div class="text-center font-weight-bold" style="min-width: 150px">
            <a href="https://jetswap.finance/" target="_blank">
              <v-avatar>
                <v-img
                  max-height="50"
                  max-width="50"
                  src="@/assets/images/sponsors-footer/jetswap.png"
                ></v-img>
              </v-avatar>
              <p
                :style="{ color: darkmode ? 'white' : '#5C6BC0' }"
                class="mt-2 font-weight-bold text-subtitle-2"
              >
                Jetswap
              </p>
            </a>
          </div>
          <div class="text-center font-weight-bold" style="min-width: 150px">
            <a
              href="https://dao.hunny.finance/?utm_source=0xtracker.app&utm_medium=logo&utm_campaign=fairlaunch"
              target="_blank"
            >
              <v-avatar>
                <v-img
                  max-height="50"
                  max-width="50"
                  src="@/assets/images/sponsors-footer/hunny.gif"
                ></v-img>
              </v-avatar>
              <p
                :style="{ color: darkmode ? 'white' : '#5C6BC0' }"
                class="mt-2 font-weight-bold text-subtitle-2"
              >
                Hunny Finance
              </p>
            </a>
          </div>
          <div class="text-center font-weight-bold" style="min-width: 150px">
            <a href="https://www.thegrandbanks.finance/" target="_blank">
              <v-avatar>
                <v-img
                  max-height="50"
                  max-width="50"
                  src="@/assets/images/sponsors-footer/grand.png"
                ></v-img>
              </v-avatar>
              <p
                :style="{ color: darkmode ? 'white' : '#5C6BC0' }"
                class="mt-2 font-weight-bold text-subtitle-2"
              >
                The Grand Banks
              </p>
            </a>
          </div>
          <div class="text-center font-weight-bold" style="min-width: 150px">
            <a href="https://www.wagmidao.io/" target="_blank">
              <v-avatar>
                <v-img
                  max-height="50"
                  max-width="50"
                  src="@/assets/images/sponsors-footer/wagmi.svg"
                ></v-img>
              </v-avatar>
              <p
                :style="{ color: darkmode ? 'white' : '#5C6BC0' }"
                class="mt-2 font-weight-bold text-subtitle-2"
              >
                WagmiDAO
              </p>
            </a>
          </div>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: () => ({
    alignments: ["start", "center", "end"],
  }),
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
>
