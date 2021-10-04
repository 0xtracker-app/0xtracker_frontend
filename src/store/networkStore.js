const networkStore = {
  namespaced: true,
  state: {
    networks: {
      56: "bsc",
      137: "matic",
      250: "ftm",
      321: "kcc",
      10: "optimism",
      1: "eth",
      66: "oke",
      1666600000: "harmony",
      42161: "arb",
      128: "heco",
      100: "xdai",
      42220: "celo",
    },
  },
  getters: {
    networks: (state) => state.networks,
  },
  actions: {
    networkNameFromID({ state }, networkId) {
      return state.networks[networkId] || "Unknown";
    },
  },
};

export default networkStore;
