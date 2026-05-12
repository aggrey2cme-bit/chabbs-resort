import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // '/' base for web deployment. The Electron app uses a separate build process.
  base: '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
