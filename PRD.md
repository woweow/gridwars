# Product Requirements Document: Grid Wars

**Status:** Draft
**Date:** 2026-03-01
**Type:** Hobby / Learning Project

---

## 1. Overview

Grid Wars is a real-time multiplayer browser game where anonymous visitors compete as Team Red or Team Blue to capture a shared 5×5 grid. Every visitor sees the same board. Clicking a square claims it for your color. Overwriting an opponent's square is allowed. The first team to paint all 25 squares their color scores a point and the board resets to grey.

The primary purpose of this project is **exploration and learning** — specifically Convex, Effect, Confect, and the full integration of a modern TypeScript stack hosted on Vercel. It is not a production application and does not need to be treated as one.

---

## 2. Goals

1. Build and deploy a fully functional real-time game to Vercel
2. Learn and use Convex as a real-time backend data layer
3. Learn and use Effect for functional programming patterns in TypeScript
4. Learn and use Confect as the typed RPC bridge between Effect and Convex
5. Instrument the app with Sentry (error tracking) and PostHog (product analytics)
6. Keep the implementation simple — this is a sandbox, not a product

---

## 3. Non-Goals

- User authentication or accounts
- PWA, native app, or app store distribution — responsive web design IS a goal; the app must be fully usable on mobile browsers
- Rate limiting or anti-cheat
- Turborepo / monorepo architecture
- OpenTelemetry / Axiom observability
- Persistent user identity across sessions
- Admin tooling
- Any form of matchmaking or lobbies

---

## 4. Tech Stack

| Category | Technology | Notes |
|---|---|---|
| Hosting | Vercel | Frontend + serverless functions |
| Package Manager / Runtime | Bun | Replaces npm/yarn/node |
| Language | TypeScript | Strict mode |
| Lint / Format | Biome | Replaces ESLint + Prettier |
| Testing | Vitest | Core functionality only |
| Backend | Convex | Real-time data sync, mutations, queries |
| Functional Runtime | Effect | Error handling, typed pipelines |
| Effect + Convex Bridge | Confect (`@rjdellecese/confect`) | Typed RPC layer over Convex |
| Frontend Framework | Next.js 16 (App Router) | Single app, no monorepo |
| UI Library | React 19 | |
| Styling | Tailwind CSS 4 | |
| UI Primitives | Radix UI | Used for the color toggle |
| Error Tracking | Sentry | SDK installed, setup guide provided |
| Product Analytics | PostHog | SDK installed, setup guide provided |

**What was considered and explicitly excluded:**
- Turborepo — unnecessary overhead for a single app
- Better Auth — no user accounts needed
- OpenTelemetry + Axiom — distributed tracing solves problems this app won't have
- nuqs — no URL state management needed

---

## 5. Application Architecture (Component Level)

The app is a single Next.js application. Convex runs as a separate hosted service (convex.dev). Sentry and PostHog are client-side SDKs initialized at the app root.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (React)                          │
│                                                                 │
│  ┌──────────────┐  ┌─────────────────┐  ┌──────────────────┐  │
│  │  Scoreboard  │  │   Grid (5×5)    │  │  Color Toggle    │  │
│  │  Component   │  │   Component     │  │  Component       │  │
│  └──────┬───────┘  └────────┬────────┘  └────────┬─────────┘  │
│         │                   │                     │            │
│         └───────────────────┴─────────────────────┘            │
│                             │                                   │
│                    ┌────────▼────────┐                         │
│                    │  Convex Client  │  (real-time WebSocket)  │
│                    │  (React hooks)  │                         │
│                    └────────┬────────┘                         │
│                             │                                   │
│              ┌──────────────┴──────────────┐                   │
│              │  Confect RPC Layer (Effect)  │                  │
│              └──────────────┬──────────────┘                   │
└─────────────────────────────┼───────────────────────────────────┘
                              │ WebSocket / HTTP
┌─────────────────────────────▼───────────────────────────────────┐
│                      Convex Backend                             │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │  Grid Mutation  │  │  Score Mutation   │  │  Queries      │ │
│  │  (claimSquare)  │  │  (incrementScore) │  │  (getGrid,    │ │
│  │                 │  │                   │  │   getScores)  │ │
│  └─────────────────┘  └──────────────────┘  └───────────────┘ │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    Convex Database                       │   │
│  │  grid: { squareIndex: number, color: "red"|"blue"|null } │   │
│  │  scores: { red: number, blue: number }                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     External Services                           │
│                                                                 │
│  ┌───────────────────┐       ┌──────────────────────────────┐  │
│  │      Sentry       │       │           PostHog            │  │
│  │  Error tracking   │       │   Product analytics /        │  │
│  │  Runtime errors   │       │   game event tracking        │  │
│  └───────────────────┘       └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Component Descriptions

When working with the UI, you MUST use the frontend-design skill before working

**Color Toggle**
- Rendered using Radix UI Switch
- On page load, randomly assigns the user Red or Blue (in-memory, not persisted)
- User can flip it at any time
- Does not communicate with Convex — pure client state

**Grid Component**
- N×N CSS grid of cells, where N is read from the Convex `gameConfig` document at runtime
- Each cell is grey, red, or blue based on Convex real-time state
- Clicking a cell calls the `claimSquare` Convex mutation via Confect
- All clients subscribed to `getGrid` see updates immediately via Convex WebSocket
- Win condition check is handled server-side inside the `claimSquare` mutation — not in the component

**Scoreboard Component**
- Displays current Red and Blue scores
- Subscribed to `getScores` Convex query — updates in real-time
- Simple display only, no interaction

**Convex Client**
- Initialized at the app root with the Convex provider
- Exposes real-time `useQuery` and `useMutation` hooks to React components
- Confect wraps mutations in Effect pipelines for typed error handling

**Confect RPC Layer**
- Sits between React components and raw Convex mutations
- Provides typed, Effect-based wrappers around Convex calls
- Enables functional error handling (Effect's `Either`/`Exit` patterns) at the call site
- Effect is used here (backend/mutation logic) and NOT in React component rendering — keep components simple and imperative

**Sentry SDK**
- Initialized in `instrumentation.ts` (Next.js convention)
- Captures unhandled React errors via Error Boundary
- Captures runtime errors in Convex mutation wrappers
- No custom events — error tracking only
- **Graceful degradation:** if `NEXT_PUBLIC_SENTRY_DSN` is not set, Sentry initialization is skipped and the app runs normally. No hard dependency.

**PostHog SDK**
- Initialized at the app root
- Tracks the following events:
  - `square_claimed` — { color, squareIndex, previousColor }
  - `round_won` — { winningColor, roundDuration }
  - `color_switched` — { from, to }
- Page views tracked automatically
- **Graceful degradation:** if `NEXT_PUBLIC_POSTHOG_KEY` is not set, PostHog initialization is skipped and the app runs normally. No hard dependency.

---

## 6. Grid Size Flexibility

The grid size must never be hardcoded as a magic number. The goal is that changing from 5×5 to 10×10 (or any other size) requires changing **one value** — not hunting through components, mutations, and win-condition logic.

### How It Works

Grid dimensions are stored in a single Convex document in a `gameConfig` table:

```
gameConfig: {
  gridSize: number   // e.g. 5 means a 5×5 grid of 25 squares
}
```

This document is seeded on first deployment and is the single source of truth. All backend logic (win detection, grid reset) reads `gridSize` from this document. The frontend reads it via a `getConfig` query and renders the grid dynamically.

### Rules

- **No hardcoded `5`, `25`, or any grid dimension** anywhere in the codebase
- The `gameConfig` document is initialized via a Convex seed/init function on first deploy
- Changing grid size in production = update the `gameConfig` document via the Convex dashboard — no code change, no redeployment needed
- When the grid size changes mid-deployment, existing scores are preserved. The grid resets to match the new dimensions.
- `convex/config.ts` is the only file that defines the default grid size used during seeding

---

## 7. Game Mechanics (Detailed Spec)

### Board State
- `gridSize × gridSize` squares indexed 0–(gridSize²−1) in row-major order, where `gridSize` is read from `gameConfig`
- Each square has a color: `"red"`, `"blue"`, or `null` (grey)
- Board state lives entirely in Convex — it is the single source of truth
- All clients subscribe to board state via Convex real-time queries

### Player Identity
- No authentication. No accounts.
- On page load, the user is randomly assigned Red or Blue
- Assignment is stored in React component state (in-memory only)
- User can toggle their color at any time via the switch
- There is no server-side concept of "this user is red" — the color sent with each mutation is whatever the client says it is

### Claiming a Square
- User clicks any square (grey, red, or blue)
- Client calls `claimSquare(squareIndex, color)` mutation
- Convex sets that square's color to the provided color
- All subscribers see the update immediately
- No validation of color authenticity (chaos mode — intentional)

### Win Condition
- After every `claimSquare` mutation, Convex checks: are all `gridSize²` squares the same non-null color?
- If yes: score increment and grid reset happen in the **same atomic mutation** — Convex's OCC guarantees no intermediate state is ever visible to clients
- Grid resets to all `null` (grey)
- All clients see the reset immediately

### Scoreboard
- Red and Blue scores are stored as integers in Convex
- They are never reset — they accumulate for the lifetime of the deployment
- Displayed live via `useQuery(getScores)`

---

## 8. Integration Points

### Convex
- **What:** Real-time backend. Hosts the database, mutations, and queries.
- **How connected:** `ConvexProvider` wraps the Next.js app root. Components use `useQuery` and `useMutation` from `convex/react`.
- **Key mutations:** `claimSquare` (includes win check, score increment, and grid reset atomically)
- **Key queries:** `getGrid`, `getScores`, `getConfig`
- **Config document:** A `gameConfig` table stores `gridSize`. Seeded on first deploy via an init function in `convex/config.ts`. All grid logic reads from this — nothing hardcoded.
- **CLI:** `bunx convex dev` runs local dev backend. `bunx convex deploy` deploys to production.
- **Environment variable:** `NEXT_PUBLIC_CONVEX_URL` — provided by Convex dashboard after project creation.

### Confect
- **What:** Typed RPC layer that wraps Convex mutations in Effect.
- **How connected:** Confect is used to define typed Convex mutations that return `Effect` types. React components call Confect-wrapped functions instead of raw Convex hooks.
- **Value:** Enables Effect's composable error handling and typed pipelines at the call site. If a mutation fails, the error is an `Effect` failure with a typed error type, not an untyped promise rejection.

### Effect
- **What:** Functional programming runtime for TypeScript.
- **Where used:** Inside Confect-wrapped Convex mutations and any data transformation logic.
- **Not used for:** Simple React state, styling, or trivial UI logic.

### Vercel
- **What:** Hosting for the Next.js frontend and serverless functions.
- **How connected:** Git push triggers automatic deployment. Convex URL and Sentry/PostHog keys are set as environment variables in the Vercel dashboard.
- **CLI:** `vercel` for deployments. `vercel env pull` to sync environment variables locally.
- **Environment variables required:**
  - `NEXT_PUBLIC_CONVEX_URL`
  - `NEXT_PUBLIC_SENTRY_DSN`
  - `NEXT_PUBLIC_POSTHOG_KEY`
  - `NEXT_PUBLIC_POSTHOG_HOST`

### Sentry
- **What:** Error tracking. Captures unhandled exceptions with stack traces.
- **How connected:** `@sentry/nextjs` SDK. Initialized via `instrumentation.ts`. Error boundary wraps the app. Convex mutation errors are caught and reported.
- **App works without it:** Yes — if DSN env var is absent, initialization is skipped gracefully.
- **Setup guide:** See Section 9.

### PostHog
- **What:** Product analytics. Tracks game events and page views.
- **How connected:** `posthog-js` SDK. Initialized in the app root provider. Custom events fired from the Grid and Toggle components.
- **App works without it:** Yes — if API key env var is absent, initialization is skipped gracefully.
- **Setup guide:** See Section 10.

### Playwright MCP
- **What:** Browser automation used during development to visually verify the running app.
- **How used:** After starting the dev server (`bun dev`), use Playwright MCP to navigate to `localhost:3000`, verify the grid renders, test square clicking, and verify real-time updates across two tabs.
- **Not used for:** Automated test suite (Vitest handles that).

---

## 9. Sentry Integration Setup Guide

> **Note:** This guide is for first-time Sentry setup. Complete this after the codebase is built and the app is verified working. Sentry is not required for the app to function.

### Step 1: Create a Sentry Account
1. Go to [sentry.io](https://sentry.io) and sign up for a free account
2. Create a new **Organization** (your name or project name)
3. Create a new **Project**:
   - Platform: **Next.js**
   - Name: `grid-wars`
4. After creation, Sentry will show you a **DSN** — copy it. It looks like: `https://abc123@o123456.ingest.sentry.io/789`

### Step 2: Add Environment Variables
Add to your Vercel project (and `.env.local` for local dev):
```
NEXT_PUBLIC_SENTRY_DSN=<your DSN>
SENTRY_AUTH_TOKEN=<from Sentry Settings → API Keys → Auth Tokens>
SENTRY_ORG=<your org slug>
SENTRY_PROJECT=grid-wars
```

The `SENTRY_AUTH_TOKEN` is needed for source map uploads during build.

### Step 3: Verify in Sentry Dashboard
1. Deploy the app (or run locally)
2. Trigger an intentional error (or wait for a real one)
3. Check **Issues** in the Sentry dashboard — you should see the error with a stack trace
4. Check **Performance** tab to see page load traces

### What Sentry Monitors in This App
- Unhandled React render errors (via Error Boundary)
- Failed Convex mutations (caught in Confect wrappers)
- Next.js API route errors (if any)

---

## 10. PostHog Integration Setup Guide

> **Note:** This guide is for first-time PostHog setup. Complete this after the codebase is built and the app is verified working. PostHog is not required for the app to function.

### Step 1: Create a PostHog Account
1. Go to [posthog.com](https://posthog.com) and sign up (free tier is generous)
2. Create a new **Project**: `grid-wars`
3. PostHog will provide:
   - **Project API Key** — looks like `phc_abc123...`
   - **Host** — either `https://us.i.posthog.com` or `https://eu.i.posthog.com` depending on region selected

### Step 2: Add Environment Variables
Add to Vercel and `.env.local`:
```
NEXT_PUBLIC_POSTHOG_KEY=<your project API key>
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Step 3: Verify Events in PostHog
1. Deploy the app and visit it in a browser
2. Open PostHog → **Activity** → **Live Events**
3. Click a square in the game — you should see `square_claimed` appear in real-time
4. Switch your color — you should see `color_switched`
5. Win a round — you should see `round_won`

### Events Tracked

| Event | Properties | Trigger |
|---|---|---|
| `square_claimed` | `color`, `squareIndex`, `previousColor` | User clicks any square |
| `round_won` | `winningColor`, `roundDuration` | All 25 squares same color |
| `color_switched` | `from`, `to` | User flips the toggle |
| Page views | Auto | PostHog default behavior |

### PostHog Dashboard Setup (Optional)
After collecting data, create an **Insight**:
- Funnel: sessions that contain `square_claimed` → `round_won`
- Trend: `square_claimed` over time, broken down by `color`
- Trend: `round_won` broken down by `winningColor` (red vs blue win rate)

---

## 11. Definition of Done

The project is complete when ALL of the following are true:

### Core Game
- [ ] Grid renders on the page with all squares initially grey (default 5×5)
- [ ] Grid size is driven by `gameConfig.gridSize` — no hardcoded dimension in code
- [ ] Color toggle displays at the top of the page, randomly initialized to Red or Blue
- [ ] User can switch their color at any time via the toggle
- [ ] Clicking any square claims it for the user's current color
- [ ] Claimed squares update in real-time for ALL connected clients without page refresh
- [ ] Opponent's squares can be overwritten (tug-of-war mechanics confirmed)
- [ ] When all squares are the same color, that team's score increments by 1
- [ ] Grid immediately resets to all grey after a team scores
- [ ] Score increment and grid reset happen atomically (no partial state visible)
- [ ] Layout is responsive and usable on mobile browsers (touch targets ≥44px, no horizontal scroll)

### Scoreboard
- [ ] Red and Blue scores are displayed and update in real-time
- [ ] Scores persist across page refreshes and new visitors
- [ ] Scores accumulate indefinitely (no reset mechanism)

### Hosting & Infrastructure
- [ ] App is deployed and publicly accessible at a Vercel URL
- [ ] Convex backend is deployed to production (`bunx convex deploy` succeeds)
- [ ] All environment variables are configured in Vercel
- [ ] `vercel --prod` CLI deployment completes without errors

### Full-Stack Verification via Playwright MCP (Production)
This must be completed against the **live Vercel URL**, not localhost.
- [ ] Navigate to the production Vercel URL — page loads without errors
- [ ] Grid renders with the correct number of grey squares
- [ ] Color toggle is visible and randomly initialized to Red or Blue
- [ ] Click a grey square — it turns the player's color
- [ ] Click an opponent's colored square — it overwrites with the player's color
- [ ] Open a second browser tab to the same URL — confirm square color changes appear in real-time without refresh
- [ ] Fill all squares the same color — confirm score increments for the winning team
- [ ] Confirm grid resets to all grey immediately after score increments
- [ ] Confirm scores persist after a full page refresh
- [ ] Confirm layout is usable on a mobile viewport (resize browser to 375px width)

### Observability
- [ ] Sentry SDK installed and initialized in `instrumentation.ts`
- [ ] Sentry captures errors from React Error Boundary
- [ ] Sentry captures failed Convex mutations
- [ ] Sentry initialization is skipped gracefully when `NEXT_PUBLIC_SENTRY_DSN` is not set
- [ ] PostHog SDK installed and initialized at app root
- [ ] `square_claimed`, `round_won`, `color_switched` events fire correctly (verified via browser console / network tab)
- [ ] PostHog initialization is skipped gracefully when `NEXT_PUBLIC_POSTHOG_KEY` is not set
- [ ] App is **fully functional** without Sentry or PostHog env vars present
- [ ] Sentry integration setup guide complete (Section 9) — written for someone creating their first Sentry account
- [ ] PostHog integration setup guide complete (Section 10) — written for someone creating their first PostHog account
- [ ] **Account creation is explicitly out of scope for the code build phase.** Guides are the deliverable; live dashboard verification is a follow-up step.

### Code Quality
- [ ] Biome lint passes with zero errors
- [ ] TypeScript compiles with zero errors
- [ ] Vitest test suite passes (see Section 11)

---

## 12. Testing Strategy

This is a hobby project. Tests exist to protect core game logic, not to achieve coverage metrics.

### What to Test (Vitest)
- **Win condition detection** — given 25 squares all red, returns `red`. Given mixed, returns `null`.
- **Grid reset logic** — after a win, all squares return to `null`
- **Score increment** — score correctly increments for the winning color only
- **Color assignment** — random assignment returns only `"red"` or `"blue"`

### What NOT to Test
- React component rendering (no Enzyme/RTL snapshots)
- Convex mutations directly (Convex has its own testing utilities; not needed here)
- Sentry/PostHog integration calls
- CSS or styling
- Anything that requires a running server

### Test File Location
`__tests__/` directory at the project root, or co-located with the logic files.

---

## 13. CLI Validation & Development Workflow

### Local Development
```bash
# Start Convex local dev backend (watches convex/ folder)
bunx convex dev

# Start Next.js dev server (separate terminal)
bun dev
```

Convex dev mode provides a local dashboard at `http://localhost:6791` for inspecting database state and running mutations manually.

### Validate Convex Deployment
```bash
# Deploy Convex functions to production
bunx convex deploy

# Convex CLI will output the deployment URL and confirm all functions deployed
```

### Validate Vercel Deployment
```bash
# Deploy to Vercel preview
vercel

# Deploy to production
vercel --prod

# Pull environment variables from Vercel to local .env.local
vercel env pull
```

### Browser Verification with Playwright MCP
Use Playwright MCP after `vercel --prod` to run through the full-stack verification checklist in Section 11. The complete checklist lives there — this is just the execution step. Key things to exercise: grid render, square claiming, real-time sync across two tabs, win condition trigger, score persistence after refresh, and mobile viewport.

### Biome
```bash
# Lint
bunx biome check .

# Format
bunx biome format --write .
```

### Tests
```bash
bun vitest
```

---

## 14. Project Structure

```
/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout — Convex + PostHog providers, Sentry init
│   ├── page.tsx                # Main game page
│   └── error.tsx               # Error boundary (feeds Sentry)
├── components/
│   ├── Grid.tsx                # 5×5 grid component
│   ├── Square.tsx              # Individual grid cell
│   ├── Scoreboard.tsx          # Red/Blue score display
│   └── ColorToggle.tsx         # Radix UI switch for team selection
├── convex/
│   ├── schema.ts               # Convex database schema (grid, scores, gameConfig tables)
│   ├── config.ts               # gameConfig seed/init + getConfig query — grid size lives here
│   ├── grid.ts                 # claimSquare mutation (atomic: win check + score + reset) + getGrid query
│   └── scores.ts               # getScores query
├── lib/
│   ├── confect.ts              # Confect RPC wrappers around Convex mutations
│   ├── game.ts                 # Pure game logic (win detection, color assignment)
│   └── analytics.ts            # PostHog event helpers
├── instrumentation.ts          # Sentry initialization (Next.js convention)
├── __tests__/
│   └── game.test.ts            # Vitest tests for core game logic
├── biome.json
├── next.config.ts
├── tailwind.config.ts
└── package.json
```
