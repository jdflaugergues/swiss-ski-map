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

  // Déterminer l'ID de la carte selon la langue actuelle
  const currentMapId = BASE_MAP_IDS[locale.value] || BASE_MAP_IDS['fr']

  /**
   * Construit une URL umap simplifiée
   */
  const buildMapUrl = (): string => {
    return `http://u.osmfr.org/m/${currentMapId}/`
  }

  return {
    embedUrl: buildMapUrl(),
    fullscreenUrl: buildMapUrl(),
    title: t('home.title'),
    description: t('home.description'),
  }
}
