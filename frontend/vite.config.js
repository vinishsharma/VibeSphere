import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    //for fetching api's - we do not need to write 'http://localhost:port/api/...' instead we can write '/api/...'
    proxy: {
      "/api": {
        target: "http://localhost:8080", // Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 10s ease infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
