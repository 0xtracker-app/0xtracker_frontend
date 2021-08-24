const networkStore = {
  namespaced: true,
  state: {
    networks: {
      56: 'bsc', 137: 'matic', 250: 'ftm', 321: 'kcc', 10: 'optimism', 1: 'eth', 66: 'oke', 1666600000: 'harmony'
    },
  },
  getters: {
    networks: state => state.networks,
    networkNameFromID: (state) => (id) => {
      return state.networks[id];
    }
  },
};

export default networkStore;
