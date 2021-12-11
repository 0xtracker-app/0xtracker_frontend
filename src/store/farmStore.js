import Vue from "vue";
import axios from "axios";

// If we get CORS errors we can override them with this
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof error.response === "undefined")
      "override undefined error response (cors)";
  }
);

const farmStore = {
  namespaced: true,
  state: {
    farmRules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 1) || "Min 1 farm.",
    ],
    farms: [],
    cosmosFarms: [],
    solFarms: [],
    terraFarms: [],
    farmsWithData: {},
    filteredFarmsWithData: {},
    farmsWithoutData: {},
    lendingFarms: [],
    loading: false,
    selectedFarms: [],
    farmsValue: 0,
  },
  getters: {
    farms: (state) => state.farms,
    cosmosFarms: (state) => state.cosmosFarms,
    solFarms: (state) => state.solFarms,
    terraFarms: (state) => state.terraFarms,
    selectedFarms: (state) => state.selectedFarms,
    farmRules: (state) => state.farmRules,
    lendingFarms: (state) => state.lendingFarms,
  },
  mutations: {
    SET_FARMS(state, farms) {
      state.farms = farms;
    },
    SET_COSMOS_FARMS(state, farms) {
      state.cosmosFarms = farms.filter(function (el) {
        return el.network == "cosmos";
      });
    },
    SET_SOL_FARMS(state, farms) {
      state.solFarms = farms.filter(function (el) {
        return el.network == "solana";
      });
    },
    SET_TERRA_FARMS(state, farms) {
      state.terraFarms = farms.filter(function (el) {
        return el.network == "terra";
      });
    },
    SET_FARMS_VALUE(state, newValue) {
      state.farmsValue = newValue;
    },
    ADD_TO_FARMS_WITH_DATA(state, { key, value }) {
      Vue.set(state.farmsWithData, key, value);
    },
    ADD_TO_FARMS_WITHOUT_DATA(state, { key, value }) {
      Vue.set(state.farmsWithoutData, key, value);
    },
    ADD_TO_FILTERED_FARMS_WITH_DATA(state, { key, value }) {
      Vue.set(state.filteredFarmsWithData, key, value);
    },
    REMOVE_FROM_FARMS_WITH_DATA(state, key) {
      Vue.delete(state.farmsWithData, key);
    },
    REMOVE_FROM_FARMS_WITHOUT_DATA(state, key) {
      Vue.delete(state.farmsWithoutData, key);
    },
    SET_FARMS_WITH_DATA(state, value) {
      Vue.set(state, "farmsWithData", value);
    },
    SET_FARMS_WITHOUT_DATA(state, value) {
      Vue.set(state, "farmsWithoutData", value);
    },
    SET_FILTERED_FARMS_WITH_DATA(state, value) {
      Vue.set(state, "filteredFarmsWithData", value);
    },
    SET_SELECTED_FARMS(state, selectedFarms) {
      state.selectedFarms = selectedFarms;
    },
    SET_LENDING_FARMS(state, lendingFarms) {
      state.lendingFarms = lendingFarms;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    async getFarms({ commit }) {
      try {
        commit("SET_LOADING", true);
        const response = await axios.get(process.env.VUE_APP_FARMS_URL);
        commit("SET_FARMS", response.data);
        commit("SET_COSMOS_FARMS", response.data);
        commit("SET_SOL_FARMS", response.data);
        commit("SET_TERRA_FARMS", response.data);
        commit("SET_LOADING", false);
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
        commit("SET_LOADING", false);
      }
    },
    setFarmsValue({ commit }, newValue) {
      commit("SET_FARMS_VALUE", newValue);
    },
    setSelectedFarms({ commit }, selectedFarms) {
      commit("SET_SELECTED_FARMS", selectedFarms);
      this.dispatch("generalStore/saveSession");
    },
  },
};

export default farmStore;
