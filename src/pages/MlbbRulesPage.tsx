import { Link } from 'react-router-dom'
import { RulebookTabs } from '../components/rules/RulebookTabs'
import { LinkButton } from '../components/ui/Button'
import {
  MLBB_NOTICE_FIELDS,
  MLBB_RULES_META,
  MLBB_RULE_SECTIONS,
  MLBB_TOP8_MATCHES,
  type MlbbRuleBlock,
  type Top8Match,
} from '../data/mlbbRules'

const bracketLabel = {
  Upper: 'Upper',
  Lower: 'Lower',
  Final: 'Grand Final',
} as const

function BlankLine() {
  return (
    <span
      className="mt-2 block h-8 border-b border-dashed border-cyan/40"
      aria-hidden
    />
  )
}

function NoticeFields() {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {MLBB_NOTICE_FIELDS.map((label) => (
        <div
          key={label}
          className="border border-border bg-ground/60 px-4 py-3"
        >
          <dt className="font-mm text-sm leading-7 text-ink">{label}</dt>
          <dd>
            <BlankLine />
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Acknowledgement() {
  const fields = [
    'အသင်းအမည်',
    'ခေါင်းဆောင်အမည်',
    'လက်မှတ် သို့မဟုတ် အွန်လိုင်းအတည်ပြုချက်',
    'ရက်စွဲ',
  ]

  return (
    <div className="border border-cyan/30 bg-cyan/5 p-4 md:p-5">
      <p className="label-code text-cyan">Captain confirmation</p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((label) => (
          <div key={label}>
            <dt className="font-mm text-sm leading-7 text-ink">{label}</dt>
            <dd>
              <BlankLine />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function MatchCard({ match }: { match: Top8Match }) {
  return (
    <article className="border border-border bg-ground/70 px-3 py-3">
      <div className="flex items-center justify-between gap-2">
        <span className="label-code text-cyan">{match.id}</span>
        <span className="label-code text-faint">{match.format}</span>
      </div>
      <p className="mt-2 font-mm text-sm leading-7 text-ink">{match.pairing}</p>
      <p className="mt-2 font-mm text-xs leading-6 text-muted">
        <span className="text-cyan">W</span> → {match.winnerTo}
        <span className="mx-2 text-border">/</span>
        <span className="text-critical">L</span> → {match.loserTo}
      </p>
    </article>
  )
}

function BracketBoard() {
  const groups = (['Upper', 'Lower', 'Final'] as const).map((bracket) => ({
    bracket,
    matches: MLBB_TOP8_MATCHES.filter((match) => match.bracket === bracket),
  }))

  return (
    <div className="min-w-0 space-y-5">
      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        {groups
          .filter((group) => group.bracket !== 'Final')
          .map((group) => (
            <div
              key={group.bracket}
              className="border border-border bg-surface-low/40 p-3"
            >
              <p className="label-code text-cyan">
                {bracketLabel[group.bracket]} bracket
              </p>
              <div className="mt-3 grid min-w-0 grid-cols-1 gap-2">
                {group.matches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
      </div>

      {groups
        .filter((group) => group.bracket === 'Final')
        .map((group) => (
          <div
            key={group.bracket}
            className="border border-cyan/40 bg-cyan/5 p-3"
          >
            <p className="label-code text-cyan">
              Grand Final · BO5 · Reset မရှိ
            </p>
            <div className="mt-3 max-w-md">
              {group.matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}

      <div className="w-full min-w-0 overflow-x-auto border border-border">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="border-b border-border bg-surface-low px-4 py-3 text-left font-mm text-sm leading-7 text-muted">
            P1 မှ P4 ကို မဲခွဲနေရာ ၁–၂၊ ၃–၄၊ ၅–၆၊ ၇–၈ အစဉ်လိုက် တွဲထားသည်။ Lower
            bracket တွင် ရှုံးပါက ထွက်သည်။ GF သည် တစ်ပွဲစဉ်တည်းဖြစ်ပြီး Reset
            မရှိပါ။
          </caption>
          <thead className="bg-chassis">
            <tr className="font-mm text-sm text-cyan">
              <th className="px-3 py-3 text-left font-semibold leading-7">
                ပွဲ
              </th>
              <th className="px-3 py-3 text-left font-semibold leading-7">
                အဆင့်
              </th>
              <th className="px-3 py-3 text-left font-semibold leading-7">
                ပြိုင်ဘက်
              </th>
              <th className="px-3 py-3 text-left font-semibold leading-7">
                W သွားရာ
              </th>
              <th className="px-3 py-3 text-left font-semibold leading-7">
                L သွားရာ
              </th>
              <th className="px-3 py-3 text-left font-semibold leading-7">
                ပုံစံ
              </th>
            </tr>
          </thead>
          <tbody>
            {MLBB_TOP8_MATCHES.map((match) => (
              <tr key={match.id} className="border-t border-border">
                <th className="px-3 py-3 label-code font-medium text-cyan">
                  {match.id}
                </th>
                <td className="px-3 py-3 font-mm text-sm leading-7 text-muted">
                  {bracketLabel[match.bracket]} · {match.round}
                </td>
                <td className="px-3 py-3 font-mm text-sm leading-7 text-ink">
                  {match.pairing}
                </td>
                <td className="px-3 py-3 font-mm text-sm leading-7 text-cyan">
                  {match.winnerTo}
                </td>
                <td className="px-3 py-3 font-mm text-sm leading-7 text-critical">
                  {match.loserTo}
                </td>
                <td className="px-3 py-3 label-code text-muted">
                  {match.format}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RuleBlockView({ block }: { block: MlbbRuleBlock }) {
  if (block.kind === 'p') {
    return (
      <p className="font-mm text-[15px] leading-[1.95] text-muted md:text-base">
        {block.text}
      </p>
    )
  }

  if (block.kind === 'subhead') {
    return (
      <h3
        id={block.id}
        className="scroll-mt-28 pt-2 font-mm text-lg font-semibold leading-snug text-ink"
      >
        {block.title}
      </h3>
    )
  }

  if (block.kind === 'notice') return <NoticeFields />
  if (block.kind === 'bracket') return <BracketBoard />
  return <Acknowledgement />
}

export function MlbbRulesPage() {
  return (
    <article lang="my">
      <header className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-tactical opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(0,240,255,0.12),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-10 md:px-12 md:py-14">
          <p className="label-code text-cyan">HOME // RULES // MLBB 2026</p>
          <RulebookTabs />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="border border-cyan/40 bg-cyan/10 px-2.5 py-1 label-code text-cyan">
              Issue {MLBB_RULES_META.issue}
            </span>
            <span className="border border-border bg-chassis px-2.5 py-1 label-code text-muted">
              MLBB 5v5
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl font-mm text-3xl font-bold leading-snug text-ink md:text-5xl">
            {MLBB_RULES_META.title}
          </h1>
          <p className="mt-4 max-w-3xl font-mm text-base leading-8 text-cyan md:text-lg">
            {MLBB_RULES_META.subtitle}
          </p>
          <p className="mt-5 max-w-3xl font-mm text-[15px] leading-[1.95] text-muted md:text-base">
            {MLBB_RULES_META.intro}
          </p>
          <p className="mt-5 font-mm text-sm leading-8 text-faint">
            ထုတ်ပြန်အမှတ် {MLBB_RULES_META.issue}
            <span className="mx-2 text-border">|</span>
            ထုတ်ပြန်ရက်
            <span className="ml-3 inline-block min-w-40 border-b border-dashed border-faint align-middle" />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/register?division=mlbb">
              Register Squad →
            </LinkButton>
            <LinkButton to="/rules" variant="secondary" clip={false}>
              Rules & FAQ
            </LinkButton>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-8 px-5 py-8 md:px-12 md:py-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
        <nav
          aria-label="စည်းမျဉ်း အပိုင်းများ"
          className="min-w-0 lg:sticky lg:top-24"
        >
          <p className="mb-3 hidden label-code text-muted lg:block">Sections</p>
          <ol className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {MLBB_RULE_SECTIONS.map((section) => (
              <li key={section.id} className="shrink-0 lg:shrink">
                <a
                  href={`#${section.id}`}
                  className="flex items-center gap-2 border border-border bg-chassis px-3 py-2 font-mm text-sm leading-6 text-muted transition-colors hover:border-cyan hover:text-cyan"
                >
                  <span className="label-code text-cyan">{section.code}</span>
                  {section.toc}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-6">
          {MLBB_RULE_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border border-border bg-chassis"
            >
              <header className="border-b border-border px-5 py-4 md:px-6">
                <p className="label-code text-cyan">Section {section.code}</p>
                <h2 className="mt-1 font-mm text-xl font-semibold leading-snug text-ink md:text-2xl">
                  {section.title}
                </h2>
              </header>
              <div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
                {section.blocks.map((block, index) => (
                  <RuleBlockView
                    key={
                      block.kind === 'subhead'
                        ? block.id
                        : `${section.id}-${index}`
                    }
                    block={block}
                  />
                ))}
              </div>
            </section>
          ))}

          <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface-low px-5 py-5">
            <p className="font-mm text-sm leading-7 text-muted">
              စာရင်းမပေးမီ ဤစည်းမျဉ်းများကို အသင်းသားအားလုံး ဖတ်ရှုပါ။
            </p>
            <Link
              to="/register?division=mlbb"
              className="label-tactical text-cyan hover:underline"
            >
              Register MLBB squad →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
