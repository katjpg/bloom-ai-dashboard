# Bloom Dashboard - Frontend
> A comprehensive content moderation platform designed for gaming communities. Features real-time chat monitoring, automated content filtering, and community safety tools with PII detection and behavioral scoring.


## Quick Start

```bash
pnpm install
pnpm dev    # http://localhost:3000
```

**Backend Required**: FastAPI backend configured via `NEXT_PUBLIC_API_URL` environment variable
- Development: `http://localhost:8000` (default)
- Production: `https://bloom-ai-dashboard-backend.vercel.app` (current)

## Development

### Prerequisites
- Node.js 18.17+
- pnpm 8.0+

### Commands
```bash
pnpm install
pnpm dev      # Development server at http://localhost:3000
pnpm build    # Production build
pnpm start    # Production server
```

## Technology Stack

- **Framework**: Next.js 15.3.3 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI (shadcn/ui)
- **HTTP Client**: Axios 1.10.0
- **State**: React Server Components + selective client hydration
- **Theme**: next-themes (dark/light mode)
- **Icons**: Lucide React + Tabler Icons
- **Charts**: Recharts 2.15.3
- **Tables**: TanStack Table 8.21.3

## Project Structure

```
src/
├── app/                    # App Router pages
│   ├── (dashboard)/       # Main dashboard with KPI cards
│   │   ├── _components/   # Dashboard components
│   │   └── _data/         # Mock data
│   ├── analytics/         # Analytics dashboard
│   │   ├── _components/   # Analytics components  
│   │   └── _data/         # Analytics data
│   ├── leaderboard/       # Community leaderboard
│   │   ├── _components/   # Leaderboard components
│   │   └── _data/         # Leaderboard data
│   ├── moderation/        # Moderation system
│   │   ├── _components/   # Moderation UI components
│   │   ├── _data/         # Moderation enums/data
│   │   ├── history/       # Moderation history page
│   │   └── queue/         # Moderation queue page
│   └── layout.tsx         # Root layout with sidebar
├── components/
│   ├── ui/                # shadcn/ui base components
│   ├── layout/            # App layout components
│   └── theme-provider.tsx # Theme context
├── config/                # API configuration
├── contexts/              # React contexts (auto-moderation, flagged messages)
├── data/                  # Mock data (central source of truth)
├── hooks/                 # Custom hooks (live messages, player data, etc.)
├── lib/
│   ├── api/              # API client classes (sentiment, moderation, roblox)
│   ├── avatar-mapping.ts # Roblox avatar utilities
│   ├── colors-mod.ts     # Moderation colors and enums
│   └── utils.ts          # General utilities
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## Features

### Dashboard (`/`)
- Real-time KPI metrics with trend indicators
- Message analytics with Recharts visualizations
- Multi-experience monitoring cards
- Container query-based responsive layouts

### Moderation System (`/moderation`)
- **Live Chat Feed**: Real-time message streaming with sentiment analysis
- **Message Flagging**: Manual flagging system for content review
- **Priority Filtering**: MODERATE/HIGH/CRITICAL severity levels
- **Content Classification**: Violence, Harassment, Hate Speech detection
- **PII Detection**: 15+ categories including financial/personal data
- **Player Profiles**: Roblox avatar integration, activity stats, violation history
- **Mode Switching**: View/Mod/Auto-Mod operational modes
- **History Page** (`/moderation/history`): Past moderation actions with detailed context
- **Queue Page** (`/moderation/queue`): Flagged messages awaiting review

### Analytics (`/analytics`) 
- Sentiment analysis trends and distribution
- Moderation action breakdown charts
- Community health metrics

### Leaderboard (`/leaderboard`)
- Top community contributors by behavioral score
- Point breakdown and user rankings

### Navigation
- Collapsible sidebar with persistent state
- Dynamic route-based breadcrumbs
- Theme toggle (dark/light mode)
- User profile dropdown

## API Integration

### Configuration
- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL` environment variable
- **Development**: `http://localhost:8000` (default fallback)
- **Production**: `https://bloom-ai-dashboard-backend.vercel.app`
- **API Client**: Axios-based client classes with request/response interceptors

### Current Backend Endpoints
**Message Processing:**
- `POST /api/analyze` - Sentiment analysis with community intent detection (requires X-API-Key header)
- `POST /api/moderate` - Message moderation only (no sentiment analysis)
- `POST /api/sentiment` - Sentiment analysis only
- `POST /api/flag` - Flag messages for manual review
- `GET /api/flagged?limit=50` - Retrieve flagged messages for moderation queue

**Data Retrieval:**
- `GET /api/players` - Fetch all players
- `GET /api/messages?player_id&limit` - Get messages with optional filtering
- `GET /api/live?limit=20` - Get recent live messages
- `GET /api/top-players?limit=10` - Top players by sentiment score

**Analytics & System:**
- `GET /api/stats` - System-wide statistics (total users, points, averages)
- `GET /api/leaderboard?limit=10` - Top scoring community members
- `GET /api/health` - Backend health check
- `GET /api/users/{player_id}/score` - Individual player scores

**External APIs:**
- `GET /api/roblox-avatar?userId={id}` - Proxy for Roblox avatar thumbnails
- **Roblox API**: Player avatar and headshot integration via `NEXT_PUBLIC_ROBLOX_API_KEY`

### Data Flow
1. **Full Analysis**: Frontend → `POST /api/analyze` (with X-API-Key) → Creates message in database + sentiment + moderation
2. **Moderation Only**: Frontend → `POST /api/moderate` → Returns moderation result (pass/fail)
3. **Sentiment Only**: Frontend → `POST /api/sentiment` → Returns sentiment analysis without database storage
4. **Message Flagging**: Frontend → `POST /api/flag` → Adds to moderation queue
5. **Live Updates**: Periodic polling of `/api/live` for real-time message feed with moderation data
6. **Scoring System**: +2 points (positive sentiment/community actions), -2 points (negative)
7. **PII Protection**: Immediate blocking when PII categories detected
8. **Database Integration**: Hybrid storage (Supabase + in-memory caching) for comprehensive data access

### Key Types
```typescript
// Core message structure
interface Message {
  id: number
  message_id: string
  player_id: number
  player_name: string
  message: string
  sentiment_score: number
  created_at: string
  moderation_action?: string
  moderation_reason?: string
  flagged?: boolean
  flag_reason?: string
}

// Sentiment analysis request/response
interface SentimentAnalysisRequest {
  message: string
  player_id?: number
  player_name?: string
  message_id?: string
}

interface SentimentAnalysisResponse {
  player_id: number
  player_name: string
  message_id: string
  message: string
  sentiment_score: number
  sentiment_details?: {
    confidence?: number
    emotion?: string
    toxicity_score?: number
  }
  community_intent?: {
    intent_type?: string
    reason?: string
  }
  rewards?: {
    points_awarded: number
    reason: string
  }
}

// Analytics types
interface TopPlayer {
  player_id: number
  player_name: string
  total_sentiment_score: number
  message_count: number
}

interface OverallStats {
  total_messages: number
  average_sentiment: number
  unique_players: number
}
```

## Development

### Environment Variables
Create a `.env` file with:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend URL
NEXT_PUBLIC_ROBLOX_API_KEY=your_roblox_key  # For avatar integration

# Backend API Key (for protected endpoints)
ROBLOX_API_KEY=your_api_key_here  # Required for /api/analyze endpoint

# Additional API keys 
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_key
GEMINI_API_KEY=your_gemini_key
HF_TOKEN=your_huggingface_token
```

### Code Organization
- **Route components**: `page.tsx` files
- **Route-specific**: `_components/` and `_data/` folders
- **Shared components**: `src/components/`
- **API clients**: `src/lib/api/` (sentiment.ts, moderation.ts, roblox.ts)
- **Types**: `src/types/` (sentiment.ts with comprehensive interfaces)
- **Mock data**: `src/data/mock-data.ts` (centralized mock data source)
- **Configuration**: `src/config/api.ts` (environment-based API URL)

### Development Notes
- **Mock Data**: Currently using extensive mock data for UI development
- **API Integration**: Partial integration with real backend endpoints
- **Real-time Updates**: Implemented via polling (WebSocket support pending)
- **Error Handling**: Comprehensive error handling in API clients with logging
- **Type Safety**: Full TypeScript coverage with strict typing

## Key Dependencies
- **Framework**: next@15.3.3, react@19.0.0, typescript@5
- **HTTP Client**: axios@1.10.0
- **UI Components**: @radix-ui/* (avatar, dropdown, dialog, etc.), tailwindcss@4.0, next-themes@0.4.6
- **Data Tables**: @tanstack/react-table@8.21.3
- **Charts**: recharts@2.15.3
- **Icons**: lucide-react@0.515.0, @tabler/icons-react@3.34.0
- **Utilities**: clsx@2.1.1, tailwind-merge@3.3.1, class-variance-authority@0.7.1

## Deployment

### Production Configuration
- **Frontend**: Deployed on Vercel
- **Backend**: `https://bloom-ai-dashboard-backend.vercel.app`
- **Environment**: Set `NEXT_PUBLIC_API_URL` for production backend URL
- **Build**: Standard Next.js build process (`pnpm build`)

### API Client Architecture
- **Modular Design**: Separate client classes for different API domains
- **Error Handling**: Interceptors for request/response logging and error management
- **Environment Awareness**: Automatic API URL resolution based on environment
- **Type Safety**: Full TypeScript integration with request/response typing

