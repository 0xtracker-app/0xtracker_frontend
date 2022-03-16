import axios from "axios";
import { detectWalletType } from "@/util/helpers";

// If we get CORS errors we can override them with this
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof error.response === "undefined")
      "override undefined error response (cors)";
  }
);

const poolStore = {
  namespaced: true,
  state: {
    loading: false,
    pendingRewardsValue: 0,
    farmInfo: {},
    farmInfoNetworks: [
      "bsc",
      "eth",
      "ftm",
      "matic",
      "avax",
      "rsk",
      "moon",
      "arb",
      "heco",
      "moonbeam",
      "iotex",
    ],
    singleFarmLoading: false,
  },
  getters: {
    farms: (state) => state.farms,
    selectedFarms: (state) => state.selectedFarms,
    farmRules: (state) => state.farmRules,
    farmInfo: (state) => state.farmInfo,
    farmInfoNetworks: (state) => state.farmInfoNetworks,
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
    SET_FARM_DETAILS(state, value) {
      state.farmInfo = value;
    },
    SET_SINGLE_FARM_LOADING(state, loading) {
      state.singleFarmLoading = loading;
    },
  },
  actions: {
    async getPoolsForFarms({ commit, dispatch, rootState }, selectedFarms) {
      try {
        commit("SET_LOADING", true);
        commit("farmStore/SET_FARMS_WITH_DATA", {}, { root: true });
        commit("farmStore/SET_FILTERED_FARMS_WITH_DATA", {}, { root: true });
        commit("farmStore/SET_FARMS_WITHOUT_DATA", {}, { root: true });
        await dispatch("farmStore/getFarms", null, { root: true });
        const farmsArray =
          selectedFarms && selectedFarms.length
            ? selectedFarms
            : rootState.farmStore.farms;
        let requestArray = farmsArray
          .filter(function (el) {
            return el.network != "cosmos";
          })
          .map(async (selectedFarm) => {
            return new Promise((resolve) => {
              axios
                .get(
                  `${process.env.VUE_APP_MYFARM_URL}${rootState.walletStore.wallet}/${selectedFarm.sendValue}`
                )
                .then((response) => {
                  if (!response || !response.data || response.data.error) {
                    commit(
                      "generalStore/ADD_ALERT",
                      `No data returned for ${selectedFarm.name}, you might need to retry.`,
                      { root: true }
                    );
                    const selectedFarmTemp = {};
                    // require the .assign to prevent modifying original state
                    Object.assign(selectedFarmTemp, selectedFarm);
                    selectedFarmTemp.error = true;
                    commit(
                      "farmStore/ADD_TO_FARMS_WITHOUT_DATA",
                      { key: selectedFarm.sendValue, value: selectedFarmTemp },
                      { root: true }
                    );
                  } else if (Object.keys(response.data).length) {
                    for (const contract in response.data) {
                      if (Object.hasOwnProperty.call(response.data, contract)) {
                        const farm = response.data[contract];
                        if (farm?.total && farm.total > 0) {
                          commit(
                            "farmStore/ADD_TO_FARMS_WITH_DATA",
                            {
                              key: `${rootState.walletStore.wallet}_${contract}`,
                              value: Object.assign(
                                {
                                  name: farm.name,
                                  sendValue: selectedFarm.sendValue,
                                },
                                farm
                              ),
                            },
                            { root: true }
                          );
                        }
                      }
                    }
                  }
                  resolve(true);
                })
                .catch((error) => {
                  commit(
                    "generalStore/ADD_ALERT",
                    "An error occurred when getting Farm data, error: " + error,
                    { root: true }
                  );
                  const selectedFarmTemp = {};
                  // require the .assign to prevent modifying original state
                  Object.assign(selectedFarmTemp, selectedFarm);
                  selectedFarmTemp.error = true;
                  commit(
                    "farmStore/ADD_TO_FARMS_WITHOUT_DATA",
                    { key: selectedFarm.sendValue, value: selectedFarmTemp },
                    { root: true }
                  );
                  resolve(true);
                });
            });
          });
        try {
          await Promise.all(requestArray);
        } catch (error) {
          commit("generalStore/ADD_ALERT", error, { root: true });
        } finally {
          commit("SET_LOADING", false);
        }
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
        commit("SET_LOADING", false);
      }
    },
    async newGetPoolsForFarms({ commit, rootState }, params) {
      const walletAddress = params.walletAddress;
      const selectedFarms = [params.selectFarm];
      const farmNetworkUrl = {
        evm: process.env.VUE_APP_MYFARM_URL,
        cosmos: process.env.VUE_APP_COSMOS_FARMS_URL,
        solana: process.env.VUE_APP_SOLANA_FARMS_URL,
        terra: process.env.VUE_APP_TERRA_FARMS_URL,
      };
      commit("SET_LOADING", true);
      try {
        commit("farmStore/SET_FARMS_WITH_DATA", {}, { root: true });
        commit("farmStore/SET_FARMS_WITHOUT_DATA", {}, { root: true });
        commit("farmStore/SET_FILTERED_FARMS_WITH_DATA", {}, { root: true });
        commit("farmStore/SET_LENDING_FARMS", [], { root: true });
        const farmsArray = selectedFarms;
        let requestArray = farmsArray.map(async (selectedFarm) => {
          await axios
            .get(
              `${farmNetworkUrl[params.network]}${walletAddress}/${
                selectedFarm.sendValue
              }`
            )
            .then((response) => {
              if (!response || !response.data || response.data.error) {
                commit(
                  "generalStore/ADD_ALERT",
                  `No data returned for ${selectedFarm.name}, you might need to retry.`,
                  { root: true }
                );
                const selectedFarmTemp = {};
                // require the .assign to prevent modifying original state
                Object.assign(selectedFarmTemp, selectedFarm);
                selectedFarmTemp.error = true;
                selectedFarmTemp.walletType = detectWalletType(walletAddress);
                commit(
                  "farmStore/ADD_TO_FARMS_WITHOUT_DATA",
                  { key: selectedFarm.sendValue, value: selectedFarmTemp },
                  { root: true }
                );
              } else if (Object.keys(response.data).length) {
                for (const contract in response.data) {
                  if (Object.hasOwnProperty.call(response.data, contract)) {
                    const farm = response.data[contract];
                    if (
                      farm.type === "lending" &&
                      rootState.generalStore.selectedNetworks.some(
                        (network) => network === farm.network
                      )
                    ) {
                      commit(
                        "farmStore/SET_LENDING_FARMS",
                        [...rootState.farmStore.lendingFarms, farm],
                        { root: true }
                      );
                    }
                    if (farm?.total && farm.total > 0) {
                      commit(
                        "farmStore/ADD_TO_FARMS_WITH_DATA",
                        {
                          key: `${walletAddress}_${contract}`,
                          value: Object.assign(
                            {
                              name: farm.name,
                              sendValue: selectedFarm.sendValue,
                            },
                            farm
                          ),
                        },
                        { root: true }
                      );

                      if (
                        rootState.generalStore.selectedNetworks.some(
                          (network) => network === farm.network
                        )
                      ) {
                        commit(
                          "farmStore/ADD_TO_FILTERED_FARMS_WITH_DATA",
                          {
                            key: `${walletAddress}_${contract}`,
                            value: Object.assign(
                              {
                                name: farm.name,
                                sendValue: selectedFarm.sendValue,
                              },
                              farm
                            ),
                          },
                          { root: true }
                        );
                      }
                    }
                  }
                }
              }
            })
            .catch((error) => {
              commit(
                "generalStore/ADD_ALERT",
                "An error occurred when getting Farm data, error: " + error,
                { root: true }
              );
              const selectedFarmTemp = {};
              // require the .assign to prevent modifying original state
              Object.assign(selectedFarmTemp, selectedFarm);
              selectedFarmTemp.error = true;
              commit(
                "farmStore/ADD_TO_FARMS_WITHOUT_DATA",
                { key: selectedFarm.sendValue, value: selectedFarmTemp },
                { root: true }
              );
            });
        });

        await Promise.all(requestArray).then(() => {
          commit("SET_LOADING", false);
        });
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
      }
    },
    async getPoolsForSingleFarm({ commit, rootState }, { key, selectedFarm }) {
      const selectedWallets = rootState.walletStore.recentQuery.profile.wallets.filter(
        (wallet) => wallet.walletType === selectedFarm.walletType
      );

      const processesArray = selectedWallets.map(async (wallet) => {
        try {
          commit("SET_LOADING", true);
          commit(
            "farmStore/REMOVE_FROM_FARMS_WITH_DATA",
            `${wallet.walletAddress}_${key}`,
            {
              root: true,
            }
          );
          commit("farmStore/REMOVE_FROM_FARMS_WITHOUT_DATA", key, {
            root: true,
          });

          const apiEndpoint =
            wallet.walletType === "EVM"
              ? process.env.VUE_APP_MYFARM_URL
              : wallet.walletType === "Cosmos"
              ? process.env.VUE_APP_COSMOS_FARMS_URL
              : wallet.walletType === "Solana"
              ? process.env.VUE_APP_SOLANA_FARMS_URL
              : wallet.walletType === "Terra"
              ? process.env.VUE_APP_TERRA_FARMS_URL
              : "";

          const response = await axios.get(
            `${apiEndpoint}${wallet.walletAddress}/${key}`
          );

          if (!response || !response.data || response.data.error) {
            throw `No data returned for some farms, you might need to retry.`;
          }

          if (Object.keys(response.data).length) {
            for (const contract in response.data) {
              const farm = response.data[contract];
              if (farm?.total && farm.total > 0) {
                commit(
                  "farmStore/ADD_TO_FARMS_WITH_DATA",
                  {
                    key: contract,
                    value: Object.assign(
                      { name: farm.name, sendValue: selectedFarm.sendValue },
                      farm
                    ),
                  },
                  { root: true }
                );

                if (
                  rootState.generalStore.selectedNetworks.some(
                    (network) => network === farm.network
                  )
                ) {
                  commit(
                    "farmStore/ADD_TO_FILTERED_FARMS_WITH_DATA",
                    {
                      key: contract,
                      value: Object.assign(
                        { name: farm.name, sendValue: selectedFarm.sendValue },
                        farm
                      ),
                    },
                    { root: true }
                  );
                }
              }
            }
          }
        } catch (error) {
          commit("generalStore/ADD_ALERT", error, { root: true });
          const selectedFarmTemp = {};
          // require the .assign to prevent modifying original state
          Object.assign(selectedFarmTemp, selectedFarm);
          selectedFarmTemp.error = true;
          commit(
            "farmStore/ADD_TO_FARMS_WITHOUT_DATA",
            { key: key, value: selectedFarmTemp },
            { root: true }
          );
        }
      });

      await Promise.all(processesArray).then(() => {
        commit("SET_LOADING", false);
      });
    },
    async getPoolsForAllFailedFarms({ dispatch, rootState }) {
      for (const [key, value] of Object.entries(
        rootState.farmStore.farmsWithoutData
      )) {
        dispatch("getPoolsForSingleFarm", { key, selectedFarm: value });
      }
    },
    async getPoolItemDetails({ commit }, { item }) {
      commit("SET_SINGLE_FARM_LOADING", true);
      commit("generalStore/SET_SINGLE_FARM_DIALOG", true, { root: true });
      const response = await axios.get(
        `${process.env.VUE_APP_HISTORICAL_URL}${item.network}/${item.wallet}/${item.contractAddress}/${item.want}`
      );
      commit("SET_FARM_DETAILS", {
        transactions: response.data,
        poolData: item,
      });
      commit("SET_SINGLE_FARM_LOADING", false);
    },
    setPendingRewardsValue({ commit }, newValue) {
      commit("SET_PENDING_REWARDS_VALUE", newValue);
    },
    setSelectedFarms({ commit }, selectedFarms) {
      commit("SET_SELECTED_FARMS", selectedFarms);
    },
  },
};

export default poolStore;
