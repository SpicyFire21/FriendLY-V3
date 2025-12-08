<template>
  <div class="cropper-main" v-if="showDialog">
    <h2>Modifier L'image</h2>

    <!-- Vérifie si l'image est bien disponible -->
    <div v-if="imagePreview" class="cropper-container">
      <img
          ref="imageElement"
          :src="imagePreview"
          class="cropper" />

    </div>


    <div class="progress-bar">
      <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.01"
          v-model="zoom"
      />
    </div>

    <div class="buttons">
      <button @click="resetCropper">Réinitialiser</button>
      <div>
        <button @click="$emit('close')">Annuler</button>
        <button @click="emitCroppedImage">Valider</button>

      </div>

    </div>

  </div>


</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

const props = defineProps({
  imagePreview: String,
  showDialog: Boolean,
});

const emit = defineEmits(["valid", "close"]);

let cropper = ref(null);
let imageElement = ref(null);
let zoom = ref(1);

// création du cropper
function initCropper() {
  if (!imageElement.value) return;

  cropper.value = new Cropper(imageElement.value, {
    aspectRatio: 1,
    viewMode: 1,
    movable: true,
    zoomable: true,
    scalable: false,
    autoCropArea: 1,
  });
}

// destruction propre
onBeforeUnmount(() => {
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
});

// réinitialisation
function resetCropper() {
  if (!cropper.value) return;
  cropper.value.reset();
  zoom.value = 1;
}

// export image
function emitCroppedImage() {
  if (!cropper.value) return;

  cropper.value.getCroppedCanvas().toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    emit("valid", blob, url);
  }, "image/webp");
}

// watcher : nouvelle image → reload cropper
watch(
    () => props.imagePreview,
    (newValue) => {
      if (!newValue) return;

      if (cropper.value) {
        cropper.value.destroy();
      }

      // attendre que <img> mette à jour son src
      nextTick(() => {
        initCropper();
        zoom.value = 1;
      });
    }
);

// watcher : zoom slider → zoom cropper
watch(
    zoom,
    (newZoom) => {
      if (!cropper.value) return;
      cropper.value.zoomTo(newZoom);
    }
);

onMounted(() => {
  if (props.imagePreview) {
    initCropper();
  }
});
</script>



<style scoped>
.cropper-main {
  background-color: var(--GrisPerle);
  margin: auto;
  width: 500px;
  height: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border: 2px var(--GrisNuit) solid;
  border-radius: 25px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

h2 {
  text-align: center;
}

.cropper {
  width: 300px;
  height: 300px;
  position: relative;
  overflow: hidden;  /* Cacher les parties de l'image qui dépassent */
}


::v-deep(.vue-preview--fill) {
  border: var(--Violet) 4px solid;
}

::v-deep(.vue-line-wrapper) {
  display: none !important;
  overflow: hidden;
}

::v-deep(.vue-advanced-cropper__image-wrapper){
  width: 0%;
  height: 0%;
}

::v-deep(.vue-simple-handler){
  height: 0;
}

::v-deep(.vue-advanced-cropper__foreground){
  background-color: var(--GrisPerle) !important;

}

::v-deep(.vue-advanced-cropper__background){
  background: none;
}

.buttons {
  display: flex;
  justify-content: space-between;
  padding: 5px;
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
  transition: background-color 0.1s ease, transform 0.1s ease;

}

.progress-bar {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.cropper-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>