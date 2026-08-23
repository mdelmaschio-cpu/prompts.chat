# CLAUDE.md

> Quick reference for Claude Code when working on prompts.chat

## Project Overview

**prompts.chat** is a social platform for AI prompts built with Next.js 16 App Router, React 19, TypeScript 5, and PostgreSQL/Prisma 6. Users can share, discover, collect, vote on, and version-control prompts. The project is open source and fully self-hostable with white-label support.

For detailed agent guidelines, see [AGENTS.md](AGENTS.md).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24.x |
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript 5 (strict mode) |
| Database | PostgreSQL + Prisma ORM 6.19 |
| Auth | NextAuth.js 5 (beta) |
| Styling | Tailwind CSS 4 + Radix UI primitives |
| UI Components | shadcn/ui pattern (`src/components/ui/`) |
| i18n | next-intl (17 locales) |
| Forms | React Hook Form + Zod 4 |
| AI | OpenAI SDK (search, generation, translation) |
| MCP | `@modelcontextprotocol/sdk` |
| Testing | Vitest + Testing Library |
| Monitoring | Sentry |

## Quick Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000
npm run build            # Production build (runs prisma generate first)
npm run start            # Start production server
npm run lint             # Run ESLint
npm run setup            # Interactive first-time setup wizard

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations (dev)
npm run db:deploy        # Apply migrations (production)
npm run db:push          # Push schema changes without migration
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with initial data
npm run db:setup         # Full setup: generate + migrate + seed
npm run db:resetadmin    # Reset admin user credentials
npm run db:backfill-slugs # Backfill slug values for existing records

# Type checking
npx tsc --noEmit         # Check TypeScript types

# Testing
npm test                 # Run all tests (vitest run)
npm run test:watch       # Watch mode
npm run test:ui          # Vitest UI
npm run test:coverage    # Coverage report

# Translations
node scripts/check-translations.js     # Check missing translations across locales
node scripts/find-unused-translations.js # Find unused translation keys

# Content generation / data utilities
npx tsx scripts/generate-examples.ts   # Generate AI example media for prompts (npm run generate:examples)
npx tsx scripts/seed-skills.ts         # Seed Skill-type prompts

# Book/PDF
npm run book:pdf         # Generate book HTML
npm run book:pdf:all     # Generate all book HTML variants
npm run book:pdf:convert # Convert generated HTML to PDF
npm run book:pdf:print   # Generate + convert print edition
npm run book:pdf:print:all # Generate + convert all print editions

# Docs linting
node scripts/lint-mdx.js # Lint MDX content under src/app/book, docs, etc.
```

## Key Files

| File | Purpose |
|------|---------|
| `prompts.config.ts` | Main app configuration (branding, theme, auth, features) |
| `prisma/schema.prisma` | Database schema |
| `src/lib/auth/index.ts` | NextAuth configuration |
| `src/lib/db.ts` | Prisma client singleton |
| `src/lib/plugins/registry.ts` | Plugin registry (auth, storage, media-generators) |
| `src/app/layout.tsx` | Root layout with providers |
| `messages/en.json` | Primary translation file (English) |
| `.env.example` | All supported environment variables |

## Project Structure

```
/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Migration history
│   ├── seed.ts             # Seed script
│   └── reset-admin.ts      # Admin credential reset script
├── messages/               # i18n files: en, tr, es, zh, ja, ar, pt, fr, de, it, nl, ko, ru, he, el, az, fa (17 locales)
├── public/                 # Static assets (logos, favicons, sponsors)
├── plugins/
│   └── claude/prompts.chat/  # Claude Code plugin (commands, agents, skills)
├── packages/
│   ├── prompts.chat/       # npm SDK package
│   └── raycast-extension/  # Raycast extension
├── scripts/                # Dev/build/content utilities (setup, docker-setup, translations, book PDF, slug backfill, etc.)
├── .github/workflows/      # CI (lint + test), Docker publish, credit reset cron, spam check, contributors sync
└── src/
    ├── app/                # Next.js App Router
    │   ├── (auth)/         # Login, register
    │   ├── [username]/     # User profile pages
    │   ├── admin/          # Admin dashboard
    │   ├── api/            # API routes (see below)
    │   ├── book/           # Book/guide pages (MDX)
    │   ├── brand/          # Brand/press kit page
    │   ├── builder/        # Prompt builder UI
    │   ├── categories/     # Category browsing
    │   ├── collection/     # User collections
    │   ├── developers/     # Developer/API docs
    │   ├── discover/       # Prompt discovery
    │   ├── docs/           # Product documentation
    │   ├── embed/          # Embeddable prompt widget
    │   ├── feed/           # Personal feed
    │   ├── how_to_write_effective_prompts/ # Prompting guide page
    │   ├── kids/           # Kids-safe prompt section
    │   ├── presentation/   # Presentation mode
    │   ├── promptmasters/  # Promptmasters feature
    │   ├── prompts/        # Prompt CRUD
    │   ├── settings/       # User settings
    │   ├── skills/         # Skills browsing
    │   ├── support/        # Support page
    │   ├── tags/           # Tag browsing
    │   ├── taste/          # Taste/preference section
    │   ├── workflows/      # Workflow (chained prompts)
    │   └── ...             # about, privacy, terms, sitemap.ts, robots.ts, etc.
    ├── components/
    │   ├── admin/          # Admin UI
    │   ├── ads/            # Ad components (Ezoic, Google AdSense)
    │   ├── api/            # API documentation components
    │   ├── auth/           # Auth forms/gates
    │   ├── book/           # Book reader components
    │   ├── categories/     # Category components
    │   ├── comments/       # Comment threads
    │   ├── developers/     # Developer/API docs
    │   ├── ide/            # IDE integration components
    │   ├── kids/           # Kids mode components
    │   ├── layout/         # Header, footer, navigation
    │   ├── mcp/            # MCP config UI
    │   ├── presentation/   # Presentation components
    │   ├── promptmasters/  # Promptmasters feature
    │   ├── prompts/        # Prompt cards, forms, viewers
    │   ├── providers/      # React context providers
    │   ├── seo/            # SEO/meta components
    │   ├── settings/       # Settings panels
    │   ├── ui/             # shadcn/ui base components
    │   └── user/           # User profile components
    └── lib/
        ├── ai/             # OpenAI integration (embeddings, generation, quality-check)
        ├── auth/           # NextAuth config
        ├── book/           # Book chapter data (chapters.ts)
        ├── config/         # defineConfig() + config type definitions
        ├── hooks/          # Custom React hooks
        ├── i18n/           # i18n utilities
        ├── kids/           # Kids-safe mode utilities
        ├── plugins/        # Plugin system
        │   ├── auth/       # credentials, github, google, azure, apple
        │   ├── storage/    # url, s3, do-spaces
        │   ├── media-generators/ # fal.ai, wiro.ai
        │   └── widgets/    # Embeddable widgets (book, coderabbit, commandcode, ezoic, textream)
        ├── analytics.ts    # Analytics integration
        ├── api-key.ts      # API key generation/validation (MCP)
        ├── date.ts         # Date formatting helpers
        ├── db-errors.ts    # Prisma error normalization
        ├── db.ts           # Prisma client singleton
        ├── ezoic.ts        # Ezoic ad integration
        ├── format.ts       # Number/text formatting helpers
        ├── prompt-access.ts # Prompt visibility/access checks
        ├── rate-limit.ts   # Rate limiting utility
        ├── similarity.ts   # Embedding similarity helpers
        ├── skill-files.ts  # Skill file handling
        ├── slug.ts         # Slug generation
        ├── urls.ts         # URL helpers
        ├── utils.ts        # cn() and misc utilities
        ├── variable-detection.ts # Prompt variable detection
        ├── webhook.ts      # Outbound webhook delivery
        └── works-best-with.ts # "Works best with" model recommendations
```

Tests live in `src/__tests__/`, mirroring source areas (e.g. `src/__tests__/api/`, `src/__tests__/hooks/`, `src/__tests__/components/`).

## API Routes (`src/app/api/`)

| Route | Purpose |
|-------|---------|
| `auth/[...nextauth]` | NextAuth handler |
| `auth/register` | User registration |
| `prompts` | List/create prompts |
| `prompts/[id]` | Get/update/delete a prompt |
| `prompts/[id]/comments`, `.../comments/[commentId]`, `.../comments/[commentId]/vote`, `.../comments/[commentId]/flag` | Threaded comments + voting + flagging |
| `prompts/[id]/changes`, `.../changes/[changeId]` | Change requests (community-proposed edits) |
| `prompts/[id]/versions`, `.../versions/[versionId]`, `.../restore` | Version history + restore |
| `prompts/[id]/connections`, `.../connections/[connectionId]` | Workflow connections between prompts |
| `prompts/[id]/vote`, `.../pin`, `.../feature`, `.../unlist` | Voting, pinning, admin featuring/unlisting |
| `prompts/[id]/examples`, `.../skill`, `.../raw`, `.../flow` | Media examples, skill file, raw content, workflow flow data |
| `prompts/search` | Keyword + semantic search |
| `prompts/translate` | AI translation of search queries |
| `generate/sql` | AI prompt generation |
| `improve-prompt` | AI prompt improvement |
| `prompt-builder/chat`, `prompt-builder/generate-example` | Prompt builder AI tools |
| `search/ai` | Global AI-assisted search |
| `categories`, `categories/[id]/subscribe` | Category CRUD + subscriptions |
| `collection` | User collections |
| `reports` | Prompt reports |
| `upload` | File upload (to storage plugin) |
| `media-generate`, `media-generate/status` | AI media generation (images/video) + job polling |
| `user/api-key`, `user/notifications`, `user/profile` | Current user operations |
| `users/search` | User search (mentions, collaborators) |
| `admin/prompts`, `admin/categories`, `admin/tags`, `admin/users`, `admin/reports`, `admin/webhooks`, `admin/embeddings`, `admin/import-prompts`, `admin/related-prompts`, `admin/slugs` | Admin-only operations |
| `leaderboard` | Leaderboard data |
| `health` | Health check |
| `cron/reset-credits` | Scheduled job (daily generation credit reset, protected by `CRON_SECRET`) |
| `config/storage` | Runtime storage config endpoint |
| `book/demo` | Book demo content API |

## Database Models (Prisma)

Key models in `prisma/schema.prisma`:

- **User** — auth, roles (ADMIN/USER), API keys, generation credits, MCP settings
- **Account / Session / VerificationToken** — standard NextAuth.js adapter models
- **Prompt** — title, content, type (TEXT/IMAGE/VIDEO/AUDIO/STRUCTURED/SKILL/TASTE), tags, category, versions, embedding, MCP configs, workflow links
- **PromptVersion** — immutable version history
- **PromptTag** — join table between `Prompt` and `Tag`
- **ChangeRequest** — community-proposed edits (PENDING/APPROVED/REJECTED)
- **Category** — hierarchical (parent/children), pinned, ordered
- **Tag** — colored slug-based tags
- **Collection** — user-saved prompts
- **PinnedPrompt** — user-pinned ordered prompts
- **Comment / CommentVote** — threaded comments with voting
- **PromptVote** — upvotes
- **PromptReport** — spam/inappropriate reports
- **Notification** — COMMENT / REPLY events
- **PromptConnection** — ordered connections between prompts (workflows)
- **UserPromptExample** — media examples submitted by users (required media type: IMAGE/VIDEO/DOCUMENT)
- **WebhookConfig** — outbound webhooks (PROMPT_CREATED/UPDATED/DELETED)
- **CategorySubscription** — user subscriptions to categories

Key enums: `UserRole` (ADMIN/USER), `PromptType` (TEXT/IMAGE/VIDEO/AUDIO/STRUCTURED/SKILL/TASTE), `StructuredFormat` (JSON/YAML), `NotificationType` (COMMENT/REPLY), `ChangeRequestStatus` (PENDING/APPROVED/REJECTED), `RequiredMediaType` (IMAGE/VIDEO/DOCUMENT), `ReportReason` (SPAM/INAPPROPRIATE/COPYRIGHT/MISLEADING/RELIST_REQUEST/OTHER), `ReportStatus`, `WebhookEvent` (PROMPT_CREATED/PROMPT_UPDATED/PROMPT_DELETED), `DelistReason` (TOO_SHORT/NOT_ENGLISH/LOW_QUALITY/NOT_LLM_INSTRUCTION/MANUAL/UNUSUAL_ACTIVITY)

## Configuration (`prompts.config.ts`)

```ts
defineConfig({
  branding: { name, logo, logoDark, favicon, description, appStoreUrl, chromeExtensionUrl },
  theme: { radius, variant, density, colors },  // "flat"|"default"|"brutal"; "none"|"sm"|"md"|"lg"
  auth: { providers, allowRegistration },        // credentials|github|google|azure|apple
  i18n: { locales, defaultLocale },
  features: {
    privatePrompts, changeRequests, categories, tags,
    aiSearch, aiGeneration, mcp, comments,
  },
  homepage: { useCloneBranding, achievements, sponsors },
})
```

## Plugin System

### Auth Plugins (`src/lib/plugins/auth/`)
`credentials` | `github` | `google` | `azure` | `apple`

### Storage Plugins (`src/lib/plugins/storage/`)
`url` (default) | `s3` | `do-spaces`  
Set `ENABLED_STORAGE` env var to activate non-default storage.

### Media Generator Plugins (`src/lib/plugins/media-generators/`)
`fal` (fal.ai) | `wiro` (wiro.ai) — configure models via env vars.

## Code Patterns

- **Server Components** by default; add `"use client"` only when needed
- **Mutations:** prefer server actions over API routes where possible
- **Translations:** always use `useTranslations()` (client) or `getTranslations()` (server); never hardcode user-facing strings
- **Styling:** Tailwind CSS with `cn()` from `@/lib/utils`; mobile-first (`sm:`, `md:`, `lg:`)
- **Forms:** React Hook Form + Zod schemas
- **Database:** Prisma client from `@/lib/db`; use `select`/`include` explicitly; use transactions for multi-step operations
- **Naming:** `PascalCase` components, `camelCase` functions/hooks, `kebab-case.tsx` files, `UPPER_SNAKE_CASE` constants

### Component Pattern

```tsx
"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  title: string;
  className?: string;
}

export function MyComponent({ title, className }: MyComponentProps) {
  const t = useTranslations("namespace");
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button>{t("actionLabel")}</Button>
    </div>
  );
}
```

## Environment Variables

Required:
```
DATABASE_URL=           # PostgreSQL connection string
DIRECT_URL=            # Direct connection URL (Neon/Supabase/PlanetScale)
NEXTAUTH_URL=           # App base URL
NEXTAUTH_SECRET=        # NextAuth secret
CRON_SECRET=            # Cron job protection secret
```

OAuth (optional — enable in `prompts.config.ts`):
```
GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
AZURE_AD_CLIENT_ID / AZURE_AD_CLIENT_SECRET / AZURE_AD_TENANT_ID
AUTH_APPLE_ID / AUTH_APPLE_SECRET
```

Storage (optional):
```
ENABLED_STORAGE=        # "s3" | "do-spaces" | "url"
S3_BUCKET / S3_REGION / S3_ACCESS_KEY_ID / S3_SECRET_ACCESS_KEY / S3_ENDPOINT
DO_SPACES_BUCKET / DO_SPACES_REGION / DO_SPACES_ACCESS_KEY_ID / DO_SPACES_SECRET_ACCESS_KEY / DO_SPACES_CDN_ENDPOINT
```

AI features (optional):
```
OPENAI_API_KEY=
OPENAI_BASE_URL=        # Default: https://api.openai.com/v1
OPENAI_EMBEDDING_MODEL= # Default: text-embedding-3-small
OPENAI_GENERATIVE_MODEL=# Default: gpt-4o-mini
OPENAI_TRANSLATION_MODEL=
```

Media generation (optional):
```
WIRO_API_KEY= / WIRO_VIDEO_MODELS= / WIRO_IMAGE_MODELS=
FAL_API_KEY=  / FAL_VIDEO_MODELS=  / FAL_IMAGE_MODELS=
```

Monitoring/ads (optional):
```
SENTRY_AUTH_TOKEN=
GOOGLE_ANALYTICS_ID=
GOOGLE_ADSENSE_ACCOUNT=
NEXT_PUBLIC_EZOIC_ENABLED=
EZOIC_SITE_DOMAIN=
```

Logging (optional):
```
LOG_LEVEL=              # Options: trace, debug, info, warn, error, fatal (default: info)
```

## Internationalization

- 17 locales: `en tr es zh ja ar pt fr de it nl ko ru he el az fa`
- Translation files: `messages/{locale}.json`
- To add a locale: add to `prompts.config.ts` → `i18n.locales`, create `messages/{locale}.json`, add to language selector in `src/components/layout/header.tsx`
- Check missing keys: `node scripts/check-translations.js`

## Common Tasks

### Adding a new page
1. Create `src/app/{route}/page.tsx` (server component for data fetching)
2. Add translations to `messages/*.json`
3. Update sitemap if publicly discoverable

### Adding a new API route
1. Create `src/app/api/{route}/route.ts`
2. Export named HTTP handlers (`GET`, `POST`, etc.)
3. Validate input with Zod
4. Apply rate limiting via `src/lib/rate-limit.ts` if needed

### Modifying the database schema
1. Edit `prisma/schema.prisma`
2. Run `npm run db:migrate` (creates migration)
3. Update related TypeScript types if needed
4. Run `npm run db:generate` if skipping migration

### Adding a new plugin
1. Create plugin file in appropriate `src/lib/plugins/{type}/` folder
2. Implement the plugin interface from `src/lib/plugins/types.ts`
3. Register in `src/lib/plugins/registry.ts`
4. Document env vars in `.env.example`

## Before Committing

1. `npm run lint` — fix all ESLint errors
2. `npx tsc --noEmit` — fix TypeScript errors
3. `npm test` — run the Vitest suite (tests live in `src/__tests__/`)
4. Add translations to all `messages/*.json` for any new user-facing text
5. Use existing `src/components/ui/` components; don't reinvent
6. Never commit secrets (use `.env`, which is gitignored)

CI (`.github/workflows/ci.yml`) runs `npm run lint` and `npm test` on every push/PR to `main` — keep both green locally before pushing.

## Boundaries

### Always Do
- Run `npm run lint` before committing
- Use existing UI components from `src/components/ui/`
- Add translations for all user-facing text
- Follow existing code patterns and naming conventions
- Use TypeScript strict types

### Ask First
- Database schema changes (require migrations)
- Adding new npm dependencies
- Modifying auth flow or session handling
- Changing `prompts.config.ts` structure or types
- Adding new plugin types

### Never Do
- Commit secrets or API keys
- Hardcode user-facing strings (use i18n)
- Modify `node_modules/` or generated Prisma files
- Delete or weaken existing translations
- Use `any` type unnecessarily
