<template>
  <router-view></router-view>
</template>

<script>
import { store, mutations } from '@/store.js';

export default {
  name: 'App',
  components: {
  },
  computed: {
    darkmode() {
      return store.userData.darkmode;
    },
    width() {
      return store.userData.width;
    },
  },
  created() {
    mutations.initStore();
    console.log("Life is very short and anxious for those who forget the past, neglect the present, and fear the future.")
  },
};
</script>
