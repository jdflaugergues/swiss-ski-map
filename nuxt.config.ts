// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    baseURL: '/swiss-ski-map/'
  },
  vite: {
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/i18n'],
  nitro: {
    preset: 'github-pages'
  },
  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', name: 'Français', file: 'fr.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', iso: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'fr',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false
    }
  }
})
