import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import DashboardPlugin from "./plugins/dashboard-plugin";
import i18n from "./i18n";
import store from "./store";
import checkView from "vue-check-view";
import VueClipboard from "vue-clipboard2";
import UUID from "vue-uuid";
import "./filters/shortenContractFilter";
import "./filters/to2DecimalsFilter";
import "./filters/toCurrencyFilter";
import "./filters/toSelectedCurrencyFilter";

Vue.config.productionTip = false;

// TODO: REMOVE EVENT HUB
const plugin = {
  install(Vue) {
    Vue.prototype.$eventHub = new Vue();
  },
};

Vue.use(plugin);
Vue.use(checkView);
Vue.use(VueClipboard);
Vue.use(UUID);

// plugin setup
Vue.use(DashboardPlugin);

new Vue({
  store,
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
