<template>
  <v-card class="card-shadow">
    <div class="card-header-padding card-border-bottom">
      <v-row>
        <v-col>
          <p class="font-weight-600 text-h3 text-typo mb-0">Real Time</p>
        </v-col>
        <v-col class="text-right">
          <v-btn
            elevation="0"
            small
            :ripple="false"
            class="font-weight-600 text-capitalize btn-neutral py-1 px-2 rounded-sm"
            color="#fff"
            >Action</v-btn
          >
        </v-col>
      </v-row>
    </div>

    <v-card-text class="card-padding pb-0">
      <world-map
        class="vector-map vector-map-sm"
        :map-data="mapData"
        :points="points"
      >
      </world-map>
      <v-list class="py-0">
        <v-list-item
          v-for="(item, i) in real"
          :key="item.country"
          class="px-0 py-4"
          :class="{ 'border-bottom': i != real.length - 1 }"
        >
          <v-list-item-avatar
            width="23"
            height="17"
            min-width="23"
            class="my-0 me-7 rounded-0"
          >
            <v-img :alt="`${item.flag} avatar`" :src="item.flag"></v-img>
          </v-list-item-avatar>
          <v-row>
            <v-col class="py-0">
              <v-list-item-content>
                <span class="text-h5 text-body mb-2">Country:</span>
                <v-list-item-title
                  v-text="item.country"
                  class="text-typo text-h5 font-weight-600 mb-2"
                ></v-list-item-title>
              </v-list-item-content>
            </v-col>

            <v-col class="py-0">
              <v-list-item-content>
                <span class="text-h5 text-body mb-2">Visits:</span>
                <v-list-item-title
                  v-text="item.visits"
                  class="text-typo text-h5 font-weight-600 mb-2 me-5"
                ></v-list-item-title>
              </v-list-item-content>
            </v-col>

            <v-col class="py-0">
              <v-list-item-content>
                <span class="text-h5 text-body mb-2">Bounce:</span>
                <v-list-item-title
                  v-text="item.bounce"
                  class="text-typo text-h5 font-weight-600 mb-2"
                ></v-list-item-title>
              </v-list-item-content>
            </v-col>
          </v-row>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
import WorldMap from "@/components/WorldMap/WorldMap.vue";
export default {
  name: "map-card",
  components: {
    WorldMap,
  },
  data() {
    return {
      mapData: {
        AUS: 760,
        BRA: 900,
        CAN: 120,
        DEU: 1300,
        FRA: 540,
        GBR: 690,
        GEO: 200,
        IND: 200,
        ROU: 600,
        RUS: 757,
        USA: 1800,
      },
      points: [
        {
          name: "Brazil",
          centered: "BRA",
        },
        {
          name: "France",
          centered: "FRA",
        },
        {
          name: "Italy",
          centered: "ITA",
        },
        {
          name: "Oman",
          centered: "OMN",
        },
        {
          name: "Indonesia",
          centered: "IDN",
        },
        {
          name: "Romania",
          centered: "ROU",
        },
      ],
      real: [
        {
          flag: require("@/assets/img/flags/US.png"),
          country: "United States",
          visits: "2500",
          bounce: "30%",
        },
        {
          flag: require("@/assets/img/flags/DE.png"),
          country: "Germany",
          visits: "2500",
          bounce: "30%",
        },
        {
          flag: require("@/assets/img/flags/GB.png"),
          country: "Great Britain",
          visits: "2500",
          bounce: "30%",
        },
      ],
    };
  },
};
</script>
