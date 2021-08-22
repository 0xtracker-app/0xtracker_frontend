import Vue from "vue";
import axios from "axios";

const walletStore = {
  namespaced: true,
  state: {
    loading: false,
    walletValue: 0,
    wallet: '0x72Dc7f18ff4B59143ca3D21d73fA6e40D286751f',
    walletBalancesList: [],
    walletRules: [
      value => !!value || 'Required.',
      value => (value && value.length >= 3) || 'Min 3 characters.',
    ],
  },
  getters: {
    wallet: state => state.wallet,
    walletRules: state => state.walletRules,
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_WALLET(state, wallet) {
      state.wallet = wallet;
    },
    SET_WALLET_BALANCES(state, newValue) {
      Vue.set(state, 'walletBalancesList', newValue);
    },
    SET_WALLET_VALUE(state, newValue) {
      state.walletValue = newValue;
    },
  },
  actions: {
    setWallet({ commit }, wallet) {
      commit('SET_WALLET', wallet);
    },
    setWalletValue({ commit }, newValue) {
      commit('SET_WALLET_VALUE', newValue);
    },
    async loadWallet({ commit, state }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_WALLET_BALANCES', []);
        const requestBody = {
          wallet : state.wallet,
        }
        const response = await axios.post(process.env.VUE_APP_MYBALANCES_URL, requestBody);
        if (!response || !response.data || response.data.error) throw `No wallet data returned, you might need to retry.`;
        commit('SET_WALLET_BALANCES', response.data);
        commit('SET_LOADING', false);
      } catch (error) {
        commit('generalStore/ADD_ALERT', error, { root: true });
        commit('SET_LOADING', false);
      }
    },
  }
};

export default walletStore;
