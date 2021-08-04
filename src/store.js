import Vue from 'vue';
import axios from "axios";

// If we get CORS errors we can override them with this
axios.interceptors.response.use((response) => response, (error) => {
  if (typeof error.response === 'undefined') 'override undefined error response (cors)';
});

export const store = Vue.observable({
  userData: {
    darkmode: false,
    round: true,
    smallValues: true,
    noLPPools: true,
    selectedFarms: [],
    wallet: '',
    // increment to clear localstore
    version: 3,
  },
  alerts: [],
  loadingFarms: false,
  loadingPools: false,
  loadingWallet: false,
  farmsList: [],
  farmsWithData: {},
  farmsWithoutData: {},
  balancesList: [],
  totalWalletValue: 0,
  totalFarmsValue: 0,
  totalPendingRewardsValue: 0,
  App : {}
});

export const mutations = {
  // STORE
  initStore() {
    if (localStorage.getItem('store')) {
      const userData = JSON.parse(localStorage.getItem('store'));
      if (!userData.version || userData.version < store.userData.version) {
        localStorage.removeItem('store');
      } else store.userData = userData;
      this.storeUserDataState();
    } else {
      // Check if system theme is dark
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkThemeMq.matches) {
        store.userData.darkmode = true;
      } else {
        store.userData.darkmode = false;
      }
      this.storeUserDataState();
    }
  },
  storeUserDataState() {
    localStorage.setItem('store', JSON.stringify(store.userData));
  },
  // ALERT
  setAlert(message) {
    store.alerts.push(message);
    const timer = window.setInterval(function () {
      if (store.alerts.length > 0) {
        store.alerts.shift();
      } else {
        window.clearInterval(timer);
      }
    }, 20 * 1000);
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
      this.setLoadingFarms(true);
      const response = await axios.get(process.env.VUE_APP_FARMS_URL);
      store.farmsList = response.data;
      this.setLoadingFarms(false);
    } catch (error) {
      this.setAlert(error)
      this.setLoadingFarms(false);
    }
  },
  // GET ALL FARM DATA
  async getFarmData() {
    try {
      this.setLoadingPortfolio(true);;
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
              this.setAlert(`No data returned for ${selectedFarm.name}, you might need to retry.`);
              const selectedFarmTemp = {};
              // require the .assign to prevent modifying original state
              Object.assign(selectedFarmTemp, selectedFarm);
              selectedFarmTemp.error = true;
              this.addFarmWithoutData(selectedFarm.sendValue, selectedFarmTemp);
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
            this.setAlert('An error occurred when getting Farm data, error: ' + error);
            const selectedFarmTemp = {};
            // require the .assign to prevent modifying original state
            Object.assign(selectedFarmTemp, selectedFarm);
            selectedFarmTemp.error = true;
            this.addFarmWithoutData(selectedFarm.sendValue, selectedFarmTemp);
            resolve(true);
          });
        }) 
      })
      try {
        await Promise.all(requestArray);
      } catch (error) {
        this.setAlert(error);
      } finally {
        this.setLoadingPortfolio(false);
      }
    } catch (error) {
      this.setAlert(error);
      this.setLoadingPortfolio(false);
    }
  },
  // REFRESH SINGLE FARM
  async refreshSingleFarm(key, selectedFarm) {
    try {;
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
      this.setAlert(error);
      this.setLoadingPortfolio(false);
      const selectedFarmTemp = {};
      // require the .assign to prevent modifying original state
      Object.assign(selectedFarmTemp, selectedFarm);
      selectedFarmTemp.error = true;
      this.addFarmWithoutData(key, selectedFarmTemp);
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
  setTotalFarmsValue(value) {
    store.totalFarmsValue = value;
  },
  setTotalPendingRewardsValue(value) {
    store.totalPendingRewardsValue = value;
  },
  // WALLET BALANCES
  async getBalancesForWallet() {
    try {;
      this.setLoadingBalances(true);
      this.clearBalances();
      const requestBody = {
        wallet : store.userData.wallet,
      }
      const response = await axios.post(process.env.VUE_APP_MYBALANCES_URL, requestBody);
      if (!response || !response.data || response.data.error) throw `No wallet data returned, you might need to retry.`;
      for (const item of response.data) {
        store.balancesList.push(item);
      }
      this.setLoadingBalances(false);
    } catch (error) {
      this.setAlert(error);
      this.setLoadingBalances(false);
    }
  },
  clearBalances() {
    store.balancesList = [];
  },
  setTotalWalletValue(value) {
    store.totalWalletValue = value;
  },
  // SHOW LOADING FARM INDICATORS
  setLoadingFarms(loading) {
    store.loadingFarms = loading;
  },
  // SHOW LOADING PORTFOLIO INDICATORS
  setLoadingPortfolio(loading) {
    store.loadingPools = loading;
  },
  // SHOW LOADING WALLET BALANCE INDICATORS
  setLoadingBalances(loading) {
    store.loadingWallet = loading;
  },
  // DARKMODE
  toggleDarkMode() {
    store.userData.darkmode = !store.userData.darkmode;
    this.storeUserDataState();
  },
  // ROUNDING TO 2 DECIMALS
  toggleRounding() {
    store.userData.round = !store.userData.round;
  },
  toggleSmallValues() {
    store.userData.smallValues = !store.userData.smallValues;
  },
  toggleSmallValues() {
    store.userData.smallValues = !store.userData.smallValues;
  },
  // SETTINGS
  toggleNoLPPools() {
    store.userData.noLPPools = !store.userData.noLPPools;
  },
  // WIDTH
  // 0 = default
  // 1 = fluid
  // 2 = slim
  toggleWidth() {
    if (store.userData.width < 2) store.userData.width++;
    else store.userData.width = 0;
  }
};