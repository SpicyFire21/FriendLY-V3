<template>
  <div v-if="props.postdata">
    <div class="post-author">

      <AvatarView :avatar="userStore.getUserById(props.postdata.authorid).avatar" size="40px"/>
      <NameTag :user="userStore.getUserById(props.postdata.authorid)"/>
      <v-spacer/>
      <i class="fa-solid fa-ellipsis fa-xl" style="color: var(--Violet);"></i>
    </div>
    <div>

      <img v-if="props.postdata.image" :src="avatarSrc" :alt="props.postdata.description" class="post-view"/>


    </div>

    <div class="post-description">
      <div class="post-buttons">
        <div class="btn-count-post">

          <div v-if="isLoved" class="btn-count-post-content">
            <button @click="handleLove(props.postdata.id)">
              <i class="fa-selfcenter fa-solid fa-heart fa-xl" style="color: var(--red);"></i>

            </button>
            <b style="font-size: 12px;color:var(--red) ;">{{ postStore.getCountLoves(postdata.id) }}</b>
          </div>

          <div v-if="!isLoved" class="btn-count-post-content">
            <button @click="handleLove(props.postdata.id)"><i class="fa-selfcenter fa-regular fa-heart fa-xl"
                                                        style="color: var(--red);"></i></button>
            <b style="font-size: 12px;color:var(--red) ;">{{ postStore.getCountLoves(props.postdata.id) }}</b>
          </div>


        </div>

        <div class="btn-count-post">
          <div v-if="isLiked" class="btn-count-post-content">
            <button @click="handleLike(props.postdata.id)"><i class="fa-selfcenter fa-solid fa-thumbs-up fa-xl"
                                                        style="color: var(--Violet);"></i></button>
            <b style="font-size: 12px;color:var(--Violet) ;">{{ postStore.getCountLikes(props.postdata.id) }}</b>
          </div>
          <div v-if="!isLiked" class="btn-count-post-content">
            <button @click="handleLike(props.postdata.id)"><i class="fa-selfcenter fa-regular fa-thumbs-up fa-xl"
                                                        style="color: var(--Violet);"></i></button>
            <b style="font-size: 12px;color:var(--Violet) ;">{{ postStore.getCountLikes(props.postdata.id) }}</b>
          </div>
        </div>

        <div class="btn-count-post">
          <button @click="handleComment(props.postdata.id)"><i class="fa-selfcenter fa-solid fa-comment fa-xl"
                                                         style="color: var(--BleuClair);"></i></button>
        </div>

        <div class="btn-count-post">
          <button @click="handleShare(props.postdata.id)"><i class="fa-selfcenter fa-solid fa-share fa-xl"
                                                       style="color: var(--BleuClair);"></i></button>
        </div>

        <v-spacer></v-spacer>

        <div class="btn-count-post">
          <button @click="handleSave(props.postdata.id)"><i class="fa-selfcenter fa-solid fa-bookmark fa-xl"
                                                      style="color: var(--green);"></i></button>
          <b style="font-size: 12px;color:var(--green) ;">{{ postStore.getCountSaves(postdata.id) }}</b>
        </div>


      </div>
      <hr>
      <p>{{ props.postdata.description }}</p>
      <em>{{$DayMonthYear(props.postdata.postedat)}}</em>
    </div>

    <div class="comments" :class="showComment ? 'show-comments' : 'hide'">
      <i @click="closeComments" class="fa-lefttop fa-3xl fa-solid fa-xmark fa-2xl" style="color: var(--BleuClair);"></i>
      <div class="row-post-comments">
        <div class="post-view-comment-container">
          <!--          <img :src="require(`@/assets/${postdata.image}`)" alt="post image" class="post-view-comment">-->

          <img
              :src="avatarSrc"
              :alt="props.postdata.description"

              class="post-view-comment"
          />
          <!--          <img v-else src="@/assets/nopost.png" alt="">-->


        </div>

        <div class="row-post-comments-container" :class="!showComment ? 'hide':'' ">
          <div class="post-author">
            <AvatarView :avatar="userStore.getUserById(props.postdata.authorid).avatar" size="40px"/>
            <NameTag :user="userStore.getUserById(props.postdata.authorid)"/>
            <v-spacer/>
            <i class="fa-solid fa-ellipsis fa-xl" style="color: var(--Violet);"></i>
          </div>
          <div class="comments-scroll">
            <div class="comments-scroll-content">

            </div>
            <div class="send-comment">
              <i class="fa-selfcenter fa-regular fa-face-laugh-beam fa-xl" style="color: var(--Violet);"></i>
              <textarea @input="handleInputComment" v-model="comment" placeholder="Écrivez votre Commentaire..." rows="2"
                        class="input-message-item"></textarea>
              <!--              <i class="fa-selfcenter fa-regular fa-image fa-xl" :class="!showSendBtn ? 'show' : 'hide'"-->
              <!--                 style="color: var(&#45;&#45;Violet);"></i>-->
              <!--              <i class="fa-selfcenter fa-regular fa-note-sticky fa-xl" :class="!showSendBtn ? 'show' : 'hide'"-->
              <!--                 style="color: var(&#45;&#45;Violet);"></i>-->
              <button :class="showSendBtn ? 'show' : 'grayshow'" style="color: var(--Violet);" @click="onSendComment">
                Envoyer
              </button>


            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import NameTag from "@/components/utils/NameTag.vue";
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {usePostStore, useUserStore} from "@/stores/index.js";

let showComment = ref(false)
let isLoved = ref(false)
let isLiked = ref(false)
let isMounted = ref(false)
let comment = ref("")
let showSendBtn = ref(false)

const props = defineProps({
  postdata: {
    type: Object,
    required: true,
  },
});

const postStore = usePostStore();
const userStore = useUserStore();

const defaultAvatar = computed(()=> {
  return new URL('@/assets/no_avatar.png', import.meta.url).href
})


const avatarSrc = computed(()=> {
  if (!props.postdata.image) {
    return defaultAvatar;
  }

  if (props.postdata.image && props.postdata.image.type === "Buffer" && Array.isArray(props.postdata.image.data)) {
    const uint8Array = new Uint8Array(props.postdata.image.data);

    // Lire les 4 premiers octets pour deviner le type
    const header = uint8Array.slice(0, 4).join(' ');
    let mimeType = 'image/png'; // fallback

    if (header === '255 216 255 224' || header === '255 216 255 225') {
      mimeType = 'image/jpeg';
    } else if (header === '137 80 78 71') {
      mimeType = 'image/png';
    } else if (header === '71 73 70 56') {
      mimeType = 'image/gif';
    } else if (header === '82 73 70 70') {
      mimeType = 'image/webp';
    }

    const blob = new Blob([uint8Array], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  return props.postdata.image; // déjà une URL ou base64
})

async function toggleReaction(postid,newState){
  await postStore.getLoves();
  await postStore.getLikes();


  const currentUserID = userStore.currentUser.id
  const alreadyLoved = postStore.loves.find(item => item.idpost === postid && item.iduser === currentUserID)
  const alreadyLiked = postStore.likes.find(item => item.idpost === postid && item.iduser === currentUserID)

  const data = {
    idpost: postid,
    iduser: currentUserID
  };

  if (newState === 'love'){
    if (alreadyLoved){
      await postStore.removeLove(data);
    } else {
      if (alreadyLiked){
        await postStore.removeLike(data)
      }
      await postStore.addLove(data)

    }
  } else if (newState === 'like'){
    if (alreadyLiked){
      await postStore.removeLike(data)
    } else {
      if (alreadyLoved){
        await postStore.removeLove(data)
      }
      await postStore.addLike(data)
    }
  } else {
    console.error("tahm kench")
  }
  await setIsLoved(postid)
  await setIsLiked(postid)

}
async function handleLove(postid) {
  await toggleReaction(postid,"love");
}
async function handleLike(postid) {
  await toggleReaction(postid,"like");
}
function handleSave(postid) {
  console.log(postid, "save");
}
function handleComment(postid) {
  console.log(postid, "comment");
  showComment.value = true;
}
function handleShare(postid) {
  console.log(postid, "share");
}
function closeComments() {
  showComment.value = false;
}

async function setIsLoved(postid){
  await postStore.getLoves();
  const currentUserID = userStore.currentUser.id
  isLoved.value = postStore.loves.some(item => item.idpost === postid && item.iduser === currentUserID)
  return isLoved.value


}

async function setIsLiked(postid) {
  await postStore.getLikes();
  const currentUserID = userStore.currentUser.id
  isLiked.value = postStore.likes.some(item => item.idpost === postid && item.iduser === currentUserID)
  return isLiked.value


}
function handleInputComment(event) {
  // this.adjustHeight(event)
  showSendButton(event)
}
function showSendButton() {
  showSendBtn.value = comment !== "";
}
async function onSendComment() {
  if (showSendBtn) {
    // code a finir pour l'envoie de commentaire
    // const data = {
    //   senderid: userStore.currentUser.id,
    //   receiverid: userStore.getUserById(messageStore.currentSenderId).id,
    //   content: comment,
    //   createdat: new Date().toISOString()
    // }
    // this.$socket.emit("post-comment", data);
    // comment='';
  }


}

onMounted(async()=>{
  isMounted = true;  // On marque le composant comme monté
  try {
    await postStore.getPostsToStore();
    await userStore.getUsersToStore();

    if (isMounted) {
      await setIsLoved(props.postdata.id);
      await setIsLiked(props.postdata.id);
    }
  } catch (error) {
    console.error("Erreur lors de l'exécution des requêtes", error);
  }
})

onBeforeUnmount(() => {
  // isMounted.value = false;
})

</script>



<style scoped>
.post-view {
  aspect-ratio: 1/1;
  max-width: 100%;
  width: 100%;
  object-fit: cover;
}

.post-author {
  padding: 15px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--GrisNuit);
}

.post-buttons {
  display: flex;
  gap: 5px;
  align-items: flex-start;
}

.btn-count-post {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

}

.btn-count-post-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.btn-count-post button .fa-heart:hover {
  animation: pulse 0.3s ease-in-out forwards;
  animation-iteration-count: 1;

}

.btn-count-post button .fa-thumbs-up:hover {
  animation: like 0.3s ease-in-out forwards;
  animation-iteration-count: 1;

}

.show-comments {
  background-color: var(--blurBackground);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.hide {
  display: none !important;
}

.comments {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.row-post-comments {
  display: flex;
  background-color: var(--BlancPur);
  height: fit-content;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.row-post-comments-container {
  display: flex;
  flex-direction: column;
  width: 350px;
}

.post-view-comment {
  aspect-ratio: 1/1;
  width:500px;
  object-fit: cover;
  border-right: var(--GrisNuit) 2px solid;
}

.post-view-comment-container {
  aspect-ratio: 1/1;
  max-height: 500px;
}

.comments-scroll {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: flex-end;
}
.send-comment {
  display: flex;
  width: 100%;
  padding: 5px;
  border-top: 1px solid var(--GrisNuit);
  gap: 5px;
}
.comments-scroll-content {
  width: 100%;
  height: 100%;
}
</style>