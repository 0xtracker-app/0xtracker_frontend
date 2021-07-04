<template>
  <v-card class="card-shadow">
    <div class="card-header-padding card-border-bottom">
      <p class="font-weight-600 text-h3 text-typo mb-0">To do list</p>
    </div>
    <v-card-text class="card-padding py-3">
      <v-list class="py-0">
        <v-list-item
          v-for="(chat, index) in checklist"
          :key="chat.title"
          class="px-0 py-4 align-stretch"
          :class="{ 'border-bottom': index != checklist.length - 1 }"
        >
          <div
            class="checklist-line-width my-2 me-2 rounded"
            :class="`bg-${chat.color}`"
          ></div>
          <v-list-item-content>
            <v-list-item-title
              v-text="chat.title"
              class="text-typo text-h5 font-weight-600 mb-2"
              :class="{
                'text-decoration-line-through': checkList(index),
              }"
            ></v-list-item-title>
            <span
              class="text-body"
              :class="{
                'text-decoration-line-through': checkList(index),
              }"
            >
              {{ chat.status }}
            </span>
          </v-list-item-content>

          <div class="d-flex align-center">
            <v-checkbox
              v-model="checkboxModel"
              :value="index"
              :color="chat.checkboxActiveColor"
              :ripple="false"
              class="ma-0 checkbox-custom checkbox-thinner"
              hide-details
            ></v-checkbox>
          </div>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "ToDoList",
  data() {
    return {
      checkboxModel: [],
      checklist: [
        {
          title: "Call with Dave",
          status: "10:30 am",
          color: "success",
          checkboxActiveColor: "#2dce89",
        },
        {
          title: "Lunch meeting",
          status: "10:30 am",
          color: "warning",
          checkboxActiveColor: "#fb6340",
        },
        {
          title: "Argon Dashboard Launch",
          status: "10:30 am",
          color: "danger",
          checkboxActiveColor: "#f5365c",
        },
        {
          title: "Winter Hackaton",
          status: "10:30 am",
          color: "success",
          checkboxActiveColor: "#2dce89",
        },
      ],
    };
  },
  methods: {
    checkList(index) {
      if (this.checkboxModel.includes(index)) {
        return true;
      } else {
        return;
      }
    },
  },
};
</script>
