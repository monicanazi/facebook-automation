import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': { target: 'http://127.0.0.1:5500', changeOrigin: true, secure: false },
      '/messages': { target: 'http://127.0.0.1:5500', changeOrigin: true, secure: false },
      '/chat': { target: 'http://127.0.0.1:5500', changeOrigin: true, secure: false }
    }
  }
})
