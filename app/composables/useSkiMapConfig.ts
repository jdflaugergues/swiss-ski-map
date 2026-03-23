import { useI18n } from 'vue-i18n'

interface SkiMapConfig {
  embedUrl: string
  fullscreenUrl: string
  title: string
  description: string
}

/**
 * Composable pour gérer la configuration et les URLs de la carte interactive des stations de ski
 * Centralise la logique métier et facilite la réutilisabilité et les tests
 * Adapte l'URL en fonction de la locale (FR, EN, DE)
 */
export function useSkiMapConfig(): SkiMapConfig {
  const { t, locale } = useI18n()

  // Mappage des locales vers les IDs de carte umap
  const BASE_MAP_IDS: Record<string, string> = {
    fr: '1018842',
    en: '1379600',
    de: '1379601',
  }
  const BASE_MAP_NAME: Record<string, string> = {
    fr: 'la-carte-interactive-des-stations-de-ski-en-suisse',
    en: 'interactive-map-of-ski-resorts-in-switzerland',
    de: 'interaktive-karte-der-skigebiete-in-der-schweiz',
  }


  // Déterminer l'ID de la carte selon la langue actuelle
  const currentMapId = BASE_MAP_IDS[locale.value] || BASE_MAP_IDS['fr']
  const currentMapName = BASE_MAP_NAME[locale.value] || BASE_MAP_NAME['fr']

  /**
   * Construit une URL umap simplifiée
   */
  const buildMapUrl = (): string => {
    const isProduction = process.env.NODE_ENV === 'production'

    if (isProduction) {
      // En production, utiliser les URLs complètes HTTPS pour éviter les blocages
      return `https://umap.openstreetmap.fr/fr/map/${currentMapName}_${currentMapId}`
    } else {
      // En développement, utiliser les URLs courtes
      return `http://u.osmfr.org/m/${currentMapId}/`
    }
  }

  return {
    embedUrl: buildMapUrl(),
    fullscreenUrl: buildMapUrl(),
    title: t('home.title'),
    description: t('home.description'),
  }
}
