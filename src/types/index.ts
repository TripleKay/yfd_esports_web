export type GameTitle = 'mlbb' | 'ps5' | 'all'
export type MatchStatus = 'live' | 'upcoming' | 'completed'
export type NewsCategory = 'all' | 'mlbb' | 'ps5' | 'info' | 'rules' | 'prize'

export interface Team {
  id: string
  name: string
  tag: string
  seed?: number
  region?: string
}

export interface Match {
  id: string
  game: Exclude<GameTitle, 'all'>
  round: string
  status: MatchStatus
  teamA: Team
  teamB: Team
  scoreA?: number
  scoreB?: number
  mapLabel?: string
  venue?: string
  startsAt: string
  viewers?: string
  duration?: string
  meta?: string
}

export interface TournamentDivision {
  id: Exclude<GameTitle, 'all'>
  title: string
  subtitle: string
  badge: string
  tierLabel: string
  prizePool: string
  slotsFilled: number
  slotsTotal: number
  slotsUnit: string
  description: string
  image: string
  rosterNote: string
}

export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  body?: string | null
  category: Exclude<NewsCategory, 'all'>
  categoryLabel: string
  date: string
  readTime: string
  author: string
  authCode: string
  image?: string
  featured?: boolean
}

export interface FaqItem {
  id: string
  section: string
  category: string
  question: string
  answer: string
  bullets?: string[]
  linkLabel?: string
}

export interface RosterPlayer {
  id: string
  label: string
  role: string
  name: string
  nrc: string
  employeeId: string
  phone: string
  corporateEmail: string
  gameUserId: string
  zoneId: string
  verified: boolean
}

export interface BracketNode {
  id: string
  label: string
  status: MatchStatus | 'scheduled'
  teamA: string
  teamB: string
  scoreA?: number
  scoreB?: number
}
