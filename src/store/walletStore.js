import Vue from "vue";
import axios from "axios";
import { ethers } from "ethers";
import i18n from "@/i18n";
import { detectWalletType } from "@/util/helpers";

import { providerState, providerActions } from "./providerState";

// If we get CORS errors we can override them with this
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof error.response === "undefined")
      "override undefined error response (cors)";
  }
);

const ERC20_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "pid", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposit",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "pid", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "EmergencyWithdraw",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "uint256", name: "pid", type: "uint256" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Withdraw",
    type: "event",
  },
  {
    inputs: [],
    name: "BONUS_MULTIPLIER",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "contract IERC20", name: "_lpToken", type: "address" },
      { internalType: "bool", name: "_withUpdate", type: "bool" },
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "bonusEndBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_devaddr", type: "address" }],
    name: "dev",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "devaddr",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eleven",
    outputs: [
      { internalType: "contract ElevenToken", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "elevenPerBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_from", type: "uint256" },
      { internalType: "uint256", name: "_to", type: "uint256" },
    ],
    name: "getMultiplier",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "massUpdatePools",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "miningEndBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" },
    ],
    name: "pendingEleven",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "poolInfo",
    outputs: [
      { internalType: "contract IERC20", name: "lpToken", type: "address" },
      { internalType: "uint256", name: "allocPoint", type: "uint256" },
      { internalType: "uint256", name: "lastRewardBlock", type: "uint256" },
      { internalType: "uint256", name: "accElevenPerShare", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "poolLength",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_allocPoint", type: "uint256" },
      { internalType: "bool", name: "_withUpdate", type: "bool" },
    ],
    name: "set",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAllocPoint",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "updatePool",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "userInfo",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "rewardDebt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_pid", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
    name: "withdrawAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const walletStore = {
  namespaced: true,
  state: {
    connectedWallet: "",
    connectedWalletNetwork: "",
    loading: false,
    walletValue: 0,
    wallet: "",
    walletBalancesList: [],
    filteredWalletBalancesList: [],
    walletsWithoutData: {},
    evmNetworks: [
      "bsc",
      "oke",
      "matic",
      "ftm",
      "kcc",
      "eth",
      "harmony",
      "avax",
      "arb",
      "celo",
      "xdai",
      "heco",
      "meter",
      "moon",
      "polis",
      "cro",
      "boba",
      "theta",
      "aurora",
      "metis",
      "moonbeam",
      "fuse",
      "iotex",
      "elastos",
      "velas",
      "smartbch",
      "oasis",
      "telos",
      "rsk",
      "astar",
      "optimism",
      "dfk",
      "evmos",
      "songbird",
      "klaytn",
      "doge",
      "kardia",
    ],
    walletNetworks: [
      "bsc",
      "oke",
      "matic",
      "ftm",
      "kcc",
      "eth",
      "harmony",
      "avax",
      "arb",
      "celo",
      "xdai",
      "heco",
      "meter",
      "moon",
      "polis",
      "cro",
      "boba",
      "theta",
      "aurora",
      "cosmos",
      "solana",
      "terra",
      "metis",
      "moonbeam",
      "fuse",
      "iotex",
      "elastos",
      "velas",
      "smartbch",
      "oasis",
      "telos",
      "rsk",
      "astar",
      "optimism",
      "dfk",
      "evmos",
      "songbird",
      "klaytn",
      "doge",
      "kardia",
      "osmosis",
    ],
    walletRules: [
      (value) => !!value || "Required.",
      (value) => (value && value.length >= 3) || "Min 3 characters.",
    ],
    recentQuery: {
      type: null,
      profile: null,
    },
    selectedInterval: 1,
    historicalData: [],
    historicalDataLoading: false,
    singleHistoricalData: [],
    singleHistoricalDataLoading: false,
    selectedProfile: null,
    selectedSingleInterval: 7,
  },
  getters: {
    connectedWallet: (state) => state.connectedWallet,
    connectedWalletNetwork: (state) => state.connectedWalletNetwork,
    connectedWalletProvider: () => {
      if (providerState.provider) return providerState.provider;
      else return false;
    },
    connectedWalletShort: (state) => {
      if (state.connectedWallet)
        return (
          state.connectedWallet.slice(0, 6) +
          "..." +
          state.connectedWallet.slice(-4)
        );
      else return "";
    },
    wallet: (state) => state.wallet,
    walletRules: (state) => state.walletRules,
    walletNetworks: (state) => state.walletNetworks,
    evmNetworks: (state) => state.evmNetworks,
    recentQuery: (state) => state.recentQuery,
    selectedInterval: (state) => state.selectedInterval,
    selectedSingleInterval: (state) => state.selectedSingleInterval,
    historicalData: (state) => state.historicalData,
    singleHistoricalData: (state) => state.singleHistoricalData,
    selectedProfile: (state) => state.selectedProfile,
  },
  mutations: {
    SET_CONNECTED_WALLET(state, value) {
      state.connectedWallet = value;
    },
    SET_CONNECTED_WALLET_NETWORK(state, value) {
      state.connectedWalletNetwork = value;
    },
    SET_LOADING(state, value) {
      state.loading = value;
    },
    SET_WALLET(state, value) {
      state.wallet = value;
    },
    SET_WALLET_BALANCES(state, value) {
      Vue.set(state, "walletBalancesList", value);
    },
    SET_FILTERED_WALLET_BALANCES(state, value) {
      Vue.set(state, "filteredWalletBalancesList", value);
    },
    SET_WALLET_PROVIDER(state, value) {
      providerActions.setProvider(value);
    },
    ADD_TO_WALLETS_WITHOUT_DATA(state, { key, value }) {
      Vue.set(state.walletsWithoutData, key, value);
    },
    REMOVE_FROM_WALLETS_WITHOUT_DATA(state, key) {
      Vue.delete(state.walletsWithoutData, key);
    },
    SET_WALLETS_WITHOUT_DATA(state, value) {
      Vue.set(state, "walletsWithoutData", value);
    },
    SET_WALLET_VALUE(state, value) {
      state.walletValue = value;
    },
    SET_RECENT_QUERY(state, value) {
      state.recentQuery = value;
    },
    SET_HISTORICAL_DATA(state, value) {
      state.historicalData = value;
    },
    SET_SELECTED_INTERVAL(state, value) {
      state.selectedInterval = value;
    },
    SET_SELECTED_SINGLE_INTERVAL(state, value) {
      state.selectedSingleInterval = value;
    },
    SET_HISTORICAL_DATA_LOADING(state, value) {
      state.historicalDataLoading = value;
    },
    SET_SELECTED_PROFILE(state, value) {
      state.selectedProfile = value;
    },
    SET_SINGLE_HISTORICAL_DATA(state, value) {
      state.singleHistoricalData = value;
    },
    SET_SINGLE_HISTORICAL_DATA_LOADING(state, value) {
      state.singleHistoricalDataLoading = value;
    },
  },
  actions: {
    async addWalletListener({ commit, dispatch }) {
      if (typeof window.ethereum !== "undefined") {
        try {
          window.ethereum.on("accountsChanged", async (accounts) => {
            if (accounts && accounts.length)
              await dispatch("connectWallet", false);
          });
          window.ethereum.on("chainChanged", async () => {
            await dispatch("connectWallet", false);
          });
          window.ethereum.on("disconnect", async () => {
            await dispatch("disconnectWallet");
          });
        } catch (error) {
          commit(
            "generalStore/ADD_ALERT",
            "Wallet connection failed with error: " + error.message || error,
            { root: true }
          );
          Promise.reject(error);
        }
      }
    },
    async claimReward(
      { commit, getters },
      { contractAddress, poolIndex, rawTokens, claimFunction }
    ) {
      try {
        commit("SET_LOADING", true);
        if (!getters.connectedWalletProvider)
          throw "No wallet provider detected.";
        const signer = getters.connectedWalletProvider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          ERC20_ABI,
          signer
        );
        if (rawTokens > 0) {
          if (claimFunction) {
            contract
              .claimFunction(poolIndex, { gasLimit: 500000 })
              .then(async (t) => {
                await getters.connectedWalletProvider.waitForTransaction(
                  t.hash
                );
                commit(
                  "generalStore/ADD_ALERT",
                  `Transaction "${t.hash}" completed.`,
                  { root: true }
                );
                commit("SET_LOADING", false);
                return Promise.resolve(true);
              })
              .catch((error) => {
                commit(
                  "generalStore/ADD_ALERT",
                  `An error occurred with the transaction. Error: ${
                    error.message || error
                  }`,
                  { root: true }
                );
                commit("SET_LOADING", false);
                return Promise.reject(error);
              });
          } else {
            contract
              .deposit(poolIndex, 0, { gasLimit: 500000 })
              .then(async (t) => {
                await getters.connectedWalletProvider.waitForTransaction(
                  t.hash
                );
                commit(
                  "generalStore/ADD_ALERT",
                  `Transaction "${t.hash}" completed.`,
                  { root: true }
                );
                commit("SET_LOADING", false);
                return Promise.resolve(true);
              })
              .catch((error) => {
                commit(
                  "generalStore/ADD_ALERT",
                  `An error occurred with the transaction. Error: ${
                    error.message || error
                  }`,
                  { root: true }
                );
                commit("SET_LOADING", false);
                return Promise.reject(error);
              });
          }
        }
      } catch (error) {
        commit(
          "generalStore/ADD_ALERT",
          `An error occurred when attempting to claim rewards. Error: ${
            error.message || error
          }`,
          { root: true }
        );
        commit("SET_LOADING", false);
      }
    },
    async emergencyHarvest(
      { commit, getters },
      { contractAddress, poolIndex, rawTokens }
    ) {
      try {
        commit("SET_LOADING", true);
        if (!getters.connectedWalletProvider)
          throw "No wallet provider detected.";
        const signer = getters.connectedWalletProvider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          ERC20_ABI,
          signer
        );
        if (rawTokens > 0) {
          contract
            .emergencyWithdraw(poolIndex, { gasLimit: 500000 })
            .then(async (t) => {
              await getters.connectedWalletProvider.waitForTransaction(t.hash);
              commit(
                "generalStore/ADD_ALERT",
                `Transaction "${t.hash}" completed.`,
                { root: true }
              );
              commit("SET_LOADING", false);
              return Promise.resolve(true);
            })
            .catch((error) => {
              commit(
                "generalStore/ADD_ALERT",
                `An error occurred with the transaction. Error: ${
                  error.message || error
                }`,
                { root: true }
              );
              commit("SET_LOADING", false);
              return Promise.reject(error);
            });
        }
      } catch (error) {
        commit(
          "generalStore/ADD_ALERT",
          `An error occurred when attempting to withdraw. Error: ${
            error.message || error
          }`,
          { root: true }
        );
        commit("SET_LOADING", false);
      }
    },
    async harvestAll(
      { commit, getters },
      { contractAddress, poolIndex, rawTokens }
    ) {
      try {
        commit("SET_LOADING", true);
        if (!getters.connectedWalletProvider)
          throw "No wallet provider detected.";
        const signer = getters.connectedWalletProvider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          ERC20_ABI,
          signer
        );
        if (rawTokens > 0) {
          contract
            .withdraw(poolIndex, -1, { gasLimit: 500000 })
            .then(async (t) => {
              await getters.connectedWalletProvider.waitForTransaction(t.hash);
              commit(
                "generalStore/ADD_ALERT",
                `Transaction "${t.hash}" completed.`,
                { root: true }
              );
              commit("SET_LOADING", false);
              return Promise.resolve(true);
            })
            .catch((error) => {
              commit(
                "generalStore/ADD_ALERT",
                `An error occurred with the transaction. Error: ${
                  error.message || error
                }`,
                { root: true }
              );
              commit("SET_LOADING", false);
              return Promise.reject(error);
            });
        }
      } catch (error) {
        commit(
          "generalStore/ADD_ALERT",
          `An error occurred when attempting to withdraw. Error: ${
            error.message || error
          }`,
          { root: true }
        );
        commit("SET_LOADING", false);
      }
    },
    async connectWallet({ commit, dispatch, state }, addListener = true) {
      // Make addListener false if you dont want to add more listeners!
      if (typeof window.ethereum !== "undefined") {
        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const networkId = await signer.getChainId();
          const address = await signer.getAddress();
          commit("SET_WALLET", address);
          commit("SET_CONNECTED_WALLET", address);
          commit("approvalsStore/SET_WALLET", address, { root: true });
          commit("SET_WALLET_PROVIDER", provider);
          commit(
            "SET_CONNECTED_WALLET_NETWORK",
            await dispatch("networkStore/networkNameFromID", networkId, {
              root: true,
            })
          );
          commit(
            "generalStore/ADD_ALERT",
            "Wallet connected successfully with address " +
              state.connectedWallet +
              ' and network "' +
              state.connectedWalletNetwork +
              '".',
            { root: true }
          );
          if (addListener) {
            await dispatch("addWalletListener", addListener);
          }
          return Promise.resolve(true);
        } catch (error) {
          commit(
            "generalStore/ADD_ALERT",
            "Wallet connection failed with error: " + error.message || error,
            { root: true }
          );
          Promise.reject(error);
        }
      }
    },
    async connectKeplr({ commit, dispatch, state }, addListener = true) {
      if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
      } else {
        if (window.keplr.experimentalSuggestChain) {
          try {
            // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
            // cosmoshub-3 is integrated to Keplr so the code should return without errors.
            // The code below is not needed for cosmoshub-3, but may be helpful if you’re adding a custom chain.
            // If the user approves, the chain will be added to the user's Keplr extension.
            // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
            // If the same chain id is already registered, it will resolve and not require the user interactions.

            const chainId = "osmosis-1";
            const offlineSigner = window.keplr.getOfflineSigner(chainId);
            const accounts = await offlineSigner.getAccounts();
            const address = accounts[0].address;

            commit("SET_WALLET", address);
            commit("SET_CONNECTED_WALLET", address);
            commit("approvalsStore/SET_WALLET", address, { root: true });
            commit("SET_WALLET_PROVIDER", offlineSigner);
            commit(
              "SET_CONNECTED_WALLET_NETWORK",
              await dispatch("networkStore/networkNameFromID", "osmosis", {
                root: true,
              })
            );
            commit(
              "generalStore/ADD_ALERT",
              "Wallet connected successfully with address " +
                state.connectedWallet +
                ' and network "' +
                state.connectedWalletNetwork +
                '".',
              { root: true }
            );
            if (addListener) {
              await dispatch("addWalletListener", addListener);
            }
            return Promise.resolve(true);
          } catch (error) {
            commit(
              "generalStore/ADD_ALERT",
              "Wallet connection failed with error: " + error.message || error,
              { root: true }
            );
            Promise.reject(error);
          }
        }
      }

      // You should request Keplr to enable the wallet.
      // This method will ask the user whether or not to allow access if they haven't visited this website.
      // Also, it will request user to unlock the wallet if the wallet is locked.
      // If you don't request enabling before usage, there is no guarantee that other methods will work.
    },
    async disconnectWallet({ commit }) {
      try {
        commit("SET_LOADING", true);
        commit("SET_CONNECTED_WALLET", "");
        commit("SET_WALLET_PROVIDER", null);
        commit("SET_CONNECTED_WALLET_NETWORK", "");
        commit("generalStore/ADD_ALERT", "Wallet disconnected", { root: true });
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
      } finally {
        commit("SET_LOADING", false);
      }
    },
    async loadWallet({ commit, state, rootState }) {
      commit("SET_LOADING", true);
      try {
        for (const network of state.evmNetworks) {
          const response = await axios.get(
            `${process.env.VUE_APP_MYBALANCES_URL}${state.wallet}/${network}`
          );
          if (!response || !response.data || response.data.error)
            throw `No wallet data returned for ${i18n.t(
              network
            )}, you might need to retry.`;
          commit("SET_WALLET_BALANCES", [
            ...state.walletBalancesList,
            ...response.data.map((walletBalance) => {
              return { ...walletBalance, network, wallet: state.wallet };
            }),
          ]);
          await commit("SET_FILTERED_WALLET_BALANCES", [
            ...state.filteredWalletBalancesList,
            ...response.data
              .filter(async (walletBalance) => {
                await rootState.generalStore.selectedNetworks.some(
                  (n) => n === walletBalance.network
                );
              })
              .map((walletBalance) => {
                return { ...walletBalance, network, wallet: state.wallet };
              }),
          ]);
        }
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
      } finally {
        // commit("SET_LOADING", false);
      }
    },
    async loadCosmosWallet({ commit, state, rootState }, params) {
      const network = "cosmos";
      const skipNetworks = params.profile.skipNetworks;
      commit("SET_LOADING", true);

      if (
        process.env.VUE_APP_COSMOS_WALLET_URL &&
        !skipNetworks.includes(network)
      ) {
        try {
          await axios
            .get(`${process.env.VUE_APP_COSMOS_WALLET_URL}${params.wallet}`)
            .then(async (response) => {
              if (!response || !response.data || response.data.error) {
                commit(
                  "generalStore/ADD_ALERT",
                  `No wallet data returned for ${params.wallet}, you might need to retry.`,
                  { root: true }
                );

                const paramsTemp = {};
                Object.assign(paramsTemp, params);
                paramsTemp.error = true;
                commit("ADD_TO_WALLETS_WITHOUT_DATA", {
                  key: paramsTemp.wallet,
                  value: paramsTemp,
                });
              } else {
                commit("SET_WALLET_BALANCES", [
                  ...state.walletBalancesList,
                  ...response.data.map((walletBalance) => {
                    return { ...walletBalance, network, wallet: params.wallet };
                  }),
                ]);
                await commit("SET_FILTERED_WALLET_BALANCES", [
                  ...state.filteredWalletBalancesList,
                  ...response.data
                    .filter(async (walletBalance) => {
                      await rootState.generalStore.selectedNetworks.some(
                        (n) => n === walletBalance.network
                      );
                    })
                    .map((walletBalance) => {
                      return {
                        ...walletBalance,
                        network,
                        wallet: params.wallet,
                      };
                    }),
                ]);
              }
            });
        } catch (error) {
          commit("generalStore/ADD_ALERT", error, { root: true });
        }
      }
    },
    async loadSolWallet({ commit, state, rootState }, params) {
      const network = "solana";
      const skipNetworks = params.profile.skipNetworks;
      commit("SET_LOADING", true);
      if (
        process.env.VUE_APP_SOLANA_WALLET_URL &&
        !skipNetworks.includes(network)
      ) {
        try {
          await axios
            .get(`${process.env.VUE_APP_SOLANA_WALLET_URL}${params.wallet}`)
            .then(async (response) => {
              if (!response || !response.data || response.data.error) {
                commit(
                  "generalStore/ADD_ALERT",
                  `No wallet data returned for ${params.wallet}, you might need to retry.`,
                  { root: true }
                );

                const paramsTemp = {};
                Object.assign(paramsTemp, params);
                paramsTemp.error = true;
                commit("ADD_TO_WALLETS_WITHOUT_DATA", {
                  key: paramsTemp.wallet,
                  value: paramsTemp,
                });
              } else {
                commit("SET_WALLET_BALANCES", [
                  ...state.walletBalancesList,
                  ...response.data.map((walletBalance) => {
                    return { ...walletBalance, network, wallet: params.wallet };
                  }),
                ]);
                await commit("SET_FILTERED_WALLET_BALANCES", [
                  ...state.filteredWalletBalancesList,
                  ...response.data
                    .filter(async (walletBalance) => {
                      await rootState.generalStore.selectedNetworks.some(
                        (n) => n === walletBalance.network
                      );
                    })
                    .map((walletBalance) => {
                      return {
                        ...walletBalance,
                        network,
                        wallet: params.wallet,
                      };
                    }),
                ]);
              }
            });
        } catch (error) {
          commit("generalStore/ADD_ALERT", error, { root: true });
        }
      }
    },
    async loadTerraWallet({ commit, state, rootState }, params) {
      const network = "terra";
      const skipNetworks = params.profile.skipNetworks;
      commit("SET_LOADING", true);

      if (
        process.env.VUE_APP_TERRA_WALLET_URL &&
        !skipNetworks.includes(network)
      ) {
        try {
          await axios
            .get(`${process.env.VUE_APP_TERRA_WALLET_URL}${params.wallet}`)
            .then(async (response) => {
              if (!response || !response.data || response.data.error) {
                commit(
                  "generalStore/ADD_ALERT",
                  `No wallet data returned for ${params.wallet}, you might need to retry.`,
                  { root: true }
                );

                const paramsTemp = {};
                Object.assign(paramsTemp, params);
                paramsTemp.error = true;
                commit("ADD_TO_WALLETS_WITHOUT_DATA", {
                  key: paramsTemp.wallet,
                  value: paramsTemp,
                });
              } else {
                commit("SET_WALLET_BALANCES", [
                  ...state.walletBalancesList,
                  ...response.data.map((walletBalance) => {
                    return { ...walletBalance, network, wallet: params.wallet };
                  }),
                ]);
                await commit("SET_FILTERED_WALLET_BALANCES", [
                  ...state.filteredWalletBalancesList,
                  ...response.data
                    .filter(async (walletBalance) => {
                      await rootState.generalStore.selectedNetworks.some(
                        (n) => n === walletBalance.network
                      );
                    })
                    .map((walletBalance) => {
                      return {
                        ...walletBalance,
                        network,
                        wallet: params.wallet,
                      };
                    }),
                ]);
              }
            });
        } catch (error) {
          commit("generalStore/ADD_ALERT", error, { root: true });
        }
      }
    },
    async loadWallets({ commit, state, rootState }, params) {
      commit("SET_LOADING", true);
      try {
        commit("SET_WALLET_BALANCES", []);
        commit("SET_FILTERED_WALLET_BALANCES", []);
        const skipNetworks = params.profile.skipNetworks;

        const networks = state.evmNetworks.filter(
          (evmNetwork) => !skipNetworks.includes(evmNetwork)
        );

        await Promise.all(
          networks.map(async (network) => {
            await axios
              .get(
                `${process.env.VUE_APP_MYBALANCES_URL}${params.wallet}/${network}`
              )
              .then(async (response) => {
                if (!response || !response.data || response.data.error) {
                  commit(
                    "generalStore/ADD_ALERT",
                    `No wallet data returned for ${params.wallet}, you might need to retry.`,
                    { root: true }
                  );

                  const paramsTemp = {};
                  Object.assign(paramsTemp, params);
                  paramsTemp.error = true;
                  commit("ADD_TO_WALLETS_WITHOUT_DATA", {
                    key: paramsTemp.wallet,
                    value: paramsTemp,
                  });
                } else {
                  commit("SET_WALLET_BALANCES", [
                    ...state.walletBalancesList,
                    ...response.data.map((walletBalance) => {
                      return {
                        ...walletBalance,
                        network,
                        wallet: params.wallet,
                      };
                    }),
                  ]);
                  await commit("SET_FILTERED_WALLET_BALANCES", [
                    ...state.filteredWalletBalancesList,
                    ...response.data
                      .filter(async (walletBalance) => {
                        await rootState.generalStore.selectedNetworks.some(
                          (n) => n === walletBalance.network
                        );
                      })
                      .map((walletBalance) => {
                        return {
                          ...walletBalance,
                          network,
                          wallet: params.wallet,
                        };
                      }),
                  ]);
                }
              });
          })
        );
      } catch (error) {
        commit("generalStore/ADD_ALERT", error, { root: true });
      }
    },
    async getSingleFailedWallet({ state, commit, dispatch }, { key, wallet }) {
      try {
        commit("SET_LOADING", true);
        commit("REMOVE_FROM_WALLETS_WITHOUT_DATA", key);
        const walletType = detectWalletType(wallet.wallet);
        const profile = state.recentQuery.profile;
        if (walletType === "EVM") {
          await dispatch("loadWallets", { wallet: wallet.wallet, profile });
        } else if (walletType === "Cosmos") {
          await dispatch("loadCosmosWallet", {
            wallet: wallet.wallet,
            profile,
          });
        } else if (walletType === "Solana") {
          await dispatch("loadSolWallet", { wallet: wallet.wallet, profile });
        } else if (walletType === "Terra") {
          await dispatch("loadTerraWallet", { wallet: wallet.wallet, profile });
        }

        commit("SET_LOADING", false);
      } catch (error) {
        commit(
          "generalStore/ADD_ALERT",
          `No wallet data returned for ${key}, you might need to retry.`,
          { root: true }
        );

        const paramsTemp = {};
        Object.assign(paramsTemp, { key, wallet });
        paramsTemp.error = true;
        commit("ADD_TO_WALLETS_WITHOUT_DATA", {
          key: paramsTemp.wallet,
          value: paramsTemp,
        });
      }
    },
    async getAllFailedWallets({ state, dispatch }) {
      for (const [key, value] of Object.entries(state.walletsWithoutData)) {
        dispatch("getSingleFailedWallet", { key, wallet: value });
      }
    },
    setWallet({ commit }, wallet) {
      commit("SET_WALLET", wallet);
      this.dispatch("generalStore/saveSession");
    },
    setWalletValue({ commit }, newValue) {
      commit("SET_WALLET_VALUE", newValue);
    },
    async loadHistoricalProfile({ commit, rootState }, profile) {
      commit("SET_HISTORICAL_DATA_LOADING", true);
      commit("SET_HISTORICAL_DATA", []);

      let _historicalData = [];

      const fetchHistoricalDataProcessesArray = profile.wallets.map(
        async (wallet) => {
          await axios
            .get(
              `${
                process.env.VUE_APP_USER_BALANCE
              }?wallet=${wallet.walletAddress.toLowerCase()}&days=${
                rootState.walletStore.selectedInterval
              }`
            )
            .then(({ data }) => {
              _historicalData = [
                ..._historicalData,
                {
                  wallet,
                  data,
                },
              ];
            });
        }
      );

      await Promise.all(fetchHistoricalDataProcessesArray).then(() => {
        commit(
          "SET_HISTORICAL_DATA",
          _historicalData.sort((a, b) =>
            a.wallet.walletAddress.localeCompare(b.wallet.walletAddress)
          )
        );
        commit("SET_HISTORICAL_DATA_LOADING", false);
      });
    },
    async loadSingleHistoricalProfile(
      { commit, rootState },
      { profile, farm }
    ) {
      commit("SET_SINGLE_HISTORICAL_DATA_LOADING", true);
      commit("generalStore/SET_SINGLE_FARM_HISTORY_DIALOG", true, {
        root: true,
      });
      commit("SET_SINGLE_HISTORICAL_DATA", []);

      let _singleHistoricalData = [];

      const fetchSingleHistoricalDataProcessesArray = profile.wallets.map(
        async (wallet) => {
          await axios
            .get(
              `${
                process.env.VUE_APP_USER_BALANCE
              }?wallet=${wallet.walletAddress.toLowerCase()}&days=${
                rootState.walletStore.selectedSingleInterval
              }&farm_id=${farm}`
            )
            .then(({ data }) => {
              _singleHistoricalData = [
                ..._singleHistoricalData,
                {
                  wallet,
                  data,
                },
              ];
            });
        }
      );

      await Promise.all(fetchSingleHistoricalDataProcessesArray).then(() => {
        commit("SET_SINGLE_HISTORICAL_DATA", _singleHistoricalData);
        commit("SET_SINGLE_HISTORICAL_DATA_LOADING", false);
      });
    },
    removeHistoricalData({ commit, state }, { timestamps, wallet }) {
      const historicalData = state.historicalData[0].data.filter((data) => {
        return !timestamps.includes(data._id);
      });

      commit("SET_HISTORICAL_DATA", [
        {
          wallet,
          data: historicalData,
        },
      ]);
    },
    async loadProfile(
      { dispatch, commit, rootState },
      { profile, type = "profile" }
    ) {
      commit("SET_RECENT_QUERY", {
        type,
        profile,
      });

      commit("SET_SELECTED_PROFILE", profile);

      let skipFarmsData = [];
      const skipFarmsValues = Object.values(profile.skipFarms);
      skipFarmsValues.map((farms) =>
        farms.map((farm) => skipFarmsData.push(farm))
      );
      commit("SET_WALLET_BALANCES", []);
      commit("SET_FILTERED_WALLET_BALANCES", []);
      commit("SET_WALLETS_WITHOUT_DATA", {});

      commit("farmStore/SET_LOADING", true, { root: true });

      const processesArray = profile.wallets.map(async (wallet) => {
        if (wallet.walletType === "EVM") {
          dispatch("loadWallets", { wallet: wallet.walletAddress, profile });
          await Promise.all(
            rootState.farmStore.farms.map(async (selectFarm) => {
              if (
                !skipFarmsData.includes(selectFarm.sendValue) &&
                !["solana", "cosmos", "terra"].includes(selectFarm.network)
              ) {
                await dispatch(
                  "poolStore/newGetPoolsForFarms",
                  {
                    walletAddress: wallet.walletAddress,
                    selectFarm,
                    network: "evm",
                  },
                  { root: true }
                );
              }
            })
          );
        } else if (wallet.walletType === "Cosmos") {
          dispatch("loadCosmosWallet", {
            wallet: wallet.walletAddress,
            profile,
          });
          await Promise.all(
            rootState.farmStore.cosmosFarms.map(async (selectFarm) => {
              if (!skipFarmsData.includes(selectFarm.sendValue)) {
                await dispatch(
                  "poolStore/newGetPoolsForFarms",
                  {
                    walletAddress: wallet.walletAddress,
                    selectFarm,
                    network: "cosmos",
                  },
                  { root: true }
                );
              }
            })
          );
        } else if (wallet.walletType === "Solana") {
          dispatch("loadSolWallet", { wallet: wallet.walletAddress, profile });
          await Promise.all(
            rootState.farmStore.solFarms.map(async (selectFarm) => {
              if (!skipFarmsData.includes(selectFarm.sendValue)) {
                await dispatch(
                  "poolStore/newGetPoolsForFarms",
                  {
                    walletAddress: wallet.walletAddress,
                    selectFarm,
                    network: "solana",
                  },
                  { root: true }
                );
              }
            })
          );
        } else if (wallet.walletType === "Terra") {
          dispatch("loadTerraWallet", {
            wallet: wallet.walletAddress,
            profile,
          });
          await Promise.all(
            rootState.farmStore.terraFarms.map(async (selectFarm) => {
              if (!skipFarmsData.includes(selectFarm.sendValue)) {
                await dispatch(
                  "poolStore/newGetPoolsForFarms",
                  {
                    walletAddress: wallet.walletAddress,
                    selectFarm,
                    network: "terra",
                  },
                  { root: true }
                );
              }
            })
          );
        }
      });

      await Promise.all(processesArray).then(async () => {
        commit("SET_LOADING", false);
        await dispatch("executeFilter");
        await dispatch("loadHistoricalProfile", profile);
        commit("farmStore/SET_LOADING", false, { root: true });
      });
    },
    async loadPortfolio({ dispatch }, { walletAddress, walletType }) {
      await dispatch("loadProfile", {
        profile: {
          name: "Single Wallet",
          wallets: [{ walletAddress, walletType }],
          skipNetworks: [],
          skipFarms: {
            kcc: [],
            oke: [],
            matic: [],
            ftm: [],
            eth: [],
            harmony: [],
            avax: [],
            bsc: [],
            cosmos: [],
            moon: [],
            arb: [],
          },
        },
        type: "portfolio",
      });
    },
    setSelectedInterval({ state, dispatch, commit }, value) {
      commit("SET_SELECTED_INTERVAL", value);
      if (state.recentQuery.profile) {
        dispatch("loadHistoricalProfile", state.recentQuery.profile);
      }
    },
    setSelectedSingleInterval({ state, dispatch, commit }, { value, farm }) {
      commit("SET_SELECTED_SINGLE_INTERVAL", value);
      if (state.recentQuery.profile) {
        dispatch("loadSingleHistoricalProfile", {
          profile: state.recentQuery.profile,
          farm: farm,
        });
      }
    },
    executeFilter({ rootState, commit, state }) {
      let farmsWithData = {};
      let walletBalancesList = [];

      Object.entries(rootState.farmStore.farmsWithData).forEach(
        ([key, value]) => {
          if (
            rootState.generalStore.selectedNetworks.some(
              (network) => network === value.network
            )
          ) {
            farmsWithData = {
              ...farmsWithData,
              [key]: value,
            };
          }
        }
      );

      walletBalancesList = state.walletBalancesList.filter((walletBalance) =>
        rootState.generalStore.selectedNetworks.some(
          (network) => network === walletBalance.network
        )
      );

      commit("SET_FILTERED_WALLET_BALANCES", walletBalancesList);
      commit("farmStore/SET_FILTERED_FARMS_WITH_DATA", farmsWithData, {
        root: true,
      });
    },
  },
};

export default walletStore;
