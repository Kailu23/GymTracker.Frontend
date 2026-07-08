import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      // ─── Workbox strategije cachiranja ──────────────────────────────
      workbox: {
        // Ove rute su dostupne offline
        navigateFallback: '/index.html',

        // Ne cachiraj API pozive — uvijek idi na mrežu za svježe podatke
        navigateFallbackDenylist: [/^\/api/],
        // Sve frontend rute su dopuštene (SPA routing)
        navigateFallbackAllowlist: [/^(?!\/api).*/],

        // Cachiraj statičke asete agresivno (JS, CSS, slike, fontovi)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Runtime caching strategije
        runtimeCaching: [
          {
            // API pozivi — Network First: pokušaj mrežu, fallback na cache
            // Korisno za workout planove koji se rijetko mijenjaju
            urlPattern: /^https?:\/\/.*\/api\/workout-plans/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-workout-plans',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 }, // 24h
              networkTimeoutSeconds: 5,
            },
          },
          {
            // Google Fonts i ostali vanjski resursi — Cache First
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },

      // ─── Web App Manifest ────────────────────────────────────────────
      manifest: {
        name: 'GymTracker',
        short_name: 'GymTracker',
        description: 'Prati treninge, napredak i pretplate',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',        // bez browser UI — izgleda kao nativna app
        orientation: 'portrait',
        start_url: '/dashboard',      // otvori dashboard, ne homepage
        scope: '/',
        lang: 'hr',

        icons: [
          { src: 'pwa-64x64.png',     sizes: '64x64',     type: 'image/png' },
          { src: 'pwa-192x192.png',   sizes: '192x192',   type: 'image/png' },
          { src: 'pwa-512x512.png',   sizes: '512x512',   type: 'image/png' },
          // maskable ikona — Android adaptive icons
          { src: 'pwa-512x512.png',   sizes: '512x512',   type: 'image/png', purpose: 'maskable' },
        ],

        // Shortcuti u long-press meniju na mobilnom
        shortcuts: [
          {
            name: 'Novi trening',
            url: '/workout',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
          {
            name: 'Moj napredak',
            url: '/progress',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
          },
        ],

        // Screenshot za install prompt (opcionalno)
        screenshots: [],
      },

      // ─── Dev options ─────────────────────────────────────────────────
      devOptions: {
        // Uključi service worker u dev modu za testiranje
        // Inače je disabled jer smeta hot reloadu
        enabled: false,
        type: 'module',
      },
    }),
  ],

  resolve: {
    alias: { '@': '/src' },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://api:5000',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('error', (err) => console.log('Proxy error:', err))
        },
      },
    },
  },
})
