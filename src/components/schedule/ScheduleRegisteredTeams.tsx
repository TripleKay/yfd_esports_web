import { MaterialIcon } from './MaterialIcon'

const TEAM_IDS = ['valkyrie', 'radiant', 'apex-dominion', 'cyber-kings'] as const

export function ScheduleRegisteredTeams({
  expanded,
  onToggle,
  allExpanded,
  onToggleAll,
}: {
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  allExpanded: boolean
  onToggleAll: () => void
}) {
  return (
    <div className="w-full min-h-[850px] bg-[#0c0e16] p-4 lg:p-8 relative overflow-hidden">
      <div className="max-w-[1720px] mx-auto flex flex-col gap-5 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#191b24]/90 backdrop-blur-md p-4 rounded-xl border border-[#3b494b]/30 shadow-xl">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-lg uppercase text-[#dbfcff] font-bold tracking-tight">
                64 REGISTERED TOURNAMENT SQUADS
              </h2>
              <span className="px-2 py-0.5 rounded bg-cyan/20 text-cyan font-mono text-xs font-bold">
                64 VERIFIED ENTRIES
              </span>
            </div>
            <p className="font-body text-xs text-[#b9cacb]">
              Official roster registry for YFD Days 2025. Click any team row to inspect
              starter roster, in-game roles, substitution slots, and verified captains.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#282a32] border border-[#3b494b]/30 text-white font-mono text-xs">
              <MaterialIcon name="verified" className="text-cyan text-[16px]" />
              <span>5 STARTERS + 1 SUB (6 TOTAL)</span>
            </div>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded bg-[#282a32] hover:bg-[#33343d] active:scale-95 text-[#dbfcff] font-mono text-xs uppercase tracking-wider flex items-center gap-1 transition-all border border-[#3b494b]/30"
              onClick={onToggleAll}
            >
              <MaterialIcon name="unfold_more" className="text-[15px] text-cyan" />
              <span>{allExpanded ? 'COLLAPSE ALL' : 'EXPAND ALL'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <TeamCard
            id="valkyrie"
            tag="VK"
            tagClass="bg-cyan text-[#00363a] shadow-[0_0_12px_rgba(0,240,255,0.4)]"
            borderClass="border-cyan/40 hover:border-cyan"
            name="Valkyrie Squad"
            badges={[
              { label: 'SEED #1', className: 'bg-[#33343d] text-[#ddb7ff]' },
              { label: 'SEMI-FINALIST', className: 'bg-cyan/10 text-cyan' },
            ]}
            captain="Captain: Maya Lin (IGN: Nyx) • Pulse Audio"
            chevronClass="text-cyan"
            expanded={expanded.valkyrie}
            onToggle={onToggle}
            rosterOpenByDefault
          />
          <TeamCard
            id="radiant"
            tag="RL"
            tagClass="bg-[#6f00be] text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]"
            borderClass="border-[#3b494b]/30 hover:border-[#ddb7ff]"
            name="Radiant Legacy"
            badges={[
              { label: 'SEED #2', className: 'bg-[#33343d] text-[#ddb7ff]' },
              { label: 'SEMI-FINALIST', className: 'bg-[#6f00be]/20 text-[#ddb7ff]' },
            ]}
            captain="Captain: Alex Vance (IGN: Mirage) • Nexus Tech"
            chevronClass="text-[#ddb7ff]"
            expanded={expanded.radiant}
            onToggle={onToggle}
            rosterOpenByDefault
          />
          <TeamCard
            id="apex-dominion"
            tag="AD"
            tagClass="bg-[#6f00be] text-white"
            borderClass="border-[#ddb7ff]/40 hover:border-[#ddb7ff]"
            name="Apex Dominion"
            badges={[
              { label: 'FINALIST', className: 'bg-[#6f00be]/40 text-[#ddb7ff] font-bold' },
            ]}
            captain="Captain: Sarah Cole (IGN: Valkyria) • Quantum Rigs"
            chevronClass="text-[#ddb7ff]"
            expanded={expanded['apex-dominion']}
            onToggle={onToggle}
            rosterOpenByDefault
          />
          <TeamCard
            id="cyber-kings"
            tag="CK"
            tagClass="bg-[#33343d] text-[#dbfcff]"
            borderClass="border-[#3b494b]/30 hover:border-cyan"
            name="Cyber Kings"
            badges={[
              { label: 'SEED #4', className: 'bg-[#33343d] text-[#849495]' },
              { label: 'QUARTER-FINAL', className: 'bg-[#1d1f28] text-[#b9cacb]' },
            ]}
            captain="Captain: Viktor Drake (IGN: CyberZero)"
            chevronClass="text-[#849495]"
            expanded={expanded['cyber-kings']}
            onToggle={onToggle}
          />
        </div>
      </div>
    </div>
  )
}

export { TEAM_IDS }

function TeamCard({
  id,
  tag,
  tagClass,
  borderClass,
  name,
  badges,
  captain,
  chevronClass,
  expanded,
  onToggle,
  rosterOpenByDefault,
}: {
  id: string
  tag: string
  tagClass: string
  borderClass: string
  name: string
  badges: { label: string; className: string }[]
  captain: string
  chevronClass: string
  expanded: boolean
  onToggle: (id: string) => void
  rosterOpenByDefault?: boolean
}) {
  const showRoster = expanded ?? rosterOpenByDefault

  return (
    <div
      className={`bg-[#191b24] border rounded-xl p-3.5 transition-all shadow group ${borderClass}`}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between cursor-pointer text-left"
        onClick={() => onToggle(id)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-black ${tagClass}`}
          >
            {tag}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-sm font-bold text-[#dbfcff]">{name}</span>
              {badges.map((b) => (
                <span
                  key={b.label}
                  className={`px-1.5 py-0.5 rounded font-mono text-[9px] ${b.className}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
            <span className="font-mono text-xs text-[#b9cacb] block">{captain}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#282a32] text-[#dbfcff] font-bold hidden sm:inline">
            6 MEMBERS
          </span>
          <MaterialIcon
            name="expand_more"
            className={`${chevronClass} transition-transform duration-300 ${showRoster ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {showRoster ? (
        <div className="mt-3 pt-3 border-t border-[#3b494b]/30 flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            Verified Battle Stations:
          </span>
          <p className="font-mono text-xs text-[#b9cacb]">
            Full roster verified — demo data matches Stitch schedule spec.
          </p>
        </div>
      ) : null}
    </div>
  )
}
