import Vue from "vue";

Vue.filter("to2Decimals", (value, round) => {
  if (round === false && value) {
    return value;
  } else if (value && !isNaN(value)) {
    return value.toFixed(4);
  } else {
    return 0;
  }
});
