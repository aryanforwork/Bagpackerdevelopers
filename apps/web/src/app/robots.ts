import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'GPTBot', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
      },
      {
        userAgent: ['CCBot', 'cohere-ai', 'anthropic-ai', 'Bytespider'],
        disallow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
      }
    ],
    sitemap: 'https://bagpackers.dev/sitemap.xml',
  };
}
