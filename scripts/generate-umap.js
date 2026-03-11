import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const BASE_SWISS_SKI_MAP_URL = "https://jdflaugergues.github.io/swiss-ski-map"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const umapPath = path.join(__dirname, "umap_backup_la-carte-interactive-des-stations-de-ski-en-suisse.umap")
const csvPath = path.join(__dirname, "input.csv")

const translations = {
  fr: {
    name: "La carte interactive des stations de ski en Suisse",
    infos: "INFOS",
    altitudes: "Altitudes",
    pistes: "Pistes",
    remontees: "Remontées mécaniques",
    km_pistes: "Km pistes",
    tarifs: "TARIFS",
    adulte: "Adulte",
    senior: "Senior",
    jeune: "Jeune",
    enfant: "Enfant",
    site: "Site internet",
    webcams: "Webcams",
    plan_interactif: "Plan interactif des pistes",
    plan_pdf: "Télécharger plan pdf",
    verified: "Vérifié le",
    yes: "oui"
  },

  en: {
    name: "Interactive map of ski resorts in Switzerland",
    infos: "INFO",
    altitudes: "Altitudes",
    pistes: "Slopes",
    remontees: "Ski lifts",
    km_pistes: "Slope length",
    tarifs: "PRICES",
    adulte: "Adult",
    senior: "Senior",
    jeune: "Youth",
    enfant: "Child",
    site: "Website",
    webcams: "Webcams",
    plan_interactif: "Interactive piste map",
    plan_pdf: "Download piste map pdf",
    verified: "Verified on",
    yes: "yes"
  },

  de: {
    name: "Interaktive Karte der Skigebiete in der Schweiz",
    infos: "INFOS",
    altitudes: "Höhenlagen",
    pistes: "Pisten",
    remontees: "Skilifte",
    km_pistes: "Pistenkilometer",
    tarifs: "PREISE",
    adulte: "Erwachsene",
    senior: "Senior",
    jeune: "Jugend",
    enfant: "Kind",
    site: "Website",
    webcams: "Webcams",
    plan_interactif: "Interaktive Pistenkarte",
    plan_pdf: "Download Pistenkarte pdf",
    verified: "Überprüft am",
    yes: "ja"
  }
}

const umap = JSON.parse(fs.readFileSync(umapPath, "utf8"));
const data = fs.readFileSync(csvPath, "utf8").trim();
const lines = data.split(/\r?\n/);

const headers = lines[0].split(";");

// Trouver index des colonnes
const nameIndex = headers.indexOf("NAME");
const logoIndex = headers.indexOf("LOGO_URL");
const infoIndex = headers.indexOf("INFO_URL");
const altMinIndex = headers.indexOf("ALT_MIN");
const altMaxIndex = headers.indexOf("ALT_MAX");
const bleueIndex = headers.indexOf("PISTE_BLEUE");
const rougeIndex = headers.indexOf("PISTE_ROUGE");
const noireIndex = headers.indexOf("PISTE_NOIRE");
const remonteesIndex = headers.indexOf("REMONTEES");
const pistesIndex = headers.indexOf("PISTES");
const kmIndex = headers.indexOf("KM_PISTES");
const deviseIndex = headers.indexOf("DEVISE");
const adulteIndex = headers.indexOf("TARIF_ADULTE");
const seniorIndex = headers.indexOf("TARIF_SENIOR");
const jeuneIndex = headers.indexOf("TARIF_JEUNE");
const enfantIndex = headers.indexOf("TARIF_ENFANT");
const magicIndex = headers.indexOf("MAGICPASS");
const siteIndex = headers.indexOf("SITE_URL");
const webcamIndex = headers.indexOf("WEBCAM_URL");
const planIIndex = headers.indexOf("PLAN_I_URL");
const planIndex = headers.indexOf("PLAN_URL");
const planPdfIndex = headers.indexOf("PLAN_PDF");

if (nameIndex === -1) {
  console.error("La colonne NAME est manquante dans le CSV");
  process.exit(1);
}

function formatNumber(n) {
  n = Number(n)
  if (Number.isInteger(n)) {
    return `${n}.-`;
  } else {
    return Number(n).toFixed(2);
  }
}

const normalize = (str) => str?.trim().normalize("NFC");

function resolveUrl(str, folder) {
  if (!str) {
    return ""
  }

  if (str.startsWith("http")) {
    return str
  }

  return `${BASE_SWISS_SKI_MAP_URL}/${folder}/${str}`
}

function extractDomain(url) {
  if (!url) return ""

  const hostname = new URL(url).hostname

  return hostname.replace(/^www\./, "")
}

function buildDescriptions(lang) {

  const t = translations[lang];

// Mapping name -> description
  const mapDesc = {};

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(";");

    const NAME = cols[nameIndex];

    if (!NAME) continue;

    const LOGO_URL = cols[logoIndex]
    const INFO_URL = cols[infoIndex]
    const ALT_MIN = cols[altMinIndex]
    const ALT_MAX = cols[altMaxIndex]
    const PISTE_BLEUE = cols[bleueIndex]
    const PISTE_ROUGE = cols[rougeIndex]
    const PISTE_NOIRE = cols[noireIndex]
    const REMONTEES = cols[remonteesIndex]
    const PISTES = cols[pistesIndex]
    const KM_PISTES = cols[kmIndex]
    const DEVISE = cols[deviseIndex]
    const TARIF_ADULTE = cols[adulteIndex]
    const TARIF_SENIOR = cols[seniorIndex]
    const TARIF_JEUNE = cols[jeuneIndex]
    const TARIF_ENFANT = cols[enfantIndex]
    const MAGICPASS = cols[magicIndex]
    const SITE_URL = cols[siteIndex]
    const WEBCAM_URL = cols[webcamIndex]
    const PLAN_I_URL = cols[planIIndex]
    const PLAN_URL = cols[planIndex]
    const PLAN_PDF = cols[planPdfIndex]

    const generationDate = new Date().toLocaleDateString(lang === "en" ? "en-CH" : lang + "-CH");
    const magicPassLine = (MAGICPASS && MAGICPASS.toLowerCase() === "oui")
      ? `\n{{https://www.seco.admin.ch/seco/fr/home/Standortfoerderung/Tourismuspolitik/Innotour/Gefoerderte_Projekte/2016-bis-2019/magic-pass/_jcr_content/par/image/image.imagespooler.jpg/1554467547295/Magic%20Pass%20Bild.jpg|128}}\n`
      : "";

    const logoUrl = LOGO_URL ? `<div style="text-align:center;"><img src="${resolveUrl(LOGO_URL, 'logo')}" style="max-height:100px; max-width:300px; height:auto; width:auto;"></div>\n\n` : ""
    const infoUrl = INFO_URL ? `**ℹ️ ${t.infos} [[${INFO_URL}|(via ${extractDomain(INFO_URL)})]]**\n` : ""
    const altitudes = ALT_MIN && ALT_MAX ? `**${t.altitudes}: ${ALT_MIN}m - ${ALT_MAX}m**\n` : ""
    const pistes = PISTE_BLEUE || PISTE_ROUGE || PISTE_NOIRE ? `**${t.pistes}: 🔵${PISTE_BLEUE || 0}% | 🔴${PISTE_ROUGE || 0}% | ⚫${PISTE_NOIRE || 0}%**\n` : ""
    const remontees = REMONTEES ? `**${t.remontees}: ${REMONTEES}**\n` : ""
    const nbPistes = PISTES ? `**${t.pistes}: ${PISTES}**\n` : ""
    const kmPistes = KM_PISTES ? `**${t.km_pistes}: ${KM_PISTES} km**\n` : ""

    const tarifAdulte = TARIF_ADULTE ? `**${t.adulte} : ${formatNumber(TARIF_ADULTE)} ${DEVISE}**\n` : ""
    const tarifSenior = TARIF_SENIOR ? `**${t.senior} : ${formatNumber(TARIF_SENIOR)} ${DEVISE}**\n` : ""
    const tarifJeune = TARIF_JEUNE ? `**${t.jeune} : ${formatNumber(TARIF_JEUNE)} ${DEVISE}**\n` : ""
    const tarifEnfant = TARIF_ENFANT ? `**${t.enfant} : ${formatNumber(TARIF_ENFANT)} ${DEVISE}**\n` : ""

    const sitUrl = SITE_URL ? `**🌐 [[${SITE_URL}|${t.site}]]**\n` : ""
    const webcamUrl = WEBCAM_URL ? `**🎥 [[${WEBCAM_URL}|${t.webcams}]]**\n` : ""
    const planInteractifUrl = PLAN_I_URL ? `**🗺️ [[${PLAN_I_URL}|${t.plan_interactif}]]**\n` : ""
    const planPdfUrl = PLAN_PDF ? `**🗺️ [[${PLAN_PDF}|${t.plan_pdf}]]**\n` : ""
    const planUrl = PLAN_URL ? `<div style="width:350px; height:auto; display:flex; align-items:center; justify-content:center;">
  <a href="${resolveUrl(PLAN_URL, 'map')}" target="_blank" rel="noopener">
    <img src="${resolveUrl(PLAN_URL, 'map')}" style="max-width:350px; max-height:500px; width:auto; height:auto; object-fit:contain;">
  </a>
</div>` : ""

    const content = `
${logoUrl}${infoUrl}${altitudes}${pistes}${remontees}${nbPistes}${kmPistes}
**💳 ${t.tarifs}**
${tarifAdulte}${tarifSenior}${tarifJeune}${tarifEnfant}${magicPassLine}
${sitUrl}${webcamUrl}${planInteractifUrl}${planPdfUrl}${planUrl}
**📅 ${t.verified} ${generationDate}**
`.trim()

    mapDesc[NAME] = content
  }
  return mapDesc
}

["fr", "en", "de"].forEach(lang => {
  const mapDesc = buildDescriptions(lang)
  const newUmap = JSON.parse(JSON.stringify(umap))

  newUmap.properties.name = translations[lang].name
  newUmap.layers.forEach(layer => {
    layer.features.forEach(feature => {
      const name = normalize(feature.properties?.name)
      if (name && mapDesc[name]) {
        feature.properties.description = mapDesc[name]
      }
    })
  })

  const outputPath = path.join(__dirname, `output_${lang}.umap`)
  fs.writeFileSync(outputPath, JSON.stringify(newUmap, null, 2), "utf8")
  console.log("Umap généré :", outputPath)
})
