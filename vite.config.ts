import { defineConfig } from 'vite'
import type { Plugin } from 'vite'

// Moves <link rel="stylesheet"> before <script type="module"> in the built HTML
// so the browser can't execute JS before CSS is available, preventing the
// Firefox "Layout was forced before the page was fully loaded" FOUC warning.
function cssBeforeScript(): Plugin {
  return {
    name: 'css-before-script',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const styles: string[] = []
        const stripped = html.replace(/[ \t]*<link rel="stylesheet"[^\n]*\n?/g, (m) => {
          styles.push(m.trim())
          return ''
        })
        if (!styles.length) return html
        return stripped.replace(
          /(\s*)(<script\b[^>]*\btype="module")/,
          `\n    ${styles.join('\n    ')}$1$2`
        )
      },
    },
  }
}

export default defineConfig({
  appType: 'spa',
  plugins: [cssBeforeScript()],
  server: {
    middlewareMode: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
  },
  build: {
    target: 'ES2022',
    manifest: true,
  },
})
