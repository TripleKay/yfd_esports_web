import { ApiError } from './registrations'
import type { NewsArticle as UiNewsArticle, NewsCategory } from '../types'

export type ApiNewsArticle = {
  id: string
  title: string
  excerpt: string
  body: string | null
  category: Exclude<NewsCategory, 'all'>
  category_label: string
  author: string
  auth_code: string
  read_time: string
  image_url: string | null
  is_featured: boolean
  status: 'draft' | 'published'
  published_at: string | null
  created_at: string | null
  updated_at: string | null
}

export type FetchNewsOptions = {
  search?: string
  category?: Exclude<NewsCategory, 'all'> | 'all'
  featured?: boolean
  excludeFeatured?: boolean
  limit?: number
}

function formatDate(value: string | null): string {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function mapNewsArticle(article: ApiNewsArticle): UiNewsArticle {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    categoryLabel: article.category_label,
    date: formatDate(article.published_at ?? article.created_at),
    readTime: article.read_time,
    author: article.author,
    authCode: article.auth_code,
    image: article.image_url ?? undefined,
    featured: article.is_featured,
  }
}

export async function fetchNews(options: FetchNewsOptions = {}): Promise<UiNewsArticle[]> {
  const query = new URLSearchParams()

  if (options.search?.trim()) {
    query.set('search', options.search.trim())
  }
  if (options.category && options.category !== 'all') {
    query.set('category', options.category)
  }
  if (options.featured) {
    query.set('featured', '1')
  }
  if (options.excludeFeatured) {
    query.set('exclude_featured', '1')
  }
  if (options.limit && options.limit > 0) {
    query.set('limit', String(options.limit))
  }

  const suffix = query.toString() ? `?${query}` : ''
  const response = await fetch(`${import.meta.env.VITE_API_URL}/news${suffix}`, {
    headers: { Accept: 'application/json' },
  })

  const body = (await response.json().catch(() => ({}))) as {
    message?: string
    data?: ApiNewsArticle[]
  }

  if (!response.ok || !body.data) {
    throw new ApiError(body.message ?? 'Failed to load news', response.status)
  }

  return body.data.map(mapNewsArticle)
}
