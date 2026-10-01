import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchNewsArticle } from '../api/news'
import { Badge } from '../components/ui/Badge'
import { LinkButton } from '../components/ui/Button'
import type { NewsArticle } from '../types'

function bodyParagraphs(article: NewsArticle): string[] {
  const source = article.body?.trim() || article.excerpt.trim()
  if (!source) {
    return []
  }

  return source
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
}

export function NewsArticlePage() {
  const { id = '' } = useParams()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    if (!id) {
      setArticle(null)
      setError('Dispatch not found.')
      setLoading(false)
      return
    }

    setLoading(true)
    fetchNewsArticle(id)
      .then((result) => {
        if (!active) {
          return
        }
        setArticle(result)
        setError(null)
      })
      .catch(() => {
        if (active) {
          setArticle(null)
          setError('This dispatch is unavailable or no longer published.')
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
  }, [id])

  const paragraphs = useMemo(
    () => (article ? bodyParagraphs(article) : []),
    [article],
  )

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-12 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label-code text-cyan">
            HOME // NEWS //{' '}
            <Link to="/news" className="hover:text-ink">
              ANNOUNCEMENTS
            </Link>{' '}
            // DISPATCH
          </p>
          <p className="label-code text-muted">
            {loading
              ? 'STATUS: DECRYPTING…'
              : error
                ? 'STATUS: OFFLINE'
                : 'STATUS: CLEARED FOR PUBLIC'}
          </p>
        </div>

        {loading ? (
          <p className="mt-10 border border-border bg-chassis p-8 text-center text-muted">
            Decrypting dispatch…
          </p>
        ) : null}

        {error && !loading ? (
          <div className="mt-10 border border-border bg-chassis p-8 text-center">
            <p className="text-muted">{error}</p>
            <div className="mt-6 flex justify-center">
              <LinkButton to="/news" variant="secondary">
                ← Back to news
              </LinkButton>
            </div>
          </div>
        ) : null}

        {article && !loading ? (
          <article className="mt-8">
            <div className="flex flex-wrap gap-2">
              {article.featured ? (
                <Badge tone="violet">★ Featured Headline</Badge>
              ) : null}
              <Badge>{article.categoryLabel}</Badge>
            </div>

            <h1 className="mt-4 max-w-4xl font-display text-3xl font-bold tracking-tight md:text-5xl">
              {article.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 label-code text-muted">
              <span>{article.date}</span>
              <span>{article.readTime}</span>
              <span>BY: {article.author}</span>
              <span>AUTH: {article.authCode}</span>
            </div>

            <div className="mx-auto mt-8 max-w-3xl overflow-hidden border border-border bg-surface-high">
              {article.image ? (
                <div className="relative aspect-[16/9]">
                  <img
                    src={article.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-chassis/70 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="flex aspect-[16/9] items-center justify-center bg-surface-mid">
                  <span className="label-code text-cyan">
                    {article.authCode}
                  </span>
                </div>
              )}
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-5 text-base leading-7 text-muted md:text-lg md:leading-8">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>
                  {paragraph.split('\n').map((line, index, lines) => (
                    <span key={index}>
                      {line}
                      {index < lines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </p>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <LinkButton to="/news" variant="secondary">
                ← All dispatches
              </LinkButton>
              <span className="label-code text-faint">
                END OF TRANSMISSION · {article.authCode}
              </span>
            </div>
          </article>
        ) : null}
      </div>
    </>
  )
}
