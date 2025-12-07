<template>
  <div class="background-dialog" v-if="postStore.showDialog">
    <div class="dialog">
      <div class="dialog-header">
        <h3>Créer une nouvelle publication</h3>
      </div>
      <div class="dialog-content">
        <div class="logo" v-if="!showPreview">
          <i class="fa-img fa-solid fa-images fa-2xl" style="color: var(--BleuFonce);"></i>
        </div>

        <b v-if="!showPreview">Ajouter une photo ici</b>
        <button @click="triggerUpload" v-if="!showPreview">Choisir une Photo</button>
        <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*"  style="display: none"/>
        <PostCropper :showDialog="showCropper"
                     :key="previewPost"
                     :imagePreview="previewPost"
                     @close="showCropper = false"
                     @valid="handleCroppedImage"/>
        <validNewPost :preview="preview" v-if="showPreview" @close="close()" @valid="addPost" />
      </div>
    </div>

    <i @click="close()" class="fa-lefttop fa-3xl fa-solid fa-xmark fa-2xl" style="color: var(--BleuClair);"></i>

  </div>

</template>

<script setup>
import PostCropper from "@/components/utils/PostCropper.vue";
import ValidNewPost from "@/components/client/post/validNewPost.vue";
import {ref} from "vue";
import {usePostStore, useUserStore} from "@/stores/index.js";

let blobIMG = ref(null)
let previewPost = ref(null)
let showCropper = ref(false)
let showPreview = ref(false)
let preview = ref('')
const fileInput = ref(null)

const postStore = usePostStore();
const userStore = useUserStore();


function close(){
  postStore.updateShowDialog(false)
  previewPost.value=null;
  showCropper.value=false;
  showPreview.value=false;
  preview.value='';
}


function triggerUpload() {
  fileInput.value?.click()
}

function handleFileUpload(event){
  const file = event.target.files[0];
  console.log("new post",URL.createObjectURL(file))

  previewPost.value = URL.createObjectURL(file);
  showCropper.value = true; // ← Active le cropper après avoir chargé l'image
}

async function handleCroppedImage(blob,url){
  showPreview.value=true;
  showCropper.value=false;
  preview.value =url;
  blobIMG.value=blob;
  console.log(blob,url)

}


async function addPost(text){
  let formData = new FormData();
  formData.append("authorid",userStore.currentUser.id)
  formData.append("publication",blobIMG.value)
  formData.append("description",text)
  await postStore.sendPost(formData);
  postStore.updateShowDialog(false);
  previewPost.value=null;
  showCropper.value=false;
  showPreview.value=false;
  preview.value='';
  sessionStorage.setItem('toastPost', 'true');

  window.location.reload();

  // alert("Votre publication s'est bien envoyé")


}

</script>




<style scoped>
.dialog {
  position: fixed;
  top: 50%;
  background-color: var(--GrisPerle);
  border-radius: 10px;
  border:2px solid var(--GrisNuit);
  transform: translate(0%, -50%);
  width: 500px;
  height: 500px;
}

.background-dialog {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  z-index: 10;
  background-color:var(--blurBackground) ;
  width: 100vw;
  height: 100vh;
}

.dialog-header {
  border-bottom: 1px var(--GrisNuit) solid;
  padding:4px 15px;
  text-align: center;
}

.dialog-content {

  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

b {
  color: var(--Violet);
}

.fa-img {
  font-size: 100px;
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  justify-content: center;
}

button {
  background-color: var(--BleuFonce);
  border-radius: 15px;
  padding: 5px;
  color: var(--GrisPerle);
}

button:hover {
  color: var(--GrisNuit);
  background-color: var(--BleuClair);
  transition: ease-in-out 0.2s;
}
</style>