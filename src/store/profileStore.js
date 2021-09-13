const profileStore = {
    namespaced: true,
    state: {
        userProfiles: []
    },
    getters: {
        userProfiles: state => state.userProfiles
    },
    mutations: {
        SET_PROFILES(state, value) {
            state.userProfiles = value
        },
        CREATE_PROFILE(state, value) {
            state.userProfiles.push({ 'name': value, 'wallets': [], 'skipNetworks': [], 'skipFarms': [] })
        },
        REMOVE_PROFILE(state, value) {
            state.userProfiles.splice(value, 1);
        },
        ADD_WALLET(state, value) {
            state.userProfiles[value.walletID].wallets.push({ 'walletAddress': value.walletAddress, 'walletType': value.walletType });
        },
        REMOVE_WALLET(state, value) {
            state.userProfiles[value.profileKey].wallets.splice(value.walletKey, 1);
        },
        TOGGLE_SKIP_NETWORK(state, value) {
            if (state.userProfiles[value.profileKey].skipNetworks.includes(value.network)) {
                state.userProfiles[value.profileKey].skipNetworks.splice(state.userProfiles[value.profileKey].skipNetworks.indexOf(value.network), 1)
            } else {
                state.userProfiles[value.profileKey].skipNetworks.push(value.network)
            }
        },
    },
    actions: {
        createProfile({ commit }, value) {
            commit('CREATE_PROFILE', value);
            this.dispatch('generalStore/saveSession');
        },
        removeProfile({ commit }, value) {
            commit('REMOVE_PROFILE', value);
            this.dispatch('generalStore/saveSession');
        },
        addWallet({ commit }, value) {
            commit('ADD_WALLET', value);
            this.dispatch('generalStore/saveSession');
        },
        removeWallet({ commit }, value) {
            commit('REMOVE_WALLET', value);
            this.dispatch('generalStore/saveSession');
        },
        toggleNetwork({ commit }, value) {
            commit('TOGGLE_SKIP_NETWORK', value);
            this.dispatch('generalStore/saveSession');
        },
    }
};

export default profileStore;
