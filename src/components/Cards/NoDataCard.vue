<template>
  <v-card class="card-shadow">
    <v-card-text class="text-center">
      <p v-if="loading"></p>
      <p v-else>No data available...</p>
    </v-card-text>
    <v-overlay
      :absolute="true"
      :value="loading"
    >
      <div class="text-center">
        <v-progress-circular
          indeterminate
          color="white"
        ></v-progress-circular>
      </div>
    </v-overlay>
    <v-progress-linear
      :indeterminate="loading"
      color="#5e72e4"
    ></v-progress-linear>
  </v-card>
</template>

<script>
export default {
  props: {
    loading: Boolean,
  },
}
</script>