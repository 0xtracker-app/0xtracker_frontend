import Vue from "vue";
import store from "../store";

Vue.filter("toSelectedCurrency", (value) => {
  return `${store.getters["generalStore/selectedCurrency"].symbol}${
    store.getters["generalStore/round"]
      ? (
          value *
          store.getters["generalStore/currencyRates"][
            store.getters["generalStore/selectedCurrency"].value
          ]
        ).toFixed(2)
      : (
          value *
          store.getters["generalStore/currencyRates"][
            store.getters["generalStore/selectedCurrency"].value
          ]
        ).toFixed(18)
  }`;
});
