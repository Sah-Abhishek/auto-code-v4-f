import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 9010,
    proxy: {
      '/api': {
        target: 'http://216.48.183.225:8501',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})