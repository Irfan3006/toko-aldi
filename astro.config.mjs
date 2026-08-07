import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://toko-aldi.vercel.app',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
});
