import type { APIRoute } from 'astro';
// @ts-ignore
import { BLOG_CONFIG } from '../blog-config.js';

export const prerender = false;

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatDate(dateStr: any): string {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
}

export const GET: APIRoute = async () => {
  let posts: any[] = [];
  try {
    const res = await fetch(`${BLOG_CONFIG.scriptUrl}?action=get_posts&_t=${Date.now()}`);
    const json = await res.json();
    if (json && json.success && Array.isArray(json.data)) {
      posts = json.data;
    }
  } catch (err) {
    console.error('Failed to fetch posts for sitemap-blog.xml:', err);
  }

  const siteUrl = BLOG_CONFIG.siteUrl.replace(/\/$/, '');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${siteUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/categories</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${siteUrl}/blog/explore</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
${posts
  .filter((p) => p && p.slug)
  .map((post) => {
    const postUrl = `${siteUrl}/blog/post/${encodeURIComponent(post.slug)}`;
    const lastMod = formatDate(post.updated_at || post.created_at);
    const thumb = post.thumbnail ? (post.thumbnail.startsWith('http') ? post.thumbnail : siteUrl + post.thumbnail) : '';
    const imageTag = thumb
      ? `
    <image:image>
      <image:loc>${escapeXml(thumb)}</image:loc>
      <image:title>${escapeXml(post.title || '')}</image:title>
    </image:image>`
      : '';
    return `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>${imageTag}
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=14400',
    },
  });
};
