import type {
  FaqItem,
  NewsArticle,
  RosterPlayer,
  TournamentDivision,
} from '../types'

export const SITE = {
  name: 'YFD ESPORTS',
  season: 'YFD DAYS // 2026',
  tagline: 'Season 4 Tournament Championship',
  prizePool: '$50,000',
  region: 'APAC REGION',
  kickoffLabel: 'TOURNAMENT KICKOFF COUNTDOWN',
  kickoffTarget: new Date(
    Date.now() + 4 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000,
  ),
}

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/register', label: 'Register' },
  { to: '/news', label: 'News' },
  { to: '/rules', label: 'Rules & FAQ' },
] as const

export const STATS = [
  { label: 'Confirm team (MLBB)', value: '192', tone: 'cyan' as const },
  {
    label: 'Final Price (MLBB)',
    value: '1,000,000 MMK',
    tone: 'violet' as const,
  },
  { label: 'Confirm team (PS5)', value: '32', tone: 'critical' as const },
  {
    label: 'Final Price (PS5)',
    value: '500,000 MMK',
    tone: 'primary' as const,
  },
]

export const DIVISIONS: TournamentDivision[] = [
  {
    id: 'mlbb',
    title: 'MLBB 5V5 SQUAD',
    subtitle: '5v5 SQUAD MOBA',
    badge: 'MOBILE',
    tierLabel: 'TIER 1 CHAMPIONSHIP',
    prizePool: '1,000,000MMK',
    slotsFilled: 48,
    slotsTotal: 64,
    slotsUnit: 'SQUADS',
    description:
      'Standard double elimination tournament rulebook with 5-ban phase. Compete on official 128-tick private scrim lobbies with real-time broadcast spectator delay.',
    image: '/images/banner-mlbb.png',
    rosterNote: '5–7 PLAYERS',
  },
  {
    id: 'ps5',
    title: 'PS5 FOOTBALL 1V1',
    subtitle: '1v1 SOLO STRIKER',
    badge: 'PS5 CONSOLE',
    tierLabel: 'COMPETITIVE SOCCER',
    prizePool: '500,000 MMK',
    slotsFilled: 94,
    slotsTotal: 128,
    slotsUnit: 'SEEDS',
    description:
      '6-minute halves with competitive slider presets on PlayStation 5. Head-to-head bracket running single elimination knockout rounds with stage monitors.',
    image: '/images/banner-ps5.png',
    rosterNote: 'DUALSENSE CERTIFIED',
  },
]

export const ARTICLES: NewsArticle[] = [
  {
    id: 'n1',
    title:
      '$50,000 Combined Prize Pool Expansion & Main Stage Arena Venue Revealed',
    excerpt:
      'YFD Days Season 4 expands with dual arena stages in Singapore & Jakarta, upgraded 128-tick private scrim servers for MLBB, and official PlayStation DualSense tournament mode specifications.',
    category: 'prize',
    categoryLabel: 'TOURNAMENT INTEL',
    date: 'October 25, 2026',
    readTime: '4 MIN READ',
    author: 'YFD ARBITER CORE',
    authCode: 'MAIN_STAGE',
    image: '/images/hero-arena.png',
    featured: true,
  },
  {
    id: 'n2',
    title:
      'Final 16 Squads Locked: Group Stage Seeding Matrix & V4 Anti-Cheat Protocol',
    excerpt:
      'All registered squad rosters have cleared corporate employee verification. Review your seed assignment, day-one match fixture paths, and mandatory device check protocols.',
    category: 'mlbb',
    categoryLabel: 'MLBB 5V5 // BRACKET INTEL',
    date: 'Oct 24, 2026',
    readTime: '3 MIN READ',
    author: 'Arena Desk',
    authCode: 'ARENA_DISPATCH',
    image: '/images/news-2.jpg',
  },
  {
    id: 'n3',
    title:
      'Slider Settings & Controller Configuration Released for 1v1 Virtual Championship',
    excerpt:
      'Official 6-minute half rules, tactical camera presets, and mandatory controller check-in guidelines for all 128 registered solo contenders entering the digital turf.',
    category: 'ps5',
    categoryLabel: 'PS5 FOOTBALL // 1V1 SOLO',
    date: 'Oct 24, 2026',
    readTime: '5 MIN READ',
    author: 'Soccer Ops',
    authCode: 'SOCCER_OPS',
    image: '/images/news-3.jpg',
  },
  {
    id: 'n4',
    title:
      'Armored-V4 Telemetry Hardware Checks: Zero-Tolerance Policy on Exploits',
    excerpt:
      'Comprehensive integrity briefing on packet inspection, device tampering countermeasures, and disqualified behavior penalties for season 4 participants.',
    category: 'rules',
    categoryLabel: 'RULES // INTEGRITY',
    date: 'Oct 23, 2026',
    readTime: '4 MIN READ',
    author: 'Integrity Div',
    authCode: 'INTEGRITY_DIV',
  },
  {
    id: 'n5',
    title:
      'Official English & Regional Shoutcaster Lineup for Main Stage Playoffs',
    excerpt:
      'Meet the casters, tactical analysts, and community hosts bringing play-by-play action across YouTube Gaming and Twitch official live streams with dual-feed telemetry.',
    category: 'info',
    categoryLabel: 'BROADCAST // ON-AIR TALENT',
    date: 'Oct 22, 2026',
    readTime: '4 MIN READ',
    author: 'Media Desk',
    authCode: 'MEDIA_DESK',
    image: '/images/news-1.jpg',
  },
  {
    id: 'n6',
    title:
      'Limited Edition YFD Days Season 4 Cyber Pro Jerseys & Digital Badges Available',
    excerpt:
      'NFC-enabled pro kits and unlockable digital badges for verified competitors. Pre-order window closes before grand finals weekend.',
    category: 'info',
    categoryLabel: 'APPAREL // NFC PRO KITS',
    date: 'Oct 21, 2026',
    readTime: '2 MIN READ',
    author: 'Merch Ops',
    authCode: 'MERCH_OPS',
  },
  {
    id: 'n7',
    title:
      'Check-in Windows & Scrim Server Schedule Announced for Weekend Warmups',
    excerpt:
      'Mandatory lobby check-in windows, warm-up scrim blocks, and referee standby channels published for captains ahead of Day One fixtures.',
    category: 'info',
    categoryLabel: 'OPS // CHECK-IN',
    date: 'Oct 20, 2026',
    readTime: '3 MIN READ',
    author: 'Ops Control',
    authCode: 'OPS_CONTROL',
  },
]

export const FAQS: FaqItem[] = [
  {
    id: 'f1',
    section: 'SEC 02.1',
    category: 'GENERAL & ELIGIBILITY',
    question: 'Who is eligible to participate in YFD Days 2026?',
    answer:
      'YFD Days Season 4 is open exclusively to verified bona fide corporate employees and accredited partner contractors across regional corporate business units. To protect the integrity and spirit of corporate athletic sportsmanship, strict vetting parameters apply:',
    bullets: [
      'Corporate ID & HR Domain: Valid Corporate Employee ID and an active HR email domain verification are mandatory during roster submission.',
      'National ID / NRC Match: National Registration Card (NRC) or government-issued national ID must strictly match the legal name on the official company register.',
      'Pro Esports Exclusion Rule: Zero active professional esports league contracts (e.g., active MPL, MDL, or official FIFA pro circuit within past 12 months) are permitted.',
    ],
    linkLabel: 'Read Section 2.1 of Official Rulebook',
  },
  {
    id: 'f2',
    section: 'SEC 03.4',
    category: 'TOURNAMENT STRUCTURE',
    question: 'Can 1 employee register for both MLBB 5v5 and PS5 Football 1v1?',
    answer:
      'Dual registration is strictly prohibited. Because concurrent group matches and playoff scheduling overlap during the weekend broadcast window, one player cannot be registered in more than one competitive title. Any player found registered on an MLBB roster and the PS5 Football bracket simultaneously will trigger an automatic disqualification of both entries prior to the Seed Draw.',
  },
  {
    id: 'f3',
    section: 'SEC 07.2',
    category: 'MLBB 5v5 // DISCONNECT',
    question:
      'What happens in case of an unexpected connection drop or ping spike during MLBB?',
    answer:
      'Matches are staged on official 128Hz APAC tournament lobby servers. If a participant experiences network loss:',
    bullets: [
      'Pause window: Captains may request a tactical pause within 30 seconds of disconnect detection.',
      'Reconnect SLA: Players have up to 5 minutes to rejoin before the round continues at referee discretion.',
      'Remake criteria: Full remakes only if disconnect occurs before first blood and within the first 3 minutes.',
    ],
    linkLabel: 'Read Disconnect Protocol 7.2',
  },
  {
    id: 'f4',
    section: 'SEC 04.1',
    category: 'REGISTRATION & NRC',
    question: 'How is team captain verification done via Employee ID and NRC?',
    answer:
      'Captains submit Corporate Employee ID, NRC/government ID photo, and HR domain email during Phase 2 roster verification. The Arbiter Core cross-checks against the employer whitelist. Verified captains unlock roster lock and scrim lobby credentials.',
  },
  {
    id: 'f5',
    section: 'SEC 09.3',
    category: 'PS5 FOOTBALL 1v1',
    question:
      'What controller accessories and slider settings are permitted for PS5 Football 1v1?',
    answer:
      'Only DualSense and DualSense Edge controllers are permitted. Competitive slider preset pack v4 must be loaded before lobby entry. No third-party macros, rapid-fire adapters, or custom firmware overlays are allowed.',
  },
  {
    id: 'f6',
    section: 'SEC 11.0',
    category: 'SCHEDULE & DISPUTES',
    question:
      'How do teams file a formal match dispute or protest a referee ruling?',
    answer:
      'Submit a dispute ticket in the Arbiter Discord channel within 15 minutes of match end, attaching VOD timestamps and lobby screenshots. Average dispute resolution target is under 15 minutes during live broadcast windows.',
  },
  {
    id: 'f7',
    section: 'SEC 12.5',
    category: 'PRIZE & PAYOUT',
    question:
      'When will the $50,000 cash prize pool be disbursed to winning rosters?',
    answer:
      'Prize disbursement begins within 14 business days after grand finals and post-event integrity audit clearance. Captains receive payout instructions via verified corporate email.',
  },
]

export const DEMO_ROSTER: RosterPlayer[] = [
  {
    id: 'p1',
    label: 'P1',
    role: 'JUNGLER',
    name: 'Alexander Vance',
    nrc: '12/ABC(N)123456',
    employeeId: 'NX-48201',
    phone: '+95 9 123 456 789',
    corporateEmail: 'alexander.vance@nexus.corp',
    gameUserId: 'VancePrime',
    zoneId: '2048',
    organizationId: '',
    verified: true,
  },
  {
    id: 'p2',
    label: 'P2',
    role: 'EXP',
    name: 'Kaizen "Ronin" Chen',
    nrc: '12/DEF(N)654321',
    employeeId: 'NX-48214',
    phone: '+95 9 234 567 890',
    corporateEmail: 'kaizen.chen@nexus.corp',
    gameUserId: 'RoninBlade',
    zoneId: '2048',
    organizationId: '',
    verified: true,
  },
  {
    id: 'p3',
    label: 'P3',
    role: 'MID',
    name: 'Sarah "Aura" Jin',
    nrc: '12/GHI(N)998877',
    employeeId: 'NX-48233',
    phone: '+95 9 345 678 901',
    corporateEmail: 'sarah.jin@nexus.corp',
    gameUserId: 'AuraBurst',
    zoneId: '2050',
    organizationId: '',
    verified: true,
  },
  {
    id: 'p4',
    label: 'P4',
    role: 'GOLD',
    name: 'Marcus Hale',
    nrc: '12/JKL(N)445566',
    employeeId: 'NX-48240',
    phone: '+95 9 456 789 012',
    corporateEmail: 'marcus.hale@nexus.corp',
    gameUserId: 'HaleMarksman',
    zoneId: '2048',
    organizationId: '',
    verified: false,
  },
  {
    id: 'p5',
    label: 'P5',
    role: 'ROAM',
    name: 'Priya Nair',
    nrc: '12/MNO(N)112233',
    employeeId: 'NX-48255',
    phone: '+95 9 567 890 123',
    corporateEmail: 'priya.nair@nexus.corp',
    gameUserId: 'NairAnchor',
    zoneId: '2049',
    organizationId: '',
    verified: false,
  },
]
