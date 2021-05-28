import Vue from 'vue';

export const store = Vue.observable({
  userData: {
    darkmode: false,
    selectedFarms: [],
    wallet: '',
  },
  alert: { type: '', message: '' },
  loadingFarms: false,
  loadingPortfolio: false,
  farmsWithData: [],
  farmsWithoutData: [],
});

export const mutations = {
  // STORE
  initStore() {
    if (localStorage.getItem('store')) {
      store.userData = JSON.parse(localStorage.getItem('store'));
    }
  },
  storeUserDataState() {
    localStorage.setItem('store', JSON.stringify(store.userData));
  },
  // ALERT
  setAlert(type, message) {
    store.alert.type = type;
    store.alert.message = message;
  },
  // WALLET & FARMS
  setFarmsAndWallet(selectedFarms, wallet) {
    store.userData.selectedFarms = selectedFarms;
    store.userData.wallet = wallet;
    this.storeUserDataState();
  },
  addFarmsWithData(farmData) {
    store.farmsWithData.push(farmData);
  },
  removeFarmWithData(index) {
    store.farmsWithData.splice(index, 1);
  },
  clearFarmsWithData() {
    store.farmsWithData = [];
  },
  addFarmsWithoutData(farm) {
    store.farmsWithoutData.push(farm);
  },
  removeFarmWithoutData(index) {
    store.farmsWithoutData.splice(index, 1);
  },
  clearFarmsWithoutData() {
    store.farmsWithoutData = [];
  },
  // SHOW LOADING FARM INDICATORS
  setLoadingFarms(loading) {
    store.loadingFarms = loading;
  },
  // SHOW LOADING PORTFOLIO INDICATORS
  setLoadingPortfolio(loading) {
    store.loadingPortfolio = loading;
  },
  // DARKMODE
  toggleDarkMode() {
    store.userData.darkmode = !store.userData.darkmode;
    this.storeUserDataState();
  }
};