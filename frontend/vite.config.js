import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { config } from "dotenv";
config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    //for fetching api's - we do not need to write 'http://localhost:port/api/...' instead we can write '/api/...'
    proxy: {
      '/api': `http://localhost:${process.env.PORT}`,
    }
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
