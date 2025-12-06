<template>
  <v-container fluid class="pa-0 ma-0">
    <AsideBar />

    <div class="account-container">
      <!-- Affiche uniquement si utilisateur courant -->
      <div class="account-content" v-if="currentUser">
        <AvatarView size="200px" :avatar="currentUser.avatar" />

        <div class="account-data">
          <div class="account-item">
            <b style="font-size: 25px">{{ currentUser.pseudo }}</b>
            <button @click="goEditAccount" class="edit-button">Modifier le profil</button>
          </div>

          <div class="account-item">
            <p>{{ getCountPostsByUser(currentUser.id) }} publications</p>
            <p>{{ getCountFollowersOfCurrentUser }} follow(s)</p>
            <p>{{ getCountSubscribersOfCurrentUser }} follower(s)</p>
          </div>

          <div>
            <p style="white-space: pre-line;">{{ currentUser.bio }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation interne -->
      <div class="account-content-picker">
        <hr />
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
      <router-view />
    </div>

    <!-- Dialog -->
    <CustomDialog />
  </v-container>
</template>

<script setup>
import { onMounted } from "vue"
import { useRouter } from "vue-router"

// Composants
import AsideBar from "@/components/navigation/AsideBar.vue"
import AvatarView from "@/components/utils/AvatarView.vue"
import SendPost from "@/components/utils/sendPost.vue"

// Stores (Pinia à utiliser au lieu de Vuex)
import { useUserStore, usePostStore } from "@/stores"

const CustomDialog = SendPost

// Router
const router = useRouter()

// Stores
const usersStore = useUsersStore()
const postsStore = usePostsStore()

// State
const currentUser = usersStore.currentUser
const getCountFollowersOfCurrentUser = usersStore.getCountFollowersOfCurrentUser
const getCountSubscribersOfCurrentUser = usersStore.getCountSubscribersOfCurrentUser
const getCountPostsByUser = postsStore.getCountPostsByUser

// Méthodes
async function goEditAccount() {
  if (currentUser) {
    await router.push({ name: "editaccount" })
  }
}

// Cycle de vie
onMounted(async () => {
  await postsStore.getPostsToStore()
  await usersStore.getUsersToStore()
  if (currentUser) {
    await usersStore.getFollowersByUserID(currentUser.id)
    await usersStore.getSubscribersByUserID(currentUser.id)
  }
})
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
