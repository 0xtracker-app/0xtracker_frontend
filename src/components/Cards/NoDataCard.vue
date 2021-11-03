<template>
  <v-card>
    <v-progress-linear
      v-if="loading"
      :indeterminate="loading"
      color="indigo lighten-1"
    ></v-progress-linear>
    <v-card-text class="text-center">
      <p v-if="loading"></p>
      <p v-else>No data available...</p>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },
};
</script>
