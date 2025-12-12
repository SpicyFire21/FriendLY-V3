<template>
  <div :class="messageStore.currentMessages ? 'message-content-conv' : 'message-content-void'">
    <div v-if="messageStore.currentMessages" class="current-conversation">
      <div class="header-conv">
        <b v-if="messageStore.currentSenderId"><NameTag :user="userStore.getUserById(messageStore.currentSenderId)"/></b>
        <v-spacer/>
        <i class="fa-solid btn-call fa-selfcenter fa-phone fa-xl" style="color: var(--BleuFonce);"></i>
        <br>
        <i class="fa-solid btn-facecall fa-selfcenter fa-camera fa-xl" style="color: var(--BleuFonce);"></i>
      </div>
      <div class="messages-scroll">
        <div v-for="(messages, date) in groupedMessages" :key="date">

          <!-- Date du jour, affichée une seule fois -->
          <div class="date-separator">{{ date }}</div>

          <div v-for="(item,index) in messages" :key="index"
               class="messages"
               :class="{'sent': item.senderid === userStore.currentUser.id, 'received': item.senderid !== userStore.currentUser.id}">

            <div :class="{'date-right': item.senderid === userStore.currentUser.id, 'date-left': item.senderid !== userStore.currentUser.id}">
              <div class="rowMessage">
                <AvatarView :avatar="userStore.getUserById(item.senderid).avatar" size="30px"
                            :show="userStore.currentUser.id !== item.senderid"/>
                <p class="message">{{ item.content }}</p>
              </div>
              <!-- affiche juste l’heure du message -->
              <em>{{ new Date(item.createdat).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }}</em>
            </div>

          </div>
        </div>
      </div>
      <div class="input-message-container">
        <div v-if="currentSender && currentSender === userStore.getUserById(messageStore.currentSenderId).pseudo" class="typing">
          <b>{{ currentSender }}</b> est en train d’écrire{{ dots }}
        </div>
        <div v-else class="typing">

        </div>
        <div class="input-message-content">
          <i class="fa-selfcenter fa-regular fa-face-laugh-beam fa-xl" style="color: var(--Violet);"></i>
          <textarea @input="handleInputMessage" v-model="message" placeholder="Écrivez votre message..." rows="2"
                    class="input-message-item"></textarea>
          <i class="fa-selfcenter fa-regular fa-image fa-xl" :class="!showSendBtn ? 'show' : 'hide'"
             style="color: var(--Violet);"></i>
          <i class="fa-selfcenter fa-regular fa-note-sticky fa-xl" :class="!showSendBtn ? 'show' : 'hide'"
             style="color: var(--Violet);"></i>
          <button :class="showSendBtn ? 'show' : 'grayshow'" style="color: var(--Violet);" @click="onSendMessage">
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <div v-if="!messageStore.currentMessages" class="new-message">
      <img src="../../../../public/logo.webp" alt="" style="width: 80px">
      <button>Nouvelle Discussion</button>

    </div>
  </div>

</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import NameTag from "@/components/utils/NameTag.vue";
import {computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useMessageStore, useUserStore} from "@/stores/index.js";

let message = ref("")
let currentSender = ref(null)
let showSendBtn =ref(false)
let typingUser=ref(null)
let dots = ref("")
let interval = ref(null)
let debounceTimer = ref(null)
let typingTimeout = null;

const messageStore = useMessageStore();
const userStore = useUserStore();
const socket = getCurrentInstance().appContext.config.globalProperties.$socket

const groupedMessages = computed(()=> {
  const groups = {}
  messageStore.currentMessages.forEach(msg => {
    // transforme la date en chaîne “JJ/MM/YYYY”
    const dateStr = new Date(msg.createdat).toLocaleDateString('fr-FR')
    if (!groups[dateStr]) groups[dateStr] = []
    groups[dateStr].push(msg)
  })
  return groups
})
const sortedMessages = computed(()=> {
  return messageStore.currentMessages.slice().sort((a, b) => new Date(a.createdat) - new Date(b.createdat))
})

watch(currentSender, (newVal) => {
  if (newVal) {
    startAnimation();
  } else {
    stopAnimation();
  }
});

function startAnimation(){
  let count = 0;
  interval.value = setInterval(() => {
    count = (count + 1) % 4;
    dots.value = '.'.repeat(count);
  }, 200);
}
function stopAnimation(){
  clearInterval(interval);
  dots.value = '';
}

function handleInputMessage(event) {
  debounceTyping();
  adjustHeight(event)
  showSendButton(event)
}
function adjustHeight(event) {
  const textarea = event.target;
  textarea.style.height = 'auto';
  const newHeight = textarea.scrollHeight;
  if (newHeight < 50) {
    textarea.style.height = '25px';
  } else if (newHeight <= 75) {
    textarea.style.height = `${newHeight}px`;
  } else {
    textarea.style.height = '100px';
  }
}
function showSendButton() {
  let msg = message.value;
  showSendBtn.value = msg !== "";
}

function onTyping() {
  socket.emit("typing", {
    from: userStore.currentUser.pseudo,
    to: userStore.getUserById(userStore.currentSenderId).pseudo,

  });



}
function debounceTyping() {
  clearTimeout(debounceTimer.value);

  debounceTimer.value = setTimeout(() => {
    onTyping(); // Émet le typing **seulement après 100ms d'inactivité**
  }, 100);
}


async function onSendMessage() {
  if (showSendBtn) {
    const data = {
      senderid: userStore.currentUser.id,
      receiverid: userStore.getUserById(userStore.currentSenderId).id,
      content: message.value,
      createdat: new Date().toISOString()
    }
    socket.emit("chat-message", data);
    message.value='';
  }


}


onMounted(async()=>{
  messageStore.setCurrentMessages(null);
  messageStore.updateCurrentSenderId();

  socket.on('connect', () => {
    console.log('Connecté au 🧦');
  });
})

//created
socket.on("typing", (data) => {

  console.log("data", data)
  console.log("currentSenderId", messageStore.currentSenderId)
  console.log("currentUser", userStore.currentUser)

  if (data.to === userStore.currentUser.pseudo) {
    currentSender.value = data.from;
    typingUser = data.to


    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      currentSender.value = null;
    }, 2000);
  }
});

socket.on("chat-message", (data) => {
  console.log("chat-message-local", data)
  console.log("", messageStore.currentMessages)
  if(messageStore.currentMessages !==null){
    messageStore.addMessageMutation(data);
  }

});
//------


onBeforeUnmount(()=> {
  socket.off("chat-message");

})
</script>

<style>
.message-content-void {
  position: fixed;
  left: 377px;
  width: calc(100% - 377px);
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-content-conv {
  position: fixed;
  left: 377px;
  width: calc(100% - 377px);
  height: 100vh;
  display: flex;
  align-items: stretch;
  flex-direction: column;
}

.new-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  gap: 5px;
}

.new-message button {
  background-color: var(--BleuClair);
  border-radius: 10px;
  padding: 6px 10px;

}

.new-message button:hover {
  background-color: var(--Violet);
  transition: background-color 0.5s ease, transform 0.2s ease;
}

.message {
  background-color: var(--BleuClair);
  padding: 5px 10px;
  border-radius: 15px;
  width: fit-content;
  margin-bottom: 0 !important;
}

.sent {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

.received {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}

.header-conv {
  display: flex;
  gap: 5px;
  padding: 5px 20px;
  border-bottom: 2px var(--GrisNuit) solid;
  height: 60px;
}

.header-conv b {
  margin-bottom: 0 !important;
  display: flex;
  align-items: center;
}

.messages {
  padding: 2px 10px;
}

.rowMessage {
  display: flex;
  align-items: center;
  gap: 5px;
}

.date-left {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.date-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.input-message-container {
  padding:10px 1px 5px 1px ;

  display: flex;
  flex-direction: column;
  justify-content: center;
  border:2px var(--GrisNuit) solid ;
  background-color: var(--GrisPerle);
}

.input-message-content {
  display: flex;
  border-radius: 50px;
  gap: 15px;
  padding: 10px 20px;
  border: var(--GrisNuit) 1px solid;
}

.input-message-item {
  width: 100%;
  height: 25px;
  outline: none;
  resize: none;
  overflow-y: auto;
  scrollbar-width: none; /* Cacher la barre de défilement sur Firefox */
  transition: height 0.2s ease-in-out;
}

.input-message-item::-webkit-scrollbar {
  display: none; /* Cacher la barre de défilement sur Chrome et Safari */
}

.btn-call, .btn-facecall {

}

.btn-call:hover, .btn-facecall:hover {
  animation: shake 0.5s ease-in-out;
}

.show {

}

.grayshow {
  color: gray !important;
  transform: scale(0.8);
}

.current-conversation {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.messages-scroll {
  flex:1;
  overflow-y: auto;
  padding-top:10px;
}

.typing {
  padding-bottom: 29px;
  height: 24px;
}

.date-separator {
  text-align: center;
  margin: 15px 0;
  font-size: 0.85rem;
  color: var(--GrisPerle);
}

</style>