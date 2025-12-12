<template>
  <div class="post-view-container">
    <div v-for="(item, index) in postStore.getPostsByUser(userStore.currentUser.id)" :key="index" class="post-view-content">
      <preview-post :postdata="item"/>

    </div>
  </div>
</template>

<script setup>
import PreviewPost from "@/components/client/account/previewPost.vue";
import {usePostStore, useUserStore} from "@/stores/index.js";


const userStore = useUserStore();
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