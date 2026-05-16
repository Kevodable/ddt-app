import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          pdfmake: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'],
        },
      },
    },
  },
})
