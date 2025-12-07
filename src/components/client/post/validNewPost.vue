<template>
  <div class="preview-content">
    <div class="preview-content-img">
      <img :src="props.preview" alt="preview post">
      <div class="bar-h"></div>

      <div>{{text}}</div>
    </div>

    <div class="bar-v"></div>

    <div class="post-detail">
      <textarea placeholder="Entrez votre description" v-model="text" maxlength="2200"
      ></textarea>
      <div class="bar-h"></div>
      <p class="no-margin">{{2200-text.length }} </p>
      <v-spacer></v-spacer>
      <div class="actions">
        <button id="close" @click="$emit('close')">Abandonner</button>
        <button id="valid" @click="$emit('valid',text)">Publier</button>
      </div>

    </div>
  </div>
</template>

<script setup>

import {ref} from "vue";

let text = ref('')

const props = defineProps({
  preview: {
    type:String,
    required:false
  }
});

</script>


<style scoped>

.post-detail textarea {
  overflow: auto;
  resize: none;
  height: 250px;
  outline: none;
  padding: 1px;
  font-size: 16px;      /* optionnel : meilleure lisibilité */
  width: 100%;

}

.preview-content {
  display: flex;
  gap: 5px;
  flex-direction: row;
  width: 100%;
  padding: 0 5px;
}
.preview-content img {
  max-width: 100%;

}

.preview-content-img {
  width: 600px;
  aspect-ratio: 1/1;
}

.bar-v {
  background-color: var(--GrisNuit);
  width: 3px;
  height: 400px;
}

.bar-h {
  background-color: var(--GrisNuit);
  width: 100%;
  height: 1px;
  margin: 2px 0;
}

.post-detail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
}

.no-margin {
  margin: 0 !important;
}

p {
  padding-right: 10px;
}

.actions {
  width:100%;
  display: flex;
  flex-direction:row ;
  justify-content: space-evenly;

}





.actions button#valid {
  background-color: var(--BleuFonce);
  border-radius: 10px;
  padding:2px 15px;
  color: var(--GrisPerle);
}

.actions button#close {
  background-color: var(--red );
  border-radius: 10px;
  padding:2px 15px;
  color: var(--GrisPerle);
}

.actions button#valid:hover {
  color: var(--GrisNuit);
  background-color: var(--BleuClair);
  transition: ease-in-out 0.2s;
}

.actions button#close:hover {
  color: var(--GrisNuit);
  background-color: var(--red2);
  transition: ease-in-out 0.2s;
}
</style>