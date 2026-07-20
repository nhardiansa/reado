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
