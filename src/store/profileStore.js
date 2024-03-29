import Vue from "vue";

const profileStore = {
  namespaced: true,
  state: {
    userProfiles: [],
  },
  getters: {
    userProfiles: (state) => state.userProfiles,
  },
  mutations: {
    SET_PROFILES(state, value) {
      state.userProfiles = value;
    },
    REMOVE_FROM_PROFILE_SKIP_NETWORKS(state, { selectedNetwork, profileKey }) {
      state.userProfiles[profileKey].skipNetworks = state.userProfiles[
        profileKey
      ].skipNetworks.filter((network) => selectedNetwork !== network);
    },
    ADD_TO_PROFILE_SKIP_NETWORKS(state, { selectedNetwork, profileKey }) {
      state.userProfiles[profileKey].skipNetworks.push(selectedNetwork);
    },
    CREATE_PROFILE(state, value) {
      state.userProfiles.push({
        name: value,
        wallets: [],
        skipNetworks: [],
        skipFarms: {},
      });
    },
    REMOVE_PROFILE(state, value) {
      state.userProfiles.splice(value, 1);
    },
    ADD_WALLET(state, value) {
      state.userProfiles[value.walletID].wallets.push({
        walletAddress: value.walletAddress,
        walletType: value.walletType,
      });
    },
    EDIT_WALLET(state, value) {
      state.userProfiles[value.userProfileId].wallets[value.walletId] = {
        walletAddress: value.walletAddress,
        walletType: value.walletType,
      };
    },
    REMOVE_WALLET(state, value) {
      state.userProfiles[value.profileKey].wallets.splice(value.walletKey, 1);
    },
    TOGGLE_SKIP_NETWORK(state, value) {
      const contractList = value.allFarms.map((x) => x.sendValue);
      const selectedNetwork = value.network;

      if (
        state.userProfiles[value.profileKey].skipNetworks.includes(
          selectedNetwork
        )
      ) {
        state.userProfiles[value.profileKey].skipNetworks = state.userProfiles[
          value.profileKey
        ].skipNetworks.filter((network) => selectedNetwork !== network);
      } else {
        state.userProfiles[value.profileKey].skipNetworks.push(selectedNetwork);
      }

      if (state.userProfiles[value.profileKey].skipFarms[selectedNetwork]) {
        if (
          state.userProfiles[value.profileKey].skipFarms[selectedNetwork]
            .length == contractList.length
        ) {
          Vue.delete(
            state.userProfiles[value.profileKey].skipFarms,
            selectedNetwork
          );
        } else {
          Vue.set(
            state.userProfiles[value.profileKey].skipFarms,
            selectedNetwork,
            contractList
          );
        }
      } else {
        Vue.set(
          state.userProfiles[value.profileKey].skipFarms,
          selectedNetwork,
          contractList
        );
      }
    },
    TOGGLE_SKIP_FARM(state, value) {
      const farmObj = state.userProfiles[value.profileKey].skipFarms;
      if (farmObj.hasOwnProperty(value.network)) {
        if (farmObj[value.network].includes(value.sendValue)) {
          const farmArray =
            state.userProfiles[value.profileKey].skipFarms[value.network];
          farmArray.splice(farmArray.indexOf(value.sendValue), 1);
        } else {
          state.userProfiles[value.profileKey].skipFarms[value.network].push(
            value.sendValue
          );
        }
      } else {
        Vue.set(state.userProfiles[value.profileKey].skipFarms, value.network, [
          value.sendValue,
        ]);
      }

      const selectedNetwork = value.network;
      const farmLength = value.allFarms.length;
      let isNetworkSelected = false;

      if (farmObj.hasOwnProperty(selectedNetwork)) {
        if (farmObj[selectedNetwork].length === farmLength) {
          isNetworkSelected = true;
        } else {
          isNetworkSelected = false;
        }
      } else {
        isNetworkSelected = true;
      }

      if (isNetworkSelected) {
        state.userProfiles[value.profileKey].skipNetworks.push(selectedNetwork);
      } else {
        if (
          state.userProfiles[value.profileKey].skipNetworks.includes(
            selectedNetwork
          )
        ) {
          state.userProfiles[
            value.profileKey
          ].skipNetworks = state.userProfiles[
            value.profileKey
          ].skipNetworks.filter((network) => selectedNetwork !== network);
        }
      }
    },
  },
  actions: {
    createProfile({ commit }, value) {
      commit("CREATE_PROFILE", value);
      this.dispatch("generalStore/saveSession");
    },
    removeProfile({ commit }, value) {
      commit("REMOVE_PROFILE", value);
      this.dispatch("generalStore/saveSession");
    },
    addWallet({ commit }, value) {
      commit("ADD_WALLET", value);
      this.dispatch("generalStore/saveSession");
    },
    updateWallet({ commit }, value) {
      commit("EDIT_WALLET", value);
      this.dispatch("generalStore/saveSession");
    },
    removeWallet({ commit }, value) {
      commit("REMOVE_WALLET", value);
      this.dispatch("generalStore/saveSession");
    },
    toggleNetwork({ commit }, value) {
      commit("TOGGLE_SKIP_NETWORK", value);
      this.dispatch("generalStore/saveSession");
    },
    toggleFarm({ commit }, value) {
      commit("TOGGLE_SKIP_FARM", value);
      this.dispatch("generalStore/saveSession");
    },
    removeFromProfileSkipNetworks({ commit }, value) {
      commit("REMOVE_FROM_PROFILE_SKIP_NETWORKS", value);
      this.dispatch("generalStore/saveSession");
    },
    addToProfileSkipNetworks({ commit }, value) {
      commit("ADD_TO_PROFILE_SKIP_NETWORKS", value);
      this.dispatch("generalStore/saveSession");
    },
  },
};

export default profileStore;
