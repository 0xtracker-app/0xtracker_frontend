const generalStore = {
  namespaced: true,
  state: {
    alerts: [],
    darkmode: false,
    loading: false,
    noLPPools: true,
    round: true,
    smallValues: true,
  },
  getters: {
    darkmode: state => state.darkmode,
    // TODO: reference all loading states in this loading state
    loading: state => state.loading,
    noLPPools: state => state.noLPPools,
    round: state => state.round,
    smallValues: state => state.smallValues,
  },
  mutations: {
    ADD_ALERT(state, alert) {
      state.alerts.push(alert);
      const timer = window.setInterval(() => {
        if (state.alerts.length > 0) {
          state.alerts.shift();
        } else {
          window.clearInterval(timer);
        }
      }, 12 * 1000);
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
