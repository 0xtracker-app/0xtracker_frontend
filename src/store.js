import Vue from 'vue';
import Vuex from 'vuex';
import farmStore from '@/store/farmStore';
import generalStore from '@/store/generalStore';
import networkStore from '@/store/networkStore';
import poolStore from '@/store/poolStore';
import walletStore from '@/store/walletStore';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    farmStore,
    generalStore,
    networkStore,
    poolStore,
    walletStore,
  },
  strict: true,
});
