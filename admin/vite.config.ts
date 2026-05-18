import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoRoot = '/home/compu/Proyectos/prodefi'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
})
