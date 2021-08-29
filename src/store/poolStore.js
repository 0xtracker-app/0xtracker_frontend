import axios from "axios";

// If we get CORS errors we can override them with this
axios.interceptors.response.use((response) => response, (error) => {
  if (typeof error.response === 'undefined') 'override undefined error response (cors)';
});

const poolStore = {
  namespaced: true,
  state: {
    loading: false,
    pendingRewardsValue: 0,
  },
  getters: {
    farms: state => state.farms,
    selectedFarms: state => state.selectedFarms,
    farmRules: state => state.farmRules,
  },
  mutations: {
    SET_FARMS(state, farms) {
      state.farms = farms;
    },
    SET_PENDING_REWARDS_VALUE(state, value) {
      state.pendingRewardsValue = value;
    },
    SET_SELECTED_FARMS(state, selectedFarms) {
      state.selectedFarms = selectedFarms;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
  },
  actions: {
    async getPoolsForSelectedFarms({ commit, rootState }) {
      try {
        commit('SET_LOADING', true);
        const response = await axios.get(process.env.VUE_APP_FARMS_URL);
        commit('SET_FARMS', response.data);
        commit('farmStore/SET_FARMS_WITH_DATA', {}, { root: true });
        commit('farmStore/SET_FARMS_WITHOUT_DATA', {}, { root: true });
        if (!rootState.farmStore.selectedFarms || rootState.farmStore.selectedFarms.length === 0) throw 'No farms selected, is this a bug?';
        let requestArray = rootState.farmStore.selectedFarms.map(async selectedFarm => {
          return new Promise((resolve) => {
            const requestBody = {
              wallet : rootState.walletStore.wallet,
              farms : [selectedFarm.sendValue]
            };
            axios.post(process.env.VUE_APP_MYFARM_URL, requestBody)
            .then(response => {
              if (!response || !response.data || response.data.error) {
                commit('generalStore/ADD_ALERT', `No data returned for ${selectedFarm.name}, you might need to retry.`, { root: true });
                const selectedFarmTemp = {};
                // require the .assign to prevent modifying original state
                Object.assign(selectedFarmTemp, selectedFarm);
                selectedFarmTemp.error = true;
                commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: selectedFarm.sendValue, value: selectedFarmTemp }, { root: true });
              } else if (Object.keys(response.data).length) {
                for (const contract in response.data) {
                  if (Object.hasOwnProperty.call(response.data, contract)) {
                    const farm = response.data[contract];
                    if (farm?.total && farm.total > 0) {
                      commit('farmStore/ADD_TO_FARMS_WITH_DATA', { key: contract, value: Object.assign({name: farm.name, sendValue: selectedFarm.sendValue}, farm) }, { root: true });
                    } else commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: contract, value: selectedFarm }, { root: true });
                  }
                }
              } else commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: selectedFarm.sendValue, value: selectedFarm }, { root: true });
                resolve(true);
              })
            .catch(error => {
              commit('generalStore/ADD_ALERT', 'An error occurred when getting Farm data, error: ' + error, { root: true });
              const selectedFarmTemp = {};
              // require the .assign to prevent modifying original state
              Object.assign(selectedFarmTemp, selectedFarm);
              selectedFarmTemp.error = true;
              commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: selectedFarm.sendValue, value: selectedFarmTemp }, { root: true });
              resolve(true);
            });
          }) 
        })
        try {
          await Promise.all(requestArray);
        } catch (error) {
          commit('generalStore/ADD_ALERT', error, { root: true });
        } finally {
          commit('SET_LOADING', false);
        }
      } catch (error) {
        commit('generalStore/ADD_ALERT', error, { root: true });
        commit('SET_LOADING', false);
      }
    },
    async getPoolsForSelectedFarm({ commit, rootState }, { key, selectedFarm }) {
      try {
        commit('SET_LOADING', true);
        commit('farmStore/REMOVE_FROM_FARMS_WITH_DATA', key);
        commit('farmStore/REMOVE_FROM_FARMS_WITHOUT_DATA', key);
        const requestBody = {
          wallet : rootState.walletStore.wallet,
          farms : [key]
        }
        const response = await axios.post(process.env.VUE_APP_MYFARM_URL, requestBody);
        if (!response || !response.data || response.data.error) throw `No data returned for some farms, you might need to retry.`;
        if (Object.keys(response.data).length) {
          for (const contract in response.data) {
            const farm = response.data[contract];
            if (farm?.total && farm.total > 0) {
              commit('farmStore/ADD_TO_FARMS_WITH_DATA', { key: contract, value: Object.assign({name: farm.name, sendValue: selectedFarm.sendValue}, farm) }, { root: true });
            } else commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: contract, value: selectedFarm }, { root: true });
          }
        } else commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: key, value: selectedFarm }, { root: true });
        commit('SET_LOADING', false);
      } catch (error) {
        commit('generalStore/ADD_ALERT', error, { root: true });
        commit('SET_LOADING', false);
        const selectedFarmTemp = {};
        // require the .assign to prevent modifying original state
        Object.assign(selectedFarmTemp, selectedFarm);
        selectedFarmTemp.error = true;
        commit('farmStore/ADD_TO_FARMS_WITHOUT_DATA', { key: key, value: selectedFarmTemp }, { root: true });
      }
    },
    setPendingRewardsValue({ commit }, newValue) {
      commit('SET_PENDING_REWARDS_VALUE', newValue);
    },
    setSelectedFarms({ commit }, selectedFarms) {
      commit('SET_SELECTED_FARMS', selectedFarms);
    },
  }
};

export default poolStore;