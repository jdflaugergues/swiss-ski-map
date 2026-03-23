<template>
  <div class="snow-container">
    <div
      v-for="flake in snowflakes"
      :key="flake.id"
      class="snow-flake"
      :style="{
        left: flake.left + '%',
        animationDelay: flake.delay + 's',
        animationDuration: flake.duration + 's',
        fontSize: flake.size + 'px',
        opacity: flake.opacity
      }"
    >
      {{ flake.char }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface SnowFlake {
  id: number
  left: number
  delay: number
  duration: number
  size: number
  opacity: number
  char: string
}

const snowflakes = ref<SnowFlake[]>([])

onMounted(() => {
  // Caractères de flocons de neige variés
  const snowChars = ['❄', '❅', '❆', '*', '✦', '✧']

  // Générer 50 flocons de neige
  const flakes: SnowFlake[] = []
  for (let i = 0; i < 50; i++) {
    flakes.push({
      id: i,
      left: Math.random() * 100, // Position horizontale aléatoire (0-100%)
      delay: Math.random() * 10, // Délai aléatoire (0-10s)
      duration: 10 + Math.random() * 10, // Durée entre 10-20s
      size: 14 + Math.random() * 8, // Taille entre 14-22px
      opacity: 0.3 + Math.random() * 0.4, // Opacité entre 0.3-0.7
      char: snowChars[Math.floor(Math.random() * snowChars.length)] // Caractère aléatoire
    })
  }
  snowflakes.value = flakes
})
</script>

<style scoped>
.snow-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.snow-flake {
  position: absolute;
  top: -50px;
  color: rgba(59, 130, 246, 0.6); /* Bleu avec transparence */
  font-family: 'Arial', sans-serif;
  font-weight: 300;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: fall linear infinite;
  user-select: none;
}

@keyframes fall {
  0% {
    transform: translateY(-50px) rotate(0deg);
  }
  10% {
    transform: translateY(10vh) rotate(10deg);
  }
  20% {
    transform: translateY(20vh) rotate(-5deg);
  }
  30% {
    transform: translateY(30vh) rotate(15deg);
  }
  40% {
    transform: translateY(40vh) rotate(-10deg);
  }
  50% {
    transform: translateY(50vh) rotate(20deg);
  }
  60% {
    transform: translateY(60vh) rotate(-15deg);
  }
  70% {
    transform: translateY(70vh) rotate(25deg);
  }
  80% {
    transform: translateY(80vh) rotate(-20deg);
  }
  90% {
    transform: translateY(90vh) rotate(30deg);
  }
  100% {
    transform: translateY(110vh) rotate(-25deg);
  }
}

/* Animation plus fluide sur les écrans plus larges */
@media (min-width: 768px) {
  .snow-flake {
    font-size: 16px;
  }
}

/* Réduire le nombre de flocons sur mobile pour les performances */
@media (max-width: 768px) {
  .snow-container .snow-flake:nth-child(n+31) {
    display: none;
  }
}
</style>
