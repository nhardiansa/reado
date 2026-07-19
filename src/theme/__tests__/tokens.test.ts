/// <reference types="jest" />
import { colors, spacing, radius, borderWidth, clayShadow } from "../tokens";

describe("claymorphism theme tokens", () => {
  it("exports PRD section 12.2 color tokens", () => {
    expect(colors.primaryBg).toBe("#F8EFD9");
    expect(colors.primaryAccent).toBe("#FFB84C");
    expect(colors.secondaryAccent).toBe("#A3D8F4");
    expect(colors.success).toBe("#9BE7A1");
    expect(colors.danger).toBe("#FF8A8A");
    expect(colors.textPrimary).toBe("#1E1E1E");
    expect(colors.border).toBe("#1E1E1E");
    expect(colors.shadow).toBe("rgba(0, 0, 0, 0.85)");
    expect(colors.cardBg).toBe("#FFF7E6");
  });

  it("exports spacing tokens (xs:4, sm:8, md:16, lg:24, xl:32)", () => {
    expect(spacing).toEqual({ xs: 4, sm: 8, md: 16, lg: 24, xl: 32 });
  });

  it("exports radius tokens (card:24, button:20, modal:28)", () => {
    expect(radius).toEqual({ card: 24, button: 20, modal: 28 });
  });

  it("exports border width tokens (standard:2, emphasized:3)", () => {
    expect(borderWidth).toEqual({ standard: 2, emphasized: 3 });
  });

  it("exports clay shadow with PRD offsets and blurRadius 0", () => {
    expect(clayShadow.default.offset).toEqual({ width: 4, height: 4 });
    expect(clayShadow.emphasized.offset).toEqual({ width: 6, height: 6 });
    expect(clayShadow.default.blurRadius).toBe(0);
    expect(clayShadow.emphasized.blurRadius).toBe(0);
    expect(clayShadow.default.color).toBe("rgba(0, 0, 0, 0.85)");
  });
});
