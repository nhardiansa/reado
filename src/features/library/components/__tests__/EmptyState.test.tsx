import { fireEvent, render } from "@testing-library/react-native";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders empty messages and add CTA", async () => {
    const { getByText } = await render(<EmptyState />);
    expect(getByText("Belum ada buku")).toBeTruthy();
    expect(getByText("Tambah buku pertamamu")).toBeTruthy();
  });

  it("fires onAddPress when + tapped", async () => {
    const onAddPress = jest.fn();
    const { getByText } = await render(<EmptyState onAddPress={onAddPress} />);
    fireEvent.press(getByText("+"));
    expect(onAddPress).toHaveBeenCalledTimes(1);
  });
});
