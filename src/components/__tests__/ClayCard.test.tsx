import { fireEvent, render } from "@testing-library/react-native";
import { Text } from "react-native";
import { ClayCard } from "../ClayCard";

describe("ClayCard", () => {
  it("renders children inside a View by default", async () => {
    const { getByText } = await render(
      <ClayCard>
        <Text>child content</Text>
      </ClayCard>,
    );
    expect(getByText("child content")).toBeTruthy();
  });

  it("renders as Pressable and fires onPress", async () => {
    const onPress = jest.fn();
    const { getByText } = await render(
      <ClayCard as="Pressable" onPress={onPress}>
        <Text>pressable card</Text>
      </ClayCard>,
    );
    fireEvent.press(getByText("pressable card"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("accepts className and testID", async () => {
    const { getByTestId } = await render(
      <ClayCard className="bg-clay-accent" testID="card">
        <Text>x</Text>
      </ClayCard>,
    );
    expect(getByTestId("card")).toBeTruthy();
  });

  it("renders without shadow when shadow='none'", async () => {
    const { getByText } = await render(
      <ClayCard shadow="none">
        <Text>no shadow</Text>
      </ClayCard>,
    );
    expect(getByText("no shadow")).toBeTruthy();
  });
});
