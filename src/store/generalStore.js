import currencies from "@/data/currencies";
import axios from "axios";

const generalStore = {
  namespaced: true,
  state: {
    alerts: [],
    darkmode: false,
    loading: false,
    noLPPools: true,
    round: true,
    smallValues: true,
    version: 5,
    walletDialog: false,
    singleFarmDialog: false,
    singleFarmHistoryDialog: false,
    compactView: false,
    mini: false,
    selectedNetworks: [],
    selectedCurrency: currencies[0],
    currencyRates: {},
  },
  getters: {
    alerts: (state) => state.alerts,
    darkmode: (state) => state.darkmode,
    // TODO: reference all loading states in this loading state
    loading: (state) => state.loading,
    noLPPools: (state) => state.noLPPools,
    round: (state) => state.round,
    smallValues: (state) => state.smallValues,
    walletDialog: (state) => state.walletDialog,
    singleFarmDialog: (state) => state.singleFarmDialog,
    singleFarmHistoryDialog: (state) => state.singleFarmHistoryDialog,
    compactView: (state) => state.compactView,
    mini: (state) => state.mini,
    selectedNetworks: (state) => state.selectedNetworks,
    selectedCurrency: (state) => state.selectedCurrency,
    currencyRates: (state) => state.currencyRates,
  },
  mutations: {
    ADD_ALERT(state, alert) {
      state.alerts.push(alert);
      const timer = window.setInterval(() => {
        if (state.alerts.length > 0) {
          this.commit("generalStore/REMOVE_ALERT", null, { root: true });
        } else {
          window.clearInterval(timer);
        }
      }, 12 * 1000);
    },
    REMOVE_ALERT(state) {
      state.alerts.shift();
    },
    SET_DARK_MODE(state, value) {
      state.darkmode = value;
    },
    SET_NO_LP_POOLS(state, value) {
      state.noLPPools = value;
    },
    SET_ROUNDING(state, value) {
      state.round = value;
    },
    SET_SMALL_VALUES(state, value) {
      state.smallValues = value;
    },
    SET_VERSION(state, value) {
      state.version = value;
    },
    SET_WALLET_DIALOG(state, value) {
      state.walletDialog = value;
    },
    SET_SINGLE_FARM_DIALOG(state, value) {
      state.singleFarmDialog = value;
    },
    SET_SINGLE_FARM_HISTORY_DIALOG(state, value) {
      state.singleFarmHistoryDialog = value;
    },
    SET_COMPACT_VIEW(state, value) {
      state.compactView = value;
    },
    SET_SELECTED_NETWORKS(state, value) {
      state.selectedNetworks = value;
    },
    SET_SELECTED_CURRENCY(state, value) {
      state.selectedCurrency = value;
    },
    SET_CURRENCY_RATES(state, value) {
      state.currencyRates = value;
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
    TOGGLE_COMPACT_VIEW(state) {
      state.compactView = !state.compactView;
    },
    TOGGLE_MINI(state, value = null) {
      if (value !== null) {
        state.mini = value;
      } else {
        state.mini = !state.mini;
      }
    },
  },
  actions: {
    async initStore({ commit, state, rootState }) {
      try {
        commit("SET_SELECTED_NETWORKS", rootState.walletStore.walletNetworks);
        if (localStorage.getItem("store")) {
          const storedStore = JSON.parse(localStorage.getItem("store"));
          if (!storedStore.version || storedStore.version < state.version) {
            localStorage.removeItem("store");
          } else this.dispatch("generalStore/restoreSession", storedStore);
          this.dispatch("generalStore/saveSession");
        } else {
          // Check if system theme is dark
          const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
          if (darkThemeMq.matches) {
            commit("SET_DARK_MODE", true);
          } else {
            commit("SET_DARK_MODE", false);
          }
          this.dispatch("generalStore/saveSession");
        }

        const response = await axios.get(
          `${process.env.VUE_APP_RATES_API_URL}`
        );

        const matchedCurrencies = {};

        if (response.status === 200) {
          for (const key in response.data.usd) {
            const currencyValue = currencies.find(
              (currency) => currency.value.toUpperCase() === key.toUpperCase()
            );
            if (currencyValue) {
              matchedCurrencies[key.toUpperCase()] =
                response.data.usd[key.toLowerCase()];
            }
          }
        }
        commit("SET_CURRENCY_RATES", matchedCurrencies);
      } catch (error) {
        commit(
          "generalStore/ADD_ALERT",
          "An error occurred when attempting to initialise the app. ",
          { root: true }
        );
      }
    },
    restoreSession({ commit }, sessionToRestore) {
      if (sessionToRestore.darkmode)
        commit("SET_DARK_MODE", sessionToRestore.darkmode);
      if (!sessionToRestore.noLPPools)
        commit("SET_NO_LP_POOLS", sessionToRestore.noLPPools);
      if (!sessionToRestore.round)
        commit("SET_ROUNDING", sessionToRestore.round);
      if (!sessionToRestore.smallValues)
        commit("SET_SMALL_VALUES", sessionToRestore.smallValues);
      if (sessionToRestore.version)
        commit("SET_VERSION", sessionToRestore.version);
      // if (sessionToRestore.selectedNetworks) {
      //   if (sessionToRestore.selectedNetworks.length === 0)
      //     commit("SET_SELECTED_NETWORKS", rootState.walletStore.walletNetworks);
      //   else commit("SET_SELECTED_NETWORKS", sessionToRestore.selectedNetworks);
      // }
      if (sessionToRestore.selectedCurrency) {
        commit("SET_SELECTED_CURRENCY", sessionToRestore.selectedCurrency);
      }
      if (sessionToRestore.wallet)
        commit("walletStore/SET_WALLET", sessionToRestore.wallet, {
          root: true,
        });
      if (sessionToRestore.selectedFarms)
        commit("farmStore/SET_SELECTED_FARMS", sessionToRestore.selectedFarms, {
          root: true,
        });
      if (sessionToRestore.compactView)
        commit("SET_COMPACT_VIEW", sessionToRestore.compactView);
      if (sessionToRestore.userProfiles) {
        commit("profileStore/SET_PROFILES", sessionToRestore.userProfiles, {
          root: true,
        });
      }
    },
    setWalletDialog({ commit }, value) {
      commit("SET_WALLET_DIALOG", value);
    },
    setSingleFarmDialog({ commit }, value) {
      commit("SET_SINGLE_FARM_DIALOG", value);
    },
    setSingleFarmHistoryDialog({ commit }, value) {
      commit("SET_SINGLE_FARM_HISTORY_DIALOG", value);
    },
    saveSession({ rootState, state }) {
      const sessionToStore = {
        darkmode: state.darkmode,
        noLPPools: state.noLPPools,
        round: state.round,
        smallValues: state.smallValues,
        version: state.version,
        wallet: rootState.walletStore.wallet,
        selectedFarms: rootState.farmStore.selectedFarms,
        compactView: state.compactView,
        selectedNetworks: state.selectedNetworks,
        selectedCurrency: state.selectedCurrency,
        userProfiles: rootState.profileStore.userProfiles,
      };
      localStorage.setItem("store", JSON.stringify(sessionToStore));
    },
    toggleCompactView({ commit }) {
      commit("TOGGLE_COMPACT_VIEW");
      this.dispatch("generalStore/saveSession");
    },
    toggleDarkMode({ commit }) {
      commit("TOGGLE_DARK_MODE");
      this.dispatch("generalStore/saveSession");
    },
    toggleNoLPPools({ commit }) {
      commit("TOGGLE_NO_LP_POOLS");
      this.dispatch("generalStore/saveSession");
    },
    toggleRounding({ commit }) {
      commit("TOGGLE_ROUNDING");
      this.dispatch("generalStore/saveSession");
    },
    toggleSmallValues({ commit }) {
      commit("TOGGLE_SMALL_VALUES");
      this.dispatch("generalStore/saveSession");
    },
    saveSelectedNetworks({ commit }, networks) {
      commit("SET_SELECTED_NETWORKS", networks);
      // this.dispatch("generalStore/saveSession");
    },
    saveSelectedCurrency({ commit }, currency) {
      commit("SET_SELECTED_CURRENCY", currency);
      this.dispatch("generalStore/saveSession");
    },
    toggleMini({ commit }, value) {
      commit("TOGGLE_MINI", value);
    },
    addAlert({ commit }, alert) {
      commit("ADD_ALERT", alert);
    },
  },
};

export default generalStore;
