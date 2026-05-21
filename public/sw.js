const CACHE_NAME = 'dcas-v4'

const APP_SHELL = [
  '/',
  '/index.html',
  '/assets/favicon.ico',
  '/datas/identification-key.json',
  '/datas/cle-identification.json',
  '/datas/clave-de-identificacion.json',
]

const LANG_FILES = {
  en: '/datas/identification-key.json',
  fr: '/datas/cle-identification.json',
  es: '/datas/clave-de-identificacion.json',
}

// Reads Vite's build manifest at install time and adds the hashed JS/CSS
// bundles to the precache. Falls back gracefully in dev (no manifest).
async function getViteBundleAssets() {
  try {
    const res = await fetch('/.vite/manifest.json', { cache: 'no-cache' })
    if (!res.ok) return []
    const manifest = await res.json()
    const urls = new Set()
    for (const entry of Object.values(manifest)) {
      if (entry.file) urls.add('/' + entry.file)
      if (Array.isArray(entry.css)) entry.css.forEach((f) => urls.add('/' + f))
      if (Array.isArray(entry.assets)) entry.assets.forEach((f) => urls.add('/' + f))
    }
    return [...urls]
  } catch {
    return []
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    const bundles = await getViteBundleAssets()
    const all = [...new Set([...APP_SHELL, ...bundles])]
    await Promise.all(all.map((url) => cache.add(url).catch(() => {})))
  })())
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

function isImageRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith('/datas/diseases-img/') ||
         (url.pathname.startsWith('/assets/') && /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(url.pathname))
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    return new Response('Not found', { status: 404 })
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch (err) {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === 'navigate') {
      const fallback = (await caches.match('/index.html')) || (await caches.match('/'))
      if (fallback) return fallback
    }
    return new Response('Not found', { status: 404 })
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  if (!request.url.startsWith(self.location.origin)) return

  event.respondWith(isImageRequest(request) ? cacheFirst(request) : networkFirst(request))
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'precache-images') {
    event.waitUntil(precacheImagesForLang(event.data.lang || 'en'))
  }
})

async function fetchLangData(lang) {
  const path = LANG_FILES[lang] || LANG_FILES.en
  try {
    const res = await fetch(path)
    if (!res.ok) return null
    const data = await res.json()
    if (!data?.nodes) return null
    return data
  } catch {
    return null
  }
}

async function broadcast(msg) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true })
  clients.forEach((c) => c.postMessage(msg))
}

const precachingLangs = new Set()
const PRECACHE_CONCURRENCY = 6

async function precacheImagesForLang(lang) {
  if (precachingLangs.has(lang)) return
  precachingLangs.add(lang)
  try {
    let data = await fetchLangData(lang)
    if (!data && lang !== 'en') data = await fetchLangData('en')
    if (!data) return

    const urls = new Set()
    const collect = (obj) => {
      if (obj?.image && Array.isArray(obj.image)) {
        obj.image.forEach((u) => urls.add(u))
      }
    }
    Object.values(data.diseases || {}).forEach(collect)
    Object.values(data.other_causes || {}).forEach(collect)

    const all = [...urls]
    const total = all.length
    let done = 0

    await broadcast({ type: 'precache-progress', done, total })

    const cache = await caches.open(CACHE_NAME)
    let index = 0
    async function worker() {
      while (index < all.length) {
        const url = all[index++]
        if (!(await cache.match(url))) {
          await cache.add(url).catch(() => {})
        }
        done++
        if (done % 10 === 0 || done === total) {
          await broadcast({ type: 'precache-progress', done, total })
        }
      }
    }
    await Promise.all(Array.from({ length: PRECACHE_CONCURRENCY }, worker))
  } catch {} finally {
    precachingLangs.delete(lang)
  }
}
