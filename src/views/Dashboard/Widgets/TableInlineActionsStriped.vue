<template>
  <v-card class="card-shadow mt-6">
    <div class="card-header-padding card-border-bottom">
      <v-row>
        <v-col>
          <p class="font-weight-600 text-h3 text-typo mb-0">Striped Table</p>
        </v-col>
        <v-col class="text-right">
          <v-btn
            elevation="0"
            small
            :ripple="false"
            class="font-weight-600 text-capitalize btn-primary py-1 px-2 rounded-sm"
            color="#5e72e4"
          >
            <v-icon class="me-2" size="11">fas fa-user-edit</v-icon>
            Export
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-card-text class="px-0 py-0">
      <v-simple-table class="table table-striped">
        <template v-slot:default>
          <thead class="thead-light">
            <tr>
              <th class="text-left ps-6">Author</th>
              <th class="text-left ps-6">Created At</th>
              <th class="text-left">Product</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in projects" :key="item.id">
              <td class="border-bottom">
                <v-list class="py-0">
                  <v-list-item class="px-0 py-4">
                    <v-list-item-avatar :size="48" class="my-0 me-5">
                      <v-img :alt="item.imgSrc" :src="item.imgSrc"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        class="text-body text-h5 ls-0 font-weight-600"
                        ><b>{{ item.name }}</b></v-list-item-title
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </td>
              <td class="text-body border-bottom text-h5">
                {{ item.date }}
              </td>
              <td class="text-body border-bottom text-h5">
                <a href="javascript:;" class="text-decoration-none">{{
                  item.link
                }}</a>
              </td>
              <td class="border-bottom">
                <v-tooltip color="#212529" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      size="14"
                      class="text-muted me-2 cursor-pointer"
                      >fas fa-user-edit</v-icon
                    >
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip color="#212529" top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      v-bind="attrs"
                      v-on="on"
                      size="14"
                      class="text-muted me-2 cursor-pointer"
                      >fas fa-trash</v-icon
                    >
                  </template>
                  <span>Delete</span>
                </v-tooltip>
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
  name: "light-table",
  data() {
    return {
      projects: [
        {
          id: 0,
          name: "John Michael",
          imgSrc: require("@/assets/img/team-1.jpg"),
          date: "10/09/2018",
          link: "Argon Dashboard PRO",
        },
        {
          id: 1,
          name: "Alexandra Smith",
          imgSrc: require("@/assets/img/team-2.jpg"),
          date: "08/09/2018",
          link: "Argon Design System",
        },
        {
          id: 2,
          name: "Samantha Ivy",
          imgSrc: require("@/assets/img/team-3.jpg"),
          date: "30/08/2018",
          link: "Black Dashboard",
        },
        {
          id: 3,
          name: "John Michael",
          imgSrc: require("@/assets/img/team-1.jpg"),
          date: "10/09/2018",
          link: "Argon Dashboard PRO",
        },
        {
          id: 4,
          name: "Alexandra Smith",
          imgSrc: require("@/assets/img/team-2.jpg"),
          date: "30/09/2018",
          link: "Vue Argon Dashboard",
        },
      ],
    };
  },
};
</script>
