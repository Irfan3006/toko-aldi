import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://tokoaldi.biz.id',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/blog/admin') &&
        !page.includes('/blog/create-post') &&
        !page.includes('/blog/edit-post') &&
        !page.includes('/blog/login') &&
        !page.includes('/blog/signup')
    })
  ],
});
