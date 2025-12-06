<template>
  <v-container fluid class="pa-0 ma-0 Vrow">
    <AsideBar/>
<!--    <div class="scroll-content">-->
<!--      <StoriesView/>-->
<!--      <PublicationColumn/>-->
<!--      <SendPost/>-->
<!--    </div>-->
    <Account/>
  </v-container>
</template>

<script setup>
import StoriesView from "@/components/client/storie/StoriesList.vue";
import PublicationColumn from "@/components/client/post/PublicationColumn.vue";
import Account from "@/components/client/account/AccountSuggestView.vue";
import AsideBar from "@/components/navigation/AsideBar.vue";
import SendPost from "@/components/utils/sendPost.vue";

import {getCurrentInstance, onMounted} from "vue"
import mitt from "mitt";

const socket = getCurrentInstance().appContext.config.globalProperties.$socket
const emitter = mitt(); // remplacement EventBus

onMounted( async()=> {
    // socket en Vue 3 => injecté via app.config.globalProperties
      socket.on("connect", () => {
      console.log("✅ Connecté au serveur socket");
    });

    if (sessionStorage.getItem("toastPost")) {
      emitter.emit("toast");
      sessionStorage.removeItem("toastPost");
    }
  })

</script>

<style>
.Vrow {
  display: flex;
  justify-content: space-between;
}

.scroll-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: fit-content;
  margin: 0 auto;
  width: 500px;
}
</style>
