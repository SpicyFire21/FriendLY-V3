<template>
  <div>
    <p v-if="user.realname">{{user.realname}}</p>
    <p v-else>{{user.pseudo}}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  user:{
    type:[Object],
    required:true
  }
});

</script>

<style scoped>
p  {
  margin: 0 !important;
}
</style>