import Vue from 'vue';
import App from './App.vue';
import router from "./router";
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

const plugin = {
  install(Vue) {
    Vue.prototype.$eventHub = new Vue();
  }
};

Vue.use(plugin);

Vue.filter("to2Decimals", value => {
  if (value && !isNaN(value)) {
    return value.toFixed(2);
  } else {
    return 0;
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
