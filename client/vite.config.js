import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {    
      proxy: {
        'http://localhost:3001': {
          secure: false,
        },
      } 
    },
    esbuild: {
      include: /\.[jt]sx?$/,
      exclude: [],
      loader: 'jsx',
    },
})