# Brand Monitor

Real-time reputation intelligence platform that tracks brand perception across reviews, news, and social media with AI-powered sentiment analysis and instant alerts.

## Features

- **Multi-Source Monitoring** - Track mentions from TrustPilot, G2, Capterra, Reddit, YouTube, X/Twitter, and news outlets
- **AI Sentiment Analysis** - Grok-powered sentiment scoring and priority classification
- **Real-Time Alerts** - Instant notifications via Slack, Telegram, and email for critical mentions
- **Daily Digests** - AI-generated summaries delivered to your preferred channel
- **Competitor Tracking** - Side-by-side comparison with competitor sentiment and ratings
- **Regional Insights** - Geographic breakdown of brand perception

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **AI**: Grok API for sentiment analysis
- **Notifications**: Slack webhooks, Telegram Bot API, Resend (email)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase/Neon)
- API keys for data sources and notifications

### Installation

```bash
# Clone the repository
git clone https://github.com/nikhilbhima/brand-perception-tracker.git
cd brand-perception-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://..."

# AI
GROK_API_KEY="..."

# News & Social
NEWS_API_KEY="..."
REDDIT_CLIENT_ID="..."
REDDIT_CLIENT_SECRET="..."

# Notifications
SLACK_WEBHOOK_URL="..."
TELEGRAM_BOT_TOKEN="..."
RESEND_API_KEY="..."

# Auth
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/        # Dashboard routes
│   └── api/                # API endpoints
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   └── ui/                 # Shared UI components
├── services/
│   ├── collectors/         # Data source integrations
│   └── notifications/      # Alert channels
├── lib/                    # Utilities and clients
└── types/                  # TypeScript definitions
```

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/mentions` | Fetch mentions with filters |
| `GET /api/brands` | List tracked brands |
| `POST /api/alerts/test` | Send test alert |
| `POST /api/cron/refresh` | Trigger data refresh |
| `POST /api/cron/digest` | Generate daily digest |

## Deployment

Optimized for Vercel deployment:

```bash
vercel deploy
```

Configure Vercel Cron for scheduled jobs:
- Data refresh: Every 6 hours
- Daily digest: 9:00 AM UTC

## License

MIT License - see [LICENSE](LICENSE) for details.
