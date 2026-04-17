import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'spa',
  server: {
    middlewareMode: false,
  },
  build: {
    target: 'ES2022',
  },
})
