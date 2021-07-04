<template>
  <v-card class="card-shadow mt-6">
    <div class="card-header-padding card-border-bottom">
      <v-row>
        <v-col>
          <p class="font-weight-600 text-h3 text-typo mb-0">
            Checkbox + Toggles
          </p>
        </v-col>
        <v-col class="text-right">
          <v-btn
            elevation="0"
            small
            :ripple="false"
            class="font-weight-600 text-capitalize btn-danger py-1 px-2 rounded-sm"
            color="#f5365c"
          >
            <v-icon class="me-2" size="11">fas fa-trash</v-icon>
            Delete
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-card-text class="px-0 py-0">
      <v-simple-table class="table row-height-auto">
        <template v-slot:default>
          <thead class="thead-light">
            <tr>
              <th class="text-left ps-6">Author</th>
              <th class="text-left ps-6">Created At</th>
              <th class="text-left">Product</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in projects" :key="item.id">
              <td class="border-bottom d-flex align-center">
                <v-checkbox
                  v-model="checkboxModel"
                  :value="i"
                  color="#5e72e4"
                  :ripple="false"
                  class="ma-0 checkbox-custom checkbox-thinner me-3"
                  hide-details
                ></v-checkbox>
                <span class="text-body text-h5 ls-0 font-weight-600 py-5"
                  ><b>{{ item.name }}</b></span
                >
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
                <v-switch
                  :ripple="false"
                  class="d-inline-flex mt-0 pt-0 switch"
                  :input-value="item.switche"
                  hide-details
                  color="#5e72e4"
                  inset
                ></v-switch>
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
      checkboxModel: [],
      projects: [
        {
          id: 0,
          name: "John Michael",
          date: "10/09/2018",
          link: "Argon Dashboard PRO",
          switche: true,
        },
        {
          id: 1,
          name: "Alexandra Smith",
          date: "08/09/2018",
          link: "Argon Design System",
          switche: false,
        },
        {
          id: 2,
          name: "Samantha Ivy",
          date: "30/08/2018",
          link: "Black Dashboard",
          switche: false,
        },
        {
          id: 3,
          name: "John Michael",
          date: "10/09/2018",
          link: "Argon Dashboard PRO",
          switche: true,
        },
        {
          id: 4,
          name: "Alexandra Smith",
          date: "30/09/2018",
          link: "Vue Argon Dashboard",
          switche: true,
        },
      ],
    };
  },
};
</script>
