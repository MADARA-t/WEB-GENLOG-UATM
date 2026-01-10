import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' 

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), 
  ],
  build: {
    // Augmente la limite à 1000 ko ou plus selon tes besoins
    chunkSizeWarningLimit: 1600, 
  }
})