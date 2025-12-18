<template>
  <v-container fluid class="pa-0 ma-0">
    <AsideBar/>

    <div class="account-container">
      <!-- Affiche uniquement si utilisateur courant -->
      <div class="account-content" v-if="CurrentUser">
        <AvatarView size="200px" :avatar="CurrentUser.avatar"/>

        <div class="account-data">
          <div class="account-item">
            <b style="font-size: 25px">{{ CurrentUser.pseudo }}</b>
            <button :hidden="!ownProfile" @click="goEditAccount" class="edit-button">Modifier le profil</button>
          </div>

          <div class="account-item">
            <p>{{ postsStore.getCountPostsByUser(CurrentUser.id) }} publications</p>
            <p>{{ usersStore.getCountFollowersOfCurrentUser }} follow(s)</p>
            <p>{{ usersStore.getCountSubscribersOfCurrentUser }} follower(s)</p>
          </div>

          <div>
            <p style="white-space: pre-line;">{{ CurrentUser.bio }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation interne -->
      <div class="account-content-picker">
        <hr/>
        <div class="account-picker">
          <div>
            <router-link :to="{ name: 'post' }" class="link">
              <div><span>Publications</span></div>
            </router-link>
          </div>

          <div>
            <router-link :to="{ name: 'save' }" class="link">
              <div><span>Saves</span></div>
            </router-link>
          </div>

          <div>
            <router-link :to="{ name: 'settings' }" class="link">
              <div><span>Settings</span></div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Vue enfant -->
      <router-view/>
    </div>

    <!-- Dialog -->
    <SendPost/>
  </v-container>
</template>

<script setup>
import {computed, watch} from "vue"
import {useRoute, useRouter} from "vue-router"


import AsideBar from "@/components/navigation/AsideBar.vue"
import AvatarView from "@/components/utils/AvatarView.vue"
import SendPost from "@/components/utils/sendPost.vue"


import {usePostStore, useUserStore} from "@/stores/index.js";

const router = useRouter()
const route = useRoute()

const usersStore = useUserStore()
const postsStore = usePostStore()

const routeUserName = computed(() => route.params.pseudo)
const CurrentUser = computed(() => {
  return usersStore.getUserByPseudo(routeUserName.value)
})
const ownProfile = computed(() => {
  if (!CurrentUser.value || !usersStore.currentUser) return false
  return CurrentUser.value.id === usersStore.currentUser.id
})

// Méthodes
async function goEditAccount() {
  if (CurrentUser.value.id === usersStore.currentUser.id) {
    await router.push({name: "editaccount"})
  }
}

// mise a jour a chaque fois que la route change
watch(() => route.params.pseudo, async (pseudo) => {
      await usersStore.getUsersToStore()
      const user = usersStore.getUserByPseudo(pseudo)
      if (user) {
        await usersStore.getFollowersByUserID(user.id)
        await usersStore.getSubscribersByUserID(user.id)
      }
    },
    {immediate: true}
)

</script>

<style>
.account-container {
  margin-left: calc(15vw + 20px);
  min-height: fit-content;
  overflow-y: auto;
  overflow-x: hidden;
}

.account-content {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin: auto;
  padding: 25px;
}

.account-data {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.account-item {
  display: flex;
  gap: 10px;
}

.account-picker {
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
}

.account-content-picker {
  margin-top: 200px;
}

.edit-button {
  width: fit-content;
  padding: 0 2px;
  background: var(--Violet);
  color: var(--BlancPur);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button:hover {
  background: var(--BleuClair);
  color: var(--GrisNuit);
  transition: background-color 0.2s ease, transform 0.2s ease;
}
</style>
