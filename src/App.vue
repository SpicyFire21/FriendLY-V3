<template>
  <v-app>

    <v-main>
      <LogNewpost/>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import LogNewpost from "@/components/client/post/LogNewPost.vue";

export default {
  name: 'App',
  components: {LogNewpost},
  data: () => ({}),
};
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
