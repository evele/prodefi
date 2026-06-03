import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const OX_PURE_ANNOTATION_WARNING = 'contains an annotation that Rollup cannot interpret due to the position of the comment'

function isKnownOxPureAnnotationWarning(warning: { message?: string; id?: string }) {
  return Boolean(
    warning.message?.includes(OX_PURE_ANNOTATION_WARNING)
      && warning.id?.includes('/node_modules/.pnpm/ox@'),
  )
}

function validateOpenfortEnv(mode: string) {
  const env = loadEnv(mode, __dirname, '')
  const publishableKey = env.VITE_OPENFORT_PUBLISHABLE_KEY?.trim()

  if (publishableKey?.startsWith('sk_')) {
    throw new Error(
      'VITE_OPENFORT_PUBLISHABLE_KEY must be an Openfort publishable key (pk_*), not a secret key (sk_*).'
    )
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  validateOpenfortEnv(mode)

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
        // Exclude dev-only routes from production builds
        routeFileIgnorePrefix: mode === 'development' ? '**/*.tsx' : '**/!(*.dev).tsx',
      }),
      react(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Current wallet/web3 dependencies produce large but expected vendor chunks.
      chunkSizeWarningLimit: 1100,
      rollupOptions: {
        onwarn(warning, warn) {
          if (isKnownOxPureAnnotationWarning(warning)) return
          warn(warning)
        },
      },
    },
  }
})
