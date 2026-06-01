#!/usr/bin/env node
// Post-build smoke test: confirms the dist/ artefacts are coherent.
// Run AFTER `npm run build`. Used in CI (and locally) to catch regressions
// in the PWA/SW pipeline without spinning up a browser.
//
// Checks:
//   - expected files exist (index.html, sw.js, .vite/manifest.json, favicon)
//   - sw.js parses as valid JavaScript and references the vite manifest
//   - hashed JS/CSS bundles in index.html are present in the vite manifest
//     (so the SW precache list and the actual page payload agree)

import { readFileSync, existsSync } from 'node:fs'
import { Script } from 'node:vm'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIST = join(__dirname, '../dist')

let failures = 0

function check(label, ok, detail = '') {
  const mark = ok ? '✓' : '✗'
  const suffix = ok ? '' : `\n    ${detail}`
  console.log(`${mark} ${label}${suffix}`)
  if (!ok) failures++
}

function readText(path) {
  try { return readFileSync(path, 'utf8') } catch { return null }
}

// 1. Required artefacts
const required = [
  'index.html',
  'sw.js',
  '.vite/manifest.json',
  'assets/favicon.ico',
]
for (const f of required) {
  check(`dist/${f} exists`, existsSync(join(DIST, f)), 'file missing — did the build complete?')
}

// 2. sw.js sanity
const swSrc = readText(join(DIST, 'sw.js'))
if (swSrc) {
  let parseErr = ''
  try { new Script(swSrc) } catch (e) { parseErr = e.message }
  check('sw.js parses as valid JavaScript', !parseErr, parseErr)
  check('sw.js fetches /.vite/manifest.json on install',
        swSrc.includes('/.vite/manifest.json'),
        'expected the SW to read the vite manifest to precache hashed bundles')
  check('sw.js declares a CACHE_NAME',
        /CACHE_NAME\s*=\s*['"][^'"]+['"]/.test(swSrc),
        'CACHE_NAME constant not found in sw.js')
}

// 3. index.html ↔ vite manifest consistency
const indexHtml = readText(join(DIST, 'index.html'))
const manifestRaw = readText(join(DIST, '.vite/manifest.json'))

if (indexHtml && manifestRaw) {
  let manifest
  try { manifest = JSON.parse(manifestRaw) } catch (e) {
    check('vite manifest is valid JSON', false, e.message)
  }
  if (manifest) {
    const manifestFiles = new Set()
    for (const entry of Object.values(manifest)) {
      if (entry.file) manifestFiles.add(entry.file)
      if (Array.isArray(entry.css)) entry.css.forEach((f) => manifestFiles.add(f))
      if (Array.isArray(entry.assets)) entry.assets.forEach((f) => manifestFiles.add(f))
    }
    check('vite manifest declares at least one bundle', manifestFiles.size > 0)

    const referenced = [...indexHtml.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)]
      .map((m) => m[1])
    check('index.html references at least one hashed bundle', referenced.length > 0,
          'no /assets/*.{js,css} found in index.html')
    for (const ref of referenced) {
      check(`${ref} is declared in the vite manifest`,
            manifestFiles.has(ref),
            'present in index.html but missing from manifest.json — SW would not precache it')
    }
  }
}

console.log('')
if (failures) {
  console.error(`${failures} check(s) failed`)
  process.exit(1)
}
console.log('All checks passed')
