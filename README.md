# Reado

Aplikasi mobile Android untuk tracking bacaan buku — local-first, neobrutalist UI, share card untuk media sosial. Lihat [`docs/PRD.md`](./docs/PRD.md) untuk spesifikasi lengkap dan [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) untuk struktur kode.

## Tech Stack

- **Framework**: Expo SDK 57 + React Native 0.86 + React 19 + TypeScript
- **Routing**: Expo Router (file-based, `src/app/`)
- **Styling**: NativeWind v4 (Tailwind CSS) + neobrutalist theme tokens
- **Local DB**: WatermelonDB (SQLite, reactive, schema migration)
- **KV store**: MMKV (preferensi ringan)
- **State**: Zustand
- **Form**: React Hook Form + Zod
- **Share**: expo-sharing + react-native-view-shot
- **Testing**: Jest + jest-expo + React Native Testing Library
- **Build**: EAS Build

## Prerequisites

- Node.js 20+
- JDK 17
- Android Studio (untuk `expo run:android` — WatermelonDB butuh development build, bukan Expo Go)
- Expo account (untuk EAS Build) — opsional untuk dev lokal

## Setup

```bash
npm install
npm run android        # build + jalankan di device/emulator (development build)
```

> WatermelonDB pakai native module → tidak kompatibel Expo Go. Wajib `expo run:android` atau EAS Build profile `development`.

## Scripts

| Script                  | Fungsi                                  |
| ----------------------- | --------------------------------------- |
| `npm start`             | Metro bundler                           |
| `npm run android`       | Build + jalankan di Android (dev build) |
| `npm run ios`           | Build + jalankan di iOS (butuh macOS)   |
| `npm run web`           | Jalankan di web                         |
| `npm run typecheck`     | Cek TypeScript                          |
| `npm run lint`          | ESLint                                  |
| `npm run lint:fix`      | ESLint + auto-fix                       |
| `npm run format`        | Prettier format                         |
| `npm run format:check`  | Cek Prettier                            |
| `npm test`              | Jest                                    |
| `npm run test:watch`    | Jest watch mode                         |
| `npm run test:coverage` | Jest + coverage                         |
| `npm run build:dev`     | EAS Build development (APK)             |
| `npm run build:preview` | EAS Build preview (APK internal)        |
| `npm run build:prod`    | EAS Build production (AAB)              |

## Folder Structure

Hybrid: feature-first for UI + thin `services/` layer for pure business rules + `repositories/` for data access. Business rules (status transitions PRD 9.2, progress calc PRD 8.6) live in `services/` as pure functions — unit-testable without React Native. Repositories handle DB only and return plain domain models. No clean-code overkill (no domain/use-case layer, no DTOs, no DI container).

```
src/
├── app/              # Expo Router routes — thin, delegate to features
├── features/         # Feature modules (UI + feature state)
│   ├── library/      # PRD 8.1 — daftar buku
│   ├── book/         # PRD 8.2-8.5 — CRUD + detail
│   ├── progress/     # PRD 8.6 — update progres
│   └── share-card/   # PRD 8.9 — share card
├── services/         # Pure business rules (status transitions, progress calc) — unit-tested
├── repositories/     # Data access layer (PRD 17.5) — wraps WatermelonDB
├── db/               # WatermelonDB internals (encapsulated)
│   ├── schema/       # Table definitions
│   ├── models/       # Model classes
│   └── migrations/   # Schema migrations
├── lib/              # Third-party setup (DB instance, MMKV, share-card renderer)
├── components/        # Shared neobrutalist UI system (ClayCard, ClayButton, dll)
├── theme/            # Design tokens (PRD 12.2)
├── navigation/       # Route types, deep-link config
├── stores/           # Global UI state (zustand)
├── hooks/            # Shared hooks
├── types/            # Shared domain types (Book, ReadingStatus)
├── utils/            # Pure utilities (date, id, rounding)
└── constants/        # Storage keys, route names
```

### Feature module anatomy

Setiap folder `src/features/<name>/` mengikuti layout ini:

```
src/features/<name>/
├── screens/        # Route-level components
├── components/     # Feature-specific UI
├── hooks/          # Feature hooks (use cases)
├── schema.ts       # Zod schema (jika ada form)
├── store.ts        # Zustand store (jika ada feature state)
├── types.ts        # Feature-local types
└── index.ts        # Public barrel — only exports screens + hooks
```

Feature-to-feature import lewat barrel `index.ts` saja. File internal feature tidak di-import dari luar.

### Data flow

```
Route (app/) → Feature Screen → Feature Hook → Service (business rule)
                                        ↘ Repository → WatermelonDB
Feature Screen → components/ (shared neobrutalist system)
```

Detail lengkap (layer rules, testing convention, dependency direction) ada di [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

## Path Alias

`@/*` → `./src/*` (lihat `tsconfig.json`)

## Design Tokens

Neobrutalist tokens ada di [`src/theme/tokens.ts`](./src/theme/tokens.ts) — warna, spacing, radius, border, shadow, fonts sesuai PRD section 12.2. Token yang sama di-mirror di `tailwind.config.js` supaya tersedia sebagai utility class (e.g. `bg-clay-bg`, `border-clay`, `shadow-clay`, `font-archivo`, `font-jetbrains`).
