<template>
  <router-view></router-view>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {},
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
    ...mapGetters("profileStore", ["userProfiles"]),
  },
  async created() {
    this.initStore();
    console.log(
      "Ask not that events should happen as you will, but let your will be that events should happen as they do, and you shall have peace."
    );
  },
  async mounted() {
    await this.getFarms();
    let farmsByNetwork = {};
    this.$store.state.farmStore.farms.forEach((farm) => {
      if (farmsByNetwork.hasOwnProperty(farm.network)) {
        farmsByNetwork[farm.network].push(farm);
      } else {
        farmsByNetwork[farm.network] = [];
        farmsByNetwork[farm.network].push(farm);
      }
    });

    this.userProfiles.forEach((profile, index) => {
      if (index === 0) {
        Object.entries(farmsByNetwork).forEach(([network, value]) => {
          const farmObj = profile.skipFarms;
          const farmLength = value.length;

          if (farmObj.hasOwnProperty(network)) {
            if (farmObj[network].length == farmLength) {
              this.addToProfileSkipNetworks({
                selectedNetwork: network,
                profileKey: index,
              });
            } else {
              this.removeFromProfileSkipNetworks({
                selectedNetwork: network,
                profileKey: index,
              });
            }
          } else {
            this.removeFromProfileSkipNetworks({
              selectedNetwork: network,
              profileKey: index,
            });
          }
        });
      }
    });
  },
  methods: {
    ...mapActions("generalStore", ["initStore"]),
    ...mapActions("farmStore", ["getFarms"]),
    ...mapActions("profileStore", [
      "removeFromProfileSkipNetworks",
      "addToProfileSkipNetworks",
    ]),
  },
};
</script>
