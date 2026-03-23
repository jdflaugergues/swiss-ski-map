<template>
  <div class="relative rounded-2xl overflow-hidden shadow-lg border border-white/40">
    <!-- État de chargement -->
    <div v-if="isLoading" class="absolute inset-0 bg-gradient-to-b from-blue-100 to-white animate-pulse z-10" />

    <!-- iframe -->
    <iframe
      :key="iframeKey"
      :src="src"
      :title="title"
      :aria-label="`${title} - Carte interactive OpenStreetMap`"
      class="w-full min-h-[400px] md:h-[600px] rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      style="border: 0; display: block;"
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      @load="onIframeLoad"
      @error="onIframeError"
    />

    <!-- Fallback en cas d'erreur -->
    <div v-if="hasError" class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-20 rounded-2xl">
      <div class="text-center">
        <p class="text-gray-700 mb-4">
          {{ t('home.mapLoadError') }}
        </p>
        <a
          :href="fullscreenUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block"
        >
          {{ t('home.openInNewTab') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  src: string
  title: string
  fullscreenUrl: string
}

const props = withDefaults(defineProps<Props>(), {})

const { t } = useI18n()
const isLoading = ref(true)
const hasError = ref(false)
const iframeKey = ref(0)

// Surveiller les changements d'URL pour éviter les rechargements inutiles
watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc) {
    // Incrémenter la clé seulement si l'URL a vraiment changé
    iframeKey.value++
    isLoading.value = true
    hasError.value = false
  }
})

const onIframeLoad = () => {
  isLoading.value = false
}

const onIframeError = () => {
  hasError.value = true
  isLoading.value = false
}
</script>

<style scoped>
iframe {
  border: none;
}

/* Support du focus au clavier pour l'accessibilité */
iframe:focus-visible {
  outline: 2px solid rgb(59, 130, 246);
  outline-offset: 2px;
}
</style>

