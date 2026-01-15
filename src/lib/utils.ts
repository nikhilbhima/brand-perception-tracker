import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(d)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'text-emerald-500'
    case 'negative':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}

export function getSentimentBgColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'positive':
      return 'bg-emerald-500/10 text-emerald-500'
    case 'negative':
      return 'bg-red-500/10 text-red-500'
    default:
      return 'bg-gray-500/10 text-gray-500'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'text-red-500'
    case 'warning':
      return 'text-amber-500'
    default:
      return 'text-blue-500'
  }
}

export function getPriorityBgColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'warning':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default:
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  }
}

export function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    TRUSTPILOT: 'star',
    G2: 'bar-chart-2',
    CAPTERRA: 'award',
    SOURCEFORGE: 'code',
    NEWSAPI: 'newspaper',
    GOOGLE_ALERTS: 'bell',
    REDDIT: 'message-circle',
    YOUTUBE: 'play-circle',
    TWITTER: 'twitter',
    HACKERNEWS: 'terminal',
  }
  return icons[source] || 'globe'
}

export function getSourceName(source: string): string {
  const names: Record<string, string> = {
    TRUSTPILOT: 'TrustPilot',
    G2: 'G2',
    CAPTERRA: 'Capterra',
    SOURCEFORGE: 'SourceForge',
    GARTNER: 'Gartner',
    NEWSAPI: 'News',
    GOOGLE_ALERTS: 'Google Alerts',
    REDDIT: 'Reddit',
    YOUTUBE: 'YouTube',
    TWITTER: 'X (Twitter)',
    HACKERNEWS: 'Hacker News',
  }
  return names[source] || source
}

export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStar
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars)
}

export function calculateSentimentScore(items: { sentimentScore: number }[]): number {
  if (items.length === 0) return 0
  const sum = items.reduce((acc, item) => acc + item.sentimentScore, 0)
  return sum / items.length
}

export function sentimentToLabel(score: number): string {
  if (score >= 0.3) return 'Positive'
  if (score <= -0.3) return 'Negative'
  return 'Neutral'
}
