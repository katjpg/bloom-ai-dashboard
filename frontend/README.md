# Bloom Dashboard - Frontend

> Roblox Content Moderation Platform | Built with Next.js 15, TypeScript, and Tailwind CSS

> UPDATED: June 16th; 2:50 AM (WHOOPS)

## TODO
### Moderation 
- [ ] Moderation Queue
- [ ] Quick Actions panel

### Analytics
- [ ] coming soon...

### Leaderboard
- [ ] coming soon...


## Overview

Bloom Dashboard is a comprehensive content moderation platform designed for Roblox experiences. It provides real-time chat monitoring, automated content filtering, and community safety tools with an emphasis on protecting young users through advanced PII detection and content classification.

## Setup & Development

### Prerequisites
- Node.js 18.17+
- pnpm 8.0+

### Installation
```bash
pnpm install
pnpm run dev    # Development server at http://localhost:3000
pnpm run build  # Production build
pnpm run start  # Production server
```

## Architecture

### Technology Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4 with custom theme system
- **UI Components**: Radix UI primitives via shadcn/ui
- **State Management**: React Server Components with selective client-side hydration
- **Theme**: next-themes for dark/light mode persistence
- **Icons**: Lucide React + Tabler Icons

### Directory Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── (dashboard)/         # Route group for main dashboard
│   │   ├── _components/     # Dashboard-specific components
│   │   ├── _data/          # Mock data and types
│   │   └── page.tsx        # Main dashboard view
│   ├── moderation/         # Content moderation module
│   │   ├── _components/    # Moderation UI components
│   │   ├── _data/          # Moderation enums and mocks
│   │   └── page.tsx        # Moderation interface
│   ├── analytics/          # Analytics module (future)
│   ├── leaderboard/        # Community leaderboard (future)
│   └── layout.tsx          # Root layout with sidebar
├── components/
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── layout/             # Application layout components
│   │   ├── app-sidebar.tsx # Collapsible navigation sidebar
│   │   ├── site-header.tsx # Header with breadcrumbs
│   │   └── nav-*.tsx       # Navigation components
│   └── theme-provider.tsx  # Theme context provider
├── hooks/
│   ├── use-breadcrumbs.ts  # Dynamic breadcrumb generation
│   └── use-mobile.ts       # Responsive utilities
├── lib/
│   ├── colors-mod.ts       # Moderation color system
│   └── utils.ts            # Utility functions
└── styles/
    ├── globals.css         # Global styles and CSS variables
    └── theme.css           # Theme configuration

```

## Core Features

### 1. Dashboard Module
- **KPI Cards**: Real-time metrics with trend indicators
- **Experience Management**: Monitor multiple Roblox experiences
- **Message Analytics**: Visual charts for community activity
- **Responsive Grid**: Container query-based layouts

### 2. Moderation System

#### Live Chat Feed
- Real-time message streaming with player metadata
- Advanced filtering system:
  - **Priority Levels**: MODERATE, HIGH, CRITICAL
  - **Content Types**: Violence, Harassment, Hate Speech, etc.
  - **Combined Filter UI**: Unified dropdown for all filter options
- **Mode Switching**: View, Mod, Auto-Mod operational modes

#### Player Information Panel
- Detailed player profiles with activity status
- Quick stats: Messages, Flagged content, Violations
- Moderation actions: Warning, Mute, Kick, Ban
- Responsive layout with Discord-inspired UX

#### Content Classification System

```typescript
// Priority levels for moderation urgency
enum PriorityLevel {
  MODERATE = "MODERATE",    // Warning level
  HIGH = "HIGH",           // ContentType violations
  CRITICAL = "CRITICAL"    // PII Risk detected
}

// Content violation categories
enum ContentType {
  OK = "OK",    // Safe content
  S = "S",      // Sexual content
  H = "H",      // Hate speech
  V = "V",      // Violence
  HR = "HR",    // Harassment
  SH = "SH",    // Self-harm
  S3 = "S3",    // CSAM content
  H2 = "H2",    // Hate with threats
  V2 = "V2"     // Graphic violence
}

// PII detection categories
enum PIIType {
  CREDITCARDNUMBER = "CREDITCARDNUMBER",
  SOCIALNUM = "SOCIALNUM",
  PASSWORD = "PASSWORD",
  // ... 15+ additional PII types
}
```

### 3. Navigation & Layout

#### Sidebar Navigation
- Collapsible sidebar with persistent state
- Icon + label navigation items
- User profile section with dropdown menu
- Theme toggle integration

#### Breadcrumb System
- Dynamic route-based breadcrumbs
- Client-side navigation tracking
- Consistent typography with `font-clash`

### 4. Theme System
- Dark/light mode with system preference detection
- CSS variables for consistent theming
- Smooth transitions between themes
- Persistent theme selection via cookies

## UI Component Library

### Design Patterns

#### Card Components
```tsx
// Consistent card styling pattern
<Card className="@container/card shadow-xs overflow-hidden">
  <CardContent className="p-4">
    {/* Content */}
  </CardContent>
</Card>
```

#### Typography System
- **Headings**: `font-clash` custom font family
- **Text Sizes**: Consistent scale from `text-xs` to `text-3xl`
- **Font Weights**: `font-medium` for emphasis, `font-semibold` for headers

#### Color System
- Semantic color tokens for moderation severity
- Risk-based color hierarchy for PII types
- Consistent hover states and transitions
- Dark mode optimized color palettes

### Component Styling Conventions

1. **Container Queries**: Use `@container` for responsive components
2. **Shadows**: Apply `shadow-xs` for subtle elevation
3. **Spacing**: Follow 4px grid system (`space-y-4`, `gap-4`)
4. **Borders**: Use `border-border/60` for subtle dividers
5. **Hover States**: `hover:bg-muted/30` for interactive elements

## API Integration

### Data Types

```typescript
interface ChatMessage {
  id: string
  player_id: number
  player_name: string
  message: string
  avatar_url: string
  timestamp: string
  role: UserRole
  status: UserStatus
  experience_id: number
  // Moderation analysis
  priority_level?: PriorityLevel
  content_types?: ContentType[]
  pii_detected?: PIIType[]
  safety_score?: number
}

interface Experience {
  id: number
  title: string
  playerCount: number
  safetyScore: number
  isActive: boolean
  lastUpdated: string
  description: string
}
```

### Mock Data Structure
- Currently uses mock data in `_data/index.ts` files
- Prepared for API integration with consistent interfaces
- Realistic gaming scenarios across different experience types

## Development Guidelines

### Code Organization
- **Route Components**: Use `page.tsx` for route entry points
- **Component Folders**: `_components/` for route-specific components
- **Shared Components**: Place in `src/components/`
- **Type Definitions**: Co-locate with relevant modules

### Naming Conventions
- **Components**: PascalCase (e.g., `PlayerInfo.tsx`)
- **Utilities**: camelCase (e.g., `useBreadcrumbs.ts`)
- **Types/Interfaces**: PascalCase with descriptive names
- **Enums**: PascalCase for enum name, UPPER_SNAKE for values

### Performance Optimization
- Use React Server Components by default
- Add `"use client"` only when needed for interactivity
- Implement `useMemo` for expensive computations
- Utilize Next.js Image component for optimized loading

## Dependencies

### Core Dependencies
- `next`: 15.3.3 - React framework with App Router
- `react`: 19.0.0 - UI library
- `react-dom`: 19.0.0 - React DOM bindings
- `typescript`: 5.0+ - Type safety

### UI & Styling
- `@radix-ui/*`: Accessible component primitives
- `tailwindcss`: 4.0 - Utility-first CSS framework
- `tailwind-merge`: Class name conflict resolution
- `class-variance-authority`: Component variant management
- `next-themes`: 0.4.6 - Theme switching

### Icons & Visualization
- `lucide-react`: 0.515.0 - Icon library
- `@tabler/icons-react`: 3.34.0 - Additional icons
- `recharts`: 2.15.3 - Charting library

### Development Tools
- `@types/*`: TypeScript type definitions
- `tailwindcss-animate`: Animation utilities
- `clsx`: Conditional class names

