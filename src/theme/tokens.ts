export const colors = {
  primaryBg: "#F8EFD9",
  primaryAccent: "#FFB84C",
  secondaryAccent: "#A3D8F4",
  success: "#9BE7A1",
  danger: "#FF8A8A",
  textPrimary: "#1E1E1E",
  border: "#1E1E1E",
  shadow: "rgba(0, 0, 0, 0.85)",
  cardBg: "#FFF7E6",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  card: 24,
  button: 20,
  modal: 28,
} as const;

export const borderWidth = {
  standard: 2,
  emphasized: 3,
} as const;

export const shadowOffset = {
  default: { width: 4, height: 4 },
  emphasized: { width: 6, height: 6 },
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
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type BorderToken = keyof typeof borderWidth;

export const theme = {
  colors,
  spacing,
  radius,
  borderWidth,
  clayShadow,
} as const;

export type Theme = typeof theme;
