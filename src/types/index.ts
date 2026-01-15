import type {
  Brand,
  Mention,
  Review,
  Alert,
  Digest,
  NotificationSettings,
  CompetitorSnapshot,
  Source,
  Sentiment,
  Priority,
  Channel
} from '@prisma/client'

// Re-export Prisma types
export type {
  Brand,
  Mention,
  Review,
  Alert,
  Digest,
  NotificationSettings,
  CompetitorSnapshot
}

export { Source, Sentiment, Priority, Channel }

// Extended types with relations
export interface BrandWithStats extends Brand {
  _count?: {
    mentions: number
    reviews: number
  }
  avgRating?: number
  sentimentScore?: number
}

export interface MentionWithBrand extends Mention {
  brand: Brand
}

export interface ReviewWithBrand extends Review {
  brand: Brand
}

export interface AlertWithMention extends Alert {
  mention?: Mention | null
}

// Dashboard stats
export interface DashboardStats {
  totalMentions: number
  totalReviews: number
  avgRating: number
  sentimentScore: number
  mentionsTrend: number // percentage change
  reviewsTrend: number
  ratingTrend: number
  sentimentTrend: number
}

export interface SentimentBreakdown {
  positive: number
  neutral: number
  negative: number
}

export interface SourceBreakdown {
  source: Source
  count: number
  sentiment: number
}

export interface RegionalBreakdown {
  region: string
  mentions: number
  sentiment: number
  reviews: number
  avgRating: number
}

export interface TrendDataPoint {
  date: string
  mentions: number
  sentiment: number
  reviews: number
  avgRating: number
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter types
export interface MentionFilters {
  brandId?: string
  source?: Source
  sentiment?: Sentiment
  priority?: Priority
  region?: string
  startDate?: string
  endDate?: string
  search?: string
}

export interface ReviewFilters {
  brandId?: string
  source?: Source
  sentiment?: Sentiment
  minRating?: number
  maxRating?: number
  region?: string
  startDate?: string
  endDate?: string
  search?: string
}

// Form types
export interface BrandFormData {
  name: string
  website?: string
  isOwn: boolean
  trustpilotId?: string
  g2Id?: string
  capterraId?: string
}

export interface NotificationSettingsFormData {
  slackWebhook?: string
  telegramChatId?: string
  email?: string
  criticalSlack: boolean
  criticalTelegram: boolean
  criticalEmail: boolean
  warningSlack: boolean
  warningTelegram: boolean
  warningEmail: boolean
  digestSlack: boolean
  digestEmail: boolean
  digestTime: string
  timezone: string
}

// Collector types
export interface CollectorResult {
  success: boolean
  source: Source
  itemsFound: number
  itemsNew: number
  errors?: string[]
}

export interface SentimentAnalysisResult {
  sentiment: Sentiment
  score: number // -1.0 to 1.0
  confidence: number // 0 to 1
  keywords?: string[]
}

// Grok API types
export interface GrokMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GrokResponse {
  id: string
  choices: {
    message: {
      content: string
    }
    finish_reason: string
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// Notification types
export interface NotificationPayload {
  userId: string
  priority: Priority
  title: string
  message: string
  url?: string
  brandName?: string
  source?: Source
}

export interface SlackBlock {
  type: string
  text?: {
    type: string
    text: string
    emoji?: boolean
  }
  elements?: unknown[]
  accessory?: unknown
  fields?: unknown[]
}

// Digest types
export interface DigestData {
  userId: string
  date: Date
  brands: {
    brandId: string
    brandName: string
    mentions: number
    reviews: number
    avgRating: number
    sentiment: number
    highlights: {
      type: 'mention' | 'review'
      id: string
      title: string
      sentiment: Sentiment
      priority: Priority
    }[]
  }[]
  summary: string
  overallSentiment: string
}

// Competitor types
export interface CompetitorComparison {
  brandId: string
  brandName: string
  isOwn: boolean
  avgRating: number
  reviewCount: number
  mentionCount: number
  sentimentScore: number
  trend: {
    rating: number
    reviews: number
    mentions: number
    sentiment: number
  }
}

// Region constants
export const REGIONS = [
  'North America',
  'Europe',
  'Asia-Pacific',
  'LATAM',
  'Middle East',
  'Africa',
] as const

export type Region = typeof REGIONS[number]
