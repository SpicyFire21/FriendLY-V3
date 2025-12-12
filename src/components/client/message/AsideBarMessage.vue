<template>
  <aside class="asidebar-message">
    <h2 style="padding-left: 15px">Messages</h2>
    <hr>
    <div class="asidebar-message-container" v-for="(item,index) in followersMessage" :key="index">
      <div class="asidebar-message-content">
        <div class="asidebar-message-item" @click="showMessages(item.id)" v-if="item.id !== userStore.currentUser.id"  :class="selectedUser(item.id) ? 'selected' : 'unselected'">
          <AvatarView :avatar="item.avatar"/>
          <NameTag :user="item"/>

          <span v-if="typingUsers[item.id]" class="typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </div>
      </div>
    </div>
    <div v-if="followersMessage.length ===0" >
      <em style="font-size: 13px">Ajoute des amis pour commencer a discuter</em>
    </div>
  </aside>
</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import NameTag from "@/components/utils/NameTag.vue";
import {getCurrentInstance, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useMessageStore, useUserStore} from "@/stores/index.js";

const socket = getCurrentInstance().appContext.config.globalProperties.$socket

let followersMessage = ref([])
let typingUsers = ref({})
let typingTimeouts = ref({})

const userStore = useUserStore();
const messageStore = useMessageStore();


function selectedUser(user){
  return messageStore.currentSenderId === user;
}
async function showMessages(idSender){
  messageStore.updateCurrentSenderId(idSender);
  const idReceiver = userStore.currentUser.id;
  messageStore.updateCurrentReceiverId(idReceiver)

  messageStore.setCurrentMessages([]);
  await messageStore.getConversationStore({idReceiver,idSender});
  console.log("currentMessages", messageStore.currentMessages);

}

function setupSocketListeners() {
  socket.on('typing', (data) => {
    // Trouve l'utilisateur par ID plutôt que par pseudo
    const user = followersMessage.find(u => u.id === data.from || u.pseudo === data.from);

    if (user && user.id !== userStore.currentUser.id) {
      this.$set(typingUsers, user.id, true);

      clearTimeout(typingTimeouts[user.id]);
      typingTimeouts[user.id] = setTimeout(() => {
        this.$set(typingUsers, user.id, false);
      }, 2000);
    }
  });
}
async function setFollowersMessage() {
  if (!userStore.followers || !userStore.users) return;

  const followerIds = userStore.followers.map(follower =>
      follower.iduser_1 || follower.id // Adaptez selon votre structure réelle
  );

  followersMessage = userStore.users.filter(item =>
      followerIds.includes(item.id)
  );
}

onMounted(async()=>{
  await userStore.getUsersToStore();
  await userStore.getFollowersByUserID(userStore.currentUser.id);
  await setFollowersMessage();
  console.log(followersMessage)
  setupSocketListeners();
})

watch(
    [userStore.followers, userStore.users],
    async () => {
      await setFollowersMessage();
    },
    { immediate: true }
);


onBeforeUnmount(()=> {
  socket.off('typing');
})

</script>

<style>

.typing-indicator {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding-right: 10px;
}

.dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--BleuFonce);
  margin: 0 2px;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.asidebar-message-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 15px 15px 20px;
  position: relative;
}

.asidebar-message {
  position: fixed;
  margin-left: 77px;
  border-right: solid var(--GrisNuit) 2px;
  height: 100vh;
  width: 300px;
  overflow-y: auto;
}

.asidebar-message-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 15px 15px 20px;
}

.asidebar-message-item:hover{
  background-color: var(--BleuClair);
  transition: background-color 0.1s ease, transform 0.1s ease;

}

.asidebar-message-item p {
  margin-bottom: 0 !important;
}

.selected{
  background-color: var(--BleuClair);

}

.unselected{

}


</style>