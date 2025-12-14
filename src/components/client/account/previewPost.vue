<template>

  <img :src="avatarSrc" class="post-view" alt=""/>

</template>

<script setup>

import {computed, onBeforeUnmount} from "vue";

const props = defineProps({
  postdata: {
    type: Object,
    required: true,
  },
});

const defaultAvatar = computed(()=> {
  return require("@/assets/no_avatar.png");
})


const avatarSrc = computed(()=> {
  if (!props.postdata.image) {
    return defaultAvatar;
  }

  if (props.postdata.image && props.postdata.image.type === "Buffer" && Array.isArray(props.postdata.image.data)) {
    const uint8Array = new Uint8Array(props.postdata.image.data);

    // Lire les 4 premiers octets pour deviner le type
    const header = uint8Array.slice(0, 4).join(' ');
    let mimeType = 'image/png'; // fallback

    if (header === '255 216 255 224' || header === '255 216 255 225') {
      mimeType = 'image/jpeg';
    } else if (header === '137 80 78 71') {
      mimeType = 'image/png';
    } else if (header === '71 73 70 56') {
      mimeType = 'image/gif';
    } else if (header === '82 73 70 70') {
      mimeType = 'image/webp';
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  return props.postdata.image; // déjà une URL ou base64
})

onBeforeUnmount(()=> {

  if (avatarSrc) {
    URL.revokeObjectURL(avatarSrc)
  }
})

</script>




<style scoped>
img {
  height: 100%;

  aspect-ratio: 1/1;
}



</style>