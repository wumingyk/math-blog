import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdown from 'vite-plugin-markdown-preview'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdown()
  ],
  assetsInclude: ['**/*.md']
})
