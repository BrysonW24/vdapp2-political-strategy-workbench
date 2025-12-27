export const APP_CONFIG = {
  name: 'CommBank AI Strategy Intelligence Workbench',
  shortName: 'AI Strategy Studio',
  organization: 'Commonwealth Bank',
} as const

export const SEVERITY_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const

export const HORIZONS = {
  IMMEDIATE: 'Immediate',
  NEAR_TERM: 'Near-term',
  LONG_TERM: 'Long-term',
} as const

export const NEWS_CATEGORIES = {
  ALL: 'all',
  CENTRAL_BANKING: 'central-banking',
  AI_GOVERNANCE: 'ai-governance',
  FINTECH: 'fintech',
  REGULATION: 'regulation',
  CUSTOMER_EXPERIENCE: 'customer-experience',
} as const

export const CONFIDENCE_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
} as const

export const DEFAULT_YOUTUBE_URLS = [
  'https://www.youtube.com/watch?v=6NwK-uq16U8',
  'https://www.youtube.com/watch?v=nvXj4HTiYqA',
] as const

export const DELIVERY_PRINCIPLES = [
  {
    title: 'Key Signals',
    description: 'always cite transcripts using the [T# speaker] notation.',
  },
  {
    title: 'Executive Audience',
    description: 'Every section is written for a CommBank executive audience with responsible AI guardrails in mind.',
  },
  {
    title: 'Markdown Optimized',
    description: 'Markdown hierarchy is optimised for board packs ExCo updates and investor notes.',
  },
  {
    title: 'Direct Quotes',
    description: 'section surfaces verbatim lines from transcripts with [T#] citations.',
  },
] as const

export const MOAT_PRINCIPLES = [
  'Every moat insight links to verbatim evidence captured from the source articles.',
  'Signals emphasise levers that lean on CommBank scale data depth or partner network.',
  'Outputs are markdown-ready for strategy sessions risk forums or investor briefings.',
] as const

export const DISRUPTION_GUARDRAILS = [
  'Every risk call includes verbatim evidence and identifies the impacted revenue line.',
  'Severity reflects potential FY25 income impact horizon flags how fast to mobilise.',
  'Defend/offend moves are written so product owners can brief teams immediately.',
] as const

export const ROUTES = {
  HOME: '/',
  THOUGHT_LEADERSHIP: '/',
  MOAT_FINDER: '/moat-finder',
  DISRUPTION_RADAR: '/disruption-radar',
} as const

export const API_ROUTES = {
  THOUGHT_LEADERSHIP: '/api/thought-leadership',
  MOAT_FINDER: '/api/moat-finder',
  DISRUPTION_RADAR: '/api/disruption-radar',
  NEWS: '/api/news',
} as const
