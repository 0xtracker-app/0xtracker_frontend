<template>
  <v-alert
    v-if="message"
    border="right"
    outlined
    :type="type"
    :dark="darkmode"
  >
    {{ message }}
  </v-alert>
</template>

<script>
import { store } from '@/store.js';

export default {
  name: "Alert",
  computed: {
    alert() {
      return store.alert;
    },
    darkmode() {
      return store.userData.darkmode
    },
    message() {
      if (this.alert.type === "error") return `An error has occurred: ${this.alert.message}`;
      if (this.alert.message) return this.alert.message;
      return '';
    },
    type() {
      if (this.alert && this.alert.type) return this.alert.type;
      else return 'info';
    }
  },
};
</script>

<style scoped></style>
