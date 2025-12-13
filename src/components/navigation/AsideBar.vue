<template>
  <aside class="asidebar-general" :class="isCompact ? 'asidebar-compact' : 'asidebar-no-compact'" v-if="userStore.currentUser !==null">

    <div v-if="!isCompact" style="width: 15vw;" >
      <img src="/FriendLY.webp" alt="" class="logo">

      <div class="asidebar-container">
        <div class="asidebar-content">
          <router-link :to="{ name: 'home' }" class="link">
            <div class="asidebar-item"><i class="fa-solid fa-house fa-2xl" style="color: var(--Violet);"></i> <span>Accueil</span></div>
          </router-link>
        </div>
        <div class="asidebar-content">
          <div class="link">
            <div class="asidebar-item"><i class="fa-solid fa-magnifying-glass fa-2xl" style="color: var(--Violet);"></i><span>Recherche</span></div>
          </div>
        </div>
        <div class="asidebar-content">
          <div class="link">
            <div class="asidebar-item"><i class="fa-solid fa-bell fa-2xl" style="color: var(--Violet);"></i><span>Notifications</span></div>
          </div>
        </div>
        <div class="asidebar-content">
          <router-link :to="{ name: 'message' }" class="link">
            <div class="asidebar-item"><i class="fa-solid fa-paper-plane fa-2xl" style="color: var(--Violet);"></i><span>Message</span></div>
          </router-link>
        </div>
        <div class="asidebar-content">
          <router-link :to="{ path: `/${userStore.currentUser.pseudo}/settings` }" class="link">
            <div class="asidebar-item"><i class="fa-solid fa-gear fa-2xl" style="color: var(--Violet);"></i><span>Paramètres</span></div>
          </router-link>
        </div>
        <div class="asidebar-content">
          <router-link :to="{ path: `/${userStore.currentUser.pseudo}/saves` }" class="link">
            <div class="asidebar-item"><i class="fa-solid fa-bookmark fa-2xl" style="color: var(--Violet);"></i><span>Saves</span></div>
          </router-link>
        </div>

        <div class="asidebar-content">
          <div class="link" @click="openDialog()">
            <div class="asidebar-item"><i class="fa-solid fa-circle-plus fa-2xl" style="color: var(--Violet);"></i><span>Publier</span></div>
          </div>
        </div>

        <div class="asidebar-content">
          <router-link :to="{ path: `/${userStore.currentUser.pseudo}` }" class="link">
            <div class="asidebar-item" v-if="userStore.currentUser" ><AvatarView :avatar="userStore.currentUser.avatar || defaultAvatar" size="36px" /><span>Profil</span></div>
          </router-link>
        </div>

      </div>
    </div>

    <div v-else class="asidebar-div-compact">
      <img src="/logo.webp" alt="" class="logo-compact">

      <div class="asidebar-container-compact">
        <div class="asidebar-content-compact">
          <router-link :to="{ name: 'home' }" class="link">
            <div class="asidebar-item-compact"><i class="fa-solid fa-house fa-2xl" style="color: var(--Violet);"></i></div>
          </router-link>
        </div>
        <div class="asidebar-content-compact">
          <div class="link">
            <div class="asidebar-item-compact"><i class="fa-solid fa-magnifying-glass fa-2xl" style="color: var(--Violet);"></i></div>
          </div>
        </div>
        <div class="asidebar-content-compact">
          <div class="link">
            <div class="asidebar-item-compact"><i class="fa-solid fa-bell fa-2xl" style="color: var(--Violet);"></i></div>
          </div>
        </div>
        <div class="asidebar-content-compact">
          <router-link :to="{ name: 'message' }" class="link">
            <div class="asidebar-item-compact"><i class="fa-solid fa-paper-plane fa-2xl" style="color: var(--Violet);"></i></div>
          </router-link>
        </div>
        <div class="asidebar-content-compact">
          <router-link :to="{ path: `/${userStore.currentUser.pseudo}/settings` }" class="link">
            <div class="asidebar-item-compact"><i class="fa-solid fa-gear fa-2xl" style="color: var(--Violet);"></i></div>
          </router-link>
        </div>
        <div class="asidebar-content-compact">
          <router-link :to="{ path: `/${userStore.currentUser.pseudo}/saves` }" class="link">
            <div class="asidebar-item-compact"><i class="fa-solid fa-bookmark fa-2xl" style="color: var(--Violet);"></i></div>
          </router-link>
        </div>
        <div class="asidebar-content-compact">
          <div class="link" @click="openDialogCompact()">
            <div class="asidebar-item-compact"><i class="fa-solid fa-circle-plus fa-2xl" style="color: var(--Violet);"></i></div>
          </div>
        </div>
        <div class="asidebar-content-compact">
          <router-link :to="{ path: `/${userStore.currentUser.pseudo}` }" class="link">
            <div class="asidebar-item-compact" v-if="userStore.currentUser" ><AvatarView :avatar="userStore.currentUser.avatar ||defaultAvatar" size="36px" /></div>
          </router-link>
        </div>


      </div>
    </div>

  </aside>
</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import {ref, computed, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {usePostStore, useUserStore} from "@/stores/index.js";

const userStore = useUserStore()
const postStore = usePostStore()

let isMounted = ref(false)
const router = useRouter();
const route = useRoute();

const defaultAvatar = computed(() =>
    new URL('@/assets/no_avatar.png', import.meta.url).href
)



const isCompact = computed(()=> {
  return route.name === 'message';
})


async function openDialog(){
  postStore.updateShowDialog(true)

}
async function openDialogCompact(){

  await router.push({path:`/${userStore.currentUser.pseudo}`})

  postStore.updateShowDialog(true)

}


onMounted(() => {
  isMounted = ref(true);
})




</script>


<style>
.asidebar-general {
  position: fixed;
  height: 100vh;
  border-right: solid var(--GrisNuit) 2px;
}

.asidebar-general ul {
  display: flex;
  flex-direction: column;
  margin-top: 25px;
  gap: 25px;
  list-style: none;

}

.logo-compact{
  aspect-ratio: 1/1;
  width: 60%;
}

.logo {
  aspect-ratio: 686/170;
  width: 100%;
}

.link i.fa-solid {
  display: flex;
  justify-content: center;
  width: 36px;
}

.link .asidebar-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
}

.link .asidebar-item:hover {
  cursor: pointer;
  background-color: var(--BleuClair);
  border-radius: 15px;
  transition: background-color 0.4s ease, transform 0.4s ease;
}

.link .asidebar-item-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 10px;
  aspect-ratio: 1/1;
}

.link .asidebar-item-compact:hover {
  cursor: pointer;
  background-color: var(--BleuClair);
  border-radius: 15px;
  transition: background-color 0.4s ease, transform 0.4s ease;
}


.asidebar-container {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.asidebar-container-compact {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
}

.link {
  text-decoration: none;
  color: var(--GrisNuit);
}

.asidebar-content-compact {
}

.asidebar-compact {
  padding: 20px 0px 20px 0px;
}

.asidebar-no-compact {
  padding: 20px 15px 20px 5px;
}

.asidebar-div-compact{
  width: 77px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

</style>