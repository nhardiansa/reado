import { fireEvent, render } from "@testing-library/react-native";
import { HomeHeader } from "../HomeHeader";

describe("HomeHeader", () => {
  it("renders greeting and Bookshelf title", async () => {
    const { getByText } = await render(<HomeHeader />);
    expect(getByText("HALO, RANGGA")).toBeTruthy();
    expect(getByText("Bookshelf")).toBeTruthy();
  });

  it("renders + add button and fires onAddPress", async () => {
    const onAddPress = jest.fn();
    const { getByText } = await render(<HomeHeader onAddPress={onAddPress} />);
    fireEvent.press(getByText("+"));
    expect(onAddPress).toHaveBeenCalledTimes(1);
  });
});
