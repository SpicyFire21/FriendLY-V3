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
import { ref, watch, onBeforeUnmount } from 'vue'

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
})

const defaultAvatar = new URL('@/assets/no_avatar.png', import.meta.url).href
const avatarSrc = ref(defaultAvatar)

function revoke() {
  if (avatarSrc.value && avatarSrc.value.startsWith('blob:')) {
    URL.revokeObjectURL(avatarSrc.value)
  }
}

watch(
    () => props.avatar,
    (avatar) => {
      revoke()

      if (!avatar) {
        avatarSrc.value = defaultAvatar
        return
      }

      if (avatar.type === 'Buffer' && Array.isArray(avatar.data)) {
        const bytes = new Uint8Array(avatar.data)
        const header = bytes.slice(0, 4).join(' ')
        let mime = 'image/png'

        if (header === '255 216 255 224' || header === '255 216 255 225') mime = 'image/jpeg'
        else if (header === '71 73 70 56') mime = 'image/gif'
        else if (header === '82 73 70 70') mime = 'image/webp'

        avatarSrc.value = URL.createObjectURL(new Blob([bytes], { type: mime }))
        return
      }

      avatarSrc.value = avatar
    },
    { immediate: true }
)

onBeforeUnmount(revoke)
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
