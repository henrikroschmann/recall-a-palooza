import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:3066',  // Assuming your backend server is running on port 3000
    },
    port: 3030,
  },
  preview: {
    proxy: {
      '/api': 'http://backend:3066',  // Assuming your backend server is running on port 3000
    },
    port: 8081,
  },
  plugins: [react()],
})
