// v1.0.0 | 2026-06-09 MEZ
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/apps/KhunPan/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,webmanifest,ico}'],
      },
      manifest: {
        name: 'Khun Pan – Schiebeblock-Puzzle',
        short_name: 'Khun Pan',
        description: 'Khun Pan Schiebeblock-Puzzle mit Hike-Motiv als PWA.',
        theme_color: '#2d3748',
        background_color: '#1a202c',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
});
