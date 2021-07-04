<template>
  <v-card class="card-shadow mt-6 bg-default">
    <div class="card-header-padding card-border-bottom">
      <p class="font-weight-600 text-h3 text-white mb-0">Dark table</p>
    </div>

    <v-card-text class="px-0 py-0">
      <v-simple-table class="table bg-default table-border-dark">
        <template v-slot:default>
          <thead class="thead-dark">
            <tr>
              <th class="text-left ps-6">
                Project
                <i class="fas fa-sort"></i>
              </th>
              <th class="text-left ps-6">
                Budget
                <i class="fas fa-sort"></i>
              </th>
              <th class="text-left">
                Status
                <i class="fas fa-sort"></i>
              </th>
              <th class="text-left">Users</th>
              <th class="text-left">
                Completion
                <i class="fas fa-sort"></i>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in projects" :key="item.id">
              <td :class="{ 'border-bottom': i != projects.length - 1 }">
                <v-list class="py-0 bg-default">
                  <v-list-item class="px-0 py-4">
                    <v-list-item-avatar :size="48" class="my-0 me-5">
                      <v-img :alt="item.imgSrc" :src="item.imgSrc"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        class="text-white text-subtitle-2 ls-0 font-weight-600"
                        >{{ item.project }}</v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </td>
              <td
                class="text-white text-h5"
                :class="{ 'border-bottom': i != projects.length - 1 }"
              >
                {{ item.budget }}
              </td>
              <td
                class="text-white text-h5"
                :class="{ 'border-bottom': i != projects.length - 1 }"
              >
                <div class="d-flex align-center">
                  <span :class="`text-${item.statusColor}`" class="me-1"
                    >●</span
                  >
                  {{ item.status }}
                </div>
              </td>
              <td :class="{ 'border-bottom': i != projects.length - 1 }">
                <span class="avatar-group d-flex me-2">
                  <v-tooltip
                    v-for="avatar in projects[i].avatars"
                    :key="avatar.avatarSrc"
                    top
                    color="#212529"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-avatar size="32" v-bind="attrs" v-on="on">
                        <img :src="avatar.avatarSrc" :alt="avatar.avatarSrc" />
                      </v-avatar>
                    </template>
                    <span>{{ avatar.tooltipName }}</span>
                  </v-tooltip>
                </span>
              </td>
              <td :class="{ 'border-bottom': i != projects.length - 1 }">
                <div class="d-flex align-center">
                  <span class="me-2 text-white text-h5"
                    >{{ item.progressValue }}%</span
                  >
                  <v-progress-linear
                    class="progress-shadow"
                    :value="item.progressValue"
                    rounded
                    background-color="#e9ecef"
                    :color="item.progressColor"
                  ></v-progress-linear>
                </div>
              </td>
              <td :class="{ 'border-bottom': i != projects.length - 1 }">
                <v-btn
                  color="transparent elevation-0"
                  class="px-0"
                  :ripple="false"
                >
                  <v-icon class="text-light">fa-ellipsis-v</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "light-table-transparent",
  data() {
    return {
      projects: [
        {
          id: 0,
          project: "Argon Design System",
          imgSrc: require("@/assets/img/bootstrap.jpg"),
          budget: "$2500",
          status: "pending",
          statusColor: "warning",
          avatars: [
            {
              avatarSrc: require("@/assets/img/team-1.jpg"),
              tooltipName: "Ryan Thompson",
            },
            {
              avatarSrc: require("@/assets/img/team-2.jpg"),
              tooltipName: "Romina Hadid",
            },
            {
              avatarSrc: require("@/assets/img/team-3.jpg"),
              tooltipName: "Alexander Smith",
            },
            {
              avatarSrc: require("@/assets/img/team-4.jpg"),
              tooltipName: "Jessica Doe",
            },
          ],
          progressValue: "90",
          progressColor: "#fb6340",
        },
        {
          id: 1,
          project: "Angular Now UI Kit PRO",
          imgSrc: require("@/assets/img/angular.jpg"),
          budget: "$1800",
          status: "completed",
          statusColor: "success",
          avatars: [
            {
              avatarSrc: require("@/assets/img/team-1.jpg"),
              tooltipName: "Ryan Thompson",
            },
            {
              avatarSrc: require("@/assets/img/team-2.jpg"),
              tooltipName: "Romina Hadid",
            },
            {
              avatarSrc: require("@/assets/img/team-3.jpg"),
              tooltipName: "Alexander Smith",
            },
            {
              avatarSrc: require("@/assets/img/team-4.jpg"),
              tooltipName: "Jessica Doe",
            },
          ],
          progressValue: "100",
          progressColor: "#2dce89",
        },
        {
          id: 2,
          project: "Black Dashboard",
          imgSrc: require("@/assets/img/sketch.jpg"),
          budget: "$3150",
          status: "delayed",
          statusColor: "danger",
          avatars: [
            {
              avatarSrc: require("@/assets/img/team-1.jpg"),
              tooltipName: "Ryan Thompson",
            },
            {
              avatarSrc: require("@/assets/img/team-2.jpg"),
              tooltipName: "Romina Hadid",
            },
            {
              avatarSrc: require("@/assets/img/team-3.jpg"),
              tooltipName: "Alexander Smith",
            },
            {
              avatarSrc: require("@/assets/img/team-4.jpg"),
              tooltipName: "Jessica Doe",
            },
          ],
          progressValue: "73",
          progressColor: "#f5365c",
        },
        {
          id: 3,
          project: "React Material Dashboard",
          imgSrc: require("@/assets/img/react.jpg"),
          budget: "$4400",
          status: "on schedule",
          statusColor: "info",
          avatars: [
            {
              avatarSrc: require("@/assets/img/team-1.jpg"),
              tooltipName: "Ryan Thompson",
            },
            {
              avatarSrc: require("@/assets/img/team-2.jpg"),
              tooltipName: "Romina Hadid",
            },
            {
              avatarSrc: require("@/assets/img/team-3.jpg"),
              tooltipName: "Alexander Smith",
            },
            {
              avatarSrc: require("@/assets/img/team-4.jpg"),
              tooltipName: "Jessica Doe",
            },
          ],
          progressValue: "90",
          progressColor: "#11cdef",
        },
        {
          id: 4,
          project: "Vue Paper UI Kit PRO",
          imgSrc: require("@/assets/img/vue.jpg"),
          budget: "$2200",
          status: "completed",
          statusColor: "success",
          avatars: [
            {
              avatarSrc: require("@/assets/img/team-1.jpg"),
              tooltipName: "Ryan Thompson",
            },
            {
              avatarSrc: require("@/assets/img/team-2.jpg"),
              tooltipName: "Romina Hadid",
            },
            {
              avatarSrc: require("@/assets/img/team-3.jpg"),
              tooltipName: "Alexander Smith",
            },
            {
              avatarSrc: require("@/assets/img/team-4.jpg"),
              tooltipName: "Jessica Doe",
            },
          ],
          progressValue: "100",
          progressColor: "#2dce89",
        },
        {
          id: 5,
          project: "Argon Design System",
          imgSrc: require("@/assets/img/bootstrap.jpg"),
          budget: "$2500",
          status: "pending",
          statusColor: "warning",
          avatars: [
            {
              avatarSrc: require("@/assets/img/team-1.jpg"),
              tooltipName: "Ryan Thompson",
            },
            {
              avatarSrc: require("@/assets/img/team-2.jpg"),
              tooltipName: "Romina Hadid",
            },
            {
              avatarSrc: require("@/assets/img/team-3.jpg"),
              tooltipName: "Alexander Smith",
            },
            {
              avatarSrc: require("@/assets/img/team-4.jpg"),
              tooltipName: "Jessica Doe",
            },
          ],
          progressValue: "60",
          progressColor: "#fb6340",
        },
      ],
    };
  },
};
</script>
