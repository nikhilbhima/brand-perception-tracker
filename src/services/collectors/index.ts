export { BaseCollector, type CollectorConfig } from './base'
export { TrustPilotCollector } from './trustpilot'
export { G2Collector } from './g2'
export { NewsAPICollector } from './newsapi'
export { RedditCollector } from './reddit'
export { YouTubeCollector } from './youtube'
export { TwitterCollector } from './twitter'

import { TrustPilotCollector } from './trustpilot'
import { G2Collector } from './g2'
import { NewsAPICollector } from './newsapi'
import { RedditCollector } from './reddit'
import { YouTubeCollector } from './youtube'
import { TwitterCollector } from './twitter'
import type { CollectorConfig } from './base'
import type { CollectorResult } from '@/types'

export async function runAllCollectors(config: CollectorConfig): Promise<CollectorResult[]> {
  const collectors = [
    new TrustPilotCollector(config),
    new G2Collector(config),
    new NewsAPICollector(config),
    new RedditCollector(config),
    new YouTubeCollector(config),
    new TwitterCollector(config),
  ]

  const results: CollectorResult[] = []

  for (const collector of collectors) {
    try {
      const result = await collector.collect()
      results.push(result)
      console.log(`[Collector] ${result.source}: Found ${result.itemsFound}, New ${result.itemsNew}`)
    } catch (err) {
      console.error(`[Collector] Failed:`, err)
      results.push({
        success: false,
        source: collector['source'],
        itemsFound: 0,
        itemsNew: 0,
        errors: [String(err)],
      })
    }
  }

  return results
}
