import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// Tailwind CSS v4 se integra como plugin de Vite (no requiere tailwind.config.js).
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
