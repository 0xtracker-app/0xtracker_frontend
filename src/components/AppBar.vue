<template>
  <div>
    <v-container fluid>
      <v-row class="d-flex">
        <v-col class="d-flex align-center px-0" cols="12">
          <v-btn
            elevation="0"
            :ripple="false"
            height="43"
            class="font-weight-600 text-capitalize drawer-toggler py-3 px-0 px-sm-6 rounded-sm"
            :class="{
              'btn-dark-toggler-hover': !hasBg,
              'btn-toggler-hover': hasBg,
              active: togglerActive,
            }"
            :style="{
              minWidth: $vuetify.breakpoint.smAndDown ? '32px' : 'auto',
            }"
            v-if="$vuetify.breakpoint.mobile"
            color="transparent"
            @click="drawerClose"
          >
            <div class="drawer-toggler-inner">
              <i
                class="drawer-toggler-line"
                :class="[darkmode ? 'bg-white' : 'bg-black']"
              ></i>
              <i
                class="drawer-toggler-line"
                :class="[darkmode ? 'bg-white' : 'bg-black']"
              ></i>
              <i
                class="drawer-toggler-line"
                :class="[darkmode ? 'bg-white' : 'bg-black']"
              ></i>
            </div>
          </v-btn>
          <HorizontalForm style="width: 100%" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import HorizontalForm from "@/views/Forms/HorizontalForm.vue";
import { mapGetters } from "vuex";

export default {
  name: "app-bar",
  components: {
    HorizontalForm,
  },
  props: {
    background: String,
    hasBg: Boolean,
    linkColor: String,
    toggleActive: Boolean,
  },
  data() {
    return {
      drawer: false,
      togglerActive: false,
    };
  },
  methods: {
    drawerClose() {
      this.togglerActive = !this.togglerActive;
      this.$emit("drawer-toggle", true);
    },
  },
  computed: {
    ...mapGetters("generalStore", ["darkmode"]),
  },
  watch: {
    toggleActive(val) {
      this.togglerActive = val;
    },
  },
};
</script>
