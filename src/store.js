import Vue from 'vue';
import axios from "axios";
import { ethers } from "ethers";

// Declaring it here as an import is just not working 🤷‍♂️
const ERC20_ABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EmergencyWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"pid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BONUS_MULTIPLIER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"contract IERC20","name":"_lpToken","type":"address"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"add","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"bonusEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_devaddr","type":"address"}],"name":"dev","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"devaddr","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"eleven","outputs":[{"internalType":"contract ElevenToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"elevenPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"emergencyWithdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_from","type":"uint256"},{"internalType":"uint256","name":"_to","type":"uint256"}],"name":"getMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"massUpdatePools","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"miningEndBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"pendingEleven","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"poolInfo","outputs":[{"internalType":"contract IERC20","name":"lpToken","type":"address"},{"internalType":"uint256","name":"allocPoint","type":"uint256"},{"internalType":"uint256","name":"lastRewardBlock","type":"uint256"},{"internalType":"uint256","name":"accElevenPerShare","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_allocPoint","type":"uint256"},{"internalType":"bool","name":"_withUpdate","type":"bool"}],"name":"set","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalAllocPoint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"}],"name":"updatePool","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"rewardDebt","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_pid","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}];

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
  walletData : {},
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
});

export const mutations = {
  // STORE
  initStore() {
    if (localStorage.getItem('store')) {
      const userData = JSON.parse(localStorage.getItem('store'));
      if (!userData.version || userData.version < store.userData.version) {
        localStorage.removeItem('store');
      } else Vue.set(store, 'userData', userData);
      this.storeUserDataState();
    } else {
      // Check if system theme is dark
      const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
      if (darkThemeMq.matches) {
        Vue.set(store.userData, 'darkmode', true);
      } else {
        Vue.set(store.userData, 'darkmode', false);
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
    }, 12 * 1000);
  },
  // WALLET & FARMS
  setFarmsAndWallet(selectedFarms, wallet) {
    Vue.set(store.userData, 'selectedFarms', selectedFarms);
    Vue.set(store.userData, 'wallet', wallet);
    this.storeUserDataState();
  },
  // GET FARMS
  async getFarms() {
    try {
      this.setLoadingFarms(true);
      const response = await axios.get(process.env.VUE_APP_FARMS_URL);
      Vue.set(store, 'farmsList', response.data);
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
  setProvider(provider) {
    Vue.set(store.walletData, 'provider', provider);
  },
  setConnectedWallet(address) {
    Vue.set(store.walletData, 'connectedWallet', address);
  },
  setNetwork(networkName) {
    Vue.set(store.walletData, 'network', networkName);
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
    Vue.set(store, 'balancesList', []);
  },
  setTotalWalletValue(value) {
    store.totalWalletValue = value;
  },
  async connectWallet(addListener = true) {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()
        const networkId = await signer.getChainId()
        const address = await signer.getAddress()
        this.setFarmsAndWallet(store.userData.selectedFarms, address);
        this.setProvider(provider);
        this.setConnectedWallet(address);
        this.setNetwork(this.returnNetworkName(networkId));
        this.setAlert('Wallet connected successfully with address ' + store.userData.wallet + ' and network "' + store.walletData.network + '".');
        if (addListener) {
          window.ethereum.on('accountsChanged', async (accounts) => {
            console.log("accountsChanged", accounts)
            await this.connectWallet(false);
            // call with false as the listener event was already added if
            // this function was called the first time
            // await this.connectWallet(false);
          })
          window.ethereum.on('chainChanged', async () => {
            // call with false as the listener event was already added if
            // this function was called the first time
            await this.connectWallet(false);
          })
        }
        return Promise.resolve(true);
      } catch (error) {
        console.log(error);
        this.setAlert('Wallet connection failed with error: ' + error.message || error);
        Promise.reject(error);
      }
    }
  },
  returnNetworkName(id) {
    const networkIds = {'bsc': { 'id' : 56},'matic':  {'id' : 137}, 'ftm' : {'id': 250}, 'kcc' : { 'id': 321}, 'optimism': { 'id' : 10}, 'eth': { 'id' : 1}, 'oke': { 'id' : 66}, 'harmony': { 'id' : 1666600000}};
    for (const network in networkIds) {
      if (Object.hasOwnProperty.call(networkIds, network)) {
        const networkObj = networkIds[network];
        if (networkObj.id == id) return network;
      }
    }
    return 'unknown';
  },
  async claimReward(contractAddress, poolIndex, rawTokens, claimFunction) {
    try {
      if (!store?.walletData?.provider) throw 'No wallet provider detected.'
      const signer = store.walletData.provider.getSigner()
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, signer)
      if (rawTokens > 0) {
        if (claimFunction) {
          contract.claimFunction(poolIndex, {gasLimit: 500000})
          .then(async (t) => {
            await store.walletData.provider.waitForTransaction(t.hash);
            this.setAlert(`Transaction "${t.hash}" completed.`)
            return Promise.resolve(true);
          })
          .catch((error) => {
            console.log('claimRewards if error', error);
            this.setAlert(`An error occurred with the transaction. Error: ${error.message || error}`);
            return Promise.reject(error);
          })
        } else {
          console.log('else deposit');
          contract.deposit(poolIndex, 0, {gasLimit: 500000})
          .then(async (t) => {
            console.log('deposit', t);
            await store.walletData.provider.waitForTransaction(t.hash);
            this.setAlert(`Transaction "${t.hash}" completed.`)
            return Promise.resolve(true);
          })
          .catch((error) => {
            console.log('claimRewards else error', error);
            this.setAlert(`An error occurred with the transaction. Error: ${error.message || error}`);
            return Promise.reject(error);
          })
        }
      }
    } catch (error) {
      console.log('claimRewards error', error);
      this.setAlert(`An error occurred with the transaction. Error: ${error.message || error}`);
      return Promise.reject(error);
    }
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