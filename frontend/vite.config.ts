import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    TanStackRouterVite({
      // Exclude dev-only routes from production builds
      routeFileMask: mode === 'development' ? '**/*.tsx' : '**/!(*.dev).tsx',
    }),
  ],
}))
