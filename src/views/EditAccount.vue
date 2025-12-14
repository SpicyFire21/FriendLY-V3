<template>
  <v-container fluid class="pa-0 ma-0">

    <AsideBar/>
    <div class="account-edit">
      <form action="" class="account-edit-form" @submit.prevent="editAccount" enctype="multipart/form-data">
        <div class="account-edit-form-avatar">
          <div class="avatar-wrapper" @click="triggerUpload">
            <AvatarView :avatar="cropped || user.avatar" size="400px" />
            <i class="fa-solid fa-pencil fa-2xl edit-icon"></i>
            <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" />

          </div>
        </div>
        <div class="account-edit-form-content">




          <div class="form-inputs">

            <div class="form-input-content">
              <label for="pseudo">
                <v-icon v-if="validPseudo" color="green">mdi-check-circle</v-icon>
                <v-icon v-if="!validPseudo" color="red">mdi-close-circle</v-icon>
                Pseudo<span>*</span></label>
              <input type="text" id="pseudo" required v-model="user.pseudo" @input="checkPseudo(user.pseudo)">
            </div>

            <div class="form-input-content">
              <label for="realName">
                <v-icon v-if="validName" color="green">mdi-check-circle</v-icon>
                <v-icon v-if="!validName" color="red">mdi-close-circle</v-icon>
                Nom D'affichage</label>
              <input type="text" v-model="user.realname" :placeholder="user.pseudo" @input="checkName(user.realname)">
            </div>

            <div class="form-input-content">
              <label for="email">
                <v-icon v-if="validEmail" color="green">mdi-check-circle</v-icon>
                <v-icon v-if="!validEmail" color="red">mdi-close-circle</v-icon>
                Email<span>*</span></label>
              <input type="email" id="email" required v-model="user.email" @input="checkEmail(user.email)">
            </div>

            <div class="form-input-content">
              <label for="bio">
                <v-icon v-if="validBio" color="green">mdi-check-circle</v-icon>
                <v-icon v-if="!validBio" color="red">mdi-close-circle</v-icon>
                Bio</label>
              <textarea id="bio" v-model="user.bio" @input="hasBanWord(user.bio)"></textarea>
            </div>

          </div>

          <button v-if="validBio && validName && validEmail && validPseudo" type="submit">Valider</button>
          <b v-if="validBio && validName && validEmail && validPseudo" class="valid-form">🫰😊</b>

          <b v-if="!validBio" >- Votre Biographie ne respectent pas notre politique "FriendLY"</b>
          <b v-if="!validName" >- Le Nom D'affichage doit contenir uniquement des lettres, des
            chiffres ou des underscores.</b>
          <b v-if="!validEmail" >- L'email n'est pas valide</b>
          <b v-if="!validPseudo" >- Le pseudo doit contenir uniquement des lettres, des chiffres ou
            des underscores.</b>
        </div>

      </form>
    </div>
    <AvatarCropper :showDialog="showCropper"
                   :key="previewAvatar"
                   :imagePreview="previewAvatar"
                   @close="showCropper = false"
                   @valid="handleCroppedImage"/>
  </v-container>


</template>


<script setup>
import AsideBar from "@/components/navigation/AsideBar.vue";
import AvatarView from "@/components/utils/AvatarView.vue";
import AvatarCropper from "@/components/utils/AvatarCropper.vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {useUserStore} from "@/stores/index.js";
import {useRouter} from "vue-router";

let bannedWords = ref([])
let validPseudo = ref(false)
let previewAvatar = ref(null)
let validEmail = ref(false)
let validName = ref(false)
let validBio = ref(false)
let cropped = ref(null)
let showCropper = ref(false)
let errorMessage =  ref("")

const fileInput = ref(null)


const user = ref({
  pseudo: "",
  realname: "",
  email: "",
  bio: "",
  avatar: null,
})

const router = useRouter();
const userStore = useUserStore();

const defaultAvatar = computed(()=>{
  return require("@/assets/no_avatar.png"); // Remplace par ton image par défaut

})



async function setDataOfCurrentUser() {
  user.value.pseudo = userStore.currentUser.pseudo
  user.value.realname = userStore.currentUser.realname
  user.value.email = userStore.currentUser.email
  user.value.bio = userStore.currentUser.bio
  user.value.avatar = userStore.currentUser.avatar

}
function handleCroppedImage(croppedImage,URL) {
  showCropper.value = false;
  cropped.value = URL;
  user.value.avatar = croppedImage;
  console.log(cropped.value," | ",user.value.avatar)

}

async function editAccount() {
  if (validName.value && validPseudo.value && validBio.value && validEmail.value) {
    // if (this.user.realname === '') {
    //   this.user.realname = this.user.pseudo;
    // }

    // Création du FormData
    const formData = new FormData();
    formData.append("id",userStore.currentUser.id)
    formData.append("pseudo", user.value.pseudo);
    formData.append("realname", user.value.realname);
    formData.append("bio", user.value.bio);
    formData.append("email", user.value.email);

    // Si l'image a changé, on l'ajoute
    if (userStore.currentUser.avatar !== user.value.avatar && user.value.avatar) {
      formData.append("avatar", user.value.avatar);
    }

    const API = userStore.currentUser;
    const local = user.value;

    const hasChanged = local.pseudo !== API.pseudo
        || local.realname !== API.realname
        || local.email !== API.email
        || local.bio !== API.bio
        || local.avatar !== API.avatar;

    if (hasChanged) {
      try {

        await userStore.updateUser(formData);


      } catch (error) {
        console.error("❌ Erreur lors de la mise à jour :", error);
      }
    }
  }

  await router.push({path: `/${userStore.currentUser.pseudo}`});
}

function checkEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  validEmail.value = emailRegex.test(email);

}
function checkPseudo(pseudo) {
  const regex = /^[A-Za-z0-9_]+$/; // Autorise lettres, chiffres et underscores
  validPseudo.value = regex.test(pseudo);
}
function checkName(name) {
  const regex = /^[\p{L}0-9_ ]*$/u; // Autorise lettres, chiffres et underscores
  validName.value = regex.test(name);
}
function hasBanWord(bio) {
  if (bio !== '' && bio !== null){

    const text = bio.toLowerCase();

    const regex = new RegExp(`\\b(${bannedWords.value.join('|')})\\b`, 'i');
    validBio.value = !regex.test(text);
    if (!validBio.value) {
      errorMessage.value = 'Votre Biographie ne respectent pas notre politique "FriendLY"';
    }

  } else {

    validBio.value = true;
  }

}

async function handleFileUpload(event) {
  const file = event.target.files[0];
  // console.log("caca",URL.createObjectURL(file))

  previewAvatar.value = URL.createObjectURL(file);
  showCropper.value = true; // ← Active le cropper après avoir chargé l'image

}

onBeforeUnmount(()=> {

  if (previewAvatar.value) {
    URL.revokeObjectURL(previewAvatar.value)
  }
})


function triggerUpload() {
  fileInput.value.click()

}

onMounted(async()=>{
  await setDataOfCurrentUser();
  checkPseudo(user.value.pseudo);
  checkEmail(user.value.email);
  checkName(user.value.realname);

  const response = await fetch('/bannedWords.txt');
  const text = await response.text();
  bannedWords.value = text
      .split('\n')
      .map(w => w.trim().toLowerCase())
      .filter(w => w.length > 0);

  hasBanWord(user.value.bio);
})

</script>




<style scoped>
.account-edit {
  margin-left: calc(15vw + 20px);
  background-color: var(--GrisPerle);
  height: 100vh;


}

.account-edit-form {
  display: grid;
  grid-template-columns: 3fr 5fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0;
  grid-row-gap: 0;
  align-items: start;
  justify-items: center;
  height: 100vh;
  padding: 75px 0 0 75px;
}

.account-edit-form-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

}

input, textarea {


  width: 100%;
  padding: 2px 5px;
  border: 1px solid var(--GrisNuit);
  border-radius: 5px;
}

textarea {
  min-height: 30px;
}

label {

  font-weight: bold;
  margin-bottom: 5px;
}


.form-inputs {
  display: flex;
  flex-direction: column;
  width: 50%;
}


button {
  width: 25%;
  padding: 5px 20px;
  background: var(--Violet);
  color: var(--BlancPur);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: var(--BleuClair);
  color: var(--GrisNuit);
  transition: background-color 0.1s ease, transform 0.1s ease;

}

.form-input-content {
  display: flex;
  flex-direction: column;
  padding: 8px;
}

/*AvaterView*/
img {
  align-self: center;
}

b, span {
  color: var(--red);
  padding: 5px 0;
  margin-top: 10px;
}

.valid-form {
  text-align: center;
  font-size: 50px;

}





.account-edit-form-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-wrapper {
  width: 400px;
  height: 400px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

/* Le composant AvatarView doit être rond aussi */
.avatar-wrapper ::v-deep img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-wrapper {
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  background-color: #f0f0f0;
}

/* Icône d'édition */
.edit-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  border-radius: 50%;
  z-index: 2; /* Le crayon doit être au-dessus de l'image mais sous le cropper */
  pointer-events: none; /* Important pour que ce soit le wrapper qui capte le clic */
  color: var(--Violet);
}


</style>
