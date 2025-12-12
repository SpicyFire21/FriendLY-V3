<template>
  <transition name="fade">
    <div v-if="show" class="toast">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script setup>
import {eventBus} from "@/eventBus"
import {ref} from "vue";

let show = ref(false);
let message = ref("");

function triggerToast() {
  message.value = "Votre publication a été envoyée ✅"
  show.value = true

  setTimeout(() => {
    show.value = false
  }, 6000)
}


// créé un event toast a la création de la vue
eventBus.on("toast", triggerToast)


</script>




<style scoped>
.toast {
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid var(--BleuFonce);
  border-left: 2px solid var(--BleuFonce);
  border-right: 2px solid var(--BleuFonce);
  background-color: var(--BleuClair);
  border-radius: 0 0 15px 15px;
  position: fixed;
  z-index: 100;
  width: fit-content;
  justify-content: center;
  transform: translate(50%,0%);
  right: 50%;
}

.toast p {
  margin-bottom: 0 !important;
  padding: 5px 10px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
