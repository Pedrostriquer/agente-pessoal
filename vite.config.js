import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Permite que o ngrok se conecte ao servidor de desenvolvimento do Vite
    allowedHosts: ['7a91c171c3e1.ngrok-free.app'],
    
    // Opcional, mas recomendado para ngrok para garantir que o HMR (Hot Module Replacement) funcione
    hmr: {
      host: 'localhost',
      protocol: 'ws',
    },
  },
})