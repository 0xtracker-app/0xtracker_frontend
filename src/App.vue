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
    console.log("Ask not that events should happen as you will, but let your will be that events should happen as they do, and you shall have peace.")
  },
};
</script>
