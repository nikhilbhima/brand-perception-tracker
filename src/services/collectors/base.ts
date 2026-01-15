import type { Source, CollectorResult } from '@/types'

export interface CollectorConfig {
  brandName: string
  brandId: string
  platformId?: string // e.g., TrustPilot business ID
}

export abstract class BaseCollector {
  protected source: Source
  protected config: CollectorConfig

  constructor(source: Source, config: CollectorConfig) {
    this.source = source
    this.config = config
  }

  abstract collect(): Promise<CollectorResult>

  protected createResult(
    itemsFound: number,
    itemsNew: number,
    errors?: string[]
  ): CollectorResult {
    return {
      success: errors === undefined || errors.length === 0,
      source: this.source,
      itemsFound,
      itemsNew,
      errors,
    }
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  protected sanitizeText(text: string): string {
    return text
      .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
  }

  protected extractRegion(text: string): string | null {
    const regionPatterns: Record<string, RegExp> = {
      'North America': /\b(US|USA|United States|Canada|CA|US|America)\b/i,
      'Europe': /\b(UK|United Kingdom|Germany|France|Italy|Spain|Netherlands|EU|Europe)\b/i,
      'Asia-Pacific': /\b(Australia|Japan|Singapore|Hong Kong|India|China|Korea|APAC|Asia)\b/i,
      'LATAM': /\b(Brazil|Mexico|Argentina|Colombia|Chile|Latin America|LATAM)\b/i,
      'Middle East': /\b(UAE|Saudi|Israel|Dubai|Middle East|MEA)\b/i,
    }

    for (const [region, pattern] of Object.entries(regionPatterns)) {
      if (pattern.test(text)) {
        return region
      }
    }

    return null
  }
}
