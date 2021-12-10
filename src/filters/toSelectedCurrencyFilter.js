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
        ).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : (
          value *
          store.getters["generalStore/currencyRates"][
            store.getters["generalStore/selectedCurrency"].value
          ]
        ).toLocaleString("en-US", {
          minimumFractionDigits: 4,
          maximumFractionDigits: 18,
        })
  }`;
});
