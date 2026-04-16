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

async function fetchKey(path: string): Promise<IdentificationKey | null> {
  try {
    const res = await fetch(path)
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.nodes) return null
    return data as IdentificationKey
  } catch {
    return null
  }
}

export async function loadKey(): Promise<IdentificationKey> {
  const lang = i18next.language
  if (cache && cachedLang === lang) return cache

  const path = fileMap[lang] ?? fileMap.en
  let data = await fetchKey(path)

  // Fallback to English if the language file is missing or empty
  if (!data && lang !== 'en') {
    data = await fetchKey(fileMap.en)
  }

  if (!data) throw new Error('Failed to load identification key')

  cache = data
  cachedLang = lang
  return cache
}
