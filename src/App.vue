<template>
  <v-app>
    <v-main>
      <LogNewpost/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script setup>
import LogNewpost from "@/components/client/post/LogNewPost.vue";
</script>

<style>

nav {
  background-color: var(--BlancPur);
  height: 13vh;
  display: flex;
  align-items: center;
  overflow: hidden;

}

</style>
