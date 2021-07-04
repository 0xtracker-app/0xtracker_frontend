<template>
  <div class="d-flex align-start mt-8 media-comment">
    <v-avatar :size="avatarSize" class="media-comment-avatar">
      <img :src="require(`@/assets/img/${imgSrc}`)" :alt="imgSrc" />
    </v-avatar>
    <div class="media-body">
      <div class="media-comment-text rounded-lg">
        <slot>add some content for the media comment</slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "media-comment",
  props: {
    imgSrc: String,
    avatarSize: Number,
  },
};
</script>
