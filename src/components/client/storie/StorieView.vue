<template>
  <div class="storie-view" @click="viewStorie()">
    <AvatarView :avatar="avatarSRC" size="50px"/>
    <div class="storie-content" v-if="index === activeIndex">
      <p>{{storieName}}</p>
    </div>
  </div>
</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import {computed} from "vue";

const emit = defineEmits(['update-active']);
const props = defineProps({
  avatar: {
    type: [Object,String],
    required: false
  },
  index: {
    type: Number,
    required: true
  },
  activeIndex: {
    type: Number,
    required: false },
  storieName: {
    type: String,
    required: false
  }
});


const avatarSRC = computed(()=>{
  if(props.avatar === "ERROR-AVATAR-USER-NOT-FOUND"){
    return defaultAvatar;
  }
  return props.avatar
})

const defaultAvatar = computed(()=> {
  new URL('@/assets/no_avatar.png', import.meta.url).href
})


function viewStorie() {
  emit('update-active', props.index);
}

</script>



<style>
.storie-content {
  position: fixed;
  z-index: 300;
  top: 0;
  left: 0;
  background-color:var(--blurBackground) ;
  width: 100vw;
  height: 100vh;
}

.storie-view{
  display: flex;
  justify-content: center;
  align-items: center;
  border: 3px solid var(--BlancPur);
  border-radius:100%;
}
</style>