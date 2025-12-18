<template>
  <div class="post-view-container">

    <div
        v-if="postStore.getPostsByUser(CurrentUser.id).length !==0"
         v-for="(item, index) in postStore.getPostsByUser(CurrentUser.id)"
        :key="index"
        class="post-view-content">
      <preview-post :postdata="item"/>

    </div>
    <div v-else>
      <h1>Poster votre première publication !</h1>
    </div>
  </div>
</template>

<script setup>
import PreviewPost from "@/components/client/account/previewPost.vue";
import {usePostStore, useUserStore} from "@/stores/index.js";
import {computed} from "vue";
import {useRoute} from "vue-router";
const route = useRoute()

const routeUserName = computed(() => route.params.pseudo)
const CurrentUser = computed(() => {
  return usersStore.getUserByPseudo(routeUserName.value)
})
const usersStore = useUserStore();
const postStore = usePostStore();

</script>


<style>
.post-view-container {
  display: grid;

  /* auto-fit = remplira les colonnes autant que possible */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  grid-auto-rows: 250px; /* hauteur fixe si tu veux, sinon auto */
  gap: 10px; /* remplace grid-row-gap + grid-column-gap */

  justify-items: center;
  padding: 15px 55px;
}

.post-view-content {
  border-radius: 4px;
  border: var(--GrisNuit) 2px solid;

  box-sizing: border-box;
}

</style>