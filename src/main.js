import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import DashboardPlugin from "./plugins/dashboard-plugin";
import i18n from "./i18n";
import store from './store';


Vue.config.productionTip = false;

const plugin = {
  install(Vue) {
    Vue.prototype.$eventHub = new Vue();
  }
};

Vue.use(plugin);

Vue.filter('to2Decimals', (value, round) => {
  if (round === false && value) {
    return value;
  } else if (value && !isNaN(value)) {
    return value.toFixed(2);
  } else {
    return 0;
  }
});

Vue.filter('toCurrency', (value, round) => {
  if (typeof value !== "number") {
    return value;
  }
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: round ? 2 : 18
  });
  return formatter.format(value);
});

// plugin setup
Vue.use(DashboardPlugin);

new Vue({
  store,
  router,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
