import { Link } from 'react-router-dom'
import type { NewsArticle } from '../types'

export function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <Link
      to={`/news/${article.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-[#3b494b]/50 bg-[#191b24] transition-colors hover:border-cyan/40"
    >
      {article.image ? (
        <div className="relative aspect-[16/9] overflow-hidden bg-surface-high">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-chassis via-transparent to-transparent" />
        </div>
      ) : (
        <div className="flex aspect-[16/9] items-center justify-center border-b border-border bg-surface-mid">
          <span className="label-code text-cyan">{article.authCode}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="label-code text-muted">
          {article.categoryLabel} · {article.date} · {article.readTime}
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink">
          {article.title}
        </h3>
        <p className="flex-1 text-sm leading-6 text-muted">{article.excerpt}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="label-tactical text-cyan">Read Article →</span>
          <span className="label-code text-faint">
            AUTH: {article.authCode}
          </span>
        </div>
      </div>
    </Link>
  )
}
