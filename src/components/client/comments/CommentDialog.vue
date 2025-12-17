<template>
  <div class="comments" :class="props.showComment ? 'show-comments' : 'hide'">
    <i @click="closeComments" class="fa-lefttop fa-3xl fa-solid fa-xmark fa-2xl" style="color: var(--BleuClair);"></i>
    <div class="row-post-comments">
      <div class="post-view-comment-container">
        <img
            :src="props.avatar"
            :alt="props.postdata.description"
            class="post-view-comment"
        />
      </div>

      <div class="row-post-comments-container" :class="!props.showComment ? 'hide':'' ">
        <div class="post-author">
          <AvatarView :avatar="userStore.getUserById(props.postdata.authorid).avatar" size="40px"/>
          <NameTag :user="userStore.getUserById(props.postdata.authorid)"/>
          <v-spacer/>
          <i class="fa-solid fa-ellipsis fa-xl" style="color: var(--Violet);"></i>
        </div>
        <div class="comments-scroll">
          <div class="comments-scroll-content">
            <div v-for="(comment, date) in commentStore.comments" :key="date">

              <div class="comment">
                <div class="comment-author">
                  <AvatarView :avatar="userStore.getUserById(comment.iduser).avatar" size="35px"/>
                </div>
                <div class="comment-body">
                  <NameTag :user="userStore.getUserById(comment.iduser)"/>
                  <p>{{comment.comment}}</p>
                  <em style="font-size:12px">{{$DayMonthYear2(comment.postedat)}}</em>
                </div>

              </div>


            </div>
          </div>

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

</template>

<script setup>
import NameTag from "@/components/utils/NameTag.vue";
import AvatarView from "@/components/utils/AvatarView.vue";
import {getCurrentInstance, onBeforeUnmount, ref, watch} from "vue";
import {useCommentStore, usePostStore, useUserStore} from "@/stores/index.js";
const socket = getCurrentInstance().appContext.config.globalProperties.$socket
const emit = defineEmits(["close"]);

let showSendBtn = ref(false)
let comment = ref("")

const props = defineProps({
  postdata: {
    type: Object,
    required: true,
  },
  showComment: {
    type:Boolean,
    required: true
  },
  avatar: {
    type: [String],
    default: null,
    required:true
  },

});

const userStore = useUserStore();
const commentStore = useCommentStore();

function closeComments() {
  emit("close", false);
}

function handleInputComment(event) {
  showSendButton(event)
}

function showSendButton() {
  let msg = comment.value;
  showSendBtn.value = msg !== "";
}

async function onSendComment() {
  if (showSendBtn) {
    const data = {
      idpost: props.postdata.id,
      iduser: userStore.currentUser.id,
      comment: comment.value,
      postedat: new Date().toISOString()
    }
    socket.emit("post-comment", data);
    comment.value='';
  }
}

socket.on("post-comment", (data) => {
  if(commentStore.comments !==null && data.comment !==  ""){
    commentStore.addComment(data);
  }
});

onBeforeUnmount(()=> {
  socket.off("post-comment");
})

</script>


<style scoped>
.comment-author {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.comment-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 10px;
}
.comment {
  display: flex;
  flex-direction: row;
  padding: 0 10px 20px 10px;
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
  height: 500px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.row-post-comments-container {
  display: flex;
  flex-direction: column;
  width: 350px;
  height: 100%;
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
.post-author {
  padding: 15px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--GrisNuit);
}

.comments-scroll {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  align-items: flex-end;
}
.send-comment {
  display: flex;
  width: 100%;
  padding: 5px;
  border-top: 1px solid var(--GrisNuit);
  gap: 5px;

  flex-shrink: 0;

}
.comments-scroll-content {
  flex: 1;
  width: 100%;
  max-height: fit-content;
  overflow-y: auto;
}

</style>