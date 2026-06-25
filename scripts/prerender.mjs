// Build-time prerenderer. After `vite build`, this renders each page in each
// language to a static HTML file with the correct <head> metadata and the main
// view markup already in the body — so crawlers (and no-JS clients) get real,
// per-language, indexable HTML. The SPA then hydrates normally on top.
//
// It runs the app's own view functions in Node via Vite's SSR loader (no
// headless browser). A few browser globals are shimmed because header()/i18n
// touch location and localStorage.

import { createServer } from 'vite'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

// --- browser global shims (must exist before any app module loads) ---
globalThis.location = { pathname: '/' }
globalThis.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  length: 0,
}

const DIST = 'dist'

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function buildHtml(template, { lang, title, desc, canonical, ogLocale, alternates, appHtml }) {
  let html = template

  html = html.replace('<html lang="en">', `<html lang="${lang}">`)
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`)

  html = html.replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escAttr(desc)}" />`)
  html = html.replace(/<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${escAttr(canonical)}" />`)

  html = html.replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${escAttr(title)}" />`)
  html = html.replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${escAttr(desc)}" />`)
  html = html.replace(/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${escAttr(canonical)}" />`)
  html = html.replace(/<meta property="og:locale" content="[^"]*" \/>/, `<meta property="og:locale" content="${ogLocale}" />`)

  html = html.replace(/<meta\s+name="twitter:title"[\s\S]*?\/>/, `<meta name="twitter:title" content="${escAttr(title)}" />`)
  html = html.replace(/<meta\s+name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description" content="${escAttr(desc)}" />`)

  for (const { hreflang, href } of alternates) {
    html = html.replace(
      new RegExp(`<link rel="alternate" hreflang="${hreflang}"[^>]*/>`),
      `<link rel="alternate" hreflang="${hreflang}" href="${escAttr(href)}" />`,
    )
  }

  html = html.replace(/<div id="app"([^>]*)><\/div>/, (_m, attrs) => `<div id="app"${attrs}>${appHtml}</div>`)

  return html
}

const vite = await createServer({ appType: 'custom', server: { middlewareMode: true }, logLevel: 'warn' })

try {
  const routes = await vite.ssrLoadModule('/src/routes.ts')
  const i18next = (await vite.ssrLoadModule('/src/i18n.ts')).default
  const views = {
    home: (await vite.ssrLoadModule('/src/views/home.ts')).homeView,
    catalogue: (await vite.ssrLoadModule('/src/views/catalog.ts')).catalogueView,
    about: (await vite.ssrLoadModule('/src/views/about.ts')).aboutView,
    privacy: (await vite.ssrLoadModule('/src/views/privacy.ts')).privacyView,
    legal: (await vite.ssrLoadModule('/src/views/legal.ts')).legalView,
  }

  const { PAGES, LANGS, SITE_ORIGIN, OG_LOCALES, urlFor } = routes
  const template = await readFile(join(DIST, 'index.html'), 'utf8')

  let count = 0
  for (const lang of LANGS) {
    for (const page of PAGES) {
      const path = urlFor(page, lang)
      globalThis.location.pathname = path
      await i18next.changeLanguage(lang)
      const t = i18next.t.bind(i18next)

      const appHtml = views[page.key]()
      const title = `${t(page.titleKey)} — CaneDr`
      const desc = t(page.descKey)
      const canonical = SITE_ORIGIN + path
      const alternates = [
        ...LANGS.map((l) => ({ hreflang: l, href: SITE_ORIGIN + urlFor(page, l) })),
        { hreflang: 'x-default', href: SITE_ORIGIN + urlFor(page, 'en') },
      ]

      const html = buildHtml(template, { lang, title, desc, canonical, ogLocale: OG_LOCALES[lang], alternates, appHtml })

      const outDir = path === '/' ? DIST : join(DIST, path.replace(/\/$/, ''))
      await mkdir(outDir, { recursive: true })
      await writeFile(join(outDir, 'index.html'), html, 'utf8')
      count++
      console.log(`  prerendered ${path}`)
    }
  }
  console.log(`✓ prerendered ${count} pages`)

  // --- sitemap.xml (one <url> per page x language, each with hreflang alternates) ---
  const today = new Date().toISOString().slice(0, 10)
  const priority = (key) => (key === 'home' ? '1.0' : key === 'catalogue' ? '0.9' : key === 'about' ? '0.6' : '0.3')
  const changefreq = (key) => (key === 'home' || key === 'catalogue' ? 'monthly' : 'yearly')

  const entries = []
  for (const page of PAGES) {
    const alternates = [
      ...LANGS.map((l) => ({ hreflang: l, href: SITE_ORIGIN + urlFor(page, l) })),
      { hreflang: 'x-default', href: SITE_ORIGIN + urlFor(page, 'en') },
    ]
    const links = alternates
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${a.href}" />`)
      .join('\n')
    for (const lang of LANGS) {
      entries.push(
        `  <url>\n    <loc>${SITE_ORIGIN + urlFor(page, lang)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq(page.key)}</changefreq>\n    <priority>${priority(page.key)}</priority>\n${links}\n  </url>`,
      )
    }
  }
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    entries.join('\n') +
    `\n</urlset>\n`
  await writeFile(join(DIST, 'sitemap.xml'), sitemap, 'utf8')
  console.log(`✓ wrote sitemap.xml (${entries.length} urls)`)
} finally {
  await vite.close()
}
