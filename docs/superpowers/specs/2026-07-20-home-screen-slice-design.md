# Home Screen Slice — Design Spec

> **Status:** Approved 2026-07-20
> **Source mockup:** `docs/mockups/home.json` (Figma Raw export, 390×798 frame)
> **Scope:** One screen — the library/home screen as static UI. No data layer.

---

## 1. Goal

Slice the home/library screen from `docs/mockups/home.json` as a static UI with mock data, empty and loading states, and a non-functional bottom navigation bar. Establish the neobrutalist visual language as the project's design system.

## 2. Decisions (locked during brainstorming)

| Decision                | Choice                                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Design system direction | **Update tokens to mockup** — treat mockup as new source of truth; rewrite `tokens.ts` + `tailwind.config.js` to neobrutalist values.                      |
| Slice scope             | **Static UI + empty/loading states** — no db/repos/models. Hardcoded sample data.                                                                          |
| Bottom navigation       | **Render as static (non-functional)** — visual tab bar with `main` active; reviews/settings are visual-only stubs. No Expo Router Tabs setup.              |
| Fonts                   | **Install + load via expo-font** — `@expo-google-fonts/archivo-black` + `@expo-google-fonts/jetbrains-mono`. Load in `_layout.tsx`, gate splash on loaded. |
| Language                | **Indonesian, hardcode now** — matches mockup. i18n deferred.                                                                                              |
| Book card last row      | **Page count (left) + percent (right)** — no progress bar. Last row: `p.264 / 416` left, `64%` right.                                                      |

## 3. Visual Language — Neobrutalist Tokens

### Colors

| Token           | Value     | Use                                     |
| --------------- | --------- | --------------------------------------- |
| `primaryBg`     | `#FFFFFF` | App background                          |
| `cardBg`        | `#FFFDF7` | Cards, nav bar, off-white surfaces      |
| `primaryAccent` | `#FFD52E` | Yellow — add button, active tab         |
| `accentPink`    | `#FF4FA0` | Pink — "SEDANG" (in-progress) stat card |
| `success`       | `#9BE7A1` | (kept) success states                   |
| `danger`        | `#FF8A8A` | (kept) danger states                    |
| `textPrimary`   | `#141414` | Text                                    |
| `border`        | `#141414` | Borders                                 |
| `shadow`        | `#141414` | Hard solid shadow (0 blur)              |

### Radius — sharp

- `card: 8`, `button: 8`, `modal: 8` (was 24/20/28)

### Border width

- `standard: 2`, `emphasized: 3` (unchanged)

### Shadow — hard, 0 blur

- `default`: offset `{3, 3}`, blur `0`, color `#141414` (cards, buttons, book cards)
- `emphasized`: offset `{4, 4}`, blur `0`, color `#141414` (stat cards)

### Fonts

| Token               | Family name               | Use                                                     |
| ------------------- | ------------------------- | ------------------------------------------------------- |
| `archivoBlack`      | `ArchivoBlack_400Regular` | Titles, "+", big numbers, percent                       |
| `jetbrainsMonoBold` | `JetBrainsMono_700Bold`   | Greeting, labels (SELESAI/SEDANG), page counts, authors |

### Tailwind utilities (kept `clay-*` names for AGENTS.md compatibility; values updated)

`bg-clay-bg`, `bg-clay-card`, `bg-clay-accent`, `bg-clay-accent-pink`, `bg-clay-success`, `bg-clay-danger`, `text-clay-text`, `border-clay`, `border-clay-emphasized`, `rounded-clay`, `rounded-clay-button`, `rounded-clay-modal`, `shadow-clay`, `shadow-clay-emphasized`, `font-archivo`, `font-jetbrains`, spacing `p-xs..p-xl`.

## 4. File Structure

```
src/
  app/
    _layout.tsx              # MODIFY: useFonts + splash gating
    index.tsx                # MODIFY: thin mount of HomeScreen
  components/
    ClayCard.tsx             # CREATE: shared bordered + hard-shadow box primitive
    __tests__/ClayCard.test.tsx
  features/library/
    types.ts                 # CREATE: HomeBook { id, title, author, currentPage, totalPages, percent }
    data/
      mock-books.ts          # CREATE: 3 sample books + counts { finished:12, inProgress:3 }
      __tests__/mock-books.test.ts
    components/
      HomeHeader.tsx         # greeting + yellow "+" add button
      StatusSummary.tsx      # 2 stat cards (SELESAI / SEDANG)
      BookProgressCard.tsx   # cover + title/author/[page · percent]
      BookProgressList.tsx   # maps mock books → cards
      EmptyState.tsx         # empty library state
      LoadingState.tsx       # 3 skeleton cards w/ reanimated pulse
      BottomNav.tsx          # static 3-tab bar (main/reviews/settings)
      __tests__/*.test.tsx   # one per component
    screens/home/
      index.tsx              # default export HomeScreen — composes all + state switch
      __tests__/HomeScreen.test.tsx
    index.ts                 # barrel: export { HomeScreen }
  theme/
    tokens.ts                # MODIFY: neobrutalist values + fonts token
    __tests__/tokens.test.ts # MODIFY: new assertions
tailwind.config.js           # MODIFY: mirror tokens + fontFamily
app.config.ts                # MODIFY: splash + adaptive icon bg → #FFFFFF
```

### Layer rule compliance

- `app/index.tsx` is thin (mount + pass) ✓
- `ClayCard` in `src/components/` — shared, multi-feature ✓
- Rest feature-local in `src/features/library/` ✓
- No `src/db/`, `src/repositories/`, `src/services/` touched ✓

## 5. Screen Layout & State Machine

`HomeScreen` renders inside `SafeAreaView` (top + bottom edges; `react-native-safe-area-context` already installed):

```
SafeAreaView (bg-clay-bg, flex-1)
├─ ScrollView (flex-1, px-[22], contentContainer: gap-5, pb-md)
│   ├─ <HomeHeader/>
│   ├─ <StatusSummary/>
│   └─ state === 'ready'   → <BookProgressList/>
│       state === 'empty'  → <EmptyState/>
│       state === 'loading'→ <LoadingState/>
└─ <BottomNav/>             # fixed outside ScrollView, full-width, h-[70], border-t-3
```

### States

- **`ready`** (default) — renders `BookProgressList` with 3 mock books.
- **`empty`** — renders `EmptyState`.
- **`loading`** — renders `LoadingState` (3 skeleton cards).

State is held in `useState<'loading'|'empty'|'ready'>('ready')`. A dev-only long-press on the header greeting cycles `ready → empty → loading → ready` for visual QA; removed when real data lands.

## 6. Component Specs

### `ClayCard` (shared primitive)

Box with neobrutalist border + hard shadow. Default: `as='View'`, `borderWidth='emphasized'`, `shadow='default'`, `radius='card'`.

| Prop          | Type                                  | Default                        |
| ------------- | ------------------------------------- | ------------------------------ |
| `as`          | `'View' \| 'Pressable'`               | `'View'`                       |
| `borderWidth` | `'standard' \| 'emphasized'`          | `'emphasized'`                 |
| `shadow`      | `'default' \| 'emphasized' \| 'none'` | `'default'`                    |
| `radius`      | `'card' \| 'button' \| 'modal'`       | `'card'`                       |
| `className`   | `string`                              | —                              |
| `children`    | `React.ReactNode`                     | —                              |
| `onPress`     | `() => void`                          | — (only when `as='Pressable'`) |
| `testID`      | `string`                              | —                              |

### `HomeHeader`

- h52, flex-row, space-between, px-[22].
- Left (`say-hi`): "HALO, RANGGA" (JetBrains Mono Bold 12px #141414) over "Bookshelf" (Archivo Black 34px, letterSpacing -1, lineHeight 34).
- Right (`add-new`): 48×46 yellow `ClayCard` (bg-clay-accent, shadow default, radius 8) with "+" (Archivo Black 26px, centered).
- Props: `onAddPress?: () => void`.

### `StatusSummary`

- h71, flex-row, gap-[10], px-[22].
- Two 168×71 `ClayCard`s (shadow emphasized, radius 8, p15):
  - **Done** (`bg-clay-card`): 35×35 white icon-badge (border-clay-emphasized, radius 8) with lucide `Book` (#141414). Right column: big count (Archivo Black ~28, "12") + "SELESAI" (JetBrains Mono Bold ~11).
  - **On-progress** (`bg-clay-accent-pink`): 35×35 white icon-badge with lucide `BookOpen` (white). Right column: count ("3") + "SEDANG".
- Props: `finished: number`, `inProgress: number`.

### `BookProgressCard`

- 346-wide `ClayCard` (bg-clay-card, shadow default, radius 8, p15, flex-row, gap-[14]).
- Left (`pict`): 64×92 cover placeholder — `ClayCard` radius 4, border-clay-emphasized (3px #000), `bg-clay-card` fill (no image).
- Right column (flex-1, gap-3):
  1. Title (Archivo Black ~18, 2-line, e.g. "Tomorrow, and\nTomorrow…")
  2. Author (JetBrains Mono Bold ~12, e.g. "Gabrielle Zevin")
  3. Last row space-between: "p.264 / 416" (JetBrains Mono Bold ~12, left) + "64%" (Archivo Black ~14, right). **No progress bar.**
- Props: `book: HomeBook`, `onPress?: () => void`.

### `BookProgressList`

- Vertical list of `BookProgressCard` (gap-[14]).
- Props: `books: HomeBook[]`, `onBookPress?: (id: string) => void`.

### `EmptyState`

- Centered. Bordered 64×64 icon tile (`ClayCard` radius 8, border-clay-emphasized, shadow='none', `bg-clay-card`) with lucide `BookOpen` (#141414). "Belum ada buku" (Archivo Black 22). "Tambah buku pertamamu" (JetBrains Mono Bold 12). Yellow "+" `ClayCard` button (bg-clay-accent, shadow default).
- Props: `onAddPress?: () => void`.

### `LoadingState`

- 3 skeleton `ClayCard`s (bordered, shadow='none', `bg-clay-card` fill, reanimated opacity pulse 0.6↔1.0 loop, infinite). Same shape as `BookProgressCard`.
- Props: none.

### `BottomNav`

- h70, bg-clay-card, border-t-3 border-clay. 3 equal tabs (130-wide each), icon-only.
- Each tab: 32×32 `ClayCard` (radius 8, border-clay-emphasized, shadow='none') holding an 18px lucide icon.
  - **main** = bg-clay-accent (yellow, active) + `Library` icon
  - **reviews** = transparent bg + `MessageCircle`
  - **settings** = transparent bg + `Settings`
- `onPress` = no-op for now (static slice).
- Props: `activeTab?: 'main' | 'reviews' | 'settings'` (default `'main'`).

### Icon mapping (mockup tdesign → project lucide-react-native)

| tdesign (mockup) | lucide-react-native |
| ---------------- | ------------------- |
| `book`           | `Book`              |
| `book-open`      | `BookOpen`          |
| `address-book`   | `Library`           |
| `chat-message`   | `MessageCircle`     |
| `setting-1`      | `Settings`          |

Add button uses literal "+" text (matches mockup), not an icon.

## 7. Mock Data

`src/features/library/data/mock-books.ts` exports:

```typescript
export const mockBooks: HomeBook[] = [
  {
    id: "1",
    title: "Tomorrow, and Tomorrow…",
    author: "Gabrielle Zevin",
    currentPage: 264,
    totalPages: 416,
    percent: 64,
  },
  {
    id: "2",
    title: "Project Hail Mary",
    author: "Andy Weir",
    currentPage: 104,
    totalPages: 476,
    percent: 22,
  },
  {
    id: "3",
    title: "Atomic Habits",
    author: "James Clear",
    currentPage: 281,
    totalPages: 320,
    percent: 88,
  },
];

export const mockCounts = { finished: 12, inProgress: 3 };
```

## 8. Deviations from Mockup (explicit)

1. **h19 row dropped** — mockup right column has 4 frames (36/22/19/15). With "no progress bar" decision, the h19 `Margin` row has no content; collapsed to 3 rows: title / author / [page + percent].
2. **Greeting name "RANGGA" hardcoded** — app is account-less. Later: read from MMKV set via settings.
3. **Book covers** — bordered empty rectangle (64×92, 4px radius, 3px #000 border, `bg-clay-card` fill), no image.
4. **Status card number/label font sizes** — JSON omits text styles for "12"/"SELESAI"/"3"/"SEDANG". Assumed Archivo Black ~28 for number + JetBrains Mono Bold ~11 for label (matches mockup's font vocabulary).
5. **No tests for static-only presentational components** beyond a smoke render + state-branch test on `HomeScreen`. `ClayCard` gets token-assertion tests. (Per AGENTS.md §11 "What Not to Test".)

## 9. Out of Scope

- WatermelonDB schema/models/migrations
- `src/repositories/`, `src/services/`, `src/db/`
- Real data wiring (reactive queries)
- Expo Router Tabs setup (bottom nav is non-functional)
- Search, filter, sort (PRD 8.x — later slice)
- Book detail screen, add/edit book forms
- Share cards
- i18n / multi-language
- Landscape layout (MVP is portrait-only per PRD 7.1)

## 10. Testing Strategy

| Target                                                                                                                         | Test type         | What                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------ | ----------------- | -------------------------------------------------------------------------------- |
| `src/theme/tokens.ts`                                                                                                          | Unit              | Assert exact neobrutalist values (colors, radius, shadow, fonts)                 |
| `src/components/ClayCard`                                                                                                      | Component         | Renders children, Pressable fires onPress, className pass-through, shadow='none' |
| `src/features/library/data/mock-books`                                                                                         | Unit              | Shape + counts (12/3) + 3 books                                                  |
| `src/features/library/screens/home/HomeScreen`                                                                                 | Component         | Renders ready/empty/loading branch correctly given state                         |
| Presentational components (HomeHeader, StatusSummary, BookProgressCard, BookProgressList, EmptyState, LoadingState, BottomNav) | Smoke render only | Renders without crash, shows expected text                                       |

Run: `npm test` · `npm run typecheck` · `npm run lint`

## 11. Packages

**Install (user-approved):**

- `@expo-google-fonts/archivo-black`
- `@expo-google-fonts/jetbrains-mono`

**Already present (no install):**

- `expo-font`, `expo-splash-screen`, `lucide-react-native`, `react-native-safe-area-context`, `react-native-reanimated`, `nativewind`, `tailwindcss`, `jest-expo`, `@testing-library/react-native`

Both font packages are already whitelisted in `jest.config.js` `transformIgnorePatterns` (`@expo-google-fonts/.*`).
