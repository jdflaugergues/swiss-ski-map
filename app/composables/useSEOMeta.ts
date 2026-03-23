import { useI18n } from 'vue-i18n'

interface SEOConfig {
  title: string
  description: string
  keywords: string
  ogImage?: string
  ogUrl?: string
  locale: string
}

/**
 * Composable pour gérer les meta tags SEO multilingues
 */
export function useSEOMeta() {
  const { locale, t } = useI18n()

  const getSEOConfig = (): SEOConfig => {
    const baseUrl = 'https://jdflaugergues.github.io/swiss-ski-map'
    const currentUrl = `${baseUrl}/${locale.value}/`

    const configs: Record<string, Omit<SEOConfig, 'locale'>> = {
      fr: {
        title: 'Carte interactive des stations de ski en Suisse | Swiss Ski Map',
        description: 'Découvrez tous les domaines skiables en Suisse avec notre carte interactive. Explorez les stations, comparez les régions et planifiez votre séjour.',
        keywords: 'skigebiete schweiz, ski karte, domaines skiables suisse, carte interactive, stations de ski suisse, magic pass, ski region',
        ogUrl: currentUrl,
      },
      de: {
        title: 'Skigebiete-Karte in der Schweiz | Swiss Ski Map',
        description: 'Entdecken Sie alle Skigebiete in der Schweiz mit unserer interaktiven Karte. Erkunden Sie die Skigebiete, vergleichen Sie Regionen und planen Sie Ihren Aufenthalt.',
        keywords: 'skigebiete schweiz, ski karte, skigebiet karte, interaktive karte, skigebiete in der schweiz, magic pass, ski',
        ogUrl: currentUrl,
      },
      en: {
        title: 'Interactive Map of Ski Resorts in Switzerland | Swiss Ski Map',
        description: 'Discover all ski resorts in Switzerland with our interactive map. Explore ski areas, compare regions and plan your stay with ease.',
        keywords: 'ski resorts switzerland, ski map, interactive map, swiss ski areas, ski station, magic pass, skiing',
        ogUrl: currentUrl,
      }
    }

    const config = configs[locale.value] || configs.fr
    return {
      ...config,
      locale: locale.value,
    }
  }

  const getAlternateLinks = () => {
    const baseUrl = 'https://jdflaugergues.github.io/swiss-ski-map'
    return [
      { rel: 'alternate', hreflang: 'fr', href: `${baseUrl}/fr/` },
      { rel: 'alternate', hreflang: 'de', href: `${baseUrl}/de/` },
      { rel: 'alternate', hreflang: 'en', href: `${baseUrl}/en/` },
      { rel: 'alternate', hreflang: 'x-default', href: `${baseUrl}/fr/` },
    ]
  }

  const getStructuredData = (config: SEOConfig) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': config.title,
      'description': config.description,
      'url': config.ogUrl,
      'applicationCategory': 'UtilitiesApplication',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'CHF',
        'availability': 'https://schema.org/InStock'
      },
      'author': {
        '@type': 'Organization',
        'name': 'Swiss Ski Map',
        'url': 'https://jdflaugergues.github.io/swiss-ski-map/'
      },
      'inLanguage': config.locale,
      'operatingSystem': 'All',
    }
  }

  return {
    getSEOConfig,
    getAlternateLinks,
    getStructuredData,
  }
}

