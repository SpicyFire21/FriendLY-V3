<template>
  <img
      :src="avatarSrc"
      alt="Avatar"
      class="avatar"
      :style="{ width: size }"
      :class="{ hide: !show }"
  >
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  avatar: {
    type: [String, Object],
    default: null
  },
  size: {
    type: String,
    default: '50px'
  },
  show: {
    type: Boolean,
    default: true
  }
});

// Image par défaut
const defaultAvatar = new URL('@/assets/no_avatar.png', import.meta.url).href;

// Computed pour déterminer la source de l'image
const avatarSrc = computed(() => {
  if (!props.avatar) return defaultAvatar;

  // Si c'est un Buffer stocké côté serveur
  if (props.avatar.type === 'Buffer' && Array.isArray(props.avatar.data)) {
    const uint8Array = new Uint8Array(props.avatar.data);

    // Détecter le type MIME via les premiers octets
    const header = uint8Array.slice(0, 4).join(' ');
    let mimeType = 'image/png';

    if (header === '255 216 255 224' || header === '255 216 255 225') mimeType = 'image/jpeg';
    else if (header === '137 80 78 71') mimeType = 'image/png';
    else if (header === '71 73 70 56') mimeType = 'image/gif';
    else if (header === '82 73 70 70') mimeType = 'image/webp';

    const blob = new Blob([uint8Array], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  return props.avatar; // URL ou base64 déjà prêt
});
</script>

<style>
.avatar {
  border-radius: 100%;
  aspect-ratio: 1/1;
}

.hide {
  display: none;
}
</style>
