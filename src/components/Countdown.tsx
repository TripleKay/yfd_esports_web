import { useEffect, useState } from 'react'

interface CountdownProps {
  target: Date | null
  title?: string
  phase?: string
  loading?: boolean
}

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0')
}

function getParts(target: Date | null) {
  if (!target) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const diff = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

export function Countdown({
  target,
  title = 'Tournament Kickoff Countdown',
  phase = 'PHASE: REGISTRATION_LOCK',
  loading = false,
}: CountdownProps) {
  const [parts, setParts] = useState(() => getParts(target))

  useEffect(() => {
    setParts(getParts(target))
    if (!target) {
      return
    }

    const id = window.setInterval(() => setParts(getParts(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  const cells = [
    { label: 'DAYS', value: parts.days, accent: 'text-[#dbfcff]' },
    { label: 'HOURS', value: parts.hours, accent: 'text-[#dbfcff]' },
    { label: 'MINUTES', value: parts.minutes, accent: 'text-[#dbfcff]' },
    { label: 'SECONDS', value: parts.seconds, accent: 'text-[#f0dbff]' },
  ]

  return (
    <div className="w-full max-w-2xl rounded-xl border border-[#3b494b]/50 bg-[#191b24]/80 p-4 shadow-[0_0_30px_rgba(111,0,190,0.25)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2">
          <span className="text-cyan" aria-hidden>
            ⏱
          </span>
          <span className="label-tactical text-[#dbfcff]">
            {loading ? 'Loading countdown…' : title}
          </span>
        </div>
        <span className="label-code text-violet">{phase}</span>
      </div>
      <div className="grid grid-cols-4 gap-3 text-center">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="flex flex-col rounded-lg border border-[#3b494b]/40 bg-[#0c0e16]/90 p-3"
          >
            <span
              className={`font-display text-3xl font-bold tracking-tight tabular md:text-4xl ${cell.accent}`}
            >
              {loading ? '--' : pad(cell.value)}
            </span>
            <span className="mt-1 label-code text-muted">{cell.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
