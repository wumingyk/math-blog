import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import markdown from 'vite-plugin-markdown-preview'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdown()
  ],
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-markdown') || id.includes('remark-') || id.includes('rehype-') || id.includes('unist-')) {
            return 'markdown-vendor';
          }
          if (id.includes('katex') || id.includes('highlight.js')) {
            return 'render-vendor';
          }
          if (id.includes('yet-another-react-lightbox')) {
            return 'lightbox-vendor';
          }
          if (id.includes('three')) {
            return 'three-vendor';
          }
          if (id.includes('d3')) {
            return 'd3-vendor';
          }
        },
      },
    },
  },
})
