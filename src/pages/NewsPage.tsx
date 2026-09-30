import { useEffect, useMemo, useState } from 'react'
import { fetchNews } from '../api/news'
import { NewsCard } from '../components/NewsCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Field'
import type { NewsArticle, NewsCategory } from '../types'

const filters: { id: NewsCategory; label: string }[] = [
  { id: 'all', label: 'All News' },
  { id: 'mlbb', label: 'MLBB 5v5' },
  { id: 'ps5', label: 'PS5 Football' },
  { id: 'info', label: 'YFD Days Info' },
  { id: 'rules', label: 'Rules & Integrity' },
  { id: 'prize', label: 'Prize & VODs' },
]

export function NewsPage() {
  const [category, setCategory] = useState<NewsCategory>('all')
  const [query, setQuery] = useState('')
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    fetchNews()
      .then((result) => {
        if (!active) {
          return
        }
        setArticles(result)
        setError(null)
      })
      .catch(() => {
        if (active) {
          setArticles([])
          setError('Unable to sync dispatches right now.')
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const featured = useMemo(() => articles.find((a) => a.featured), [articles])

  const filtered = useMemo(() => {
    return articles
      .filter((a) => !a.featured)
      .filter((a) => {
        const catOk = category === 'all' || a.category === category
        const q = query.trim().toLowerCase()
        const qOk =
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q)
        return catOk && qOk
      })
  }, [articles, category, query])

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-12 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-code text-cyan">
            HOME // NEWS // ANNOUNCEMENTS & INTEL
          </p>
          <p className="label-code text-muted">
            FEED STATUS: {loading ? 'SYNCING…' : error ? 'DEGRADED' : 'SYNCHRONIZED (LIVE)'}
          </p>
        </div>

        <div className="mt-6 max-w-3xl">
          <p className="label-code text-violet">
            TRANSMISSION FEED // REAL-TIME DISPATCHES
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Latest News &{' '}
            <span className="text-cyan text-glow-cyan">Announcements</span>
          </h1>
          <p className="mt-4 text-muted">
            Official tournament briefings, balance patches, roster lock alerts,
            and broadcast schedules direct from the YFD Arena Control Deck.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search announcements…"
              aria-label="Search news"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCategory(f.id)}
                className={[
                  'border px-3 py-2 label-code transition-colors',
                  category === f.id
                    ? 'border-cyan bg-cyan text-ground'
                    : 'border-border bg-chassis text-muted hover:text-cyan',
                ].join(' ')}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {featured ? (
        <section className="mx-auto max-w-[1280px] px-5 pb-10 md:px-12">
          <article className="grid overflow-hidden border border-border bg-chassis lg:grid-cols-2">
            <div className="relative min-h-[240px]">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-surface-low label-code text-cyan">
                  {featured.authCode}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-chassis/80 max-lg:bg-gradient-to-t max-lg:from-chassis" />
            </div>
            <div className="flex flex-col justify-center p-6 md:p-10">
              <div className="flex flex-wrap gap-2">
                <Badge tone="violet">★ Featured Headline</Badge>
                <Badge>{featured.categoryLabel}</Badge>
              </div>
              <p className="mt-4 label-code text-muted">{featured.date}</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted md:text-base">
                {featured.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button type="button">Read Article →</Button>
                <span className="label-code text-muted">
                  {featured.readTime} · BY: {featured.author}
                </span>
              </div>
            </div>
          </article>
        </section>
      ) : null}

      <section className="border-t border-border bg-surface-low/40">
        <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="label-code text-cyan">FIELD DISPATCHES</p>
              <h2 className="mt-2 font-display text-3xl font-bold">
                Tactical Intel
              </h2>
            </div>
            <p className="label-code text-muted">Sort by: Latest Arrivals</p>
          </div>
          {loading ? (
            <p className="border border-border bg-chassis p-8 text-center text-muted">
              Syncing dispatches…
            </p>
          ) : null}
          {error && !loading ? (
            <p className="border border-border bg-chassis p-8 text-center text-muted">
              {error}
            </p>
          ) : null}
          {!loading && !error ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
              {filtered.length === 0 ? (
                <p className="border border-border bg-chassis p-8 text-center text-muted">
                  No dispatches match this filter.
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </section>
    </>
  )
}
