import { useCallback, useRef, useState, type ReactNode } from 'react'
import { MaterialIcon } from '../components/schedule/MaterialIcon'
import { ScheduleBracketTree } from '../components/schedule/ScheduleBracketTree'
import {
  ScheduleRegisteredTeams,
  TEAM_IDS,
} from '../components/schedule/ScheduleRegisteredTeams'

type ScheduleTab = 'mlbb' | 'ps5' | 'teams'

const TAB_ACTIVE =
  'tab-btn px-3.5 py-1.5 rounded font-display text-xs uppercase tracking-wide bg-cyan text-[#00363a] font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all flex items-center gap-1.5 whitespace-nowrap'
const TAB_IDLE =
  'tab-btn px-3.5 py-1.5 rounded font-display text-xs uppercase tracking-wide text-[#b9cacb] hover:text-white hover:bg-[#1d1f28] transition-all flex items-center gap-1.5 whitespace-nowrap'
const BADGE_ACTIVE =
  'tab-badge font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#00363a]/20 text-[#00363a]'
const BADGE_IDLE =
  'tab-badge font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#33343d] text-[#b9cacb]'

export function SchedulePage() {
  const [tab, setTab] = useState<ScheduleTab>('mlbb')
  const [pageTitle, setPageTitle] = useState('64-TEAM TOURNAMENT BRACKET TREE')
  const [liveTag, setLiveTag] = useState('MLBB SEMI-FINALS')
  const [modalMatchId, setModalMatchId] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [expandedRosters, setExpandedRosters] = useState<Record<string, boolean>>({
    valkyrie: true,
    radiant: true,
    'apex-dominion': true,
    'cyber-kings': false,
  })
  const [allExpanded, setAllExpanded] = useState(false)

  const viewportRef = useRef<HTMLDivElement>(null)
  const showBracket = tab !== 'teams'

  const scrollToStage = useCallback((stageId: string) => {
    document.getElementById(stageId)?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [])

  const openIntelModal = useCallback((matchId: string) => {
    setModalMatchId(matchId)
  }, [])

  const closeIntelModal = useCallback(() => {
    setModalMatchId(null)
  }, [])

  function selectTab(next: ScheduleTab) {
    setTab(next)
    if (next === 'mlbb') {
      setPageTitle('MLBB 5V5 (64 TEAMS) TOURNAMENT BRACKET')
      setLiveTag('MLBB SEMI-FINALS')
    } else if (next === 'ps5') {
      setPageTitle('PS5 FOOTBALL (64 SEEDS) TOURNAMENT BRACKET')
      setLiveTag('PS5 FOOTBALL SEMI-FINALS')
    } else {
      setPageTitle('REGISTERED TOURNAMENT SQUADS & ROSTERS')
    }
  }

  function toggleRoster(id: string) {
    setExpandedRosters((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function toggleAllRosters() {
    const next = !allExpanded
    setAllExpanded(next)
    const map: Record<string, boolean> = {}
    for (const id of TEAM_IDS) map[id] = next
    setExpandedRosters(map)
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => {})
    } else {
      void document.exitFullscreen().catch(() => {})
    }
  }

  return (
    <div className="flex flex-col w-full text-[#e2e1ed] relative overflow-x-hidden bg-[#0b0d14]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] bg-[#6f00be]/10 rounded-full blur-[160px]" />
      </div>

      <section className="w-full bg-[#0c0e16]/80 backdrop-blur-md px-4 lg:px-6 py-4 shadow-2xl relative z-20 border-b border-[#3b494b]/20">
        <div className="max-w-[1850px] mx-auto flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#282a32] font-mono text-[11px] text-[#dbfcff] tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-ping" />
                YFD DAYS 2025 // 64-TEAM TOURNAMENT TREE HUD
              </span>
              <span className="hidden sm:inline text-[#3b494b] font-mono text-xs">//</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan/10 text-cyan font-mono text-[11px] font-bold tracking-wider">
                <MaterialIcon name="account_tree" className="text-[14px]" />
                64 TEAMS • 6 ROUNDS • 63 FIXTURES TOTAL
              </span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px] text-[#b9cacb] flex-wrap">
              <div className="flex items-center gap-1">
                <span className="text-[#849495]">TOTAL SQUADS:</span>
                <span className="text-[#dbfcff] font-bold">64</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ffb4ab] animate-ping" />
                <span className="text-[#ffb4ab] font-bold">1 LIVE MATCH</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <span className="text-[#849495]">PRIZE POOL:</span>
                <span className="text-cyan font-bold">$50,000 USD</span>
              </div>
              <div className="flex items-center gap-1">
                <MaterialIcon name="visibility" className="text-[13px] text-[#ddb7ff]" />
                <span className="text-[#ddb7ff] font-bold">25,840 VIEWERS</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-gradient-to-r from-[#282a32]/90 via-[#191b24]/95 to-[#282a32]/90 border border-[#ffb4ab]/40 rounded-xl p-3 sm:p-4 shadow-[0_0_24px_rgba(255,51,102,0.2)] backdrop-blur-md relative overflow-hidden ring-1 ring-[#ffb4ab]/30">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ffb4ab] via-cyan to-[#ddb7ff]" />
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 relative z-10">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#ffb4ab]/20 border border-[#ffb4ab]/40 text-[#ffb4ab] font-mono text-xs font-bold tracking-wider shadow-[0_0_12px_rgba(255,51,102,0.3)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb4ab]" />
                  </span>
                  <span>CURRENT MATCH [LIVE]</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-[#b9cacb]">
                  <span className="text-[#dbfcff] font-bold uppercase tracking-wider">{liveTag}</span>
                  <span className="text-[#3b494b]">//</span>
                  <span className="px-2 py-0.5 rounded bg-[#33343d] text-[#ddb7ff] font-bold">
                    BO3 DECIDER • GAME 3
                  </span>
                </div>
                <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#1d1f28] font-mono text-[11px] text-[#849495]">
                  <MaterialIcon name="timer" className="text-[14px] text-cyan" />
                  <span>16:42 elapsed (Map: Sanctuary)</span>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-6 flex-wrap">
                <div className="flex items-center gap-2 sm:gap-3 bg-[#0c0e16]/80 px-3 py-1.5 rounded-lg border border-[#3b494b]/30">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-cyan text-[#00363a] flex items-center justify-center font-mono text-xs font-bold">
                      VK
                    </div>
                    <span className="font-display text-[14px] font-bold text-[#dbfcff]">Valkyrie Squad</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#282a32] font-display text-sm font-black">
                    <span className="text-cyan">1</span>
                    <span className="text-[#849495]">-</span>
                    <span className="text-cyan">1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[14px] font-bold text-[#dbfcff]">Radiant Legacy</span>
                    <div className="w-6 h-6 rounded bg-[#6f00be] text-white flex items-center justify-center font-mono text-xs font-bold">
                      RL
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded bg-gradient-to-r from-[#ffb4ab] to-[#93000a] hover:brightness-110 active:scale-95 text-white font-display text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,51,102,0.35)]"
                    onClick={() => scrollToStage('stage-semis')}
                  >
                    <MaterialIcon name="play_circle" className="text-[16px]" />
                    <span>WATCH LIVE</span>
                  </button>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-[#282a32] hover:bg-[#33343d] active:scale-95 text-[#dbfcff] font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-1"
                    onClick={() => openIntelModal('M-301')}
                  >
                    <MaterialIcon name="scoreboard" className="text-[15px] text-cyan" />
                    <span className="hidden sm:inline">LIVE INTEL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-3 pt-1">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl uppercase tracking-tight text-white font-black">
                  {pageTitle}
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#33343d] text-[#ddb7ff] font-mono text-[10px] uppercase font-bold">
                  STAGE 6 • SINGLE ELIMINATION
                </span>
              </div>
              <p className="font-body text-xs text-[#b9cacb]">
                Full single-elimination mapping from Round of 64 through the compact Grand Final
                decider. Hover or click fixtures to track advancing progression paths.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-72 min-w-[220px]">
                <MaterialIcon
                  name="search"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#849495] text-[16px] pointer-events-none"
                />
                <input
                  className="w-full pl-9 pr-12 py-1.5 bg-[#1d1f28] text-white font-body text-xs rounded placeholder:text-[#849495] focus:outline-none focus:bg-[#282a32] border border-[#3b494b]/30"
                  placeholder="Search 64 squads or players..."
                  type="search"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 px-1 py-0.5 rounded bg-[#33343d] font-mono text-[10px] text-[#b9cacb]">
                  ⌘K
                </span>
              </div>
              <button
                type="button"
                className="px-3.5 py-1.5 bg-[#282a32] hover:bg-[#33343d] text-[#dbfcff] font-mono text-xs uppercase tracking-wider rounded flex items-center gap-1.5 border border-[#3b494b]/30"
              >
                <MaterialIcon name="route" className="text-[15px] text-cyan" />
                <span>Highlight Live Path</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 bg-[#191b24] p-1 rounded-lg border border-[#3b494b]/30 overflow-x-auto">
              <TabButton
                active={tab === 'mlbb'}
                className={tab === 'mlbb' ? TAB_ACTIVE : TAB_IDLE}
                badgeClass={tab === 'mlbb' ? BADGE_ACTIVE : BADGE_IDLE}
                icon="sports_esports"
                label="MLBB 5v5 (64 Teams)"
                badge="64 SQUADS"
                onClick={() => selectTab('mlbb')}
              />
              <TabButton
                active={tab === 'ps5'}
                className={tab === 'ps5' ? TAB_ACTIVE : TAB_IDLE}
                badgeClass={tab === 'ps5' ? BADGE_ACTIVE : BADGE_IDLE}
                icon="stadia_controller"
                label="PS5 Football (64 Seeds)"
                badge="64 PLAYERS"
                onClick={() => selectTab('ps5')}
              />
              <TabButton
                active={tab === 'teams'}
                className={tab === 'teams' ? TAB_ACTIVE : TAB_IDLE}
                badgeClass={tab === 'teams' ? BADGE_ACTIVE : BADGE_IDLE}
                icon="groups"
                label="Registered Teams (64 Squads)"
                badge="ROSTER DIRECTORY"
                onClick={() => selectTab('teams')}
              />
            </div>

            <div
              className={`flex items-center gap-1.5 overflow-x-auto pb-1 xl:pb-0 font-mono text-xs uppercase transition-opacity ${tab === 'teams' ? 'opacity-30 pointer-events-none' : ''}`}
            >
              <RoundPill onClick={() => scrollToStage('stage-r64')}>R-64 (32 Matches)</RoundPill>
              <RoundPill onClick={() => scrollToStage('stage-r32')}>R-32 (16 Matches)</RoundPill>
              <RoundPill onClick={() => scrollToStage('stage-r16')}>R-16 (8 Matches)</RoundPill>
              <RoundPill onClick={() => scrollToStage('stage-quarters')}>Quarter-Finals</RoundPill>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#ffb4ab]/15 text-[#ffb4ab] hover:bg-[#ffb4ab]/25 font-bold transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(255,180,171,0.2)] whitespace-nowrap border border-[#ffb4ab]/30"
                onClick={() => scrollToStage('stage-semis')}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb4ab] animate-ping" />
                Semi-Finals [LIVE]
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded bg-[#ddb7ff]/15 text-[#ddb7ff] hover:bg-[#ddb7ff]/25 font-bold transition-all flex items-center gap-1 whitespace-nowrap border border-[#ddb7ff]/30"
                onClick={() => scrollToStage('stage-finals')}
              >
                <MaterialIcon name="emoji_events" className="text-[14px]" />
                Grand Final
              </button>
            </div>
          </div>
        </div>
      </section>

      {showBracket ? (
        <ScheduleBracketTree
          viewportRef={viewportRef}
          zoom={zoom}
          onOpenIntel={openIntelModal}
          onScrollToStage={scrollToStage}
        />
      ) : (
        <ScheduleRegisteredTeams
          expanded={expandedRosters}
          onToggle={toggleRoster}
          allExpanded={allExpanded}
          onToggleAll={toggleAllRosters}
        />
      )}

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-1.5 bg-[#191b24]/95 backdrop-blur-md p-1.5 rounded-xl shadow-2xl border border-[#3b494b]/30">
        <HudButton title="Zoom In" onClick={() => setZoom((z) => Math.min(1.3, z + 0.1))}>
          <MaterialIcon name="add" className="text-[18px]" />
        </HudButton>
        <HudButton title="Zoom Out" onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))}>
          <MaterialIcon name="remove" className="text-[18px]" />
        </HudButton>
        <HudButton title="Reset Viewport" onClick={() => setZoom(1)}>
          <MaterialIcon name="center_focus_strong" className="text-[18px]" />
        </HudButton>
        <HudButton title="Fullscreen" onClick={toggleFullscreen}>
          <MaterialIcon name="fullscreen" className="text-[18px]" />
        </HudButton>
      </div>

      <div className="hidden sm:flex fixed bottom-6 left-6 z-40 flex-col gap-1 bg-[#0c0e16]/90 backdrop-blur-md p-3 rounded-xl shadow-xl font-mono text-[10px] border border-[#3b494b]/30">
        <span className="text-[#849495] uppercase tracking-widest text-[9px] pb-0.5 font-bold">
          BRACKET SPECTATOR HUD
        </span>
        <LegendDot color="bg-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]" label="Glowing Cyan: Active Path" textClass="text-cyan" />
        <LegendDot color="bg-[#ddb7ff] shadow-[0_0_8px_rgba(221,183,255,0.8)]" label="Purple / Gold: Finals Route" textClass="text-[#ddb7ff]" />
        <LegendDot color="bg-[#ffb4ab] animate-ping" label="Pulsing Red: Live Match Node" textClass="text-[#ffb4ab]" />
        <LegendDot color="bg-[#33343d]" label="Dimmed Line-through: Eliminated" textClass="text-[#849495]" />
      </div>

      {modalMatchId ? (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-[#0b0d14]/80 backdrop-blur-sm z-40"
            aria-label="Close match intel"
            onClick={closeIntelModal}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-lg bg-[#191b24]/95 backdrop-blur-xl p-5 rounded-2xl ring-2 ring-cyan shadow-[0_0_50px_rgba(0,240,255,0.3)] border border-[#3b494b]/40"
            role="dialog"
            aria-modal
            aria-labelledby="modal-match-title"
          >
            <div className="flex items-start justify-between pb-3">
              <div>
                <span className="font-mono text-[10px] text-cyan font-bold tracking-widest uppercase block">
                  OFFICIAL TOURNAMENT TELEMETRY
                </span>
                <h2
                  id="modal-match-title"
                  className="font-display text-lg uppercase text-white font-black"
                >
                  MATCH #{modalMatchId} TELEMETRY
                </h2>
              </div>
              <button
                type="button"
                className="w-7 h-7 rounded-full bg-[#33343d] hover:bg-[#282a32] flex items-center justify-center text-white transition-colors"
                onClick={closeIntelModal}
              >
                <MaterialIcon name="close" className="text-[16px]" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0c0e16] mb-3">
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-sm font-bold text-cyan">Valkyrie Squad (1)</span>
                <span className="font-mono text-[10px] text-[#b9cacb]">Capt. Maya Lin • Bo3 Decider</span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="font-display text-sm font-bold text-[#ddb7ff]">Radiant Legacy (1)</span>
                <span className="font-mono text-[10px] text-[#ffb4ab] font-bold">Map 3 in Progress</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1d1f28] mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-cyan/20 flex items-center justify-center text-cyan">
                  <MaterialIcon name="stars" className="text-[18px]" />
                </div>
                <div>
                  <span className="font-display text-xs font-bold text-[#dbfcff] block leading-tight">
                    ACTIVE DECIDER: Game 3
                  </span>
                  <span className="font-mono text-[10px] text-[#b9cacb]">
                    Map: Sanctuary • 16:42 elapsed
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] font-bold text-cyan bg-cyan/10 px-2 py-0.5 rounded">
                LIVE STATS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex-1 py-2.5 bg-cyan text-[#00363a] font-display text-xs uppercase tracking-wider font-bold rounded flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:brightness-110"
              >
                <MaterialIcon name="play_circle" className="text-[16px]" />
                <span>WATCH STREAM (1080P)</span>
              </button>
              <button
                type="button"
                className="px-3 py-2.5 bg-[#33343d] hover:bg-[#282a32] text-white font-mono text-xs uppercase rounded flex items-center gap-1"
                onClick={closeIntelModal}
              >
                <span>CLOSE</span>
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}

function TabButton({
  className,
  badgeClass,
  icon,
  label,
  badge,
  onClick,
}: {
  active: boolean
  className: string
  badgeClass: string
  icon: string
  label: string
  badge: string
  onClick: () => void
}) {
  return (
    <button type="button" className={className} onClick={onClick}>
      <MaterialIcon name={icon} className="text-[16px]" />
      <span>{label}</span>
      <span className={badgeClass}>{badge}</span>
    </button>
  )
}

function RoundPill({
  children,
  onClick,
}: {
  children: ReactNode
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="px-2.5 py-1 rounded bg-[#1d1f28] hover:bg-[#282a32] text-[#b9cacb] hover:text-white transition-all whitespace-nowrap border border-[#3b494b]/30"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function HudButton({
  children,
  title,
  onClick,
}: {
  children: ReactNode
  title: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={title}
      className="w-9 h-9 rounded-lg bg-[#1d1f28] hover:bg-[#282a32] text-[#dbfcff] flex items-center justify-center transition-all"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function LegendDot({
  color,
  label,
  textClass,
}: {
  color: string
  label: string
  textClass: string
}) {
  return (
    <div className={`flex items-center gap-2 ${textClass}`}>
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  )
}
