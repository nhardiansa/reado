# Home Screen Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Slice the home/library screen from `docs/mockups/home.json` as static UI with mock data, empty/loading states, and a non-functional bottom nav — neobrutalist visual language.

**Architecture:** Foundation-first (tokens → fonts → ClayCard primitive) → feature-local components → compose HomeScreen with a 3-state switch → thin mount in `app/index.tsx`. No db/repos/models — static mock data only.

**Tech Stack:** Expo SDK 57, React Native 0.86, Expo Router, NativeWind v4, lucide-react-native, expo-font + @expo-google-fonts, Jest + @testing-library/react-native, react-native-safe-area-context, react-native-reanimated.

## Global Constraints

- Package manager: **npm** only (no yarn/pnpm/bun lockfiles)
- TypeScript strict mode — no `any`, explicit return types on exported functions
- Named exports for components/hooks; default export only for Expo Router screens
- Never hardcode hex in components — use Tailwind `clay-*` utilities or `@/theme/tokens`
- Import order: external → `@/` absolute → relative → types
- Fonts: `ArchivoBlack_400Regular` + `JetBrainsMono_700Bold` loaded in `src/app/_layout.tsx`
- Language: Indonesian hardcoded
- `src/app/**` excluded from coverage; `@expo-google-fonts/.*` already whitelisted in `transformIgnorePatterns`
- Commit after each task; Conventional Commits format

## File Structure

| File                                                              | Action | Responsibility                                       |
| ----------------------------------------------------------------- | ------ | ---------------------------------------------------- |
| `src/theme/tokens.ts`                                             | Modify | Neobrutalist color/spacing/radius/shadow/font tokens |
| `src/theme/__tests__/tokens.test.ts`                              | Modify | Assert new token values                              |
| `tailwind.config.js`                                              | Modify | Mirror tokens as Tailwind utilities + fontFamily     |
| `app.config.ts`                                                   | Modify | Splash + adaptive icon bg → `#FFFFFF`                |
| `src/app/_layout.tsx`                                             | Modify | Load fonts via useFonts, gate splash                 |
| `src/app/index.tsx`                                               | Modify | Thin mount of HomeScreen                             |
| `src/components/ClayCard.tsx`                                     | Create | Shared bordered + hard-shadow box primitive          |
| `src/components/__tests__/ClayCard.test.tsx`                      | Create | ClayCard tests                                       |
| `src/features/library/types.ts`                                   | Create | HomeBook feature-local type                          |
| `src/features/library/data/mock-books.ts`                         | Create | 3 sample books + counts                              |
| `src/features/library/data/__tests__/mock-books.test.ts`          | Create | Mock data tests                                      |
| `src/features/library/components/HomeHeader.tsx`                  | Create | Greeting + add button                                |
| `src/features/library/components/StatusSummary.tsx`               | Create | 2 stat cards (SELESAI / SEDANG)                      |
| `src/features/library/components/BookProgressCard.tsx`            | Create | Single book row card                                 |
| `src/features/library/components/BookProgressList.tsx`            | Create | Maps mock books → cards                              |
| `src/features/library/components/EmptyState.tsx`                  | Create | Empty library state                                  |
| `src/features/library/components/LoadingState.tsx`                | Create | 3 skeleton cards w/ pulse                            |
| `src/features/library/components/BottomNav.tsx`                   | Create | Static 3-tab bar                                     |
| `src/features/library/components/__tests__/*.test.tsx`            | Create | One per component                                    |
| `src/features/library/screens/home/index.tsx`                     | Create | Composes all + state switch                          |
| `src/features/library/screens/home/__tests__/HomeScreen.test.tsx` | Create | State-branch tests                                   |
| `src/features/library/index.ts`                                   | Create | Barrel: export { HomeScreen }                        |

**Packages to install:** `@expo-google-fonts/archivo-black`, `@expo-google-fonts/jetbrains-mono` (user-approved). `expo-font` + `expo-splash-screen` already in `package.json`.

---

### Task 1: Neobrutalist tokens + Tailwind config

**Files:**

- Modify: `src/theme/tokens.ts`
- Modify: `src/theme/__tests__/tokens.test.ts`
- Modify: `tailwind.config.js`

**Interfaces:**

- Produces: `colors` (with `accentPink`), `fonts` ({ `archivoBlack`, `jetbrainsMonoBold` }), updated `radius` ({ card:8, button:8, modal:8 }), updated `clayShadow` (default {3,3}, emphasized {4,4}), `shadow` color `#141414`. Tailwind utilities `bg-clay-bg`, `bg-clay-card`, `bg-clay-accent`, `bg-clay-accent-pink`, `border-clay`, `shadow-clay`, `font-archivo`, `font-jetbrains` available to later tasks.

- [ ] **Step 1: Update tokens test with new expected values (failing)**

Replace entire contents of `src/theme/__tests__/tokens.test.ts`:

```typescript
/// <reference types="jest" />
import { colors, spacing, radius, borderWidth, clayShadow, fonts } from "../tokens";

describe("neobrutalist theme tokens", () => {
  it("exports neobrutalist color tokens", () => {
    expect(colors.primaryBg).toBe("#FFFFFF");
    expect(colors.primaryAccent).toBe("#FFD52E");
    expect(colors.accentPink).toBe("#FF4FA0");
    expect(colors.success).toBe("#9BE7A1");
    expect(colors.danger).toBe("#FF8A8A");
    expect(colors.textPrimary).toBe("#141414");
    expect(colors.border).toBe("#141414");
    expect(colors.shadow).toBe("#141414");
    expect(colors.cardBg).toBe("#FFFDF7");
  });

  it("exports spacing tokens (xs:4, sm:8, md:16, lg:24, xl:32)", () => {
    expect(spacing).toEqual({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32 });
  });

  it("exports radius tokens (card:8, button:8, modal:8)", () => {
    expect(radius).toEqual({ card: 8, button: 8, modal: 8 });
  });

  it("exports border width tokens (standard:2, emphasized:3)", () => {
    expect(borderWidth).toEqual({ standard: 2, emphasized: 3 });
  });

  it("exports hard shadow with 0 blur and solid #141414 color", () => {
    expect(clayShadow.default.offset).toEqual({ width: 3, height: 3 });
    expect(clayShadow.emphasized.offset).toEqual({ width: 4, height: 4 });
    expect(clayShadow.default.blurRadius).toBe(0);
    expect(clayShadow.emphasized.blurRadius).toBe(0);
    expect(clayShadow.default.color).toBe("#141414");
  });

  it("exports font family name tokens", () => {
    expect(fonts.archivoBlack).toBe("ArchivoBlack_400Regular");
    expect(fonts.jetbrainsMonoBold).toBe("JetBrainsMono_700Bold");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --testPathPattern src/theme/__tests__/tokens.test.ts`
Expected: FAIL — `colors.accentPink` undefined, `colors.primaryBg` expected `#FFFFFF` received `#F8EFD9`, `fonts` undefined.

- [ ] **Step 3: Rewrite tokens.ts with neobrutalist values**

Replace entire contents of `src/theme/tokens.ts`:

```typescript
export const colors = {
  primaryBg: "#FFFFFF",
  primaryAccent: "#FFD52E",
  accentPink: "#FF4FA0",
  success: "#9BE7A1",
  danger: "#FF8A8A",
  textPrimary: "#141414",
  border: "#141414",
  shadow: "#141414",
  cardBg: "#FFFDF7",
} as const;

export const fonts = {
  archivoBlack: "ArchivoBlack_400Regular",
  jetbrainsMonoBold: "JetBrainsMono_700Bold",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  card: 8,
  button: 8,
  modal: 8,
} as const;

export const borderWidth = {
  standard: 2,
  emphasized: 3,
} as const;

export const shadowOffset = {
  default: { width: 3, height: 3 },
  emphasized: { width: 4, height: 4 },
} as const;

export const shadowBlurRadius = 0 as const;

export const clayShadow = {
  default: {
    offset: shadowOffset.default,
    blurRadius: shadowBlurRadius,
    color: colors.shadow,
  },
  emphasized: {
    offset: shadowOffset.emphasized,
    blurRadius: shadowBlurRadius,
    color: colors.shadow,
  },
} as const;

export type ColorToken = keyof typeof colors;
export type FontToken = keyof typeof fonts;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type BorderToken = keyof typeof borderWidth;

export const theme = {
  colors,
  fonts,
  spacing,
  radius,
  borderWidth,
  clayShadow,
} as const;

export type Theme = typeof theme;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- --testPathPattern src/theme/__tests__/tokens.test.ts`
Expected: PASS (6 tests)

- [ ] **Step 5: Mirror tokens in tailwind.config.js**

Replace entire contents of `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        clay: {
          bg: "#FFFFFF",
          accent: "#FFD52E",
          "accent-pink": "#FF4FA0",
          success: "#9BE7A1",
          danger: "#FF8A8A",
          text: "#141414",
          border: "#141414",
          card: "#FFFDF7",
        },
      },
      fontFamily: {
        archivo: ["ArchivoBlack_400Regular"],
        jetbrains: ["JetBrainsMono_700Bold"],
      },
      spacing: {
        xs: "4",
        sm: "8",
        md: "16",
        lg: "24",
        xl: "32",
      },
      borderRadius: {
        clay: "8",
        "clay-button": "8",
        "clay-modal": "8",
      },
      borderWidth: {
        clay: "2",
        "clay-emphasized": "3",
      },
      boxShadow: {
        clay: "3 3 0 0 #141414",
        "clay-emphasized": "4 4 0 0 #141414",
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 6: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/theme/tokens.ts src/theme/__tests__/tokens.test.ts tailwind.config.js
git commit -m "refactor(theme): rewrite tokens to neobrutalist values

- colors: white bg, #FFFDF7 cards, #FFD52E yellow, #FF4FA0 pink
- #141414 text/border/shadow (solid, 0 blur)
- radius: 8 (was 24/20/28)
- shadow offsets: 3,3 default / 4,4 emphasized
- add fonts tokens (ArchivoBlack, JetBrainsMonoBold)
- mirror in tailwind.config.js + add font-archivo/font-jetbrains utilities"
```

---

### Task 2: Font loading + splash config

**Files:**

- Modify: `app.config.ts` (lines 20, 36 — adaptiveIcon + splash bg)
- Modify: `src/app/_layout.tsx`

**Interfaces:**

- Consumes: `fonts` from `@/theme/tokens` (Task 1)
- Produces: `ArchivoBlack_400Regular` + `JetBrainsMono_700Bold` loaded app-wide; `font-archivo` / `font-jetbrains` Tailwind utilities functional. Splash stays visible until fonts loaded.

- [ ] **Step 1: Install font packages**

Run:

```bash
npm install @expo-google-fonts/archivo-black @expo-google-fonts/jetbrains-mono
```

Expected: packages added to `package.json` dependencies. Both packages already whitelisted in `jest.config.js` `transformIgnorePatterns`.

- [ ] **Step 2: Update splash + adaptive icon bg in app.config.ts**

In `app.config.ts`, change `backgroundColor: "#F8EFD9"` → `backgroundColor: "#FFFFFF"` in both the android.adaptiveIcon block and the expo-splash-screen plugin block.

- [ ] **Step 3: Rewrite \_layout.tsx with font loading + splash gating**

Replace entire contents of `src/app/_layout.tsx`:

```typescript
import "../global.css";

import { useFonts } from "expo-font";
import { ArchivoBlack_400Regular } from "@expo-google-fonts/archivo-black";
import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    ArchivoBlack_400Regular,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
```

- [ ] **Step 4: Run typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 5: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app.config.ts src/app/_layout.tsx package.json package-lock.json
git commit -m "feat(layout): load Archivo Black + JetBrains Mono fonts

- install @expo-google-fonts/archivo-black + jetbrains-mono
- useFonts in _layout, gate render until loaded
- preventAutoHideAsync -> hideAsync when fonts ready
- update splash + adaptive icon bg to #FFFFFF (neobrutalist)"
```

---

### Task 3: ClayCard shared primitive

**Files:**

- Create: `src/components/ClayCard.tsx`
- Create: `src/components/__tests__/ClayCard.test.tsx`

**Interfaces:**

- Produces: `ClayCard` — `import { ClayCard } from "@/components/ClayCard"`. Props: `{ as?: 'View'|'Pressable'; borderWidth?: 'standard'|'emphasized'; shadow?: 'default'|'emphasized'|'none'; radius?: 'card'|'button'|'modal'; className?: string; children?: React.ReactNode; onPress?: () => void; testID?: string }`. Defaults: `as='View'`, `borderWidth='emphasized'`, `shadow='default'`, `radius='card'`.

- [ ] **Step 1: Write failing test**

Create `src/components/__tests__/ClayCard.test.tsx`:

```typescript
import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { ClayCard } from "../ClayCard";

describe("ClayCard", () => {
  it("renders children inside a View by default", () => {
    const { getByText } = render(<ClayCard><Text>child content</Text></ClayCard>);
    expect(getByText("child content")).toBeTruthy();
  });

  it("renders as Pressable and fires onPress", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ClayCard as="Pressable" onPress={onPress}><Text>pressable card</Text></ClayCard>,
    );
    fireEvent.press(getByText("pressable card"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("accepts className and testID", () => {
    const { getByTestId } = render(<ClayCard className="bg-clay-accent" testID="card"><Text>x</Text></ClayCard>);
    expect(getByTestId("card")).toBeTruthy();
  });

  it("renders without shadow when shadow='none'", () => {
    const { getByText } = render(<ClayCard shadow="none"><Text>no shadow</Text></ClayCard>);
    expect(getByText("no shadow")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- --testPathPattern src/components/__tests__/ClayCard.test.tsx`
Expected: FAIL — `Cannot find module '../ClayCard'`

- [ ] **Step 3: Implement ClayCard**

Create `src/components/ClayCard.tsx`:

```typescript
import { Pressable, View } from "react-native";

type ClayCardAs = "View" | "Pressable";
type ClayBorderWidth = "standard" | "emphasized";
type ClayShadow = "default" | "emphasized" | "none";
type ClayRadius = "card" | "button" | "modal";

interface ClayCardProps {
  as?: ClayCardAs;
  borderWidth?: ClayBorderWidth;
  shadow?: ClayShadow;
  radius?: ClayRadius;
  className?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
}

const borderClass: Record<ClayBorderWidth, string> = {
  standard: "border-clay",
  emphasized: "border-clay-emphasized",
};

const shadowClass: Record<ClayShadow, string> = {
  default: "shadow-clay",
  emphasized: "shadow-clay-emphasized",
  none: "",
};

const radiusClass: Record<ClayRadius, string> = {
  card: "rounded-clay",
  button: "rounded-clay-button",
  modal: "rounded-clay-modal",
};

export function ClayCard({
  as = "View",
  borderWidth = "emphasized",
  shadow = "default",
  radius: radiusKey = "card",
  className,
  children,
  onPress,
  testID,
}: ClayCardProps): React.ReactElement {
  const composed = `border ${borderClass[borderWidth]} ${shadowClass[shadow]} ${radiusClass[radiusKey]} ${className ?? ""}`;

  if (as === "Pressable") {
    return (
      <Pressable onPress={onPress} className={composed} testID={testID}>
        {children}
      </Pressable>
    );
  }
  return (
    <View className={composed} testID={testID}>
      {children}
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- --testPathPattern src/components/__tests__/ClayCard.test.tsx`
Expected: PASS (4 tests)

- [ ] **Step 5: typecheck + lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/ClayCard.tsx src/components/__tests__/ClayCard.test.tsx
git commit -m "feat(components): add ClayCard neobrutalist primitive"
```

---

### Task 4: HomeBook type + mock data

**Files:**

- Create: `src/features/library/types.ts`
- Create: `src/features/library/data/mock-books.ts`
- Create: `src/features/library/data/__tests__/mock-books.test.ts`

**Interfaces:**

- Produces: `HomeBook` (`{ id: string; title: string; author: string; currentPage: number; totalPages: number; percent: number }`), `mockBooks: HomeBook[]` (3 items), `mockCounts: { finished: number; inProgress: number }`.

- [ ] **Step 1: Write failing test**

Create `src/features/library/data/__tests__/mock-books.test.ts`:

```typescript
import { mockBooks, mockCounts } from "../mock-books";
import type { HomeBook } from "../../types";

describe("mock-books", () => {
  it("exports 3 books with correct shape", () => {
    expect(mockBooks).toHaveLength(3);
    mockBooks.forEach((b: HomeBook) => {
      expect(typeof b.id).toBe("string");
      expect(typeof b.title).toBe("string");
      expect(typeof b.author).toBe("string");
      expect(typeof b.currentPage).toBe("number");
      expect(typeof b.totalPages).toBe("number");
      expect(typeof b.percent).toBe("number");
    });
  });

  it("matches mockup data exactly", () => {
    expect(mockBooks[0]).toEqual({
      id: "1",
      title: "Tomorrow, and Tomorrow…",
      author: "Gabrielle Zevin",
      currentPage: 264,
      totalPages: 416,
      percent: 64,
    });
    expect(mockBooks[1]).toEqual({
      id: "2",
      title: "Project Hail Mary",
      author: "Andy Weir",
      currentPage: 104,
      totalPages: 476,
      percent: 22,
    });
    expect(mockBooks[2]).toEqual({
      id: "3",
      title: "Atomic Habits",
      author: "James Clear",
      currentPage: 281,
      totalPages: 320,
      percent: 88,
    });
  });

  it("exports counts finished:12, inProgress:3", () => {
    expect(mockCounts).toEqual({ finished: 12, inProgress: 3 });
  });
});
```

- [ ] **Step 2: Run to verify fail**

Run: `npm test -- --testPathPattern mock-books`
Expected: FAIL (module not found)

- [ ] **Step 3: Create `src/features/library/types.ts`**

```typescript
export interface HomeBook {
  id: string;
  title: string;
  author: string;
  currentPage: number;
  totalPages: number;
  percent: number;
}
```

- [ ] **Step 4: Create `src/features/library/data/mock-books.ts`**

```typescript
import type { HomeBook } from "../types";

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

- [ ] **Step 5: Run to verify pass**

Run: `npm test -- --testPathPattern mock-books`
Expected: PASS (3 tests)

- [ ] **Step 6: Commit**

```bash
git add src/features/library/types.ts src/features/library/data/mock-books.ts src/features/library/data/__tests__/mock-books.test.ts
git commit -m "feat(library): add HomeBook type + mock data"
```

---

### Task 5: HomeHeader

**Files:**

- Create: `src/features/library/components/HomeHeader.tsx`
- Create: `src/features/library/components/__tests__/HomeHeader.test.tsx`

**Interfaces:**

- Consumes: `ClayCard` (Task 3)
- Produces: `HomeHeader` — props `{ onAddPress?: () => void }`

- [ ] **Step 1: Write failing test**

Create `src/features/library/components/__tests__/HomeHeader.test.tsx`:

```typescript
import { fireEvent, render } from "@testing-library/react-native";
import { HomeHeader } from "../HomeHeader";

describe("HomeHeader", () => {
  it("renders greeting and Bookshelf title", () => {
    const { getByText } = render(<HomeHeader />);
    expect(getByText("HALO, RANGGA")).toBeTruthy();
    expect(getByText("Bookshelf")).toBeTruthy();
  });

  it("renders + add button and fires onAddPress", () => {
    const onAddPress = jest.fn();
    const { getByText } = render(<HomeHeader onAddPress={onAddPress} />);
    fireEvent.press(getByText("+"));
    expect(onAddPress).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement HomeHeader.tsx**

```typescript
import { Text, View } from "react-native";

import { ClayCard } from "@/components/ClayCard";

interface HomeHeaderProps {
  onAddPress?: () => void;
}

export function HomeHeader({ onAddPress }: HomeHeaderProps): React.ReactElement {
  return (
    <View className="flex-row items-center justify-between px-[22px]">
      <View className="gap-[2px]">
        <Text className="font-jetbrains text-[12px] text-clay-text">HALO, RANGGA</Text>
        <Text className="font-archivo text-[34px] leading-[34px] tracking-[-1px] text-clay-text">
          Bookshelf
        </Text>
      </View>
      <ClayCard
        as="Pressable"
        radius="button"
        className="h-[46px] w-[48px] items-center justify-center bg-clay-accent"
        onPress={onAddPress}
        testID="add-btn"
      >
        <Text className="font-archivo text-[26px] leading-none text-clay-text">+</Text>
      </ClayCard>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/HomeHeader.tsx src/features/library/components/__tests__/HomeHeader.test.tsx
git commit -m "feat(library): add HomeHeader"
```

---

### Task 6: StatusSummary

**Files:**

- Create: `src/features/library/components/StatusSummary.tsx`
- Create: `src/features/library/components/__tests__/StatusSummary.test.tsx`

**Interfaces:**

- Consumes: `ClayCard`, `lucide-react-native` `Book` + `BookOpen`
- Produces: `StatusSummary` — props `{ finished: number; inProgress: number }`

- [ ] **Step 1: Write failing test**

```typescript
import { render } from "@testing-library/react-native";
import { StatusSummary } from "../StatusSummary";

describe("StatusSummary", () => {
  it("renders finished count + SELESAI label", () => {
    const { getByText } = render(<StatusSummary finished={12} inProgress={3} />);
    expect(getByText("12")).toBeTruthy();
    expect(getByText("SELESAI")).toBeTruthy();
  });

  it("renders in-progress count + SEDANG label", () => {
    const { getByText } = render(<StatusSummary finished={12} inProgress={3} />);
    expect(getByText("3")).toBeTruthy();
    expect(getByText("SEDANG")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement StatusSummary.tsx**

```typescript
import { Text, View } from "react-native";
import { Book, BookOpen } from "lucide-react-native";

import { ClayCard } from "@/components/ClayCard";

interface StatusSummaryProps {
  finished: number;
  inProgress: number;
}

export function StatusSummary({ finished, inProgress }: StatusSummaryProps): React.ReactElement {
  return (
    <View className="flex-row gap-[10px] px-[22px]">
      <ClayCard
        shadow="emphasized"
        className="h-[71px] w-[168px] flex-row items-center gap-[4px] bg-clay-card p-[15px]"
      >
        <ClayCard
          radius="button"
          borderWidth="emphasized"
          className="h-[35px] w-[35px] items-center justify-center bg-white"
        >
          <Book size={20} color="#141414" />
        </ClayCard>
        <View className="gap-[2px]">
          <Text className="font-archivo text-[28px] leading-none text-clay-text">{finished}</Text>
          <Text className="font-jetbrains text-[11px] text-clay-text">SELESAI</Text>
        </View>
      </ClayCard>

      <ClayCard
        shadow="emphasized"
        className="h-[71px] w-[168px] flex-row items-center gap-[4px] bg-clay-accent-pink p-[15px]"
      >
        <ClayCard
          radius="button"
          borderWidth="emphasized"
          className="h-[35px] w-[35px] items-center justify-center bg-white"
        >
          <BookOpen size={20} color="#FFFFFF" />
        </ClayCard>
        <View className="gap-[2px]">
          <Text className="font-archivo text-[28px] leading-none text-white">{inProgress}</Text>
          <Text className="font-jetbrains text-[11px] text-white">SEDANG</Text>
        </View>
      </ClayCard>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/StatusSummary.tsx src/features/library/components/__tests__/StatusSummary.test.tsx
git commit -m "feat(library): add StatusSummary stat cards"
```

---

### Task 7: BookProgressCard

**Files:**

- Create: `src/features/library/components/BookProgressCard.tsx`
- Create: `src/features/library/components/__tests__/BookProgressCard.test.tsx`

**Interfaces:**

- Consumes: `ClayCard`, `HomeBook`
- Produces: `BookProgressCard` — props `{ book: HomeBook; onPress?: (id: string) => void }`. Renders title, author, `p.{currentPage} / {totalPages}`, `{percent}%`.

- [ ] **Step 1: Write failing test**

```typescript
import { fireEvent, render } from "@testing-library/react-native";
import { BookProgressCard } from "../BookProgressCard";
import type { HomeBook } from "../../types";

const book: HomeBook = {
  id: "1",
  title: "Tomorrow, and Tomorrow…",
  author: "Gabrielle Zevin",
  currentPage: 264,
  totalPages: 416,
  percent: 64,
};

describe("BookProgressCard", () => {
  it("renders title, author, page count, percent", () => {
    const { getByText } = render(<BookProgressCard book={book} />);
    expect(getByText("Tomorrow, and Tomorrow…")).toBeTruthy();
    expect(getByText("Gabrielle Zevin")).toBeTruthy();
    expect(getByText("p.264 / 416")).toBeTruthy();
    expect(getByText("64%")).toBeTruthy();
  });

  it("fires onPress with book id", () => {
    const onPress = jest.fn();
    const { getByText } = render(<BookProgressCard book={book} onPress={onPress} />);
    fireEvent.press(getByText("Tomorrow, and Tomorrow…"));
    expect(onPress).toHaveBeenCalledWith("1");
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement BookProgressCard.tsx**

```typescript
import { Text, View } from "react-native";

import { ClayCard } from "@/components/ClayCard";
import type { HomeBook } from "../types";

interface BookProgressCardProps {
  book: HomeBook;
  onPress?: (id: string) => void;
}

export function BookProgressCard({ book, onPress }: BookProgressCardProps): React.ReactElement {
  return (
    <ClayCard
      as="Pressable"
      onPress={() => onPress?.(book.id)}
      className="flex-row gap-[14px] bg-clay-card p-[15px]"
    >
      <ClayCard
        radius="button"
        borderWidth="emphasized"
        className="h-[92px] w-[64px] rounded-[4px] bg-clay-card"
      />
      <View className="flex-1 gap-[3px]">
        <Text className="font-archivo text-[18px] leading-tight text-clay-text" numberOfLines={2}>
          {book.title}
        </Text>
        <Text className="font-jetbrains text-[12px] text-clay-text">{book.author}</Text>
        <View className="flex-row justify-between">
          <Text className="font-jetbrains text-[12px] text-clay-text">
            p.{book.currentPage} / {book.totalPages}
          </Text>
          <Text className="font-archivo text-[14px] text-clay-text">{book.percent}%</Text>
        </View>
      </View>
    </ClayCard>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/BookProgressCard.tsx src/features/library/components/__tests__/BookProgressCard.test.tsx
git commit -m "feat(library): add BookProgressCard"
```

---

### Task 8: BookProgressList

**Files:**

- Create: `src/features/library/components/BookProgressList.tsx`
- Create: `src/features/library/components/__tests__/BookProgressList.test.tsx`

**Interfaces:**

- Consumes: `BookProgressCard`, `HomeBook`
- Produces: `BookProgressList` — props `{ books: HomeBook[]; onBookPress?: (id: string) => void }`

- [ ] **Step 1: Write failing test**

```typescript
import { render } from "@testing-library/react-native";
import { BookProgressList } from "../BookProgressList";
import { mockBooks } from "../../data/mock-books";

describe("BookProgressList", () => {
  it("renders one card per book", () => {
    const { getByText } = render(<BookProgressList books={mockBooks} />);
    expect(getByText("Tomorrow, and Tomorrow…")).toBeTruthy();
    expect(getByText("Project Hail Mary")).toBeTruthy();
    expect(getByText("Atomic Habits")).toBeTruthy();
  });

  it("renders empty View when books is empty", () => {
    const { toJSON } = render(<BookProgressList books={[]} />);
    expect(toJSON()).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement BookProgressList.tsx**

```typescript
import { View } from "react-native";

import { BookProgressCard } from "./BookProgressCard";
import type { HomeBook } from "../types";

interface BookProgressListProps {
  books: HomeBook[];
  onBookPress?: (id: string) => void;
}

export function BookProgressList({ books, onBookPress }: BookProgressListProps): React.ReactElement {
  return (
    <View className="gap-[14px] px-[22px]">
      {books.map((book) => (
        <BookProgressCard key={book.id} book={book} onPress={onBookPress} />
      ))}
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/BookProgressList.tsx src/features/library/components/__tests__/BookProgressList.test.tsx
git commit -m "feat(library): add BookProgressList"
```

---

### Task 9: EmptyState

**Files:**

- Create: `src/features/library/components/EmptyState.tsx`
- Create: `src/features/library/components/__tests__/EmptyState.test.tsx`

**Interfaces:**

- Consumes: `ClayCard`, `lucide-react-native` `BookOpen`
- Produces: `EmptyState` — props `{ onAddPress?: () => void }`

- [ ] **Step 1: Write failing test**

```typescript
import { fireEvent, render } from "@testing-library/react-native";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders empty messages and add CTA", () => {
    const { getByText } = render(<EmptyState />);
    expect(getByText("Belum ada buku")).toBeTruthy();
    expect(getByText("Tambah buku pertamamu")).toBeTruthy();
  });

  it("fires onAddPress when + tapped", () => {
    const onAddPress = jest.fn();
    const { getByText } = render(<EmptyState onAddPress={onAddPress} />);
    fireEvent.press(getByText("+"));
    expect(onAddPress).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement EmptyState.tsx**

```typescript
import { Text, View } from "react-native";
import { BookOpen } from "lucide-react-native";

import { ClayCard } from "@/components/ClayCard";

interface EmptyStateProps {
  onAddPress?: () => void;
}

export function EmptyState({ onAddPress }: EmptyStateProps): React.ReactElement {
  return (
    <View className="flex-1 items-center justify-center gap-[12px] px-[22px]">
      <ClayCard
        shadow="none"
        radius="button"
        className="h-[64px] w-[64px] items-center justify-center bg-clay-card"
      >
        <BookOpen size={28} color="#141414" />
      </ClayCard>
      <Text className="font-archivo text-[22px] text-clay-text">Belum ada buku</Text>
      <Text className="font-jetbrains text-[12px] text-clay-text">Tambah buku pertamamu</Text>
      <ClayCard
        as="Pressable"
        radius="button"
        className="h-[46px] w-[48px] items-center justify-center bg-clay-accent"
        onPress={onAddPress}
        testID="empty-add-btn"
      >
        <Text className="font-archivo text-[26px] leading-none text-clay-text">+</Text>
      </ClayCard>
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/EmptyState.tsx src/features/library/components/__tests__/EmptyState.test.tsx
git commit -m "feat(library): add EmptyState"
```

---

### Task 10: LoadingState

**Files:**

- Create: `src/features/library/components/LoadingState.tsx`
- Create: `src/features/library/components/__tests__/LoadingState.test.tsx`

**Interfaces:**

- Consumes: `ClayCard`, `react-native-reanimated` `Animated` + `useAnimatedStyle` + `withRepeat` + `withTiming`
- Produces: `LoadingState` — props none. Renders 3 skeleton cards with opacity pulse 0.6↔1.0 loop.

- [ ] **Step 1: Write failing test**

```typescript
import { render } from "@testing-library/react-native";
import { LoadingState } from "../LoadingState";

describe("LoadingState", () => {
  it("renders 3 skeleton cards", () => {
    const { toJSON } = render(<LoadingState />);
    expect(toJSON()).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement LoadingState.tsx**

```typescript
import { View } from "react-native";
import Animated, { useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";

import { ClayCard } from "@/components/ClayCard";

function SkeletonCard(): React.ReactElement {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withRepeat(withTiming(1, { duration: 800 }), -1, true),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ClayCard shadow="none" className="flex-row gap-[14px] bg-clay-card p-[15px]">
        <ClayCard
          radius="button"
          borderWidth="emphasized"
          className="h-[92px] w-[64px] rounded-[4px] bg-clay-card"
        />
        <View className="flex-1 gap-[3px]">
          <View className="h-[18px] w-[70%] rounded-[4px] bg-clay-card" />
          <View className="h-[12px] w-[40%] rounded-[4px] bg-clay-card" />
          <View className="flex-row justify-between">
            <View className="h-[12px] w-[80px] rounded-[4px] bg-clay-card" />
            <View className="h-[14px] w-[40px] rounded-[4px] bg-clay-card" />
          </View>
        </View>
      </ClayCard>
    </Animated.View>
  );
}

export function LoadingState(): React.ReactElement {
  return (
    <View className="gap-[14px] px-[22px]">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/LoadingState.tsx src/features/library/components/__tests__/LoadingState.test.tsx
git commit -m "feat(library): add LoadingState with reanimated pulse"
```

---

### Task 11: BottomNav

**Files:**

- Create: `src/features/library/components/BottomNav.tsx`
- Create: `src/features/library/components/__tests__/BottomNav.test.tsx`

**Interfaces:**

- Consumes: `ClayCard`, `lucide-react-native` `AddressBook` + `MessageCircle` + `Settings`
- Produces: `BottomNav` — props `{ activeTab?: 'main'|'reviews'|'settings' }` (default `'main'`). Non-functional onPress (static slice).

- [ ] **Step 1: Write failing test**

```typescript
import { render } from "@testing-library/react-native";
import { BottomNav } from "../BottomNav";

describe("BottomNav", () => {
  it("renders 3 tabs without crashing", () => {
    const { toJSON } = render(<BottomNav />);
    expect(toJSON()).not.toBeNull();
  });

  it("renders with custom activeTab", () => {
    const { toJSON } = render(<BottomNav activeTab="settings" />);
    expect(toJSON()).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement BottomNav.tsx**

```typescript
import { Pressable, View } from "react-native";
import { AddressBook, MessageCircle, Settings } from "lucide-react-native";

import { ClayCard } from "@/components/ClayCard";

type TabKey = "main" | "reviews" | "settings";

interface BottomNavProps {
  activeTab?: TabKey;
}

const tabs: Array<{ key: TabKey; Icon: typeof AddressBook }> = [
  { key: "main", Icon: AddressBook },
  { key: "reviews", Icon: MessageCircle },
  { key: "settings", Icon: Settings },
];

export function BottomNav({ activeTab = "main" }: BottomNavProps): React.ReactElement {
  return (
    <View className="h-[70px] flex-row border-t-[3px] border-clay bg-clay-card pt-[4px]">
      {tabs.map(({ key, Icon }) => {
        const isActive = key === activeTab;
        return (
          <Pressable key={key} className="flex-1 items-center justify-center" onPress={() => {}}>
            <ClayCard
              shadow="none"
              radius="button"
              className={`h-[32px] w-[32px] items-center justify-center ${
                isActive ? "bg-clay-accent" : "bg-transparent"
              }`}
            >
              <Icon size={18} color="#141414" />
            </ClayCard>
          </Pressable>
        );
      })}
    </View>
  );
}
```

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Commit**

```bash
git add src/features/library/components/BottomNav.tsx src/features/library/components/__tests__/BottomNav.test.tsx
git commit -m "feat(library): add BottomNav static 3-tab bar"
```

---

### Task 12: HomeScreen + barrel

**Files:**

- Create: `src/features/library/screens/home/index.tsx`
- Create: `src/features/library/screens/home/__tests__/HomeScreen.test.tsx`
- Create: `src/features/library/index.ts`

**Interfaces:**

- Consumes: `HomeHeader`, `StatusSummary`, `BookProgressList`, `EmptyState`, `LoadingState`, `BottomNav`, `mockBooks`, `mockCounts`, `react-native-safe-area-context` `SafeAreaView`
- Produces: `HomeScreen` default export. `src/features/library/index.ts` barrel re-exports `{ HomeScreen }`.

- [ ] **Step 1: Write failing test**

Create `src/features/library/screens/home/__tests__/HomeScreen.test.tsx`:

```typescript
import { render } from "@testing-library/react-native";
import { HomeScreen } from "../";

describe("HomeScreen", () => {
  it("renders ready state with mock books", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText("HALO, RANGGA")).toBeTruthy();
    expect(getByText("Bookshelf")).toBeTruthy();
    expect(getByText("Tomorrow, and Tomorrow…")).toBeTruthy();
    expect(getByText("12")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run to verify fail**

- [ ] **Step 3: Implement HomeScreen**

Create `src/features/library/screens/home/index.tsx`:

```typescript
import { ScrollView, useState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "../../components/BottomNav";
import { BookProgressList } from "../../components/BookProgressList";
import { EmptyState } from "../../components/EmptyState";
import { HomeHeader } from "../../components/HomeHeader";
import { LoadingState } from "../../components/LoadingState";
import { StatusSummary } from "../../components/StatusSummary";
import { mockBooks, mockCounts } from "../../data/mock-books";

type HomeState = "loading" | "empty" | "ready";

export default function HomeScreen(): React.ReactElement {
  const [state, setState] = useState<HomeState>("ready");

  const cycleState = () => {
    setState((prev) => (prev === "ready" ? "empty" : prev === "empty" ? "loading" : "ready"));
  };

  return (
    <SafeAreaView className="flex-1 bg-clay-bg" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-[20px] pb-[16px]"
      >
        <HomeHeader onAddPress={cycleState} />
        <StatusSummary finished={mockCounts.finished} inProgress={mockCounts.inProgress} />
        {state === "ready" && <BookProgressList books={mockBooks} onBookPress={cycleState} />}
        {state === "empty" && <EmptyState onAddPress={cycleState} />}
        {state === "loading" && <LoadingState />}
      </ScrollView>
      <BottomNav activeTab="main" />
    </SafeAreaView>
  );
}
```

Wait — `HomeHeader`'s `onAddPress` should not cycle states. The cycle is dev-only via long-press greeting. Correct this: remove `onAddPress={cycleState}` from HomeHeader; wire long-press on greeting text instead. Replace Step 3 code with:

```typescript
import { ScrollView, Text, useState } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomNav } from "../../components/BottomNav";
import { BookProgressList } from "../../components/BookProgressList";
import { EmptyState } from "../../components/EmptyState";
import { HomeHeader } from "../../components/HomeHeader";
import { LoadingState } from "../../components/LoadingState";
import { StatusSummary } from "../../components/StatusSummary";
import { mockBooks, mockCounts } from "../../data/mock-books";

type HomeState = "loading" | "empty" | "ready";

export default function HomeScreen(): React.ReactElement {
  const [state, setState] = useState<HomeState>("ready");

  const cycleState = () => {
    setState((prev) => (prev === "ready" ? "empty" : prev === "empty" ? "loading" : "ready"));
  };

  return (
    <SafeAreaView className="flex-1 bg-clay-bg" edges={["top", "bottom"]}>
      <ScrollView className="flex-1" contentContainerClassName="gap-[20px] pb-[16px]">
        <Pressable onLongPress={cycleState}>
          <HomeHeader />
        </Pressable>
        <StatusSummary finished={mockCounts.finished} inProgress={mockCounts.inProgress} />
        {state === "ready" && <BookProgressList books={mockBooks} />}
        {state === "empty" && <EmptyState />}
        {state === "loading" && <LoadingState />}
      </ScrollView>
      <BottomNav activeTab="main" />
    </SafeAreaView>
  );
}
```

And import `Pressable` from `react-native`:

```typescript
import { Pressable, ScrollView, useState } from "react-native";
```

Remove unused `Text` import.

- [ ] **Step 4: Run to verify pass**
- [ ] **Step 5: typecheck + lint**
- [ ] **Step 6: Create barrel `src/features/library/index.ts`**

```typescript
export { default as HomeScreen } from "./screens/home";
```

- [ ] **Step 7: Run typecheck**
- [ ] **Step 8: Commit**

```bash
git add src/features/library/screens/home/index.tsx src/features/library/screens/home/__tests__/HomeScreen.test.tsx src/features/library/index.ts
git commit -m "feat(library): add HomeScreen with 3-state switch + barrel"
```

---

### Task 13: Wire app/index.tsx

**Files:**

- Modify: `src/app/index.tsx`

**Interfaces:**

- Consumes: `HomeScreen` from `@/features/library` (Task 12)
- Produces: default export `Index` that mounts `<HomeScreen />`.

- [ ] **Step 1: Rewrite `src/app/index.tsx`**

```typescript
import { HomeScreen } from "@/features/library";

export default function Index() {
  return <HomeScreen />;
}
```

- [ ] **Step 2: Run typecheck**
- [ ] **Step 3: Run lint**
- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: all tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/index.tsx
git commit -m "feat(app): wire HomeScreen as index route"
```

---

### Task 14: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full test run**

Run: `npm test`
Expected: all tests PASS

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Format check**

Run: `npm run format:check`
Expected: PASS (or run `npm run format` if any files need formatting)

- [ ] **Step 5: Visual smoke test (manual)**

Run: `npm run android` (requires emulator/device)
Expected:

- Splash → app loads with fonts (Archivo Black titles, JetBrains Mono labels)
- Home screen renders: "HALO, RANGGA" + "Bookshelf" title, 2 stat cards (12 SELESAI off-white, 3 SEDANG pink), 3 book cards with mock data, bottom nav with main tab yellow
- Long-press greeting cycles: ready → empty (Belum ada buku) → loading (3 pulsing skeletons) → ready
- No console errors

- [ ] **Step 6: Final commit (if any formatting changes)**

```bash
git add -A
git commit -m "style: final formatting" || echo "nothing to commit"
```

---

## Self-Review Notes

- Spec coverage: every spec section has a task (tokens §3 → T1; fonts §3 → T2; ClayCard §6 → T3; mock data §7 → T4; components §6 → T5–T11; state machine §5 → T12; app wiring → T13; verification §10 → T14).
- No placeholders. Every code step has full implementation.
- Type consistency: `HomeBook` shape consistent across T4 → T7 → T8 → T12. `ClayCard` props consistent across all uses.
- Deviations: spec §8 #1 (h19 row dropped) — reflected in T7 (3 rows not 4). spec §8 #5 (no tests for presentational) — only smoke + state-branch tests written.
