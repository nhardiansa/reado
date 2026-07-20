# Architecture

This document describes how the Reado codebase is organized and where different kinds of logic live. For product requirements, see [`PRD.md`](./PRD.md).

## Tech Stack

Expo SDK 57 + React Native 0.86 + React 19 + TypeScript. Expo Router (file-based) for navigation, NativeWind v4 (Tailwind) for styling, WatermelonDB for local persistence, MMKV for preferences, Zustand for state, React Hook Form + Zod for forms, `expo-sharing` + `react-native-view-shot` for share cards, Jest + React Native Testing Library for tests.

## Folder Responsibilities

| Folder                 | Responsibility                                                                                                                                                                           | Depends on                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `src/app/`             | Expo Router routes. Thin files that mount feature screens and pass route params. No business logic.                                                                                      | `features/`, `theme/`                                           |
| `src/features/<name>/` | One folder per product feature. Co-locates its screens, components, hooks, feature store, and (if owned) Zod schema + types.                                                             | `services/`, `repositories/`, `components/`, `theme/`, `types/` |
| `src/components/`      | Shared neobrutalist UI system (`ClayCard`, `ClayButton`, `ClayModal`, etc.). Reusable across features.                                                                                   | `theme/`                                                        |
| `src/services/`        | Pure business rules — status transitions (PRD 9.2), progress calc (PRD 8.6), auto-finished logic, `startedAt`/`finishedAt` derivation. No React Native imports. Unit-tested.             | `types/` only                                                   |
| `src/repositories/`    | Data-access layer (PRD 17.5). Each repository wraps WatermelonDB queries and returns plain domain models from `types/`. Swappable behind an interface.                                   | `db/`, `types/`                                                 |
| `src/db/`              | WatermelonDB internals: `schema/` (table definitions), `models/` (Model classes with decorators), `migrations/` (schema version steps). Not imported outside `repositories/` and `lib/`. | `@nozbe/watermelondb`                                           |
| `src/lib/`             | Third-party setup: WatermelonDB database instance, MMKV instance, share-card image renderer.                                                                                             | `db/`, `react-native-view-shot`, `react-native-mmkv`            |
| `src/theme/`           | Design tokens (PRD 12.2) — colors, spacing, radius, border, shadow. Pure data, no RN imports.                                                                                            | none                                                            |
| `src/navigation/`      | Route type helpers, deep-link config, nav constants.                                                                                                                                     | `expo-router`                                                   |
| `src/stores/`          | Global UI state via Zustand (e.g. theme preference, library filter/sort UI state). Per-feature state lives inside the feature, not here.                                                 | `lib/` (MMKV)                                                   |
| `src/hooks/`           | Shared hooks not owned by a single feature.                                                                                                                                              | `theme/`, `stores/`                                             |
| `src/types/`           | Shared domain types — `Book`, `ReadingStatus`, `ReadingProgressLog`. The canonical domain model (mirrors PRD section 11).                                                                | none                                                            |
| `src/utils/`           | Pure utilities (date formatting, id generation, percentage rounding). No domain logic.                                                                                                   | none                                                            |
| `src/constants/`       | Storage keys, route names, status label maps.                                                                                                                                            | `types/`                                                        |

## Feature Module Convention

Each folder under `src/features/<name>/` follows this layout:

```
src/features/<name>/
├── screens/        # Route-level components rendered by app/<route>
├── components/     # Feature-specific UI (not shared across features)
├── hooks/          # Feature hooks (use cases for this feature)
├── schema.ts       # Zod schema for this feature's forms (if any)
├── store.ts        # Zustand store for this feature's UI state (if any)
├── types.ts        # Feature-local types (not shared)
└── index.ts        # Public barrel — only exports screens + hooks the rest of the app needs
```

Features depend on each other only through the public `index.ts` barrel. Internal files are not imported from outside the feature.

## Data Flow

```
Route (src/app/<route>.tsx)
  └─ mounts Feature Screen (src/features/<name>/screens/)
       ├─ reads/writes Feature UI State (feature store.ts, Zustand)
       ├─ calls Feature Hook (src/features/<name>/hooks/)
       │     ├─ calls Service (src/services/)            ← pure business rule
       │     │     e.g. applyStatusChange(book, newStatus)
       │     └─ calls Repository (src/repositories/)     ← data access
       │           └─ WatermelonDB (src/db/)             ← persistence
        └─ renders Shared Components (src/components/)    ← neobrutalist system
                  styled via theme tokens (src/theme/)
```

Share-card rendering path is separate:

```
Feature Screen → lib/renderShareCard (react-native-view-shot)
               → expo-sharing (Android share sheet)
```

## Layer Rules

1. **`services/` is pure.** No `react-native`, no `@nozbe/watermelondb`, no React. Inputs are plain domain types from `types/`. Outputs are plain domain types or derived values. Every business rule here is unit-testable in isolation.
2. **`repositories/` owns DB mapping.** Repositories translate between WatermelonDB `Model` instances and plain `types/` domain models. Callers never see `Model`.
3. **`db/` is encapsulated.** `schema/`, `models/`, `migrations/` are imported only by `repositories/` and `lib/` (database bootstrap). Anything else importing from `db/` is a layering violation.
4. **`features/` orchestrate.** Feature hooks call services for rules and repositories for data, then expose ready-to-render state to screens. Screens stay declarative.
5. **`app/` routes stay thin.** A route file imports a feature screen and passes route params. No hooks, no logic, no data fetching.
6. **`components/` is the design system.** Only neobrutalist primitives and generic patterns (EmptyState, ErrorState). Feature-specific visuals live in the feature.

## State Management

- **Per-feature state**: Zustand store inside `src/features/<name>/store.ts` for state that only that feature reads (e.g. the Add Book form's draft, the library's current filter).
- **Global UI state**: `src/stores/` for cross-feature UI state only (e.g. theme preference persisted to MMKV, app-wide sort default).
- **Server/cache state**: not applicable — local-first, no remote data. WatermelonDB's reactive queries replace React Query's role.

## Testing Convention

| Layer           | Tool                               | What to test                                                                                               |
| --------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `services/`     | Jest                               | Business rules — every status-transition branch, progress calc, auto-finished edge cases. No mocks needed. |
| `repositories/` | Jest + WatermelonDB memory adapter | Repository methods return correct domain models, handle not-found, persist correctly.                      |
| `components/`   | RNTL                               | Neobrutalist primitives render tokens correctly, accept className/style overrides.                         |
| `features/`     | RNTL                               | Screen renders correct content for given state, user actions call the right hook, empty/error states show. |
| `app/`          | RNTL                               | Route renders the expected feature screen, params flow through.                                            |

## Path Alias

`@/*` maps to `./src/*` (see `tsconfig.json`). Examples:

```ts
import { ClayCard } from "@/components/ClayCard";
import { applyStatusChange } from "@/services/status-transitions";
import { bookRepository } from "@/repositories/book-repository";
import { Book, ReadingStatus } from "@/types/book";
import { colors } from "@/theme/tokens";
```

Feature-to-feature imports go through the feature barrel:

```ts
import { LibraryScreen } from "@/features/library";
```
