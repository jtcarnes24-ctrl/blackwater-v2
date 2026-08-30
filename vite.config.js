import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// Multi-page build. Each entry becomes a real static .html file with its own
// <title>, description and canonical, which is what lets each page rank for a
// different query. Cloudflare Pages serves /about/index.html at /about.
const pages = {
  main: 'index.html',
  services: 'services/index.html',
  metaAds: 'services/meta-ads/index.html',
  tiktokAds: 'services/tiktok-ads/index.html',
  creative: 'services/creative-strategy/index.html',
  method: 'the-method/index.html',
  paidAds: 'services/paid-ads/index.html',
  funnels: 'services/funnels/index.html',
  emailSms: 'services/email-sms/index.html',
  b2b: 'services/b2b-marketing/index.html',
  crmCro: 'services/crm-cro/index.html',
  tracking: 'services/tracking-setup/index.html',
  landing: 'services/landing-pages/index.html',
  testing: 'services/testing-scaling/index.html',
  about: 'about/index.html',
  results: 'results/index.html',
  contact: 'contact/index.html',
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        Object.entries(pages).map(([k, v]) => [k, path.resolve(__dirname, v)])
      ),
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
