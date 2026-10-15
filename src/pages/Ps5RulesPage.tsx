import { Link } from 'react-router-dom'
import { RulebookTabs } from '../components/rules/RulebookTabs'
import { LinkButton } from '../components/ui/Button'
import {
  PS5_ACK_FIELDS,
  PS5_NOTICE_FIELDS,
  PS5_RULES_META,
  PS5_RULE_SECTIONS,
  type Ps5RuleBlock,
} from '../data/ps5Rules'

function BlankLine() {
  return (
    <span
      className="mt-2 block h-8 border-b border-dashed border-violet/40"
      aria-hidden
    />
  )
}

function RuleText({ text }: { text: string }) {
  const [before, after] = text.split('(__TIME__)')
  if (after === undefined) return text

  return (
    <>
      {before}(
      <span className="mx-1 inline-block min-w-16 border-b border-dashed border-faint align-middle" />
      ){after}
    </>
  )
}

function NoticeFields() {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {PS5_NOTICE_FIELDS.map((label) => (
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
  return (
    <div className="border border-violet/30 bg-violet/5 p-4 md:p-5">
      <p className="label-code text-violet">Player confirmation</p>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {PS5_ACK_FIELDS.map((label) => (
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

function Disclaimer() {
  return (
    <div className="border border-border bg-ground/60 px-4 py-4">
      <p className="font-mm text-sm leading-7 text-muted">
        ဤပြိုင်ပွဲသည် Electronic Arts Inc. သို့မဟုတ် ၎င်း၏
        လိုင်စင်ပေးသူများနှင့် ဆက်နွှယ်ခြင်းမရှိသကဲ့သို့ ၎င်းတို့၏
        ပံ့ပိုးကူညီမှုဖြင့် ကျင်းပခြင်းလည်း မဟုတ်ပါ။
      </p>
      <p className="mt-3 text-sm leading-6 text-faint">
        This tournament is not affiliated with or sponsored by Electronic Arts
        Inc. or its licensors.
      </p>
    </div>
  )
}

function RuleBlockView({ block }: { block: Ps5RuleBlock }) {
  if (block.kind === 'p') {
    return (
      <p className="font-mm text-[15px] leading-[1.95] text-muted md:text-base">
        <RuleText text={block.text} />
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
  if (block.kind === 'ack') return <Acknowledgement />
  return <Disclaimer />
}

export function Ps5RulesPage() {
  return (
    <article lang="my">
      <header className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 grid-tactical opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(168,85,247,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-[1280px] px-5 py-10 md:px-12 md:py-14">
          <p className="label-code text-violet">HOME // RULES // PS5 2026</p>
          <RulebookTabs />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="border border-violet/40 bg-violet/10 px-2.5 py-1 label-code text-violet">
              Issue {PS5_RULES_META.issue}
            </span>
            <span className="border border-border bg-chassis px-2.5 py-1 label-code text-muted">
              PS5 Football
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl font-mm text-3xl font-bold leading-snug text-ink md:text-5xl">
            {PS5_RULES_META.title}
          </h1>
          <p className="mt-4 max-w-3xl font-mm text-base leading-8 text-violet md:text-lg">
            {PS5_RULES_META.subtitle}
          </p>
          <div className="mt-5 max-w-3xl space-y-4">
            {PS5_RULES_META.intro.map((paragraph) => (
              <p
                key={paragraph}
                className="font-mm text-[15px] leading-[1.95] text-muted md:text-base"
              >
                <RuleText text={paragraph} />
              </p>
            ))}
          </div>
          <p className="mt-5 font-mm text-sm leading-8 text-faint">
            ထုတ်ပြန်အမှတ် {PS5_RULES_META.issue}
            <span className="mx-2 text-border">|</span>
            ထုတ်ပြန်ရက်
            <span className="ml-3 inline-block min-w-40 border-b border-dashed border-faint align-middle" />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton to="/register?division=ps5">Register Solo →</LinkButton>
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
            {PS5_RULE_SECTIONS.map((section) => (
              <li key={section.id} className="shrink-0 lg:shrink">
                <a
                  href={`#${section.id}`}
                  className="flex items-center gap-2 border border-border bg-chassis px-3 py-2 font-mm text-sm leading-6 text-muted transition-colors hover:border-violet hover:text-violet"
                >
                  <span className="label-code text-violet">{section.code}</span>
                  {section.toc}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="min-w-0 space-y-6">
          {PS5_RULE_SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 border border-border bg-chassis"
            >
              <header className="border-b border-border px-5 py-4 md:px-6">
                <p className="label-code text-violet">Section {section.code}</p>
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
              စာရင်းမပေးမီ ဤစည်းမျဉ်းများကို ဖတ်ရှုပါ။
            </p>
            <Link
              to="/register?division=ps5"
              className="label-tactical text-violet hover:underline"
            >
              Register PS5 solo →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
