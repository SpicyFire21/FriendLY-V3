<template>
  <nav class="stories-list">
    <div v-for="(item,index) in userStore.followers" :key="item.id" class="storie">

      <StoriesView
          :avatar="userStore.getAvatarByUserID(item.iduser_1)"
          :index="index" :activeIndex="activeIndex" @update-active="setActiveIndex" :storieName="item.pseudo"/>
    </div>
    <div v-if="userStore.followers.length < 5" class="add-more-friends">
      Soyez plus FriendLY !
    </div>
  </nav>

</template>

<script setup>
import StoriesView from '@/components/client/storie/StorieView.vue'
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/index.js";

let activeIndex = ref(null)

const userStore = useUserStore()

function setActiveIndex(index) {
  activeIndex.value = activeIndex.value === index ? null : index;
}


onMounted(async()=>{
  await userStore.getFollowersByUserID(userStore.currentUser.id)
})


</script>




<style>
.stories-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 10px 0 10px;
  scroll-behavior: smooth;

  width: 500px;
}



.storie {
  width:60px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  flex-shrink: 0;
  scroll-snap-align: start;
  display: flex;
  justify-content: center;
  align-items: center;
}

.storie{
  background-color: var(--Violet);
}

.storie:hover{
  background-color: var(--BleuClair);
  cursor: pointer;
  transition: background-color 0.1s ease, transform 0.2s ease;

}

.add-more-friends {
  color:var(--BleuFonce)
}
</style>