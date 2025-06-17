# Bloom Dashboard - Frontend

> Bloom is a comprehensive content moderation platform designed for gaming communities. Features real-time chat monitoring, automated content filtering, and community safety tools with PII detection and behavioral scoring.

> UPDATED: JUNE 17, 2:44 AM (rip)

## Quick Start

```bash
pnpm install
pnpm dev    # http://localhost:3000
```

**Backend Required**: Ensure FastAPI backend is running on `http://localhost:8000`

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
- **State**: React Server Components + selective client hydration
- **Theme**: next-themes (dark/light mode)
- **Icons**: Lucide React + Tabler Icons

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
├── contexts/              # React contexts
├── hooks/                 # Custom hooks
├── lib/                   # Utils and config
└── styles/                # Global styles
```

## Features

### Dashboard (`/`)
- Real-time KPI metrics with trend indicators
- Message analytics with Recharts visualizations
- Multi-experience monitoring cards
- Container query-based responsive layouts

### Moderation System (`/moderation`)
- **Live Chat Feed**: Real-time message streaming with metadata
- **Priority Filtering**: MODERATE/HIGH/CRITICAL severity levels
- **Content Classification**: Violence, Harassment, Hate Speech detection
- **PII Detection**: 15+ categories including financial/personal data
- **Player Profiles**: Activity stats, violation history, quick actions
- **Mode Switching**: View/Mod/Auto-Mod operational modes
- **History Page** (`/moderation/history`): Past moderation actions
- **Queue Page** (`/moderation/queue`): Pending moderation items

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

### Backend Endpoints
- **Base URL**: `http://localhost:8000`
- `POST /api/v1/moderate` - Process messages through moderation pipeline
- `GET /api/v1/users/{user_id}/score` - Retrieve user behavioral scores
- `GET /api/v1/leaderboard?limit=10` - Top scoring community members
- `GET /api/v1/stats` - System-wide statistics
- `GET /api/v1/health` - Backend health check

### Data Flow
1. **Message Processing**: Frontend → `/api/v1/moderate` → FSM (Moderation → Sentiment Analysis)
2. **Scoring System**: +2 points (positive sentiment/community actions), -2 points (negative)
3. **PII Protection**: Immediate message blocking on PII detection

### Key Types
```typescript
interface ChatMessage {
  message_id: string
  content: string
  user_id: number
  timestamp: string
  deleted: boolean
}

interface ModerationResponse {
  moderation_state: ModerationState
  sentiment_analysis?: SentimentAnalysisState
  user_score_updated: boolean
  new_score?: number
}
```

## Development

### Code Organization
- Route components: `page.tsx` 
- Route-specific: `_components/` folders
- Shared: `src/components/`
- Types: Co-located with modules

## Key Dependencies
- **Framework**: next@15.3.3, react@19.0.0
- **UI**: @radix-ui/*, tailwindcss@4.0, next-themes@0.4.6
- **Icons**: lucide-react@0.515.0, @tabler/icons-react@3.34.0
- **Charts**: recharts@2.15.3

