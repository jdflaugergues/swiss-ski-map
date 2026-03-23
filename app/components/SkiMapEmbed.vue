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
        <div class="space-y-2">
          <a
            :href="fullscreenUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition mr-2"
          >
            {{ t('home.openInNewTab') }}
          </a>
          <button
            @click="retryLoad"
            class="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            {{ t('home.retry') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onUnmounted } from 'vue'
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
const lastSrc = ref('')
const loadTimeout = ref<NodeJS.Timeout | null>(null)

// Surveiller les changements d'URL pour éviter les rechargements inutiles
watch(() => props.src, async (newSrc, oldSrc) => {
  if (newSrc !== oldSrc && newSrc !== lastSrc.value) {
    // Attendre que le DOM soit mis à jour avant de forcer le rechargement
    await nextTick()

    // Incrémenter la clé seulement si l'URL a vraiment changé
    iframeKey.value++
    isLoading.value = true
    hasError.value = false
    lastSrc.value = newSrc

    // Timeout de sécurité pour éviter les chargements infinis
    if (loadTimeout.value) {
      clearTimeout(loadTimeout.value)
    }

    loadTimeout.value = setTimeout(() => {
      if (isLoading.value) {
        console.warn('Iframe loading timeout, showing error state')
        hasError.value = true
        isLoading.value = false
      }
    }, 15000) // 15 secondes timeout
  }
}, { immediate: true })

const onIframeLoad = () => {
  isLoading.value = false
  hasError.value = false
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = null
  }
}

const onIframeError = () => {
  hasError.value = true
  isLoading.value = false
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
    loadTimeout.value = null
  }
}

const retryLoad = () => {
  hasError.value = false
  isLoading.value = true
  // Forcer le rechargement de l'iframe en changeant sa clé
  iframeKey.value++
}

// Cleanup du timeout lors du unmount
onUnmounted(() => {
  if (loadTimeout.value) {
    clearTimeout(loadTimeout.value)
  }
})
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

