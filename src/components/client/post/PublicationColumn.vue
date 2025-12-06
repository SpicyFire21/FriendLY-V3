<template>
  <div class="post-list">
    <div v-for="(post, index) in postsList" :key="index" class="post" >
      <!--      {{post}}-->
      <OnePost :postdata="post"/>
    </div>
    <div v-if="postsList.length === 0" class="no-posts">
      <b>Plantez les premières graines !</b>
      <em>Ajouter vos premiers amis</em>
    </div>
  </div>
</template>


<script setup>
import OnePost from "@/components/client/post/OnePost.vue";
import {usePostStore, useUserStore} from "@/stores/index.js";
import {computed, onMounted, ref} from "vue";

let followersPosts = ref([])

const userStore = useUserStore();
const postStore = usePostStore();

const postsList = computed(() => followersPosts.value)


async function setFollowersPosts(){
  const f = userStore.followers.map(follower => follower.iduser_1)
  followersPosts.value = postStore.posts.filter(item => f.includes(item.authorid) || item.authorid === userStore.currentUser.id)
}

onMounted(async()=>{
  await userStore.getUsersToStore();
  await postStore.getPostsToStore();
  await setFollowersPosts();
  await postStore.getLoves();
  await postStore.getLikes();
})

</script>



<style>
.post {
  /*border: 2px solid var(--GrisNuit);*/
  width: 30vw;
  margin-top: 15px;
  background-color: var(--BlancPur);
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

}
.post-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
.post-author p {
  margin: auto 0 !important;
  font-weight: bold;
  color: var(--GrisNuit);
  border-bottom: 0;
}
.post-buttons button {
  font-size: 16px;
  cursor: pointer;
  padding: 3px;
  transition: 0.3s;
}
hr {
  background-color: var(--GrisNuit);
  margin: 5px 0;
}
.post-description p {
  color: var(--GrisNuit);
  font-size: 14px;
  line-height: 1.5;
  padding: 5px 10px;
}

.post-description {
  padding:0 5px;
}

.no-posts {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  background-color: var(--BlancPur);
  border: 2px solid var(--GrisNuit);
  width: 30vw;
  margin-top: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>
