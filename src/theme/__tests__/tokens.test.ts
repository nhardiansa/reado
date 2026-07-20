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
