import type { RefObject } from 'react'
import { MaterialIcon } from './MaterialIcon'

type Props = {
  viewportRef: RefObject<HTMLDivElement | null>
  zoom: number
  onOpenIntel: (matchId: string) => void
  onScrollToStage: (stageId: string) => void
}

export function ScheduleBracketTree({
  viewportRef,
  zoom,
  onOpenIntel,
  onScrollToStage,
}: Props) {
  return (
    <div
      className="relative w-full overflow-x-auto schedule-scrollbar bg-[#0c0e16] min-h-[850px] p-4 lg:p-6"
      id="bracket-canvas-wrapper"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div
        ref={viewportRef}
        className="min-w-[1920px] max-w-[2400px] mx-auto transition-transform duration-300 origin-top-left"
        id="bracket-viewport"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="grid grid-cols-6 gap-6 relative items-start py-2">
          <Round64 onOpenIntel={onOpenIntel} />
          <Round32 onOpenIntel={onOpenIntel} />
          <Round16 onOpenIntel={onOpenIntel} />
          <Quarters onOpenIntel={onOpenIntel} />
          <Semis onOpenIntel={onOpenIntel} onScrollToStage={onScrollToStage} />
          <GrandFinal />
        </div>
      </div>
    </div>
  )
}

function Round64({ onOpenIntel }: { onOpenIntel: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-2.5 min-w-[280px]" id="stage-r64">
      <StageHeader title="1. ROUND OF 64" format="BO1" fixtures="32 FIXTURES" />
      <Sector label="Bracket Sector 1 (Top 16 Seeds)" accent="cyan" />
      <BracketMatch
        id="M-001"
        metaIcon="shield"
        score="2 - 0"
        winner={{ tag: 'VK', name: 'Valkyrie Squad', score: '2' }}
        loser={{ tag: 'NG', name: 'Nova Genesis', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
      <BracketMatch
        id="M-002"
        metaIcon="military_tech"
        score="2 - 1"
        winner={{ tag: 'CE', name: 'Chronos Echo', score: '2' }}
        loser={{ tag: 'AR', name: 'Aegis Reign', score: '1' }}
        onOpenIntel={onOpenIntel}
      />
      <BracketMatch
        id="M-003"
        metaIcon="military_tech"
        score="2 - 0"
        winner={{ tag: 'CK', name: 'Cyber Kings', score: '2' }}
        loser={{ tag: 'BV', name: 'Blaze Vortex', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
      <BracketMatch
        id="M-004"
        metaIcon="military_tech"
        score="2 - 0"
        winner={{ tag: 'PS', name: 'Phantom Strike', score: '2' }}
        loser={{ tag: 'DF', name: 'Delta Force', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
      <Sector label="Bracket Sector 2 (Seeds 17-32)" accent="violet" />
      <BracketMatch
        id="M-005"
        metaIcon="military_tech"
        score="2 - 0"
        winner={{ tag: 'RL', name: 'Radiant Legacy', score: '2', violet: true }}
        loser={{ tag: 'FV', name: 'Frost Vipers', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
      <div className="p-2.5 rounded bg-[#0c0e16]/80 border border-dashed border-[#3b494b]/40 flex flex-col gap-1 font-mono text-[10px] text-[#b9cacb]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-[#dbfcff]">
            <MaterialIcon name="dns" className="text-[13px] text-cyan" />
            27 OTHER R-64 FIXTURES
          </span>
          <span className="text-[#dbfcff] font-bold">CONCLUDED</span>
        </div>
        <span className="text-[#849495] text-[9px]">
          Sectors 3 & 4 (Seeds 33-64) concluded. Advancing 32 squads into Round 2.
        </span>
      </div>
    </div>
  )
}

function Round32({ onOpenIntel }: { onOpenIntel: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-5 min-w-[280px]" id="stage-r32">
      <StageHeader title="2. ROUND OF 32" format="BO3" formatTone="violet" fixtures="16 FIXTURES" />
      <BracketMatchLarge
        id="M-101"
        status="FINAL RESULT"
        winner={{ tag: 'VK', name: 'Valkyrie Squad', score: '2' }}
        loser={{ tag: 'AP', name: 'Apex Prime', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
      <BracketMatchLarge
        id="M-102"
        winner={{ tag: 'CK', name: 'Cyber Kings', score: '2' }}
        loser={{ tag: 'VD', name: 'Vanguard Delta', score: '1' }}
        onOpenIntel={onOpenIntel}
      />
      <BracketMatchLarge
        id="M-103"
        winner={{ tag: 'RL', name: 'Radiant Legacy', score: '2', violet: true }}
        loser={{ tag: 'QT', name: 'Quantum Titans', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
      <BracketMatchLarge
        id="M-104"
        winner={{ tag: 'SP', name: 'Synapse Pulse', score: '2' }}
        loser={{ tag: 'PP', name: 'Pulse Phantoms', score: '1' }}
        onOpenIntel={onOpenIntel}
      />
    </div>
  )
}

function Round16({ onOpenIntel }: { onOpenIntel: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-9 min-w-[280px]" id="stage-r16">
      <StageHeader title="3. ROUND OF 16" format="BO3" formatTone="violet" fixtures="8 FIXTURES" />
      {[
        { id: 'M-151', w: ['VK', 'Valkyrie Squad', '2'], l: ['CE', 'Chronos Echo', '0'], violet: false },
        { id: 'M-152', w: ['CK', 'Cyber Kings', '2'], l: ['PS', 'Phantom Strike', '1'], violet: false },
        {
          id: 'M-153',
          w: ['RL', 'Radiant Legacy', '2'],
          l: ['SP', 'Synapse Pulse', '0'],
          violet: true,
        },
      ].map((m) => (
        <div
          key={m.id}
          className="match-card group relative bg-[#191b24] rounded-lg p-3 border border-[#3b494b]/30 hover:border-cyan hover:bg-[#1d1f28] transition-all cursor-pointer shadow-lg"
          onClick={() => onOpenIntel(m.id)}
          onKeyDown={(e) => e.key === 'Enter' && onOpenIntel(m.id)}
          role="button"
          tabIndex={0}
        >
          <div className="flex items-center justify-between text-[#849495] text-[10px] font-mono mb-2">
            <span className="flex items-center gap-1 font-bold text-[#dbfcff]">
              <MaterialIcon name="bolt" className="text-[13px] text-cyan" />
              R16 #{m.id}
            </span>
            <span className="text-cyan font-bold">ADVANCED</span>
          </div>
          <TeamRow tag={m.w[0]} name={m.w[1]} score={m.w[2]} winner violet={m.violet} />
          <TeamRow tag={m.l[0]} name={m.l[1]} score={m.l[2]} loser />
        </div>
      ))}
    </div>
  )
}

function Quarters({ onOpenIntel }: { onOpenIntel: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-14 min-w-[280px]" id="stage-quarters">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-[#3b494b]/30 sticky top-0 bg-[#0c0e16]/95 backdrop-blur z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm uppercase tracking-wider text-white font-bold">
            4. QUARTERS
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#282a32] font-mono text-[9px] text-[#ddb7ff]">
            BO3
          </span>
        </div>
        <span className="font-mono text-[10px] text-cyan uppercase">STAGE CLEAR</span>
      </div>
      <QuarterCard
        id="M-201"
        status="CLICK INTEL"
        winner={{
          tag: 'VK',
          name: 'Valkyrie Squad',
          seed: 'SEED #1 • BRACKET A',
          score: '2',
        }}
        loser={{ tag: 'CK', name: 'Cyber Kings', score: '1' }}
        onOpenIntel={onOpenIntel}
      />
      <QuarterCard
        id="M-202"
        status="2 - 0 SWEEP"
        winner={{
          tag: 'RL',
          name: 'Radiant Legacy',
          seed: 'SEED #2 • BRACKET B',
          score: '2',
          violet: true,
        }}
        loser={{ tag: 'SP', name: 'Synapse Pulse', score: '0' }}
        onOpenIntel={onOpenIntel}
      />
    </div>
  )
}

function Semis({
  onOpenIntel,
  onScrollToStage,
}: {
  onOpenIntel: (id: string) => void
  onScrollToStage: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-6 min-w-[310px]" id="stage-semis">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-[#3b494b]/30 sticky top-0 bg-[#0c0e16]/95 backdrop-blur z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm uppercase tracking-wider text-white font-bold">
            5. SEMI-FINALS
          </span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb4ab]" />
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#ffb4ab] font-bold tracking-widest uppercase">
          BROADCASTING
        </span>
      </div>

      <div
        className="match-card relative bg-gradient-to-b from-[#282a32] to-[#1d1f28] rounded-xl p-3.5 shadow-[0_0_30px_rgba(255,51,102,0.25)] ring-2 ring-[#ffb4ab]/50 flex flex-col gap-2.5 overflow-hidden cursor-pointer"
        onClick={() => onOpenIntel('M-301')}
        onKeyDown={(e) => e.key === 'Enter' && onOpenIntel('M-301')}
        role="button"
        tabIndex={0}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ffb4ab] via-cyan to-[#ddb7ff]" />
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ffb4ab]/20 text-[#ffb4ab] font-mono text-[10px] font-bold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping" />
            MAP 3: SANCTUARY // 16:42
          </span>
          <span className="font-mono text-[10px] text-[#ddb7ff] font-bold">BO3 DECIDER</span>
        </div>
        <LiveTeam tag="VK" name="Valkyrie Squad" captain="Capt. Maya Lin" score="1" cyan />
        <div className="flex items-center justify-center -my-1">
          <div className="px-2 py-0.5 bg-[#33343d] rounded font-display text-[9px] font-black text-[#ddb7ff] tracking-widest ring-1 ring-[#ddb7ff]/40">
            VS TIEBREAKER
          </div>
        </div>
        <LiveTeam tag="RL" name="Radiant Legacy" captain="Capt. Alex Vance" score="1" violet />
        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            className="flex-1 py-1.5 bg-gradient-to-r from-[#ffb4ab] to-[#93000a] text-white font-display text-[11px] uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(255,51,102,0.35)] hover:brightness-110"
            onClick={(e) => {
              e.stopPropagation()
              onScrollToStage('stage-semis')
            }}
          >
            <MaterialIcon name="play_circle" className="text-[14px]" />
            <span>WATCH</span>
          </button>
          <button
            type="button"
            className="px-2.5 py-1.5 bg-[#33343d] hover:bg-[#282a32] text-[#dbfcff] font-mono text-[10px] uppercase tracking-wider rounded flex items-center justify-center gap-1"
            onClick={(e) => {
              e.stopPropagation()
              onOpenIntel('M-301')
            }}
          >
            <MaterialIcon name="info" className="text-[13px] text-cyan" />
            <span>INTEL</span>
          </button>
        </div>
      </div>

      <div
        className="match-card group relative bg-[#191b24] rounded-xl p-3 border border-[#3b494b]/30 hover:border-[#ddb7ff] transition-all cursor-pointer"
        onClick={() => onOpenIntel('M-302')}
        onKeyDown={(e) => e.key === 'Enter' && onOpenIntel('M-302')}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center justify-between text-[#849495] text-[10px] font-mono mb-1.5">
          <span className="text-[#ddb7ff] font-bold">SEMI-FINAL #2</span>
          <span className="px-1.5 py-0.5 rounded bg-[#282a32] text-[#ddb7ff] font-bold">3 - 0 SWEEP</span>
        </div>
        <TeamRow tag="AD" name="Apex Dominion" score="3" winner violet />
        <TeamRow tag="VT" name="Vector Tactical" score="0" loser />
      </div>
    </div>
  )
}

function GrandFinal() {
  return (
    <div className="flex flex-col gap-3 min-w-[260px] max-w-[270px]" id="stage-finals">
      <div className="flex items-center justify-between px-2 pb-2 border-b border-[#3b494b]/30 sticky top-0 bg-[#0c0e16]/95 backdrop-blur z-10">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm uppercase tracking-wider text-[#ddb7ff] font-bold">
            6. GRAND FINAL
          </span>
          <span className="px-1.5 py-0.5 rounded bg-[#6f00be]/40 text-[#ddb7ff] font-mono text-[9px] font-bold">
            BO5
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#ddb7ff] font-bold">CHAMPION</span>
      </div>

      <div className="relative bg-gradient-to-b from-[#282a32] via-[#191b24] to-[#0c0e16] rounded-xl p-3 shadow-[0_0_25px_rgba(221,183,255,0.18)] ring-1 ring-[#ddb7ff]/50 flex flex-col gap-2.5 overflow-hidden border border-[#ddb7ff]/30">
        <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#ddb7ff]/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between pb-1.5 border-b border-[#3b494b]/30">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#6f00be]/80 ring-1 ring-[#ddb7ff]/60 flex items-center justify-center text-[#ddb7ff] shadow-[0_0_10px_rgba(221,183,255,0.4)]">
              <MaterialIcon name="emoji_events" className="text-[16px]" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#ddb7ff] font-bold">
                YFD DAYS 2025
              </span>
              <span className="font-display text-xs font-black text-white">$25,000 + RINGS</span>
            </div>
          </div>
          <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#ddb7ff]/20 text-[#ddb7ff] font-bold">
            BO5
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="p-1.5 rounded-lg bg-[#282a32]/70 flex items-center justify-between border border-[#3b494b]/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-cyan/20 flex items-center justify-center font-mono text-[9px] font-bold text-cyan">
                ?
              </div>
              <div>
                <span className="font-display text-xs font-bold text-[#dbfcff] block leading-tight">
                  Winner M-301
                </span>
                <span className="font-mono text-[9px] text-[#849495]">Valkyrie OR Radiant</span>
              </div>
            </div>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#1d1f28] text-[#b9cacb]">
              TBD
            </span>
          </div>
          <div className="p-1.5 rounded-lg bg-[#282a32]/70 flex items-center justify-between border border-[#ddb7ff]/30">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-[#6f00be] flex items-center justify-center font-mono text-[9px] font-bold text-white">
                AD
              </div>
              <div>
                <span className="font-display text-xs font-bold text-[#ddb7ff] block leading-tight">
                  Apex Dominion
                </span>
                <span className="font-mono text-[9px] text-[#849495]">BRACKET B SEED #1</span>
              </div>
            </div>
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#6f00be]/40 text-[#ddb7ff] font-bold">
              READY
            </span>
          </div>
        </div>
        <div className="p-1.5 rounded bg-[#0c0e16]/80 text-center flex flex-col gap-0.5 border border-[#3b494b]/20">
          <span className="font-mono text-[9px] text-[#849495] uppercase tracking-wider">
            CHAMPIONSHIP MATCH
          </span>
          <span className="font-display text-xs text-[#dbfcff] font-bold">TODAY @ 20:30 UTC</span>
          <span className="font-mono text-[9px] text-[#b9cacb]">Arena Stage 1 • Full Audio</span>
        </div>
      </div>
    </div>
  )
}

function StageHeader({
  title,
  format,
  formatTone = 'muted',
  fixtures,
}: {
  title: string
  format: string
  formatTone?: 'muted' | 'violet'
  fixtures: string
}) {
  return (
    <div className="flex items-center justify-between px-2 pb-2 border-b border-[#3b494b]/30 sticky top-0 bg-[#0c0e16]/95 backdrop-blur z-10">
      <div className="flex items-center gap-1.5">
        <span className="font-display text-sm uppercase tracking-wider text-white font-bold">
          {title}
        </span>
        <span
          className={`px-1.5 py-0.5 rounded bg-[#282a32] font-mono text-[9px] ${formatTone === 'violet' ? 'text-[#ddb7ff]' : 'text-[#b9cacb]'}`}
        >
          {format}
        </span>
      </div>
      <span className="font-mono text-[10px] text-[#849495] uppercase">{fixtures}</span>
    </div>
  )
}

function Sector({ label, accent }: { label: string; accent: 'cyan' | 'violet' }) {
  const border = accent === 'cyan' ? 'border-cyan' : 'border-[#ddb7ff]'
  const text = accent === 'cyan' ? 'text-cyan' : 'text-[#ddb7ff]'
  return (
    <div
      className={`p-1 rounded bg-[#191b24]/40 border-l-2 ${border} font-mono text-[9px] ${text} px-2 font-bold uppercase tracking-wider`}
    >
      {label}
    </div>
  )
}

function BracketMatch({
  id,
  metaIcon,
  score,
  winner,
  loser,
  onOpenIntel,
}: {
  id: string
  metaIcon: string
  score: string
  winner: { tag: string; name: string; score: string; violet?: boolean }
  loser: { tag: string; name: string; score: string }
  onOpenIntel: (id: string) => void
}) {
  return (
    <div
      className="match-card group relative bg-[#191b24] rounded-lg p-2.5 border border-[#3b494b]/30 hover:border-cyan hover:bg-[#1d1f28] transition-all cursor-pointer shadow"
      onClick={() => onOpenIntel(id)}
      onKeyDown={(e) => e.key === 'Enter' && onOpenIntel(id)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between text-[#849495] text-[10px] font-mono mb-1.5">
        <span className="flex items-center gap-1 text-[#dbfcff]">
          <MaterialIcon name={metaIcon} className="text-[12px] text-cyan" />
          {id}
        </span>
        <span className="text-cyan font-bold">{score}</span>
      </div>
      <TeamRow tag={winner.tag} name={winner.name} score={winner.score} winner violet={winner.violet} compact />
      <TeamRow tag={loser.tag} name={loser.name} score={loser.score} loser compact />
    </div>
  )
}

function BracketMatchLarge({
  id,
  status = 'FINAL RESULT',
  winner,
  loser,
  onOpenIntel,
}: {
  id: string
  status?: string
  winner: { tag: string; name: string; score: string; violet?: boolean }
  loser: { tag: string; name: string; score: string }
  onOpenIntel: (id: string) => void
}) {
  return (
    <div
      className="match-card group relative bg-[#191b24] rounded-lg p-3 border border-[#3b494b]/30 hover:border-cyan hover:bg-[#1d1f28] transition-all cursor-pointer shadow"
      onClick={() => onOpenIntel(id)}
      onKeyDown={(e) => e.key === 'Enter' && onOpenIntel(id)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between text-[#849495] text-[10px] font-mono mb-2">
        <span className="flex items-center gap-1 text-[#dbfcff]">
          <MaterialIcon name="check_circle" className="text-[13px] text-cyan" />
          MATCH #{id}
        </span>
        <span className="text-cyan font-bold">{status}</span>
      </div>
      <TeamRow tag={winner.tag} name={winner.name} score={winner.score} winner violet={winner.violet} />
      <TeamRow tag={loser.tag} name={loser.name} score={loser.score} loser />
    </div>
  )
}

function QuarterCard({
  id,
  status,
  winner,
  loser,
  onOpenIntel,
}: {
  id: string
  status: string
  winner: { tag: string; name: string; seed: string; score: string; violet?: boolean }
  loser: { tag: string; name: string; score: string }
  onOpenIntel: (id: string) => void
}) {
  return (
    <div
      className="match-card group relative bg-[#191b24] rounded-xl p-3 border border-cyan/40 hover:border-cyan hover:bg-[#1d1f28] transition-all cursor-pointer shadow-xl ring-1 ring-cyan/20"
      onClick={() => onOpenIntel(id)}
      onKeyDown={(e) => e.key === 'Enter' && onOpenIntel(id)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-center justify-between text-[#849495] text-[10px] font-mono mb-2">
        <span className="flex items-center gap-1 font-bold text-white">
          <MaterialIcon name="sports_score" className="text-[13px] text-cyan" />
          MATCH #{id}
        </span>
        <span className="px-1.5 py-0.5 rounded bg-[#282a32] text-[#dbfcff] font-bold">{status}</span>
      </div>
      <div className="flex items-center justify-between p-2 rounded bg-[#282a32] mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded flex items-center justify-center font-mono text-[10px] font-bold ${winner.violet ? 'bg-[#6f00be] text-white' : 'bg-cyan text-[#00363a]'}`}
          >
            {winner.tag}
          </div>
          <div>
            <span className="font-display text-xs font-bold text-[#dbfcff] block leading-tight">
              {winner.name}
            </span>
            <span className="font-mono text-[9px] text-[#849495]">{winner.seed}</span>
          </div>
        </div>
        <span className="font-mono text-xs font-bold text-cyan px-2 py-0.5 rounded bg-cyan/20">
          {winner.score}
        </span>
      </div>
      <TeamRow tag={loser.tag} name={loser.name} score={loser.score} loser />
    </div>
  )
}

function TeamRow({
  tag,
  name,
  score,
  winner,
  loser,
  violet,
  compact,
}: {
  tag: string
  name: string
  score: string
  winner?: boolean
  loser?: boolean
  violet?: boolean
  compact?: boolean
}) {
  const size = compact ? 'w-5 h-5 text-[9px]' : 'w-6 h-6 text-[10px]'
  const tagBg = winner
    ? violet
      ? 'bg-[#6f00be] text-white'
      : 'bg-cyan/20 text-cyan'
    : 'bg-[#33343d] text-[#849495]'

  return (
    <div
      className={[
        'flex items-center justify-between rounded',
        compact ? 'p-1.5' : 'p-2',
        winner ? 'bg-[#282a32] mb-1' : 'bg-[#0c0e16]/60 opacity-60 line-through',
      ].join(' ')}
    >
      <div className="flex items-center gap-1.5">
        <div className={`${size} rounded flex items-center justify-center font-mono font-bold ${tagBg}`}>
          {tag}
        </div>
        <span
          className={`${compact ? 'font-display text-xs font-bold text-[#dbfcff]' : loser ? 'font-body text-xs text-[#b9cacb]' : 'font-display text-xs font-bold text-[#dbfcff]'}`}
        >
          {name}
        </span>
      </div>
      <span
        className={`font-mono text-xs ${winner ? 'font-bold text-cyan' : 'text-[#849495]'} ${!compact && winner ? 'px-2 py-0.5 rounded bg-cyan/10' : ''}`}
      >
        {score}
      </span>
    </div>
  )
}

function LiveTeam({
  tag,
  name,
  captain,
  score,
  cyan,
  violet,
}: {
  tag: string
  name: string
  captain: string
  score: string
  cyan?: boolean
  violet?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0c0e16]/80 ring-1 ring-cyan/40">
      <div className="flex items-center gap-2">
        <div
          className={`w-7 h-7 rounded flex items-center justify-center font-display text-xs font-black ${cyan ? 'bg-cyan text-[#00363a] shadow-[0_0_10px_rgba(0,240,255,0.4)]' : ''} ${violet ? 'bg-[#6f00be] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]' : ''}`}
        >
          {tag}
        </div>
        <div>
          <span className="font-display text-xs font-bold text-[#dbfcff] block leading-none">{name}</span>
          <span className="font-mono text-[9px] text-[#b9cacb]">{captain}</span>
        </div>
      </div>
      <div className="font-display text-base font-black text-cyan px-2 py-0.5 bg-cyan/10 rounded">
        {score}
      </div>
    </div>
  )
}
