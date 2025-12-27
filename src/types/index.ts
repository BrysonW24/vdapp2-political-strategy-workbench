export interface YouTubeUrl {
  id: number
  url: string
}

// Thought Leadership Brief - matches PDF format
export interface ThoughtLeadershipBrief {
  urls: string[]  // T1, T2, etc.
  directQuotesAndImplications: DirectQuoteWithImplication[]
  strategicChoices: string[]
  moatPlays: {
    trust: string
    impact: string
  }
  topRisks: string[]
  counterArguments: string[]
}

export interface DirectQuoteWithImplication {
  quote: string
  source: string  // e.g., "[T1] Speaker Name"
  implication: string
  ranking?: number  // 5-10 ranked quotes
}

export interface KeySignal {
  signal: string
  transcript: string
  implication: string
}

export interface DirectQuote {
  quote: string
  source: string
  timestamp: string
}

export type Severity = 'High' | 'Medium' | 'Low'
export type Horizon = 'Immediate' | 'Near-term' | 'Long-term'

// Disruption Radar - matches PDF format
export interface DisruptionCall {
  title: string
  mechanism: string  // How the disruption works
  pool: string  // Which budget/revenue pool is affected
  revenue: string  // Estimated impact on revenue/budget
  severity: 'High' | 'Medium' | 'Low'
  velocity: 'Fast (0-12 months)' | 'Medium (1-3 years)' | 'Slow (3+ years)'
  posture: 'Defend' | 'Offend' | 'Monitor'
  response: string  // Recommended response strategy
  owner: string  // Minister/Department responsible
  evidence: string  // Supporting evidence
  evidenceSource: string  // Citation for evidence
}

export interface DisruptionIntelligence {
  disruptions: DisruptionCall[]
  additionalNotes: string
  citations: Citation[]
}

export interface DisruptionSignal {
  id: number
  title: string
  severity: Severity
  horizon: Horizon
  impactedRevenue: string
  defendOffendMove: string
  evidence?: string
  productLine?: string
}

// Strategic Moat Finder - matches PDF format
export interface MoatPlay {
  title: string
  whyUs: string  // Why this is uniquely suited for government
  horizon: 'Immediate (0-6 months)' | 'Near-term (6-12 months)' | 'Long-term (12+ months)'
  owner: string  // Minister/Department responsible
  firstMove: string  // Concrete first action
  evidence: string  // Supporting evidence
  evidenceSource: string  // Citation for evidence
}

export interface MoatIntelligence {
  moats: MoatPlay[]
  additionalNotes: string
  citations: Citation[]
}

export interface MoatCategory {
  category: string
  signal: string
  evidence: string
  governmentAdvantage: string
  actionableInsight: string
  confidenceLevel: 'High' | 'Medium' | 'Low'
}

export interface NewsArticle {
  id: number
  title: string
  source: string
  category: string
  publishedAt: string
  summary: string
  url: string
  relevanceScore: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}

// Shared Citation interface
export interface Citation {
  source: string
  quote: string
  relevance: string
}
