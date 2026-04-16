import i18next from '../i18n'

export interface KeyNode {
  type: string
  text: string
  options: Array<{ label: string; next: string }>
}

export interface Disease {
  name: string
  image: string[]
  pathogen?: string
  geo_locations: Array<Record<string, string[]>>
}

export interface IdentificationKey {
  nodes: Record<string, KeyNode>
  diseases: Record<string, Disease>
}

const fileMap: Record<string, string> = {
  en: '/datas/identification-key.json',
  fr: '/datas/cle-identification.json',
  es: '/datas/clave-de-identificacion.json',
}

let cache: IdentificationKey | null = null
let cachedLang: string | null = null

export async function loadKey(): Promise<IdentificationKey> {
  const lang = i18next.language
  if (cache && cachedLang === lang) return cache

  const path = fileMap[lang] ?? fileMap.en
  const res = await fetch(path)
  cache = await res.json()
  cachedLang = lang
  return cache!
}
