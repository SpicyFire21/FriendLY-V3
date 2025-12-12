<template>
  <v-container fluid class="pa-0 ma-0 Vrow">
    <AsideBar/>
    <div class="message-container">
      <AsideBarMessage/>
      <MessageContent/>
    </div>
  </v-container>
</template>

<script setup>
import AsideBar from "@/components/navigation/AsideBar.vue";
import AsideBarMessage from "@/components/client/message/AsideBarMessage.vue";
import MessageContent from "@/components/client/message/MessageContent.vue"
</script>

<style >
.message-container {
  margin-left: 1.5px;

}



</style>