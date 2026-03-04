<template>
  <main>
    <h1>La carte des stations de ski en Suisse</h1>
    <div class="map-container">
      <iframe
        style="width: 100%; height: 500px; border: 0;" allowfullscreen
        allow="geolocation"
        src="//umap.openstreetmap.fr/fr/map/la-carte-interactive-des-stations-de-ski-en-suisse_1018842?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true">
      </iframe>
      <p>
        <a href="//umap.openstreetmap.fr/fr/map/la-carte-interactive-des-stations-de-ski-en-suisse_1018842?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true">
          Voir en plein écran
        </a>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
import TheWelcome from '../components/TheWelcome.vue'
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
}
iframe {
  border: none;
}
</style>
