<template>
  <div class="account-suggest-container">
    <div class="account-log-head">
      <div class="account-content" v-if="userStore.currentUser">
        <AvatarView :avatar="userStore.currentUser.avatar "/>
        <NameTag :user="userStore.currentUser"/>
      </div>

      <button @click="logout()" class="logout">Déconnexion</button>
    </div>
    <hr>

    <div class="suggestion-for-you">
      <h3>Suggestions</h3>
      <div class="suggestion-for-you-content">

        <div v-for="(item, index) in suggest" :key="index">

          <div class="account-log">
            <div class="account-log-content">


              <AvatarView :avatar="item.avatar"/>

              <NameTag :user="item"/>
            </div>

            <!--            {{item.id}}-->
            <button @click="follow(item.id)">
              <i class="fa-solid fa-user-plus fa-l" style="color: var(--Violet);"></i>
            </button>
          </div>
        </div>
        <div v-if="suggest.length < 5" class="log-text" >
          <b class="log-text-content">Tu as beaucoup d'amis 😮</b>
        </div>

      </div>
    </div>



  </div>
</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import NameTag from "@/components/utils/NameTag.vue";
import {computed, onMounted} from "vue";
import {useMessageStore, useUserStore} from "@/stores/index.js";
import {useRouter} from "vue-router";

const userStore = useUserStore();
const messageStore  =useMessageStore();
const router = useRouter();

const suggest = computed(()=>{
  if(userStore.currentUser){
    const currentUserID = userStore.currentUser.id;
    const followerIds = userStore.followers.flatMap(f => [f.iduser, f.iduser_1]);
    return userStore.users.filter(user =>
        user.id !== currentUserID && !followerIds.includes(user.id)
    );
  } else {
    return [];
  }
})

async function follow(id){
  const data = {
    iduser:userStore.currentUser.id,
    usertarget:id
  }
  await userStore.addFollower(data);
}
async function Unfollow(id){
  const data = {
    iduser:userStore.currentUser.id,
    usertarget:id
  }
  console.log(data)
}

async function logout(){

  await messageStore.disconnectSender();
  await userStore.disconnectUser();
  await router.push({name: 'login'});

}

onMounted( async()=> {
  await userStore.getUsersToStore();
})

</script>


<style>
.account-log {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  height: fit-content;
  padding: 10px 20px;
  background-color: var(--BlancPur);
}

.account-log p {
  margin: 0 !important;
}

.account-content {
  display: flex;
  min-width: fit-content;
  align-items: center;
  gap: 10px;
}

.account-content p {
  margin: auto 0 !important;
  font-weight: bold;

}
.account-suggest-container {
  background-color: var(--BlancPur);
  position: fixed;
  right: 0%;
  min-width: fit-content;
}

.suggestion-for-you-content {
  overflow-y: auto;
  height: 420px;
}



.logout {
  background-color: var(--BleuClair);
  border-radius: 10px;
  padding: 5px 10px;
  color: var(--GrisNuit);
}

.logout:hover {
  transform: scale(1.01);
  transition: background-color 0.5s ease, transform 0.2s ease;

}

.account-log-head {
  display: flex;
  align-items: center;
}

.account-log-head .account-content {
  margin: 0 !important;
}

.account-log-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.log-text  {
  display: flex;
  justify-content: center;
}

.log-text-content {
  font-size: 15px;
  margin-top: 10px;
  color: var(--BleuClair);
}
</style>