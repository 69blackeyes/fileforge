import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use '' for custom domain, '/your-repo-name/' for project page
export default defineConfig({
  plugins: [react()],
  base: '/',  // Change this to '/your-repo-name/' if using a project page (not username.github.io)
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'pdf-lib': ['pdf-lib'],
          'pdfjs': ['pdfjs-dist'],
          'jszip': ['jszip'],
          'image-compression': ['browser-image-compression'],
        }
      }
    }
  }
})
