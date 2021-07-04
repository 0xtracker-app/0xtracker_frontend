<template>
  <v-card class="card-shadow">
    <div class="card-header-padding card-border-bottom">
      <p class="font-weight-600 text-h3 text-typo mb-0">Progress Track</p>
    </div>
    <v-card-text class="card-padding">
      <v-list class="py-0">
        <v-list-item
          v-for="(el, index) in progress"
          :key="el.title"
          class="px-0 py-4"
          :class="{ 'border-bottom': index != progress.length - 1 }"
        >
          <v-list-item-avatar :size="48" class="my-0 me-5">
            <v-img :alt="`${el.title} avatar`" :src="el.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
              v-text="el.title"
              class="text-typo text-h5 font-weight-600 mb-3"
            ></v-list-item-title>
            <v-progress-linear
              class="progress-shadow"
              :value="el.progressValue"
              rounded
              background-color="#e9ecef"
              :color="el.color"
            ></v-progress-linear>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "progress-track",
  data() {
    return {
      progress: [
        {
          avatar: require("@/assets/img/bootstrap.jpg"),
          title: "Argon Design System",
          color: "#2dce89",
          progressValue: "60",
        },
        {
          avatar: require("@/assets/img/angular.jpg"),
          title: "Angular Now UI Kit PRO",
          color: "#fb6340",
          progressValue: "100",
        },
        {
          avatar: require("@/assets/img/sketch.jpg"),
          title: "Black Dashboard",
          color: "#f5365c",
          progressValue: "72",
        },
        {
          avatar: require("@/assets/img/react.jpg"),
          title: "React Material Dashboard",
          color: "#11cdef",
          progressValue: "90",
        },
      ],
    };
  },
};
</script>
