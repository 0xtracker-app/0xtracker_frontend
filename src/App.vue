<template>
  <router-view></router-view>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { store, mutations } from '@/store-old.js';

export default {
  name: 'App',
  components: {
  },
  computed: {
    ...mapGetters('generalStore', ['darkmode']),
  },
  created() {
    mutations.initStore();
    console.log("Ask not that events should happen as you will, but let your will be that events should happen as they do, and you shall have peace.")
  },
};
</script>
