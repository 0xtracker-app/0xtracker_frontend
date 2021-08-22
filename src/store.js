import Vue from 'vue';
import Vuex from 'vuex';
import farmStore from '@/store/farmStore';
import generalStore from '@/store/generalStore';
import poolStore from '@/store/poolStore';
import walletStore from '@/store/walletStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    farmStore,
    generalStore,
    poolStore,
    walletStore,
  },
  strict: true,
});