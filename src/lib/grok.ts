import type { GrokMessage, GrokResponse, SentimentAnalysisResult, Sentiment } from '@/types'

const GROK_API_URL = process.env.GROK_API_URL || 'https://api.x.ai/v1'
const GROK_API_KEY = process.env.GROK_API_KEY

interface GrokOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export class GrokClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || GROK_API_KEY || ''
    this.baseUrl = baseUrl || GROK_API_URL
  }

  async chat(
    messages: GrokMessage[],
    options: GrokOptions = {}
  ): Promise<GrokResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || 'grok-beta',
        messages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens || 1024,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Grok API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    const systemPrompt = `You are a sentiment analysis expert. Analyze the following text and respond with a JSON object containing:
- sentiment: "POSITIVE", "NEUTRAL", or "NEGATIVE"
- score: a number from -1.0 (most negative) to 1.0 (most positive)
- confidence: a number from 0 to 1 indicating your confidence
- keywords: array of key sentiment-bearing words or phrases

Be precise and objective. Consider context, sarcasm, and nuance.
Only respond with the JSON object, no additional text.`

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ], { temperature: 0.3 })

    try {
      const content = response.choices[0].message.content
      const parsed = JSON.parse(content)

      return {
        sentiment: parsed.sentiment as Sentiment,
        score: parsed.score,
        confidence: parsed.confidence,
        keywords: parsed.keywords,
      }
    } catch (error) {
      // Fallback to simple analysis if parsing fails
      return {
        sentiment: 'NEUTRAL',
        score: 0,
        confidence: 0.5,
        keywords: [],
      }
    }
  }

  async generateDigestSummary(
    data: {
      reviews: number
      mentions: number
      avgSentiment: number
      highlights: string[]
      negativeItems: string[]
    }
  ): Promise<string> {
    const systemPrompt = `You are a brand reputation analyst. Generate a concise, professional daily digest summary.
Keep it brief (2-3 sentences) but insightful. Focus on actionable insights.
Mention specific numbers and highlight any concerns that need attention.`

    const userPrompt = `Generate a daily digest summary for the following brand monitoring data:
- New reviews: ${data.reviews}
- Total mentions: ${data.mentions}
- Average sentiment: ${data.avgSentiment > 0 ? '+' : ''}${(data.avgSentiment * 100).toFixed(0)}%
- Positive highlights: ${data.highlights.join(', ') || 'None'}
- Negative items requiring attention: ${data.negativeItems.join(', ') || 'None'}`

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.7 })

    return response.choices[0].message.content
  }

  async searchTwitter(query: string, limit: number = 10): Promise<any[]> {
    // Grok has access to X/Twitter data through its integration
    // This is a specialized method to search for brand mentions on X
    const systemPrompt = `You have access to recent X/Twitter data. Search for posts about "${query}" and return a JSON array of the most relevant posts with:
- id: unique identifier
- text: the post content
- author: username
- timestamp: ISO date string
- engagement: { likes, retweets, replies }
- sentiment: your assessment of the sentiment

Return up to ${limit} posts. Only return the JSON array, no additional text.`

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Find recent X/Twitter posts about: ${query}` },
    ], { temperature: 0.3 })

    try {
      return JSON.parse(response.choices[0].message.content)
    } catch {
      return []
    }
  }

  async detectPriority(
    content: string,
    rating?: number,
    engagement?: number
  ): Promise<'CRITICAL' | 'WARNING' | 'INFO'> {
    // Rule-based priority detection
    const lowRating = rating !== undefined && rating <= 2
    const highEngagement = engagement !== undefined && engagement > 1000

    // If it's a low rating review, it's critical
    if (lowRating) {
      return 'CRITICAL'
    }

    // Use AI to detect negative sentiment for non-review content
    const sentiment = await this.analyzeSentiment(content)

    if (sentiment.score <= -0.5 || (sentiment.score <= -0.3 && highEngagement)) {
      return 'CRITICAL'
    }

    if (sentiment.score <= -0.2 || (sentiment.sentiment === 'NEGATIVE')) {
      return 'WARNING'
    }

    return 'INFO'
  }
}

// Singleton instance
export const grok = new GrokClient()

export default grok
