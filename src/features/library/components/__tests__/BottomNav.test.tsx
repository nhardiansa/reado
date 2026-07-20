import { render } from "@testing-library/react-native";
import { BottomNav } from "../BottomNav";

describe("BottomNav", () => {
  it("renders 3 tabs without crashing", async () => {
    const { toJSON } = await render(<BottomNav />);
    expect(toJSON()).not.toBeNull();
  });

  it("renders with custom activeTab", async () => {
    const { toJSON } = await render(<BottomNav activeTab="settings" />);
    expect(toJSON()).not.toBeNull();
  });
});
