import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Fallback defaults for CI/CD build safety
  const googleSiteVerification =
    env.VITE_GOOGLE_SITE_VERIFICATION ||
    process.env.VITE_GOOGLE_SITE_VERIFICATION ||
    'ZUhFWaGuP_ZrNKLCXxIXODCoIJGDPJbPfNsLyotgX_A'

  process.env.VITE_GOOGLE_SITE_VERIFICATION = googleSiteVerification

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    build: {
      outDir: '../siap-deploy',
      emptyOutDir: true,
    },
  }
})
