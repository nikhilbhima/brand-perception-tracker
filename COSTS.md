# Brand Monitor - Cost Breakdown

## Monthly Cost Estimates

### Infrastructure

| Service | Plan | Monthly Cost | Notes |
|---------|------|--------------|-------|
| **Vercel** | Pro | $20 | Hosting + Cron jobs (10 crons free on Pro) |
| **Supabase** | Free→Pro | $0-$25 | Free tier: 500MB DB, 2 crons. Pro for scale. |
| **Upstash Redis** | Free | $0 | 10K commands/day free, sufficient for caching |

**Infrastructure Total: $20-$45/month**

---

### API Services

| Service | Free Tier | Paid Tier | Est. Monthly Cost |
|---------|-----------|-----------|-------------------|
| **Grok API** | - | ~$0.002/1K tokens | $10-$50 (depends on usage) |
| **NewsAPI** | 100 req/day | $449/month (Business) | $0-$449 |
| **YouTube Data API** | 10K units/day | N/A | **FREE** |
| **Reddit API** | Rate limited | N/A | **FREE** (no auth needed) |

#### Grok API Breakdown
- Sentiment analysis: ~100 tokens/request
- Digest generation: ~500 tokens/request
- X/Twitter search: ~200 tokens/request
- **Estimated**: 5,000-20,000 API calls/month = **$10-$50/month**

#### NewsAPI Alternative (Cost Savings)
Instead of NewsAPI Business ($449/mo), consider:
- **Google Alerts RSS** - FREE (already implemented)
- **Bing News Search** - $3/1K transactions
- **GNews.io** - $5/month for 10K requests

**API Services Total: $10-$100/month** (using free alternatives)

---

### Notification Services

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Slack Webhooks** | Unlimited | FREE - just need webhook URL |
| **Telegram Bot** | Unlimited | FREE - create via @BotFather |
| **Resend** | 3K emails/month | FREE tier sufficient for most users |

**Notifications Total: $0/month**

---

### Data Collection Costs

| Source | Method | Cost |
|--------|--------|------|
| **TrustPilot** | Web scraping | FREE |
| **G2** | Web scraping | FREE |
| **Capterra** | Web scraping | FREE |
| **Reddit** | Public API | FREE |
| **YouTube** | Data API | FREE (10K/day) |
| **X/Twitter** | Via Grok | Included in Grok costs |

**Data Collection Total: $0/month** (just API costs above)

---

## Total Monthly Cost Estimates

### Minimal Setup (Solo/Small Team)
| Category | Cost |
|----------|------|
| Vercel Pro | $20 |
| Supabase Free | $0 |
| Upstash Free | $0 |
| Grok API (light) | $10 |
| NewsAPI (use free alternatives) | $0 |
| Notifications | $0 |
| **TOTAL** | **~$30/month** |

### Growth Setup (Multiple Brands)
| Category | Cost |
|----------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Upstash Pro | $10 |
| Grok API (moderate) | $30 |
| Google Cloud (YouTube) | $0 |
| Resend Free | $0 |
| **TOTAL** | **~$85/month** |

### Enterprise Setup (High Volume)
| Category | Cost |
|----------|------|
| Vercel Enterprise | $150+ |
| Supabase Pro | $25 |
| Upstash Pro | $50 |
| Grok API (heavy) | $100+ |
| NewsAPI Business | $449 |
| Resend Pro | $20 |
| **TOTAL** | **~$800+/month** |

---

## One-Time Setup Costs

| Item | Cost |
|------|------|
| Domain name | $10-15/year |
| SSL Certificate | FREE (via Vercel) |
| Development | Already done! |

---

## Cost Optimization Tips

1. **Use Google Alerts RSS instead of NewsAPI**
   - Saves $449/month
   - Already implemented in the codebase

2. **Leverage Grok for X/Twitter data**
   - No need for expensive X API ($100/month basic)
   - Sentiment analysis + X data in one API

3. **Start with Supabase Free Tier**
   - 500MB database is plenty for starting out
   - Upgrade only when needed

4. **Reddit doesn't require authentication**
   - Public API works for read-only access
   - 60 requests/minute without auth

5. **Batch sentiment analysis**
   - Analyze multiple items in one Grok request
   - Reduces API calls by 50-70%

---

## Required API Keys

```
GROK_API_KEY         # Get from x.ai
NEWS_API_KEY         # Optional - newsapi.org
YOUTUBE_API_KEY      # Google Cloud Console
RESEND_API_KEY       # resend.com
SLACK_WEBHOOK_URL    # Slack App settings
TELEGRAM_BOT_TOKEN   # @BotFather on Telegram
```

---

## Scaling Considerations

### Database
- Each brand generates ~100-500 mentions/month
- 10 brands = ~5K records/month
- Supabase Free handles 500MB = ~2 years of data

### API Rate Limits
- YouTube: 10K units/day (1 search = 100 units) = 100 searches/day
- Reddit: 60 req/min without auth, 600/min with auth
- Grok: No published limits, usage-based pricing

### Cron Job Frequency
- 6-hour refresh = 4 runs/day = 120/month
- Daily digest = 30/month
- Well within Vercel Pro limits (10 cron jobs)

---

## ROI Calculation

### Time Saved
- Manual monitoring: 2-4 hours/day
- With Brand Monitor: 15 minutes/day
- **Time saved: 45-105 hours/month**

### Value
- Marketing team salary: $50-100/hour
- **Value generated: $2,250-$10,500/month**

### ROI
- Cost: ~$30-85/month
- Value: ~$2,250-$10,500/month
- **ROI: 2,600% - 34,900%**
