<template>
  <div class="bubble-container">
    <div
        v-for="(bubble, index) in bubbles"
        :key="index"
        class="bubble"
        :style="bubbleStyle(bubble)"
    ></div>
  </div>
</template>

<script setup>
import {computed, ref,onMounted,onBeforeUnmount} from "vue";
import {useUserStore} from "@/stores/index.js";

const bubbles = ref([])
const objectURLs = ref(new Set())
const animationInterval = ref(null)
const usedImages = ref(new Set())
const userWithAvatar = ref(0)
const bubblesCount = ref(0)
const maxCount = ref(50)

const userStore = useUserStore()


const availableImages = computed(() =>{
  return Array.from(objectURLs.value);
})


onMounted(async () => {
  await userStore.getUsersToStore()
  await setCountOfBubbles();
  await prepareImages();
  generateBubbles(bubblesCount.value);
  startAnimation();


});

onBeforeUnmount(()=> {
  clearInterval(animationInterval.value);
  cleanupObjectURLs();
});

const bubbleStyle = (bubble) => {
      return {
        left: bubble.x + 'px',
        top: bubble.y + 'px',
        width: bubble.size + 'px',
        height: bubble.size + 'px',
        opacity: bubble.opacity,
        backgroundImage: bubble.image ? `url(${bubble.image})` : 'none'
      };
    }

const setCountOfBubbles = async () => {
      userWithAvatar.value = userStore.users.filter(item => item.avatar !== null)
      const count = userWithAvatar.value.length;
      const max = maxCount.value;
      if (count < max){
        bubblesCount.value = count;
      } else {
        bubblesCount.value = max;
      }


    }

    const prepareImages = async () => {
      cleanupObjectURLs();
      const imageProcessing = userWithAvatar.value.map(async user => {
        if (user.avatar?.type === "Buffer" && Array.isArray(user.avatar.data)) {
          try {

            const blob = createBlobFromBuffer(user.avatar.data);
            const objectURL = URL.createObjectURL(blob);

            objectURLs.value.add(objectURL);

          } catch (error) {
            console.error("Error processing avatar:", error);
          }
        }
      });

      await Promise.all(imageProcessing);
    }

    const createBlobFromBuffer = (bufferData) => {
      const uint8Array = new Uint8Array(bufferData);
      const header = uint8Array.slice(0, 4).join(' ');
      const mimeType = detectMimeType(header);
      return new Blob([uint8Array], { type: mimeType });
    }

    const detectMimeType = (header) => {
      const signatures = {
        '255 216 255 224': 'image/jpeg',
        '255 216 255 225': 'image/jpeg',
        '137 80 78 71': 'image/png',
        '71 73 70 56': 'image/gif',
        '82 73 70 70': 'image/webp'
      };
      return signatures[header] || 'image/png';
    }

    const generateBubbles = (count) => {

      if (availableImages.value.length === 0) return;
      usedImages.value.clear();
      bubbles.value = Array.from({length: count}, () => ({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight +(Math.random() *500),
        size: 60 + Math.random() * 50,
        opacity: 1,
        speed: 0.1 + Math.random() * 0.2,
        oscillation: Math.random() * 0.8, // <-- Nouvelle propriété
        image: getRandomUnusedImage()
      }));
    }
    const getRandomUnusedImage = () => {
      const available = [...availableImages.value].filter(img => !usedImages.value.has(img));
      if (available.length === 0) {
        usedImages.value.clear();
        return availableImages.value[Math.floor(Math.random() * availableImages.value.length)];
      }

      const randomImage = available[Math.floor(Math.random() * available.length)];
      usedImages.value.add(randomImage);
      return randomImage;
    }
    const resetBubblePosition = (bubble) => {
      bubble.y = window.innerHeight* 1.5 + bubble.y + bubble.size ;
      bubble.x = Math.random() * window.innerWidth;

      bubble.size = 60 + Math.random() * 30;
      bubble.opacity = 1;

      bubble.speed = 0.1 + Math.random() * 0.2;

      usedImages.value.delete(bubble.image);
      bubble.image = getRandomUnusedImage();

      bubble.oscillation = Math.random() * 0.5;
    }
    const startAnimation = () => {

      animationInterval.value = setInterval(() => {
        const now = Date.now();

        bubbles.value.forEach(bubble => {
          // console.log(bubble)

          bubble.x += Math.sin(now/1000 * bubble.oscillation) * 0.1;
          bubble.y -= bubble.speed;

          if (bubble.y < -bubble.size) {
            resetBubblePosition(bubble);
          }
          if (bubble.x < bubble.size) {
            // Collision avec le bord gauche
            bubble.x = bubble.size;
          } else if (bubble.x > window.innerWidth - bubble.size-7*2) {
            // Collision avec le bord droit
            bubble.x = window.innerWidth - bubble.size -7*2;
          }
        });
      }, 16);

    }
    const cleanupObjectURLs = () => {
      objectURLs.value.forEach(url => URL.revokeObjectURL(url));
      objectURLs.value.clear();
    }


</script>

<style scoped>
.bubble-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  overflow: hidden;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  will-change: transform;
  transition:
      transform 0.3s ease-out,
      opacity 0.3s ease-out;
}


.bubble:nth-child(2n){
  animation:rotate-clockwise 150s linear infinite !important;
}

.bubble:nth-child(2n+1){
  animation:rotate-counterclockwise 150s linear infinite !important;
}

.bubble:nth-child(4n){
  border:var(--Violet) 3px solid;
}
.bubble:nth-child(4n+1){
  border:var(--BleuClair) 3px solid;
}
.bubble:nth-child(4n+2){
  border:var(--BleuFonce) 3px solid;
}
.bubble:nth-child(4n+3){
  border:var(--GrisNuit) 3px solid;
}


@keyframes rotate-clockwise {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

@keyframes rotate-counterclockwise {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  100% {
    transform: translateY(0) rotate(-360deg);
  }
}
</style>