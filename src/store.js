import Vue from 'vue';
import axios from "axios";

// If we get CORS errors we can override them with this
axios.interceptors.response.use((response) => response, (error) => {
  if (typeof error.response === 'undefined') 'override undefined error response (cors)';
});

export const store = Vue.observable({
  userData: {
    darkmode: false,
    selectedFarms: [],
    wallet: '',
  },
  // TODO: Change to array for multiple errors
  alert: { type: '', message: '' },
  loadingFarms: false,
  loadingPortfolio: false,
  farmsList: [],
  farmsWithData: {},
  farmsWithoutData: {},
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
  // GET FARMS
  async getFarms() {
    try {
      this.setAlert('', '')
      this.setLoadingFarms(true);
      const response = await axios.get(process.env.VUE_APP_FARMS_URL);
      store.farmsList = response.data;
      this.setLoadingFarms(false);
    } catch (error) {
      this.setAlert('error', error)
      this.setLoadingFarms(false);
    }
  },
  // GET ALL FARM DATA
  async getFarmData() {
    try {
      this.setLoadingPortfolio(true);
      this.setAlert('', '');
      this.clearFarmsWithData();
      this.clearFarmsWithoutData();
      if (!store.userData.selectedFarms || store.userData.selectedFarms.length === 0) throw 'No farms selected, is this a bug?';
      let requestArray = store.userData.selectedFarms.map(async selectedFarm => {
        return new Promise((resolve) => {
          const requestBody = {
            wallet : store.userData.wallet,
            farms : [selectedFarm.sendValue]
          };
          axios.post(process.env.VUE_APP_MYFARM_URL, requestBody)
          .then(response => {
            if (!response || !response.data || response.data.error) {
              this.setAlert('error', `No data returned for some farms, you might need to retry.`);
              selectedFarm.error = true;
              this.addFarmWithoutData(selectedFarm.sendValue, selectedFarm);
            } else if (Object.keys(response.data).length) {
              for (const contract in response.data) {
                if (Object.hasOwnProperty.call(response.data, contract)) {
                  const farm = response.data[contract];
                  if (farm?.total && farm.total > 0) {
                    this.addFarmWithData(contract, Object.assign({name: farm.name, sendValue: selectedFarm.sendValue}, farm));
                  } else this.addFarmWithoutData(contract, selectedFarm);
                }
              }
            } else this.addFarmWithoutData(selectedFarm.sendValue, selectedFarm);
            resolve(true);
          })
          .catch(error => {
            this.setAlert('error', error);
            selectedFarm.error = true;
            this.addFarmWithoutData(selectedFarm.sendValue, selectedFarm);
            resolve(true);
          });
        }) 
      })
      try {
        await Promise.all(requestArray);
      } catch (error) {
        this.setAlert('error', error);
      } finally {
        this.setLoadingPortfolio(false);
      }
    } catch (error) {
      this.setAlert('error', error);
      this.setLoadingPortfolio(false);
    }
  },
  // REFRESH SINGLE FARM
  async refreshSingleFarm(key, selectedFarm) {
    try {
      this.setAlert('', '');
      this.setLoadingPortfolio(true);
      this.removeFarmWithoutData(key);
      this.removeFarmWithData(key);
      const requestBody = {
        wallet : store.userData.wallet,
        farms : [key]
      }
      const response = await axios.post(process.env.VUE_APP_MYFARM_URL, requestBody);
      if (!response || !response.data || response.data.error) throw `No data returned for some farms, you might need to retry.`;
      if (Object.keys(response.data).length) {
        for (const contract in response.data) {
          const farm = response.data[contract];
          if (farm?.total && farm.total > 0) {
            this.addFarmWithData(contract, Object.assign({name: farm.name, sendValue: selectedFarm.sendValue}, farm));
          } else this.addFarmWithoutData(contract, selectedFarm);
        }
      } else this.addFarmWithoutData(key, selectedFarm);
      this.setLoadingPortfolio(false);
    } catch (error) {
      this.setAlert('error', error);
      this.setLoadingPortfolio(false);
      selectedFarm.error = true;
      this.addFarmWithoutData(key, selectedFarm);
    }
  },
  // FARMS WITH DATA
  addFarmWithData(key, farmData) {
    Vue.set(store.farmsWithData, key, farmData);
  },
  removeFarmWithData(key) {
    Vue.delete(store.farmsWithData, key);
  },
  clearFarmsWithData() {
    Vue.set(store, 'farmsWithData', {});
  },
  // FARMS WITHOUT DATA
  addFarmWithoutData(key, farm) {
    Vue.set(store.farmsWithoutData, key, farm);
  },
  removeFarmWithoutData(key) {
    Vue.delete(store.farmsWithoutData, key);
  },
  clearFarmsWithoutData() {
    Vue.set(store, 'farmsWithoutData', {});
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