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
        ADD_WALLET(state, address, type, key) {
            state.userProfiles[key].wallets.push({ 'walletAddress': address, 'walletType': type })
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
        addWallet({ commit }, address, type, key) {
            console.log(address,type,key)
            commit('ADD_WALLET', address, type, key);
            this.dispatch('generalStore/saveSession');
        },
    }
};

export default profileStore;
