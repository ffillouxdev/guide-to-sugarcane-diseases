import { defineConfig } from 'vite'

export default defineConfig({
  appType: 'spa',
  server: {
    middlewareMode: false,
  },
  preview: {
    host: '0.0.0.0',
    port: 5174,
  },
  build: {
    target: 'ES2022',
  },
})
