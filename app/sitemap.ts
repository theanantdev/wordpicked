import { MetadataRoute } from 'next';
import { createAdminClient } from '@/utils/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  const supabase = createAdminClient();

  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, slug, category, publish_at')
    .eq('status', 'published');

  const dynamicUrls: MetadataRoute.Sitemap = (articles || []).map((article) => {
    const isFilm = article.category?.toLowerCase() === 'films';
    const section = isFilm ? 'films' : 'literature';
    const slug = article.slug || `${article.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${article.id.slice(0, 8)}`;
    
    return {
      url: `${baseUrl}/${section}/${slug}`,
      lastModified: article.publish_at ? new Date(article.publish_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/literature`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/films`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pick-of-the-day`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...dynamicUrls];
}
