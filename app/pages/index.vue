<template>
  <!-- Alternate language links for SEO -->
  <Head>
    <Link rel="alternate" hreflang="fr" href="https://jdflaugergues.github.io/swiss-ski-map/fr/" />
    <Link rel="alternate" hreflang="de" href="https://jdflaugergues.github.io/swiss-ski-map/de/" />
    <Link rel="alternate" hreflang="en" href="https://jdflaugergues.github.io/swiss-ski-map/en/" />
    <Link rel="alternate" hreflang="x-default" href="https://jdflaugergues.github.io/swiss-ski-map/fr/" />
  </Head>

  <main class="flex-1 bg-gradient-to-b from-blue-50 to-white text-blue-900 relative">
    <!-- Snow effect background -->
    <SnowEffect />

    <!-- Intro section -->
    <section class="max-w-6xl mx-auto px-4 pt-10 pb-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4">
        {{ mapConfig.title }}
      </h1>

      <p class="text-base sm:text-lg text-blue-800/80 max-w-2xl leading-relaxed">
        {{ mapConfig.description }}
      </p>
    </section>

    <!-- Map instructions -->
    <section class="max-w-6xl mx-auto px-4 pb-6 sm:px-6 lg:px-8">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-medium text-blue-900 mb-1">
              {{ t('home.mapInstructionsTitle') }}
            </h3>
            <p class="text-sm text-blue-800 leading-relaxed">
              {{ t('home.mapInstructions') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map embed -->
    <section class="w-full px-4 sm:px-6 lg:px-8 pb-6">
      <SkiMapEmbed
        :src="mapConfig.embedUrl"
        :title="mapConfig.title"
        :fullscreenUrl="mapConfig.fullscreenUrl"
      />

      <!-- Call-to-action button -->
      <div class="mt-6 sm:mt-8 flex justify-center">
        <a
          :href="mapConfig.fullscreenUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {{ t('home.showFullScreen') }}
          <span class="sr-only">{{ t('home.openInNewTab') }}</span>
        </a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSkiMapConfig } from '../composables/useSkiMapConfig'
import { useSEOMeta } from '../composables/useSEOMeta'

const { t, locale } = useI18n()
const mapConfig = useSkiMapConfig()
const { getSEOConfig, getStructuredData } = useSEOMeta()

const seoConfig = getSEOConfig()
const structuredData = getStructuredData(seoConfig)

useHead({
  title: seoConfig.title,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'description', content: seoConfig.description },
    { name: 'keywords', content: seoConfig.keywords },
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'google-site-verification', content: '7Y_dKD-WwnPAkp_eSYWCEOX5k8PcQx4luoWFV1b89eI' },
    { name: 'theme-color', content: '#1e40af' },
    { name: 'author', content: 'Swiss Ski Map' },
    { name: 'revisit-after', content: '7 days' },
    // Open Graph
    { property: 'og:title', content: seoConfig.title },
    { property: 'og:description', content: seoConfig.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: seoConfig.ogUrl },
    { property: 'og:locale', content: locale.value === 'de' ? 'de_DE' : locale.value === 'en' ? 'en_US' : 'fr_FR' },
    { property: 'og:site_name', content: 'Swiss Ski Map' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoConfig.title },
    { name: 'twitter:description', content: seoConfig.description },
  ],
  link: [
    { rel: 'canonical', href: seoConfig.ogUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(structuredData),
    }
  ]
})
</script>
