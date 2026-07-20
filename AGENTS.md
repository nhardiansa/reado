# AGENTS.md — Reado

> Agent instructions for working on this codebase. See `docs/PRD.md` for product spec and `docs/ARCHITECTURE.md` for full architecture.

---

## 1. Project Overview

- Name: Reado
- Description: Mobile Android book reading tracker app. Local-first, neobrutalist UI, share-card generation for social media.
- Goal: Help users record books, track reading progress by last page read, and share reading milestones as visual cards.
- Target Users: Personal readers who want simple offline tracking without accounts.
- Version: v1.0.0
- Status: Active development

---

## 2. Tech Stack

- Language: TypeScript (strict mode)
- Framework: Expo SDK 57 + React Native 0.86 + React 19
- Routing: Expo Router (file-based, `src/app/`)
- Styling: NativeWind v4 (Tailwind CSS) + neobrutalist theme tokens
- UI Library: Custom neobrutalist system in `src/components/`
- Local DB: WatermelonDB (SQLite, reactive, schema migrations) — replaces Isar from the original Flutter PRD
- KV Store: MMKV (lightweight preferences) — replaces SharedPreferences
- State Management: Zustand
- Forms: React Hook Form + Zod (validation)
- Share: `expo-sharing` (Android share sheet) + `react-native-view-shot` (view → image)
- Icons: lucide-react-native + react-native-svg
- Package Manager: npm
- Build: EAS Build (Android APK / AAB)
- Testing: Jest + jest-expo + React Native Testing Library
- Linting/Formatting: ESLint (flat config, eslint-config-expo) + Prettier

> WatermelonDB ships a native module. The app cannot run in Expo Go. Use `expo run:android` or EAS Build `development` profile for local development.

---

## 3. Commands

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Build + run on Android device/emulator (dev build)
npm run ios            # Build + run on iOS (requires macOS)
npm run web            # Run on web

# Quality
npm run typecheck      # TypeScript check (tsc --noEmit)
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run format         # Prettier format
npm run format:check   # Prettier check

# Testing
npm test               # Run all tests
npm run test:watch     # Jest watch mode
npm run test:coverage  # Jest with coverage

# Build (EAS)
npm run build:dev      # EAS Build development (APK)
npm run build:preview  # EAS Build preview (APK internal)
npm run build:prod     # EAS Build production (AAB)
```

> Package manager is npm. Do not introduce yarn/pnpm/bun lockfiles.

---

## 4. Project Structure

Architecture: Hybrid — feature-first for UI + thin `services/` layer for pure business rules + `repositories/` for data access. No clean-code overkill (no domain/use-case layer, no DTOs, no DI container).

```
src/
  app/              # Expo Router routes — thin, delegate to features
  features/         # Feature modules (UI + feature state)
    library/        #   PRD 8.1 — book list
    book/           #   PRD 8.2-8.5 — CRUD + detail
    progress/       #   PRD 8.6 — progress update
    share-card/     #   PRD 8.9 — share cards
  services/         # Pure business rules (status transitions, progress calc) — unit-tested
  repositories/     # Data access layer (PRD 17.5) — wraps WatermelonDB
  db/               # WatermelonDB internals (encapsulated)
    schema/         #   Table definitions
    models/         #   Model classes
    migrations/     #   Schema migrations
  lib/              # Third-party setup (DB instance, MMKV, share-card renderer)
  components/       # Shared neobrutalist UI system (ClayCard, ClayButton, etc)
  theme/            # Design tokens (PRD 12.2)
  navigation/       # Route types, deep-link config
  stores/           # Global UI state (Zustand)
  hooks/            # Shared hooks
  types/            # Shared domain types (Book, ReadingStatus)
  utils/            # Pure utilities (date, id, percentage rounding)
  constants/        # Storage keys, route names, status label maps
docs/
  PRD.md            # Product requirements (canonical spec)
  ARCHITECTURE.md   # Full architecture, layer rules, data flow
```

### Feature module anatomy

```
src/features/<name>/
  screens/        # Route-level components rendered by app/<route>
  components/     # Feature-specific UI (not shared across features)
  hooks/          # Feature hooks (use cases for this feature)
  schema.ts       # Zod schema for this feature's forms (if any)
  store.ts        # Zustand store for this feature's UI state (if any)
  types.ts        # Feature-local types (not shared)
  index.ts        # Public barrel — exports only screens + hooks
```

### Layer rules (summary)

1. `services/` — pure functions only. No `react-native`, no `@nozbe/watermelondb`, no React. Input/output are plain domain types from `types/`.
2. `repositories/` — translate between WatermelonDB `Model` instances and plain `types/` domain models. Callers never see `Model`.
3. `db/` — imported only by `repositories/` and `lib/`. Anything else importing from `db/` is a layering violation.
4. `features/` — orchestrate. Feature hooks call services for rules and repositories for data, then expose ready-to-render state to screens.
5. `app/` routes — thin. Mount a feature screen and pass route params. No hooks, no logic, no data fetching.
6. `components/` — neobrutalist design system only. Feature-specific visuals live in the feature.

### File placement

- New UI component shared across features → `src/components/`
- New UI component used by one feature only → `src/features/<name>/components/`
- Business rule (status transition, progress calc, derivation) → `src/services/`
- Data access (CRUD, query, filter) → `src/repositories/`
- WatermelonDB table or model → `src/db/schema/` or `src/db/models/`
- Shared domain type → `src/types/`
- Feature-local type → `src/features/<name>/types.ts`
- Pure utility (date format, id gen, rounding) → `src/utils/`
- Third-party singleton (DB instance, MMKV instance) → `src/lib/`
- Do not create new folders without confirmation

Full details in `docs/ARCHITECTURE.md`.

---

## 5. Naming Conventions

```
# File and Folder
- Component      : PascalCase    example: ClayCard.tsx
- Non-component  : camelCase     example: useBookForm.ts, applyStatusChange.ts
- Folder         : kebab-case    example: share-card/
- Screen         : index.tsx (inside features/<name>/screens/<route-name>/)
- Route file     : matches Expo Router convention (src/app/<route>.tsx)
- Test file      : [name].test.ts or [name].test.tsx, co-located in __tests__/

# In Code
- Variable       : camelCase     example: bookData, isLoading
- Constant       : UPPER_SNAKE   example: STORAGE_KEY, MAX_RATING
- Function       : camelCase     example: getProgressPercent, applyStatusChange
- Type/Interface : PascalCase    example: Book, BookFormData
- Enum/Union     : PascalCase    example: ReadingStatus
- CSS class      : kebab-case    example: clay-card, primary-accent
- Zustand store  : useXStore     example: useLibraryStore

# Git Branch
- New feature    : feat/[feature-name]
- Bug fix        : fix/[bug-name]
- Hotfix         : hotfix/[name]
- Refactor       : refactor/[name]
```

---

## 6. Code Conventions

```
# Approach
- Follow clean code principles pragmatically — DRY, single responsibility, but no over-abstraction
- Extract a function only when reused or when it clarifies intent
- Prefer readable over terse

# TypeScript
- Strict mode is enabled — respect it
- No `any` type. Use `unknown` + narrowing if type is truly unknown
- Write explicit return types on exported functions
- Use `interface` for object shapes, `type` for unions/intersections
- Domain models live in src/types/ and mirror PRD section 11

# Import Order
1. External libraries (react, react-native, expo, @nozbe/watermelondb)
2. Internal absolute (@/components, @/services, @/repositories, @/types)
3. Internal relative (./Component, ../utils)
4. Types and interfaces
5. Styles and assets

# Export Pattern
- Named exports for components, hooks, services, repositories, utils
- Default export only for Expo Router screens (required by file-based routing)

# Error Handling
- Always use try-catch for async functions
- Never swallow errors silently
- Error messages must be user-readable in the UI (PRD section 13.2)
- Repository errors are caught in feature hooks and surfaced as UI state
```

---

## 7. Component Rules

```
# Component File Structure
1. Imports
2. Props type or interface
3. Component definition
4. Hooks (useState, useEffect, useColorScheme, etc)
5. Handlers and local functions
6. Return JSX
7. (Default export for Expo Router screens only, otherwise named export)

# Props
- Always declare prop types explicitly
- Use default values for optional props
- Keep props count reasonable — if a component needs 8+ props, consider splitting

# Small Components
- Extract to its own file if reused in more than one place
- Keep inline in the parent file if used in only one component
```

> This is React Native, not Next.js. There is no Server/Client component split. All components run on the device.

---

## 8. Styling Rules

```
# Approach
- Primary: NativeWind v4 — use Tailwind utility classes via className
- Fallback: StyleSheet + tokens from src/theme/tokens.ts when utilities cannot express the style
- No inline `style={{}}` except for truly dynamic values that cannot be precomputed
- No !important

# Neobrutalist Tokens
- Colors: bg-clay-bg, bg-clay-card, bg-clay-accent, bg-clay-accent-pink, text-clay-text, border-clay
- Status: bg-clay-success, bg-clay-danger
- Radius: rounded-clay (8), rounded-clay-button (8), rounded-clay-modal (8)
- Border: border-clay (2), border-clay-emphasized (3)
- Shadow: shadow-clay (default 3,3), shadow-clay-emphasized (4,4)
- Fonts: font-archivo (ArchivoBlack_400Regular), font-jetbrains (JetBrainsMono_700Bold)
- Spacing: p-xs p-sm p-md p-lg p-xl (4 / 8 / 16 / 24 / 32)
- Tokens are defined in src/theme/tokens.ts and mirrored in tailwind.config.js — keep both in sync

# Conditional Classes
- Use clsx or a cn helper for conditional className
- Extract repeated className combinations into a component if used 2+ times

# Class Order
layout > spacing > sizing > color > typography > state
example: "flex-1 p-md rounded-clay bg-clay-card border-clay border-2 shadow-clay"

# Orientation
- MVP is portrait-only (PRD 7.1). Do not add landscape layouts unless explicitly requested

# Design Tokens
- Never hardcode hex colors, spacing, radius, or shadow values in components
- Always reference tokens from src/theme/tokens.ts or the Tailwind utility
```

---

## 9. State Management Rules

```
# State Hierarchy (use the simplest that works)
1. Local state (useState)          — used by one component only
2. Lifted state                    — used by 2-3 closely related components
3. Feature store (Zustand)         — used by multiple components in one feature
4. Global store (Zustand)          — used across features

# When to Use a Feature Store (src/features/<name>/store.ts)
- Form draft state that persists across screen navigation within the feature
- Feature-scoped UI state (library filter, sort, selected tab)

# When to Use a Global Store (src/stores/)
- Cross-feature UI state only (theme preference persisted to MMKV, app-wide sort default)

# Zustand Rules
- One store per feature or per global concern — never one giant store
- Do not store data that can be derived from other state
- Use selectors to subscribe to slices of state, not the whole store

# Data from WatermelonDB
- Use WatermelonDB's reactive queries (enhanced/observe) — do not replicate DB rows into Zustand
- Repositories return plain domain models; feature hooks subscribe to repository observables
- Zustand holds UI state and form drafts, not the source of truth for book data

# Context
- Avoid for state that changes frequently (causes re-renders)
- Acceptable for static or rarely-changing config
```

---

## 10. Features

```
# MVP Core (PRD section 6.1) — Not Started
- [ ] Book list / library
- [ ] Add a new book
- [ ] Edit book data
- [ ] Delete a book with confirmation
- [ ] Book detail
- [ ] Update last-page-read progress
- [ ] Automatic progress percentage calculation
- [ ] Filter books by reading status
- [ ] Simple search by title or author
- [ ] Single-text-field private note per book
- [ ] Local data storage
- [ ] Share progress card for in-progress books
- [ ] Share finished book card for finished-book achievements
- [ ] Consistent basic neobrutalist UI

# MVP Plus and Post-MVP — see docs/PRD.md sections 6.2, 6.3, 18
```

---

## 11. Testing

```
# Approach
- Types     : Unit (services), Integration (repositories), Component (UI), Route (E2E-ish)
- Framework : Jest + jest-expo + React Native Testing Library

# What to Test
- src/services/      — every business rule branch (status transitions PRD 9.2, progress calc PRD 8.6, auto-finished, startedAt/finishedAt derivation). Pure functions, no mocks.
- src/repositories/  — repository methods return correct domain models, handle not-found, persist correctly. Use WatermelonDB memory adapter.
- src/components/    — neobrutalist primitives apply correct tokens, accept className/style overrides.
- src/features/      — screens render correct content for state, user actions call right hook, empty/error states show.
- src/app/           — route renders expected feature screen, params flow through.

# What Not to Test
- Simple presentational components with no logic
- Third-party libraries (WatermelonDB, NativeWind — already tested upstream)
- Config files

# Test Writing Rules
- One test file per source file (co-located in __tests__/ next to the file)
- Test names are descriptive: "applies Finished status when currentPage reaches totalPages"
- Use AAA pattern: Arrange, Act, Assert
- Services tests must not import react-native or watermelondb
- Repository tests must not touch filesystem — use in-memory adapter

# Coverage Priority
services > repositories > components > features > routes
```

---

## 12. Do Not

If an instruction or prompt is ambiguous, ASK FIRST before coding. Do not assume and proceed without confirmation. If you are in plan mode and you want to write something, ask for confirmation first, do not write in terminal especially if you want to write plan, just write to do and ask me to make build mode activate

```
# Structure and Files
- Do not create new folders without confirmation
- Do not delete files without confirmation
- Do not move files without confirmation
- Do not change existing folder structure without confirmation

# Code
- Do not use `any` in TypeScript — use `unknown` + narrowing
- Do not hardcode values that should come from theme tokens (src/theme/tokens.ts)
- Do not hardcode storage keys — use src/constants/
- Do not commit .env files or any file containing secrets
- Do not install new packages without confirmation
- Do not change or remove finished features without clear instruction

# Forbidden Patterns
- Do not import from src/db/ outside src/repositories/ and src/lib/ — layering violation
- Do not run the app in Expo Go — WatermelonDB requires a development build
- Do not use useEffect for data fetching — use WatermelonDB reactive queries via repositories
- Do not use inline style for values expressible via utility classes or tokens
- Do not bypass input validation from PRD section 8.2
- Do not skip error handling in repositories or feature hooks

# Database
- Do not run commands that mutate or destroy local data without confirmation
- Do not create WatermelonDB migrations without confirmation
- Do not expose database internals to components

# Security
- Do not expose API keys or secrets to the client
- Do not bypass user input validation
- Do not skip error handling

# Git
- Do not commit changes without explicit user request
```
