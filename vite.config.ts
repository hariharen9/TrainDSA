import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import netlify from '@netlify/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: {
    include: [
      'prismjs',
      'prismjs/components/prism-c',
      'prismjs/components/prism-cpp',
      'prismjs/components/prism-java',
      'prismjs/components/prism-javascript',
      'prismjs/components/prism-typescript',
      'prismjs/components/prism-python',
    ],
  },
  plugins: [
    react(),
    tailwindcss(),
    netlify(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'maskable-icon.svg', 'icon-192.svg', 'icon-512.svg'],
      manifest: {
        name: 'TrainDSA — Interview Prep Cockpit',
        short_name: 'TrainDSA',
        description: 'Linear, concept-first DSA interview preparation with spaced repetition & streak tracking',
        theme_color: '#0B1018',
        background_color: '#0B1018',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/maskable-icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
})
