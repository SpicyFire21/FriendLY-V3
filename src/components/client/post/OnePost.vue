<template>
  <div v-if="props.postdata">
    <div class="post-author">
      <AvatarView
          :avatar="userStore.getUserById(props.postdata.authorid).avatar"
          size="40px"
          @click="goTo(userStore.getUserById(props.postdata.authorid).pseudo)"
      />
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
            <button @click="handleLove(props.postdata.id)"><i class="fa-selfcenter fa-regular fa-heart fa-xl" style="color: var(--red);"></i></button>
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

    <CommentDialog
        :avatar="avatarSrc"
        :showComment="showComment"
        :postdata="props.postdata"
        @close="showComment = false"

    />


  </div>
</template>

<script setup>
import AvatarView from "@/components/utils/AvatarView.vue";
import NameTag from "@/components/utils/NameTag.vue";
import {computed,watch, onBeforeUnmount, onMounted, ref} from "vue";
import {useCommentStore, usePostStore, useUserStore} from "@/stores/index.js";
import CommentDialog from "@/components/client/comments/CommentDialog.vue";
import AvatarCropper from "@/components/utils/AvatarCropper.vue";
import {useRouter} from "vue-router";

const avatarSrc = ref(null);
const router = useRouter()

let showComment = ref(false)

const props = defineProps({
  postdata: {
    type: Object,
    required: true,
  },
});

const postStore = usePostStore();
const userStore = useUserStore();
const commentStore = useCommentStore();


const goTo = async(pseudo)=>{
  await router.push({ path: `/${pseudo}` })
}


function revoke() {
  if (avatarSrc.value && avatarSrc.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarSrc.value);
  }
}

watch(
    () => props.postdata?.image,
    (image) => {
      revoke();

      if (!image) {
        avatarSrc.value = null;
        return;
      }

      if (image.type === "Buffer" && Array.isArray(image.data)) {
        const bytes = new Uint8Array(image.data);
        const header = bytes.slice(0, 4).join(" ");
        let mime = "image/png";

        if (header === "255 216 255 224" || header === "255 216 255 225") mime = "image/jpeg";
        else if (header === "71 73 70 56") mime = "image/gif";
        else if (header === "82 73 70 70") mime = "image/webp";

        avatarSrc.value = URL.createObjectURL(new Blob([bytes], { type: mime }));
        return;
      }

      avatarSrc.value = image;
    },
    { immediate: true }
);

onBeforeUnmount(revoke);



const isLoved = computed(() => {
  const uid = userStore.currentUser.id

  return postStore.loves.some(
      l => l.idpost === props.postdata.id && l.iduser === uid
  )
})

const isLiked = computed(() => {
  const uid = userStore.currentUser.id
  return postStore.likes.some(
      l => l.idpost === props.postdata.id && l.iduser === uid
  )
})

async function toggleReaction(postid, type) {
  const uid = userStore.currentUser.id
  const data = { idpost: postid, iduser: uid }

  const loved = postStore.loves.some(l => l.idpost === postid && l.iduser === uid)
  const liked = postStore.likes.some(l => l.idpost === postid && l.iduser === uid)

  if (type === "love") {
    if (loved) {
      await postStore.removeLoveAction(data)
    } else {
      if (liked) await postStore.removeLikeAction(data)
      await postStore.addLoveAction(data)
    }
  }

  if (type === "like") {
    if (liked) {
      await postStore.removeLikeAction(data)
    } else {
      if (loved) await postStore.removeLoveAction(data)
      await postStore.addLikeAction(data)
    }
  }
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
function handleComment() {
  showComment.value = true;
}
function handleShare(postid) {
  console.log(postid, "share");
}





onMounted(async()=>{
  try {
    await postStore.getPostsToStore();
    await userStore.getUsersToStore();
    await commentStore.getComments();
    await postStore.getLikes()
    await postStore.getLoves()
    console.log(commentStore.comments)

  } catch (error) {
    console.error("Erreur lors de l'exécution des requêtes", error);
  }
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

</style>