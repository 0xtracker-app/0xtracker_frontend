<template>
  <v-container fluid class="pt-0 px-6 mt-n13">
    <v-row class="mt-0">
      <v-col cols="12" lg="12" class="pt-6">
        <v-card class="card-shadow mb-6" :dark="darkmode">
          <div class="card-header-padding card-border-bottom">
            <p class="font-weight-600 text-h3 mb-0 text-center" :class="{'text-muted': !darkmode}">
              Check Out Our Sponsors!
            </p>
          </div>
          <v-card-text class="pt-10">
            <v-row justify="space-around">
              <div class="text-center">
                <a href="https://jetswap.finance/" target="_blank">
                  <v-avatar>
                    <v-img
                      max-height="50"
                      max-width="50"
                      src="@/assets/images/sponsors-footer/jetswap.png"
                    ></v-img>
                  </v-avatar>
                  <p :class="{'text-white': darkmode}">Jetswap</p>
                </a>
              </div>
              <div class="text-center">
                <a href="https://iron.finance/" target="_blank">
                  <v-avatar>
                    <v-img
                      max-height="50"
                      max-width="50"
                      src="@/assets/images/sponsors-footer/iron-finance.gif"
                    ></v-img>
                  </v-avatar>
                  <p :class="{'text-white': darkmode}">Iron Finance</p>
                </a>
              </div>
              <div class="text-center">
                <a href="http://kogefarm.io/" target="_blank">
                  <v-avatar>
                    <v-img
                      max-height="50"
                      max-width="50"
                      src="@/assets/images/sponsors-footer/koge.png"
                    ></v-img>
                  </v-avatar>
                  <p :class="{'text-white': darkmode}">Koge Farm</p>
                </a>
              </div>
            </v-row>
            <v-row justify="space-around">
              <div class="text-center">
                <a href="https://bundledao.org/" target="_blank">
                  <v-avatar>
                    <v-img
                      max-height="50"
                      max-width="50"
                      src="@/assets/images/sponsors-footer/bundle.svg"
                    ></v-img>
                  </v-avatar>
                  <p :class="{'text-white': darkmode}">Bundle</p>
                </a>
              </div>
              <div class="text-center">
                <a href="https://shibanova.io/" target="_blank">
                  <v-avatar>
                    <v-img
                      max-height="50"
                      max-width="50"
                      src="@/assets/images/sponsors-footer/coin.png"
                    ></v-img>
                  </v-avatar>
                  <p :class="{'text-white': darkmode}">ShibaNova</p>
                </a>
              </div>
              <div class="text-center">
                <a href="https://timeleap.finance/" target="_blank">
                  <v-avatar>
                    <v-img
                      max-height="50"
                      max-width="50"
                      src="@/assets/images/sponsors-footer/timeleap.gif"
                    ></v-img>
                  </v-avatar>
                  <p :class="{'text-white': darkmode}">Timeleap</p>
                </a>
              </div>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SponsorsFooter',
  components: {
  },
  computed: {
    ...mapGetters('generalStore', ['darkmode']),
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>>
