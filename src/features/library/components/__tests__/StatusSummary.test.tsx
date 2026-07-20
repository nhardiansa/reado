import { render } from "@testing-library/react-native";
import { StatusSummary } from "../StatusSummary";

describe("StatusSummary", () => {
  it("renders finished count + SELESAI label", async () => {
    const { getByText } = await render(<StatusSummary finished={12} inProgress={3} />);
    expect(getByText("12")).toBeTruthy();
    expect(getByText("SELESAI")).toBeTruthy();
  });

  it("renders in-progress count + SEDANG label", async () => {
    const { getByText } = await render(<StatusSummary finished={12} inProgress={3} />);
    expect(getByText("3")).toBeTruthy();
    expect(getByText("SEDANG")).toBeTruthy();
  });
});
