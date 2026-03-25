import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'yaml'

const BASE_SWISS_SKI_MAP_URL = 'https://jdflaugergues.github.io/swiss-ski-map'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const umapPath = path.join(
  __dirname,
  'umap_backup_la-carte-interactive-des-stations-de-ski-en-suisse.umap',
)
const yamlPath = path.join(__dirname, 'input.yaml')

const translations = {
  fr: {
    name: 'La carte interactive des stations de ski en Suisse',
    infos: 'INFOS',
    altitudes: 'Altitudes',
    pistes: 'Pistes',
    remontees: 'Remontées mécaniques',
    km_pistes: 'Domaine skiable',
    domaineSkiable: 'Domaine skiable (en km)',
    tarifs: 'Forfait journée',
    adulte: 'Adulte',
    senior: 'Senior',
    jeune: 'Jeune',
    enfant: 'Enfant',
    site: 'Site internet',
    webcams: 'Webcams',
    plan_interactif: 'Plan interactif des pistes',
    plan_pdf: 'Télécharger plan pdf',
    verified: 'Généré le',
    yes: 'oui',
    gratuit: 'Gratuit',
    editeur: 'Éditeur',
    magicPass: 'Magic Pass',
  },

  en: {
    name: 'Interactive map of ski resorts in Switzerland',
    infos: 'INFO',
    altitudes: 'Altitudes',
    pistes: 'Slopes',
    remontees: 'Ski lifts',
    km_pistes: 'Skiable terrain',
    domaineSkiable: 'Skiable terrain (in km)',
    tarifs: 'Prices day',
    adulte: 'Adult',
    senior: 'Senior',
    jeune: 'Youth',
    enfant: 'Child',
    site: 'Website',
    webcams: 'Webcams',
    plan_interactif: 'Interactive piste map',
    plan_pdf: 'Download piste map pdf',
    verified: 'Generated on',
    yes: 'yes',
    gratuit: 'free',
    editeur: 'Editor',
    magicPass: 'Magic Pass',
  },

  de: {
    name: 'Interaktive Karte der Skigebiete in der Schweiz',
    infos: 'INFOS',
    altitudes: 'Höhenlagen',
    pistes: 'Gesamte Pistenanzahl',
    remontees: 'Skilifte',
    km_pistes: 'Befahrbare Fläche',
    domaineSkiable: 'Befahrbare Fläche (in km)',
    tarifs: 'Tageskarte',
    adulte: 'Erwachsen',
    senior: 'Senior',
    jeune: 'Kind',
    enfant: 'Kleinkind',
    site: 'Website',
    webcams: 'Webcams',
    plan_interactif: 'Interaktive Pistenkarte',
    plan_pdf: 'Download Pistenkarte pdf',
    verified: 'Erstellt am',
    yes: 'ja',
    gratuit: 'gratis',
    editeur: 'Editor',
    magicPass: 'Magic Pass',
  },
}

const umap = JSON.parse(fs.readFileSync(umapPath, 'utf8'))
const yamlData = parse(fs.readFileSync(yamlPath, 'utf8'))
const stations = yamlData?.stations

if (!stations || typeof stations !== 'object') {
  console.error('La clé stations est manquante dans le YAML')
  process.exit(1)
}

const instaLink = `
<div style="display:flex;">
  <a target="_blank" href="https://www.instagram.com/jondfl/" style="display: flex;align-items: center;">
    <img style="max-height:25px; max-width:25px; height:auto; width:auto;" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Instagram_logo_2022.svg/1280px-Instagram_logo_2022.svg.png">
    <div style="margin-left: 0.5rem;"><b>jondfl</b></div>
  </a>
</div>`

function formatPrice(price, devise, t) {
  if (price === '0' || price === 0) {
    return t.gratuit
  }

  price = Number(price)
  if (Number.isInteger(price)) {
    return `${price}.- ${devise}`
  }

  return `${Number(price).toFixed(2)} ${devise}`
}

const normalize = (str) => str?.trim().normalize('NFC')

function resolveUrl(str, folder) {
  if (!str) {
    return ''
  }

  if (str.startsWith('http')) {
    return str
  }

  return `${BASE_SWISS_SKI_MAP_URL}/${folder}/${str}`
}

function extractDomain(url) {
  if (!url) return ''

  const hostname = new URL(url).hostname

  return hostname.replace(/^www\./, '')
}

function buildLogoMarkup(logoSvg, logoUrl, logoBackground) {
  const backgroundStyle = hasValue(logoBackground)
    ? ` background-color:${String(logoBackground).trim()}; padding:0.5rem; border-radius:0.25rem;`
    : ''
  const wrapperStyle = `text-align:center;${backgroundStyle}`

  if (logoSvg) {
    const trimmedSvg = String(logoSvg).trim()

    if (trimmedSvg.startsWith('<svg')) {
      return `<div style="${wrapperStyle} max-height:100px; max-width:300px;">${trimmedSvg}</div>\n\n`
    }

    const svgUrl = resolveUrl(trimmedSvg, 'logo')
    return `<div style="${wrapperStyle}"><img src="${svgUrl}" style="max-height:100px; max-width:300px; height:auto; width:auto;"></div>\n\n`
  }

  if (logoUrl) {
    return `<div style="${wrapperStyle}"><img src="${resolveUrl(logoUrl, 'logo')}" style="max-height:100px; max-width:300px; height:auto; width:auto;"></div>\n\n`
  }

  return ''
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== ''
}

function formatTarifLabel(baseLabel, extraLabel) {
  return hasValue(extraLabel) ? `${baseLabel} (${String(extraLabel).trim()})` : baseLabel
}

function isMagicPassEnabled(value) {
  if (typeof value === 'boolean') {
    return value
  }

  return String(value || '')
    .trim()
    .toLowerCase() === 'oui'
}

function buildDescriptions(lang) {
  const t = translations[lang]

  const mapDesc = {}

  Object.entries(stations).forEach(([stationName, station]) => {
    const domaine = station?.DOMAINE || {}
    const tarif = station?.TARIF || {}

    const NAME = stationName
    const LOGO_URL = station?.LOGO_URL || ''
    const LOGO_BACKGROUND = station?.LOGO_BACKGROUND
    const LOGO_SVG = station?.LOGO_SVG || ''
    const INFO_URL = station?.INFO_URL || ''
    const ALT_MIN = domaine?.ALT_MIN
    const ALT_MAX = domaine?.ALT_MAX
    const PISTE_BLEUE = domaine?.PISTE_BLEUE
    const PISTE_ROUGE = domaine?.PISTE_ROUGE
    const PISTE_NOIRE = domaine?.PISTE_NOIRE
    const REMONTEES = domaine?.REMONTEES
    const PISTES = domaine?.PISTES
    const KM_PISTES = domaine?.KM_PISTES
    const DEVISE = tarif?.DEVISE || ''
    const TARIF_ADULTE = tarif?.TARIF_ADULTE
    const TARIF_SENIOR = tarif?.TARIF_SENIOR
    const TARIF_JEUNE = tarif?.TARIF_JEUNE
    const TARIF_ENFANT = tarif?.TARIF_ENFANT
    const LIBELLE_ADULTE = tarif?.LIBELLE_ADULTE
    const LIBELLE_SENIOR = tarif?.LIBELLE_SENIOR
    const LIBELLE_JEUNE = tarif?.LIBELLE_JEUNE
    const LIBELLE_ENFANT = tarif?.LIBELLE_ENFANT
    const MAGICPASS = tarif?.MAGICPASS
    const SITE_URL = station?.SITE_URL || ''
    const WEBCAM_URL = station?.WEBCAM_URL || ''
    const PLAN_I_URL = station?.PLAN_I_URL || ''
    const PLAN_URL = station?.PLAN_URL || ''
    const PLAN_PDF = station?.PLAN_PDF || ''

    if (!NAME) {
      return
    }

    const generationDate = new Date().toLocaleDateString(lang === 'en' ? 'en-CH' : `${lang}-CH`)
    const hasMagicPass = isMagicPassEnabled(MAGICPASS)
    const magicPassLine = hasMagicPass
      ? '\n{{https://www.seco.admin.ch/seco/fr/home/Standortfoerderung/Tourismuspolitik/Innotour/Gefoerderte_Projekte/2016-bis-2019/magic-pass/_jcr_content/par/image/image.imagespooler.jpg/1554467547295/Magic%20Pass%20Bild.jpg|128}}\n'
      : ''

    const logo = buildLogoMarkup(LOGO_SVG, LOGO_URL, LOGO_BACKGROUND)
    const infoUrl = INFO_URL
      ? `**ℹ️ ${t.infos} [[${INFO_URL}|(via ${extractDomain(INFO_URL)})]]**\n`
      : ''
    const altitudes = hasValue(ALT_MIN) && hasValue(ALT_MAX) ? `**${t.altitudes}: ${ALT_MIN}m - ${ALT_MAX}m**\n` : ''
    const pistes =
      hasValue(PISTE_BLEUE) || hasValue(PISTE_ROUGE) || hasValue(PISTE_NOIRE)
        ? `**${t.pistes}: 🔵${PISTE_BLEUE || 0}% | 🔴${PISTE_ROUGE || 0}% | ⚫${PISTE_NOIRE || 0}%**\n`
        : ''
    const remontees = hasValue(REMONTEES) ? `**${t.remontees}: ${REMONTEES}**\n` : ''
    const nbPistes = hasValue(PISTES) ? `**${t.pistes}: ${PISTES}**\n` : ''
    const kmPistes = hasValue(KM_PISTES) ? `**${t.km_pistes}: ${KM_PISTES} km**\n` : ''

    const adulteLabel = formatTarifLabel(t.adulte, LIBELLE_ADULTE)
    const seniorLabel = formatTarifLabel(t.senior, LIBELLE_SENIOR)
    const jeuneLabel = formatTarifLabel(t.jeune, LIBELLE_JEUNE)
    const enfantLabel = formatTarifLabel(t.enfant, LIBELLE_ENFANT)

    const tarifAdulte = hasValue(TARIF_ADULTE)
      ? `**${adulteLabel} : ${formatPrice(TARIF_ADULTE, DEVISE, t)}**\n`
      : ''
    const tarifSenior = hasValue(TARIF_SENIOR)
      ? `**${seniorLabel} : ${formatPrice(TARIF_SENIOR, DEVISE, t)}**\n`
      : ''
    const tarifJeune = hasValue(TARIF_JEUNE)
      ? `**${jeuneLabel} : ${formatPrice(TARIF_JEUNE, DEVISE, t)}**\n`
      : ''
    const tarifEnfant = hasValue(TARIF_ENFANT)
      ? `**${enfantLabel} : ${formatPrice(TARIF_ENFANT, DEVISE, t)}**\n`
      : ''

    const isAnyTarif =
      hasValue(TARIF_ADULTE) || hasValue(TARIF_SENIOR) || hasValue(TARIF_JEUNE) || hasValue(TARIF_ENFANT)
    const tarifTitle = isAnyTarif ? `**💳 ${t.tarifs.toUpperCase()}**` : ''
    const sitUrl = SITE_URL ? `**🌐 [[${SITE_URL}|${t.site}]]**\n` : ''
    const webcamUrl = WEBCAM_URL ? `**🎥 [[${WEBCAM_URL}|${t.webcams}]]**\n` : ''
    const planInteractifUrl = PLAN_I_URL ? `**🗺️ [[${PLAN_I_URL}|${t.plan_interactif}]]**\n` : ''
    const planPdfUrl = PLAN_PDF ? `**🗺️ [[${PLAN_PDF}|${t.plan_pdf}]]**\n` : ''
    const planUrl = PLAN_URL
      ? `<div style="width:350px; height:auto; display:flex; align-items:center; justify-content:center;">
  <a href="${resolveUrl(PLAN_URL, 'map')}" target="_blank" rel="noopener">
    <img src="${resolveUrl(PLAN_URL, 'map')}" style="max-width:350px; max-height:500px; width:auto; height:auto; object-fit:contain;">
  </a>
</div>`
      : ''

    const content = `
${logo}${infoUrl}${altitudes}${pistes}${remontees}${nbPistes}${kmPistes}
${tarifTitle}
${tarifAdulte}${tarifSenior}${tarifJeune}${tarifEnfant}${magicPassLine}
${sitUrl}${webcamUrl}${planInteractifUrl}${planPdfUrl}${planUrl}${instaLink}
**📅 ${t.verified} ${generationDate}**
`.trim()

    mapDesc[NAME] = {
      description: content,
      kmPistes: hasValue(KM_PISTES) ? Number(KM_PISTES) : '',
      price: hasValue(TARIF_ADULTE) ? Number(TARIF_ADULTE) : '',
      magicPass: hasMagicPass,
    }
  })

  return mapDesc
}

;['fr', 'en', 'de'].forEach((lang) => {
  const mapDesc = buildDescriptions(lang)
  const newUmap = JSON.parse(JSON.stringify(umap))

  newUmap.properties.name = translations[lang].name
  newUmap.properties.permanentCredit = `<span data-ref="short">${translations[lang].editeur}: <a target="_blank" href="https://www.instagram.com/jondfl/"><strong>Jonathan de Flaugergues </strong></a> - <a target="_blank" href="https://jdflaugergues.github.io/swiss-ski-map/"> <strong>Swiss Ski Map</strong></a><strong> - ${new Date().getFullYear()}</strong></span>`
  newUmap.properties.fields = [
    { key: 'magicPass', type: 'Boolean' },
    { key: 'kmPistes', type: 'Number' },
    { key: 'price', type: 'Number' },
  ]
  newUmap.properties.filters = [
    { label: translations[lang].magicPass, widget: 'Switch', fieldKey: 'magicPass' },
    { label: translations[lang].tarifs, widget: 'MinMax', fieldKey: 'price' },
    { label: translations[lang].domaineSkiable, widget: 'MinMax', fieldKey: 'kmPistes' },
  ]

  newUmap.layers.forEach((layer) => {
    layer.features.forEach((feature) => {
      const name = normalize(feature.properties?.name)
      if (name && mapDesc[name]?.description) {
        feature.properties.description = mapDesc[name]?.description
        feature.properties.kmPistes = mapDesc[name]?.kmPistes
        feature.properties.price = mapDesc[name]?.price
        feature.properties.magicPass = mapDesc[name]?.magicPass
      }
    })
  })

  const outputPath = path.join(__dirname, `output_${lang}.umap`)
  fs.writeFileSync(outputPath, JSON.stringify(newUmap, null, 2), 'utf8')
  console.log('Umap généré :', outputPath)
})

