export type GameTitle = 'mlbb' | 'ps5' | 'all'
export type NewsCategory = 'all' | 'mlbb' | 'ps5' | 'info' | 'rules' | 'prize'

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

export type OrganizationType = 'single' | 'mix'

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
  organizationId: string
  verified: boolean
}
