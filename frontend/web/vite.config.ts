import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  })],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://backend:8000', // Change this to http://localhost:8000 if you are not using Docker
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/music': {
        target: 'http://backend:8000', // Change this to http://localhost:8000 if you are not using Docker
        changeOrigin: true,
      }
    }
  }
})
