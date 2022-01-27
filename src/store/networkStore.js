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
      43114: "avax",
      1285: "moon",
      42161: "arb",
      128: "heco",
      100: "xdai",
      42220: "celo",
      82: "meter",
      25: "cro",
      333999: "polis",
      288: "boba",
      1088: "metis",
      1284: "moonbeam",
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
