import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),

        // PWA - generate service worker and web manifest
        VitePWA({
            registerType: 'autoUpdate',
            workbox: {
                navigateFallback: '/index.html',

                navigateFallbackDenylist: [/^\/api/],

                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

                runtimeCaching: [
                    {
                        urlPattern: /^https?:\/\/.*\/api\/workout-plans/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'api-workout-plans',
                            expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
                            networkTimeoutSeconds: 5,
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                        },
                    },
                ],
            },

            manifest: {
                name: 'GymTracker',
                short_name: 'GymTracker',
                description: 'Track your workouts and progress',
                theme_color: '#0a0a0a',
                background_color: '#0a0a0a',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/dashboard',
                scope: '/',
                lang: 'en',

                icons: [
                    { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
                    { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                    // maskable ikona — Android adaptive icons
                    { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
                ],

                shortcuts: [
                    {
                        name: 'New workout',
                        url: '/workout',
                        icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
                    },
                    {
                        name: 'My progress',
                        url: '/progress',
                        icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }],
                    },
                ],

                screenshots: [],
            },

            devOptions: {
                enabled: true,
                type: 'module'
            }
        }),
    ],
    resolve: {
        alias: {
            '@': '/src'
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://api:5000',
                changeOrigin: true,
            },
        },
    },
})

