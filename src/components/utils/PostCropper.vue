<template>
  <div class="cropper-main" v-if="showDialog">
    <div v-if="imagePreview" class="cropper-container">
      <img ref="img" :src="imagePreview" class="cropper" />
    </div>

    <div class="progress-bar">
      <input
          type="range"
          min="0.1"
          max="3"
          step="0.01"
          v-model.number="zoom"
      />
    </div>

    <div class="buttons">
      <button @click="$emit('close')">Annuler</button>
      <button @click="resetCropper">Réinitialiser</button>
      <button @click="emitCroppedImage">Valider</button>
    </div>
  </div>
</template>

<script setup>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { ref, watch, onMounted, onBeforeUnmount } from "vue";

const emit = defineEmits(['close','valid']);

const props = defineProps({
  imagePreview: String,
  showDialog: Boolean
});

const img = ref(null);
let cropper = null;

const zoom = ref(1);
watch(
    () => props.imagePreview,
    (newImage) => {
      if (!newImage) return;


      if (cropper) {
        cropper.destroy();
        cropper = null;
      }

      setTimeout(() => {
        if (img.value) {
          img.value.onload = () => {
            cropper = new Cropper(img.value, {
              aspectRatio: 1,
              viewMode: 1,
              movable: true,
              zoomable: true,
              scalable: false,
              autoCropArea: 1
            });
            zoom.value = 1;
          };
        }
      }, 0);
    },
    { immediate: true }
);



watch(zoom, (newZoom) => {
  if (cropper) {
    cropper.zoomTo(newZoom);
  }
});

function resetCropper() {
  if (cropper) {
    cropper.reset();
    zoom.value = 1;
  }
}

function emitCroppedImage() {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
  if (!canvas) return;

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    emit('valid', blob, url);
  }, 'image/webp');
}

onBeforeUnmount(() => {
  if (cropper) cropper.destroy();
});
</script>


<style scoped>
.cropper-main {
  background-color: var(--GrisPerle);
  max-width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.cropper {
  width: 300px;
  height: 300px;
  display: block;
}

.buttons {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

button {
  padding: 5px 10px;
  background: var(--Violet);
  color: var(--BlancPur);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background: var(--BleuClair);
  color: var(--GrisNuit);
}

.progress-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: 10px 0;
}

.cropper-container {
  display: flex;
  justify-content: center;
}
</style>
