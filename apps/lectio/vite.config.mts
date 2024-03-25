/// <reference types='vitest' />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import crossOriginIsolation from 'vite-plugin-cross-origin-isolation'
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/lectio',

  server: {
    port: 4200,
    host: 'localhost',
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate', injectRegister: 'auto' }),
    nxViteTsPaths(),
    mkcert(),
    crossOriginIsolation(),
  ],

  optimizeDeps: {
    exclude: ['sqlocal'],
  },

  // Uncomment this if you are using workers.
  worker: {
    plugins: () => [nxViteTsPaths()],
  },

  build: {
    outDir: '../../dist/apps/lectio',
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/lectio',
      provider: 'v8',
    },
  },
})
