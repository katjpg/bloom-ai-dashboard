# Bloom Dashboard - Frontend

> Updated: June 15th, 3:09AM (RIP)

## Setup

```bash
pnpm install
pnpm run dev
```

## Architecture

### Next.js 14+ App Router Structure

The frontend uses Next.js 14+ with the App Router pattern, organizing routes through the filesystem-based routing system.

**Route Organization:**
- `src/app/(dashboard)/page.tsx` - Main dashboard (grouped route)
- `src/app/moderation/` - Message moderation interface
- `src/app/analytics/` - System analytics and metrics
- `src/app/leaderboard/` - Community scoring leaderboard

**Layout Strategy:**
- Root layout (`layout.tsx`) provides sidebar-based navigation using shadcn/ui components
- Collapsible sidebar with theme toggle support
- Route grouping with `(dashboard)` keeps the main dashboard at `/` while organizing code

**Component Architecture:**
```
src/
├── components/
│   ├── ui/           # shadcn/ui base components (Button, Card, etc.)
│   ├── layout/       # Navigation and layout components
│   └── features/     # Feature-specific components
└── app/
    ├── (dashboard)/  # Grouped route for main dashboard
    ├── moderation/   # Moderation-specific pages and components
    ├── analytics/    # Analytics pages and components
    └── leaderboard/  # Leaderboard pages and components

```

**Key Dependencies:**
- **UI Framework**: Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with custom theme support
- **State Management**: React Server Components with client-side interactivity
- **Theme**: next-themes for dark/light mode switching
- **Icons**: Tabler Icons and Lucide React

**Navigation Structure:**
The sidebar has access to four main sections:
1. **Dashboard** (`/`) - Overview and system status
2. **Moderation** (`/moderation`) - Real-time message processing
3. **Analytics** (`/analytics`) - Community health metrics  
4. **Leaderboard** (`/leaderboard`) - Top community contributors

