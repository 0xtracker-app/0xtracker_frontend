import axios from "axios";

// If we get CORS errors we can override them with this
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof error.response === "undefined")
      "override undefined error response (cors)";
  }
);

const bridgeStore = {
  namespaced: true,
  state: {
    tokens: [],
    blockchains: [],
    popularTokens: [],
    swappers: [],
    loading: false,
  },
  getters: {
    tokens: (state) => state.tokens,
    blockchains: (state) => state.blockchains,
    popularTokens: (state) => state.popularTokens,
    swappers: (state) => state.swappers,
  },
  mutations: {
    SET_TOKENS(state, tokens) {
      state.tokens = tokens;
    },
    SET_BLOCKCHAINS(state, blockchains) {
      state.blockchains = blockchains;
    },
    SET_POPULAR_TOKENS(state, popularTokens) {
      state.popularTokens = popularTokens;
    },
    SET_SWAPPERS(state, swappers) {
      state.swappers = swappers;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    async getMeta({ commit }) {
      try {
        commit("SET_LOADING", true);
        const { data } = await axios.get(process.env.VUE_APP_RANGO_META_URL, {
          params: { apiKey: process.env.VUE_APP_RANGO_API_KEY },
        });

        commit("SET_TOKENS", data.tokens);
        commit("SET_BLOCKCHAINS", data.blockchains);
        commit("SET_POPULAR_TOKENS", data.popularTokens);
        commit("SET_SWAPPERS", data.swappers);
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
};

export default bridgeStore;
