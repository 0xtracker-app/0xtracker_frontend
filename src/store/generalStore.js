const generalStore = {
  namespaced: true,
  state: {
    alerts: [],
    darkmode: false,
    loading: false,
    noLPPools: true,
    round: true,
    smallValues: true,
    walletDialog: false,
  },
  getters: {
    alerts: state => state.alerts,
    darkmode: state => state.darkmode,
    // TODO: reference all loading states in this loading state
    loading: state => state.loading,
    noLPPools: state => state.noLPPools,
    round: state => state.round,
    smallValues: state => state.smallValues,
    walletDialog: state => state.walletDialog,
  },
  mutations: {
    ADD_ALERT(state, alert) {
      state.alerts.push(alert);
      const timer = window.setInterval(() => {
        if (state.alerts.length > 0) {
          this.commit('generalStore/REMOVE_ALERT', null, { root: true });
        } else {
          window.clearInterval(timer);
        }
      }, 12 * 1000);
    },
    REMOVE_ALERT(state) {
      state.alerts.shift();
    },
    SET_WALLET_DIALOG(state, value) {
      state.walletDialog = value;
    },
    TOGGLE_DARK_MODE(state) {
      state.darkmode = !state.darkmode;
    },
    TOGGLE_NO_LP_POOLS(state) {
      state.noLPPools = !state.noLPPools;
    },
    TOGGLE_ROUNDING(state) {
      state.round = !state.round;
    },
    TOGGLE_SMALL_VALUES(state) {
      state.smallValues = !state.smallValues;
    },
  },
  actions: {
    setWalletDialog({ commit }, value) {
      commit('SET_WALLET_DIALOG', value);
    },
    toggleDarkMode({ commit }) {
      commit('TOGGLE_DARK_MODE');
    },
    toggleNoLPPools({ commit }) {
      commit('TOGGLE_NO_LP_POOLS');
    },
    toggleRounding({ commit }) {
      commit('TOGGLE_ROUNDING');
    },
    toggleSmallValues({ commit }) {
      commit('TOGGLE_SMALL_VALUES');
    },
  }
};

export default generalStore;
