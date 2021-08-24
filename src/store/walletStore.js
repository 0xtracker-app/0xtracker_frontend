import Vue from "vue";
import axios from "axios";
import { ethers } from "ethers";

// If we get CORS errors we can override them with this
axios.interceptors.response.use((response) => response, (error) => {
  if (typeof error.response === 'undefined') 'override undefined error response (cors)';
});

const walletStore = {
  namespaced: true,
  state: {
    connectedWallet: '',
    connectedWalletNetwork: '',
    loading: false,
    walletValue: 0,
    wallet: '0x72Dc7f18ff4B59143ca3D21d73fA6e40D286751f',
    walletBalancesList: [],
    walletProvider: {},
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
    SET_CONNECTED_WALLET(state, value) {
      state.connectedWallet = value;
    },
    SET_CONNECTED_WALLET_NETWORK(state, value) {
      state.connectedWalletNetwork = value;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_WALLET(state, value) {
      state.wallet = value;
    },
    SET_WALLET_BALANCES(state, value) {
      Vue.set(state, 'walletBalancesList', value);
    },
    SET_WALLET_PROVIDER(state, value) {
      Vue.set(state, 'walletProvider', value);
    },
    SET_WALLET_VALUE(state, value) {
      state.walletValue = value;
    },
  },
  actions: {
    async addWalletListener({ dispatch }) {
      if (typeof window.ethereum !== 'undefined') {
        try {
          window.ethereum.on('accountsChanged', async (accounts) => {
            console.log("accountsChanged", accounts)
            await dispatch('connectWallet', false);
          })
          window.ethereum.on('chainChanged', async () => {
            console.log("chainChanged", true)
            await dispatch('connectWallet', false);
          })
        } catch (error) {
          console.log('addWalletListener.error', error);
          commit('generalStore/ADD_ALERT', 'Wallet connection failed with error: ' + error.message || error, { root: true });
          Promise.reject(error);
        }
      }
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
    async connectWallet({ commit, dispatch, state }, addListener = true) {
      // Make addListener false if you dont want to add more listeners!
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const networkId = await signer.getChainId();
          const address = await signer.getAddress();
          commit('SET_WALLET_VALUE', address);
          commit('SET_CONNECTED_WALLET', address);
          commit('SET_WALLET_PROVIDER', provider);
          commit('SET_CONNECTED_WALLET_NETWORK', dispatch('networkStore/networkNameFromID', networkId, { root: true }));
          commit('generalStore/ADD_ALERT', 'Wallet connected successfully with address ' + state.connectedWallet + ' and network "' + state.connectedWalletNetwork + '".', { root: true });
          if (addListener) {
            await dispatch('addWalletListener', addListener);
          }
          return Promise.resolve(true);
        } catch (error) {
          console.log('connectWallet.error', error);
          commit('generalStore/ADD_ALERT', 'Wallet connection failed with error: ' + error.message || error, { root: true });
          Promise.reject(error);
        }
      }
    },
    setWallet({ commit }, wallet) {
      commit('SET_WALLET', wallet);
    },
    setWalletValue({ commit }, newValue) {
      commit('SET_WALLET_VALUE', newValue);
    },
  }
};

export default walletStore;
